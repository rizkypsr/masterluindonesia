import { useAuth } from '~/lib/auth'

export interface ChatFaq {
  id: number
  question: string
  answer: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
}

interface Pagination {
  page: number
  paginate: number
  total: number
  total_pages: number
}

/**
 * Admin-only CRUD for `/api/chat-faq` — curated Q&A pairs the chatbot matches
 * against user messages (cosine similarity on the embedded `question`).
 * Every write invalidates the API's FAQ cache immediately.
 */
export const useChatFaqApi = () => {
  const config = useRuntimeConfig()
  const { getAuthHeader } = useAuth()

  const base = `${config.public.apiV2BaseUrl}/chat-faq`
  const headers = () => getAuthHeader() as Record<string, string>

  async function list(page = 1, paginate = 20, isActive?: boolean) {
    const res = await $fetch<ApiEnvelope<{ items: ChatFaq[]; pagination: Pagination }>>(base, {
      headers: headers(),
      query: {
        page,
        paginate,
        ...(isActive !== undefined ? { is_active: isActive } : {}),
      },
    })
    return res.data
  }

  async function get(id: number) {
    const res = await $fetch<ApiEnvelope<ChatFaq>>(`${base}/${id}`, { headers: headers() })
    return res.data
  }

  async function create(payload: { question: string; answer: string; is_active?: boolean }) {
    const res = await $fetch<ApiEnvelope<ChatFaq>>(base, {
      method: 'POST',
      headers: headers(),
      body: payload,
    })
    return res.data
  }

  async function update(
    id: number,
    payload: Partial<{ question: string; answer: string; is_active: boolean }>,
  ) {
    const res = await $fetch<ApiEnvelope<ChatFaq>>(`${base}/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: payload,
    })
    return res.data
  }

  async function remove(id: number) {
    await $fetch(`${base}/${id}`, { method: 'DELETE', headers: headers() })
  }

  return { list, get, create, update, remove }
}
