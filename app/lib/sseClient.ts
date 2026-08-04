import type { SuggestedCategory } from '~/lib/chatTransport'

/** A live message pushed over a conversation SSE channel (user or admin side). */
export interface LiveMessage {
  id: number
  conversation_id: number
  role: 'user' | 'assistant'
  content: string
  is_admin_reply: boolean
  suggested_categories: SuggestedCategory[]
  created_at: string
}

/** Payload of a `mode_change` event: an admin took over or released the chat. */
export interface ModeChange {
  conversation_id: number
  human_mode: boolean
  human_mode_admin_id: number | null
}

interface SubscribeOptions {
  url: string
  getAuthHeader: () => Record<string, string>
  onMessage: (msg: LiveMessage) => void
  /** Admin takeover/release, pushed live without a message being sent. */
  onModeChange?: (change: ModeChange) => void
  /**
   * Id of the last message already shown. Sent as `?after_id=` on every
   * (re)connect so the server backfills anything pushed while we were away.
   * Return null/0 to skip the backfill.
   */
  getAfterId?: () => number | null
  /**
   * Called before every RE-connect (not the first). A safety net for state the
   * backfill can't carry (e.g. a `mode_change` missed while disconnected).
   */
  onResync?: () => void | Promise<void>
  onError?: (error: unknown) => void
}

/** Milliseconds to wait before reconnecting after the stream drops. */
const RECONNECT_DELAY = 3000

/**
 * Subscribe to a MasterLu SSE conversation channel. Uses `fetch` (not
 * `EventSource`) so the `Authorization: Bearer` header can be sent — the API
 * authenticates with a bearer token, which `EventSource` cannot carry.
 *
 * Auto-reconnects when the stream ends or errors, resyncing first. Returns a
 * handle whose `close()` stops it for good.
 */
export function subscribeConversationStream(opts: SubscribeOptions): { close: () => void } {
  let controller: AbortController | null = null
  let closed = false
  let firstConnect = true

  const handleFrame = (raw: string) => {
    let event = 'message'
    const dataLines: string[] = []
    for (const line of raw.split('\n')) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim()
      } else if (line.startsWith('data:')) {
        let v = line.slice(5)
        if (v.startsWith(' ')) v = v.slice(1)
        dataLines.push(v)
      }
    }
    const data = dataLines.join('\n')
    try {
      if (event === 'message') {
        opts.onMessage(JSON.parse(data) as LiveMessage)
      } else if (event === 'mode_change') {
        opts.onModeChange?.(JSON.parse(data) as ModeChange)
      }
      // `ping` and anything else: ignore.
    } catch {
      /* skip malformed frame */
    }
  }

  const connect = async () => {
    if (closed) return
    if (!firstConnect) {
      try {
        await opts.onResync?.()
      } catch {
        /* non-fatal — keep trying to reconnect */
      }
      if (closed) return
    }
    firstConnect = false

    controller = new AbortController()
    try {
      // Backfill anything pushed while we were away, then go live.
      const afterId = opts.getAfterId?.()
      const url =
        afterId && afterId > 0
          ? `${opts.url}${opts.url.includes('?') ? '&' : '?'}after_id=${afterId}`
          : opts.url
      const res = await fetch(url, {
        headers: { Accept: 'text/event-stream', ...opts.getAuthHeader() },
        signal: controller.signal,
      })
      if (!res.ok || !res.body) throw new Error(`SSE ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let idx: number
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const raw = buffer.slice(0, idx)
          buffer = buffer.slice(idx + 2)
          if (raw.trim()) handleFrame(raw)
        }
      }
    } catch (error) {
      if (closed || (error as Error)?.name === 'AbortError') return
      opts.onError?.(error)
    }

    // Stream ended or errored — reconnect (unless closed).
    if (!closed) {
      await new Promise((r) => setTimeout(r, RECONNECT_DELAY))
      connect()
    }
  }

  connect()

  return {
    close() {
      closed = true
      controller?.abort()
    },
  }
}
