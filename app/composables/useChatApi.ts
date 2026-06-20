import { useAuth } from '~/lib/auth'
import type { ChatSource } from '~/lib/chatTransport'

/** A question category used to scope a new conversation's retrieval. */
export interface ChatCategory {
  id: number
  name: string
  /** Content types this category spans, e.g. ["audio", "topics"]. */
  types: string[]
}

/** A conversation as returned in the list endpoint. */
export interface ConversationListItem {
  id: number
  title: string
  /** Chosen question category, or `null` for legacy conversations. */
  category: ChatCategory | null
  message_count?: number
  created_at: string
  updated_at: string
}

/** A single persisted message in a conversation's history. */
export interface ConversationMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  books: ChatSource[]
  flagged: boolean
  created_at: string
}

export interface ConversationDetail {
  conversation: {
    id: number
    title: string
    category: ChatCategory | null
    created_at: string
    updated_at: string
  }
  messages: ConversationMessage[]
}

interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
}

/**
 * Thin wrapper around the MasterLu chat conversation endpoints
 * (`/api/chat/conversations*` and `/api/chat/feedback`). All requests are
 * authenticated with the user's Bearer token.
 */
export const useChatApi = () => {
  const config = useRuntimeConfig()
  const { getAuthHeader } = useAuth()

  const base = `${config.public.apiV2BaseUrl}/chat`
  const headers = () => getAuthHeader() as Record<string, string>

  async function listCategories() {
    const res = await $fetch<ApiEnvelope<{ categories: ChatCategory[] }>>(
      `${base}/categories`,
      { headers: headers() },
    )
    return res.data.categories
  }

  async function listConversations(page = 1, pageSize = 20) {
    const res = await $fetch<
      ApiEnvelope<{
        total: number
        page: number
        pageSize: number
        conversations: ConversationListItem[]
      }>
    >(`${base}/conversations`, { headers: headers(), query: { page, pageSize } })
    return res.data
  }

  async function getConversation(id: number) {
    const res = await $fetch<ApiEnvelope<ConversationDetail>>(
      `${base}/conversations/${id}`,
      { headers: headers() },
    )
    return res.data
  }

  async function deleteConversation(id: number) {
    await $fetch(`${base}/conversations/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
  }

  async function sendFeedback(messageId: number, rating: 1 | -1, comment?: string) {
    const res = await $fetch<ApiEnvelope<{ feedback_id: number }>>(`${base}/feedback`, {
      method: 'POST',
      headers: headers(),
      body: { message_id: messageId, rating, ...(comment ? { comment } : {}) },
    })
    return res.data
  }

  return { listCategories, listConversations, getConversation, deleteConversation, sendFeedback }
}
