import type { ChatTransport, UIMessage, UIMessageChunk } from 'ai'

/** Content type of a retrieved source — maps to the frontend route. */
export type ChatContentType = 'book' | 'topics2' | 'topics3' | 'audio' | 'video'

/**
 * A single retrieved source item returned by the MasterLu chat API in the
 * `books` list (one entry per content item, best match first).
 */
export interface ChatSource {
  /** book | topics2 | topics3 | audio | video → route key */
  content_type: ChatContentType
  /** Top-level entity id used to build the link. */
  content_id: number
  /** Title of the content item. */
  title?: string
  /** Display category (e.g. "Video", "Audio", or book/topic category). */
  category_title?: string
  /** Chapter title (empty for audio/video). */
  chapter_title?: string
  /** Granular source row (subtitle line / content block) for deep-linking. */
  segment_id?: number
  /** ~180-char excerpt of the matched passage. */
  snippet?: string
  /** Cosine similarity in [0,1]. */
  score?: number
  /** Video timestamp in seconds (video sources only). */
  timestamp?: number
  /** Human-readable video timestamp, e.g. "4:47" (video sources only). */
  timestamp_formatted?: string
}

/** How a single answer was paid for. */
export interface ChatBilling {
  /**
   * `free` = daily allowance, `balance` = charged, `free_tier` = the model is
   * currently free at the provider, `none` = nothing charged.
   */
  source: 'free' | 'balance' | 'free_tier' | 'none'
  /** `cheap` drops chapter summaries — happens when the balance runs thin. */
  mode: 'full' | 'cheap'
  cost_mrp: number
  cost_rp: number
  /** Balance AFTER the deduction — use it to refresh the UI without refetching. */
  balance_mrp: number
}

/** A category the API recommends when it couldn't answer (grounded: false). */
export interface SuggestedCategory {
  id: number
  name: string
}

/**
 * The `meta` payload emitted once at the end of a streamed answer (or returned
 * inline for the non-streamed JSON fallback).
 */
export interface ChatMeta {
  conversation_id: number
  message_id?: number
  books: ChatSource[]
  grounded: boolean
  flagged?: boolean
  billing?: ChatBilling
  /** Only present (and non-empty) on a fallback answer; absent when flagged. */
  suggested_categories?: SuggestedCategory[]
}

/**
 * Custom UI message type for the MasterLu chatbot. The assistant answer carries
 * its retrieved sources as a `data-sources` part so they persist on the message
 * and can be rendered as links.
 */
export type MasterLuUIMessage = UIMessage<
  never,
  {
    sources: {
      books: ChatSource[]
      grounded: boolean
      suggestedCategories: SuggestedCategory[]
      /** True for a persisted answer written manually by an admin. */
      isAdminReply?: boolean
    }
  }
>

/** Live billing/quota counters read from the `X-Billing-*` / `X-Quota-*` headers. */
export interface BillingHeaders {
  /** Where this question was paid from. */
  source: 'free' | 'balance' | 'free_tier' | 'none' | null
  /** `cheap` = reduced answer because the balance is thin. */
  mode: 'full' | 'cheap' | null
  /** Balance BEFORE the deduction. */
  balanceMrp: number | null
  /** Daily free allowance. */
  limit: number | null
  remaining: number | null
  reset: string
}

/** Extra payload carried by billing-related error responses. */
export interface BillingError {
  /** Stable branch key: `insufficient_balance`, `free_limit_reached`, … */
  code?: string
  balanceMrp?: number
  balanceRp?: number
  /** When the daily free allowance comes back. */
  resetAt?: string
  waContact?: string
}

interface TransportOptions {
  /** Base URL of the v2 API, e.g. `https://api.masterluindonesia.com/api`. */
  apiBaseUrl: string
  /** Returns the `Authorization` header (or an empty object when logged out). */
  getAuthHeader: () => Record<string, string>
  /** Current conversation id, or `undefined` to start a new conversation. */
  getConversationId: () => number | undefined
  /** Category id for a NEW conversation (ignored once a conversation exists). */
  getCategoryId: () => number | undefined
  /** Called with the `meta` payload so the caller can persist conversation_id. */
  onMeta: (meta: ChatMeta) => void
  /** Called for non-2xx responses (409 cap, 402 out of balance, 429s) before the error chunk. */
  onHttpError?: (
    status: number,
    message: string,
    extra?: BillingError & { retryAfterSeconds?: number },
  ) => void
  /** Called with the live billing/quota counters from the response headers. */
  onBilling?: (headers: BillingHeaders) => void
  /** Defensive: the API asked for a category before answering (should be pre-gated client-side). */
  onNeedsCategory?: (categories: unknown[]) => void
  /** The conversation is under admin takeover — no AI reply; wait for the SSE channel. */
  onHumanMode?: (conversationId: number) => void
}

const TEXT_ID = 'answer'
const SOURCES_ID = 'sources'

/** Extract the concatenated text of a UI message's text parts. */
function messageText(message: MasterLuUIMessage | undefined): string {
  if (!message) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

/**
 * Parse the MasterLu Server-Sent-Events stream and translate it into the
 * AI SDK `UIMessageChunk` protocol that the `Chat` class understands.
 *
 * Source protocol:
 *   event: token  / data: <text fragment>
 *   event: meta   / data: {"conversation_id":..,"books":[..],"grounded":..}
 *   event: error  / data: <message>
 *   data: [DONE]
 */
async function pumpSseStream(
  body: ReadableStream<Uint8Array>,
  controller: ReadableStreamDefaultController<UIMessageChunk>,
  onMeta: (meta: ChatMeta) => void,
) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let textStarted = false

  const ensureTextStarted = () => {
    if (!textStarted) {
      controller.enqueue({ type: 'text-start', id: TEXT_ID })
      textStarted = true
    }
  }

  const handleEvent = (rawEvent: string): boolean => {
    let eventType = 'message'
    const dataLines: string[] = []

    for (const line of rawEvent.split('\n')) {
      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim()
      } else if (line.startsWith('data:')) {
        // Strip "data:" and a single optional leading space (SSE spec).
        let value = line.slice(5)
        if (value.startsWith(' ')) value = value.slice(1)
        dataLines.push(value)
      }
    }

    const data = dataLines.join('\n')
    if (data === '[DONE]') return true

    if (eventType === 'token') {
      ensureTextStarted()
      controller.enqueue({ type: 'text-delta', id: TEXT_ID, delta: data })
    } else if (eventType === 'meta') {
      emitMetaFrame(data)
    } else if (eventType === 'error') {
      controller.enqueue({ type: 'error', errorText: data || 'Stream error' })
    } else {
      // Some providers emit the final payload under a different (or default)
      // event name. Treat any JSON frame carrying a conversation_id as meta so
      // sources/suggested_categories aren't lost.
      emitMetaFrame(data)
    }
    return false
  }

  /** Parse a meta-shaped JSON frame and emit its sources part. No-op otherwise. */
  const emitMetaFrame = (data: string) => {
    let meta: ChatMeta
    try {
      meta = JSON.parse(data) as ChatMeta
    } catch {
      return
    }
    if (!meta || typeof meta.conversation_id !== 'number') return
    onMeta(meta)
    controller.enqueue({
      type: 'data-sources',
      id: SOURCES_ID,
      data: {
        books: meta.books ?? [],
        grounded: meta.grounded ?? true,
        suggestedCategories: meta.suggested_categories ?? [],
      },
    })
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let boundary: number
    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
      const rawEvent = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)
      if (rawEvent.trim() && handleEvent(rawEvent)) {
        if (textStarted) controller.enqueue({ type: 'text-end', id: TEXT_ID })
        return
      }
    }
  }

  if (textStarted) controller.enqueue({ type: 'text-end', id: TEXT_ID })
}

/**
 * Emit a complete answer from the non-streamed JSON response shape. The server
 * returns plain JSON (not SSE) for the out-of-scope / flagged fallback and for
 * error statuses.
 */
function emitJsonAnswer(
  controller: ReadableStreamDefaultController<UIMessageChunk>,
  reply: string,
  meta: ChatMeta,
  onMeta: (meta: ChatMeta) => void,
) {
  onMeta(meta)
  controller.enqueue({ type: 'text-start', id: TEXT_ID })
  controller.enqueue({ type: 'text-delta', id: TEXT_ID, delta: reply })
  controller.enqueue({ type: 'text-end', id: TEXT_ID })
  controller.enqueue({
    type: 'data-sources',
    id: SOURCES_ID,
    data: {
      books: meta.books ?? [],
      grounded: meta.grounded ?? false,
      suggestedCategories: meta.suggested_categories ?? [],
    },
  })
}

/**
 * Build a `ChatTransport` that talks to the MasterLu RAG chat API
 * (`POST /chat`) while exposing the AI SDK UI message-stream protocol so it can
 * back the reactive `Chat` class from `@ai-sdk/vue`.
 */
export function createMasterLuChatTransport(
  options: TransportOptions,
): ChatTransport<MasterLuUIMessage> {
  const {
    apiBaseUrl,
    getAuthHeader,
    getConversationId,
    getCategoryId,
    onMeta,
    onHttpError,
    onBilling,
    onNeedsCategory,
    onHumanMode,
  } = options

  return {
    async sendMessages({ messages, abortSignal }) {
      const text = messageText(messages[messages.length - 1])
      const conversationId = getConversationId()
      const categoryId = getCategoryId()

      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          message: text,
          stream: true,
          ...(conversationId
            ? { conversation_id: conversationId }
            : categoryId
              ? { category_id: categoryId }
              : {}),
        }),
        signal: abortSignal,
      })

      // Live billing/quota counters from the response headers.
      const num = (name: string): number | null => {
        const raw = response.headers.get(name)
        return raw != null && raw !== '' ? Number(raw) : null
      }
      const source = response.headers.get('X-Billing-Source') as BillingHeaders['source']
      const limit = num('X-Quota-Limit')
      if (source != null || limit != null) {
        onBilling?.({
          source: source ?? null,
          mode: (response.headers.get('X-Billing-Mode') as BillingHeaders['mode']) ?? null,
          balanceMrp: num('X-Billing-Balance-Mrp'),
          limit,
          remaining: num('X-Quota-Remaining'),
          reset: response.headers.get('X-Quota-Reset') ?? '',
        })
      }

      const contentType = response.headers.get('content-type') ?? ''
      const isStream = contentType.includes('text/event-stream')

      return new ReadableStream<UIMessageChunk>({
        async start(controller) {
          try {
            if (!response.ok) {
              // Error statuses (401/402/409/413/429/503/...) return JSON { message }.
              let message = `Request failed (${response.status})`
              const extra: BillingError & { retryAfterSeconds?: number } = {}
              try {
                const err = await response.json()
                if (err?.message) message = err.message
                if (typeof err?.code === 'string') extra.code = err.code
                if (typeof err?.retry_after_seconds === 'number') {
                  extra.retryAfterSeconds = err.retry_after_seconds
                }
                if (typeof err?.balance_mrp === 'number') extra.balanceMrp = err.balance_mrp
                if (typeof err?.balance_rp === 'number') extra.balanceRp = err.balance_rp
                if (typeof err?.reset_at === 'string') extra.resetAt = err.reset_at
                if (typeof err?.wa_contact === 'string') extra.waContact = err.wa_contact
              } catch {
                /* keep default message */
              }
              onHttpError?.(response.status, message, extra)
              controller.enqueue({ type: 'start' })
              controller.enqueue({ type: 'error', errorText: message })
              controller.enqueue({ type: 'finish' })
              controller.close()
              return
            }

            if (isStream && response.body) {
              controller.enqueue({ type: 'start' })
              await pumpSseStream(response.body, controller, onMeta)
            } else {
              // Non-streamed JSON: needs_category gate, or out-of-scope / flagged fallback.
              const json = await response.json()
              const data = json?.data ?? {}
              if (data.needs_category) {
                // Should be pre-gated client-side; emit nothing so no empty bubble appears.
                onNeedsCategory?.(data.categories ?? [])
                controller.enqueue({ type: 'finish' })
                controller.close()
                return
              }
              if (data.human_mode) {
                // Admin takeover — no AI reply. The answer arrives over SSE, so
                // emit no assistant bubble here.
                onHumanMode?.(data.conversation_id)
                controller.enqueue({ type: 'finish' })
                controller.close()
                return
              }
              controller.enqueue({ type: 'start' })
              emitJsonAnswer(
                controller,
                data.reply ?? '',
                {
                  conversation_id: data.conversation_id,
                  message_id: data.message_id,
                  books: data.books ?? [],
                  grounded: data.grounded ?? false,
                  flagged: data.flagged,
                  billing: data.billing,
                  suggested_categories: data.suggested_categories,
                },
                onMeta,
              )
            }

            controller.enqueue({ type: 'finish' })
            controller.close()
          } catch (error) {
            if ((error as Error)?.name === 'AbortError') {
              controller.close()
              return
            }
            controller.enqueue({
              type: 'error',
              errorText: (error as Error)?.message ?? 'Network error',
            })
            controller.close()
          }
        },
      })
    },

    async reconnectToStream() {
      // The MasterLu API does not support resuming an interrupted stream.
      return null
    },
  }
}
