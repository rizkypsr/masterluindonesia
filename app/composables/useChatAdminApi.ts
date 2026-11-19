import { useAuth } from '~/lib/auth'
import type { ConversationDetail } from '~/composables/useChatApi'

/** One question awaiting a manual admin reply (FIFO, oldest first). */
export interface QueueItem {
  message_id: number
  conversation_id: number
  question: string
  /** The AI fallback text the user already saw. */
  fallback_reply: string
  created_at: string
  category: { id: number; name: string } | null
  pengguna: { id: number; nama: string; username: string } | null
}

/** A conversation currently taken over by an admin (for the resume list). */
export interface TakeoverItem {
  conversation_id: number
  title: string
  human_mode_admin_id: number
  category: { id: number; name: string } | null
  pengguna: { id: number; nama: string; username: string } | null
  updated_at: string
}

interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
}

/**
 * Admin-only endpoints (`/chat-admin/*`) for answering questions the AI couldn't
 * ground and had no category suggestion for. Requires a logged-in admin
 * (`is_admin: true`); non-admins get 403.
 */
export const useChatAdminApi = () => {
  const config = useRuntimeConfig()
  const { getAuthHeader } = useAuth()

  const base = `${config.public.apiV2BaseUrl}/chat-admin`
  const headers = () => getAuthHeader() as Record<string, string>

  async function getQueue(page = 1, paginate = 20) {
    const res = await $fetch<
      ApiEnvelope<{ total: number; page: number; paginate: number; items: QueueItem[] }>
    >(`${base}/queue`, { headers: headers(), query: { page, paginate } })
    return res.data
  }

  /** Full conversation history, for context before replying. */
  async function getConversation(id: number) {
    const res = await $fetch<ApiEnvelope<ConversationDetail>>(
      `${base}/conversations/${id}`,
      { headers: headers() },
    )
    return res.data
  }

  /** Post the manual reply (no takeover). 404 if already answered or gone. */
  async function replyMessage(messageId: number, reply: string, suggestedCategoryIds?: number[]) {
    const res = await $fetch<ApiEnvelope<unknown>>(`${base}/messages/${messageId}/reply`, {
      method: 'POST',
      headers: headers(),
      body: {
        reply,
        ...(suggestedCategoryIds?.length ? { suggested_category_ids: suggestedCategoryIds } : {}),
      },
    })
    return res.data
  }

  /** Conversations this admin fleet is currently handling live (resume list). */
  async function listTakeovers() {
    const res = await $fetch<ApiEnvelope<{ items: TakeoverItem[] }>>(`${base}/takeovers`, {
      headers: headers(),
    })
    return res.data.items
  }

  /** Claim a conversation for live chat. 409 if another admin already has it. */
  async function takeover(conversationId: number) {
    const res = await $fetch<ApiEnvelope<{ conversation_id: number; human_mode_admin_id: number }>>(
      `${base}/conversations/${conversationId}/takeover`,
      { method: 'POST', headers: headers() },
    )
    return res.data
  }

  /** Hand the conversation back to the AI. */
  async function release(conversationId: number) {
    const res = await $fetch<ApiEnvelope<{ conversation_id: number; human_mode_admin_id: null }>>(
      `${base}/conversations/${conversationId}/release`,
      { method: 'POST', headers: headers() },
    )
    return res.data
  }

  /** Send a live message (requires an active takeover; 403 otherwise). */
  async function sendLiveMessage(
    conversationId: number,
    content: string,
    suggestedCategoryIds?: number[],
  ) {
    const res = await $fetch<ApiEnvelope<unknown>>(
      `${base}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: headers(),
        body: {
          content,
          ...(suggestedCategoryIds?.length ? { suggested_category_ids: suggestedCategoryIds } : {}),
        },
      },
    )
    return res.data
  }

  /** URL of the admin SSE channel for a conversation. */
  function streamUrl(conversationId: number) {
    return `${base}/conversations/${conversationId}/stream`
  }

  return {
    getQueue,
    getConversation,
    replyMessage,
    listTakeovers,
    takeover,
    release,
    sendLiveMessage,
    streamUrl,
  }
}
