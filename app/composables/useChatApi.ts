import { useAuth } from '~/lib/auth'
import type { ChatSource } from '~/lib/chatTransport'

/** Minimal category reference (as attached to a conversation). */
export interface CategoryRef {
  id: number
  name: string
}

/**
 * A question category node. The catalog is a parent→child tree:
 * a node with non-empty `children` is a group header (NOT selectable); the user
 * picks a leaf (`children: []`). A top-level node with no children is itself a
 * selectable leaf. Send the chosen leaf id as category_id.
 */
export interface ChatCategory {
  id: number
  name: string
  parent_id: number | null
  /** Number of content items in the category. Leaves only appear when > 0. */
  scope_count: number
  /** Optional explanation of what this category covers, shown via an info toggle. */
  description?: string | null
  children: ChatCategory[]
}

/** Minimal group reference (as attached to a conversation). */
export interface GroupRef {
  id: number
  name: string
}

/**
 * A user-owned folder for organizing the caller's own conversation history.
 * Purely a personal grouping — unrelated to `ChatCategory`, which scopes
 * retrieval and is admin-managed. One user's groups are invisible to everyone
 * else, and deleting a group only ungroups its conversations.
 */
export interface ConversationGroup {
  id: number
  name: string
  /** Manual sort key; the list comes back ordered by `seq` then `id`. */
  seq: number
  conversation_count: number
  created_at: string
  updated_at: string
}

/** A conversation as returned in the list endpoint. */
export interface ConversationListItem {
  id: number
  title: string
  /** Chosen question category, or `null` for legacy conversations. */
  category: CategoryRef | null
  /** Owning group, or `null`/absent when ungrouped. */
  group?: GroupRef | null
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
  /** True when this assistant message was written manually by an admin. */
  is_admin_reply?: boolean
  /** Category buttons attached to this answer (AI fallback or admin). */
  suggested_categories?: { id: number; name: string }[]
  created_at: string
}

export interface ConversationDetail {
  conversation: {
    id: number
    title: string
    category: CategoryRef | null
    group?: GroupRef | null
    /** True when an admin has taken over — AI is paused, replies come via SSE. */
    human_mode?: boolean
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

  /**
   * Ask to be connected to a human admin. Omitting `conversationId` starts a new
   * conversation (no category needed). Idempotent per conversation. The AI stops
   * answering this conversation immediately; replies then come via the SSE stream.
   */
  async function requestHuman(conversationId?: number, message?: string) {
    const res = await $fetch<
      ApiEnvelope<{ conversation_id: number; message_id: number; awaiting_admin: boolean }>
    >(`${base}/request-human`, {
      method: 'POST',
      headers: headers(),
      body: {
        ...(conversationId ? { conversation_id: conversationId } : {}),
        ...(message ? { message } : {}),
      },
    })
    return res.data
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

  /** Rename a conversation, overriding the title auto-derived from its first message. */
  async function renameConversation(id: number, title: string) {
    const res = await $fetch<ApiEnvelope<{ id: number; title: string; updated_at: string }>>(
      `${base}/conversations/${id}/title`,
      { method: 'PUT', headers: headers(), body: { title } },
    )
    return res.data
  }

  async function deleteConversation(id: number) {
    await $fetch(`${base}/conversations/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
  }

  // ── Conversation groups (user-owned folders) ──────────────────────────────

  async function listGroups() {
    const res = await $fetch<ApiEnvelope<{ groups: ConversationGroup[] }>>(`${base}/groups`, {
      headers: headers(),
    })
    return res.data.groups
  }

  /** Create a group. Fails with 409 at the per-user cap (default 20). */
  async function createGroup(name: string, seq?: number) {
    const res = await $fetch<ApiEnvelope<ConversationGroup>>(`${base}/groups`, {
      method: 'POST',
      headers: headers(),
      body: { name, ...(seq !== undefined ? { seq } : {}) },
    })
    return res.data
  }

  async function updateGroup(id: number, patch: { name?: string; seq?: number }) {
    const res = await $fetch<ApiEnvelope<ConversationGroup>>(`${base}/groups/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: patch,
    })
    return res.data
  }

  /** Delete a group. Its conversations are ungrouped, never deleted. */
  async function deleteGroup(id: number) {
    await $fetch(`${base}/groups/${id}`, { method: 'DELETE', headers: headers() })
  }

  /** Move a conversation into a group, or pass `null` to ungroup it. */
  async function setConversationGroup(conversationId: number, groupId: number | null) {
    const res = await $fetch<ApiEnvelope<{ id: number; group: GroupRef | null }>>(
      `${base}/conversations/${conversationId}/group`,
      { method: 'PUT', headers: headers(), body: { group_id: groupId } },
    )
    return res.data
  }

  async function sendFeedback(messageId: number, rating: 1 | -1, comment?: string) {
    const res = await $fetch<ApiEnvelope<{ feedback_id: number }>>(`${base}/feedback`, {
      method: 'POST',
      headers: headers(),
      body: { message_id: messageId, rating, ...(comment ? { comment } : {}) },
    })
    return res.data
  }

  return {
    listCategories,
    requestHuman,
    listConversations,
    getConversation,
    renameConversation,
    deleteConversation,
    listGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    setConversationGroup,
    sendFeedback,
  }
}
