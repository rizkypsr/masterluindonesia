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
  children: ChatCategory[]
}

/** Donor/subscription plan attached to the caller. */
export interface QuotaPlan {
  /** code: free | donatur_a | donatur_b | donatur_c */
  name: string
  label: string
  /** ISO date, or null for Free (never expires). */
  expires_at?: string | null
}

/** Effective plan + today's usage (`GET /chat/quota`). */
export interface QuotaState {
  plan: QuotaPlan
  unlimited: boolean
  limit: number
  used: number
  remaining: number | null
  reset_at: string
}

/** A purchasable donor plan in the catalog. */
export interface PlanCatalogItem {
  name: string
  label: string
  /** Price in IDR (0 for Free). */
  price: number
  /** Questions/day, or null for unlimited. */
  limit: number | null
}

/** Fallback catalog (docs values) used if the API has no plans endpoint yet. */
const FALLBACK_PLANS: PlanCatalogItem[] = [
  { name: 'free', label: 'Free', price: 0, limit: 1 },
  { name: 'donatur_c', label: 'Donatur C', price: 5000, limit: 5 },
  { name: 'donatur_b', label: 'Donatur B', price: 10000, limit: 10 },
  { name: 'donatur_a', label: 'Donatur A', price: 20000, limit: null },
]

/** A conversation as returned in the list endpoint. */
export interface ConversationListItem {
  id: number
  title: string
  /** Chosen question category, or `null` for legacy conversations. */
  category: CategoryRef | null
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
    category: CategoryRef | null
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

  async function listPlans(): Promise<PlanCatalogItem[]> {
    try {
      const res = await $fetch<ApiEnvelope<{ plans: PlanCatalogItem[] }>>(`${base}/plans`, {
        headers: headers(),
      })
      const plans = res?.data?.plans
      return Array.isArray(plans) && plans.length ? plans : FALLBACK_PLANS
    } catch {
      return FALLBACK_PLANS
    }
  }

  async function getQuota() {
    const res = await $fetch<ApiEnvelope<QuotaState>>(`${base}/quota`, { headers: headers() })
    return res.data
  }

  /** First active admin WhatsApp number (from the app's contact source). */
  async function getAdminWhatsApp(): Promise<string | null> {
    try {
      const res = await $fetch<{ success: boolean; data: { no_wa: string; status: number }[] }>(
        `${config.public.apiBaseUrl}/contact/wa`,
      )
      return res.data?.find((c) => c.status === 1)?.no_wa ?? null
    } catch {
      return null
    }
  }

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

  return {
    getQuota,
    listPlans,
    getAdminWhatsApp,
    listCategories,
    listConversations,
    getConversation,
    deleteConversation,
    sendFeedback,
  }
}
