import { useAuth } from '~/lib/auth'

/**
 * Money is carried in two shapes on every field:
 *   `_mrp` — milli-rupiah (Rp1 = 1000), full precision, use for arithmetic.
 *   `_rp`  — whole rupiah, floored, use for display.
 * A single question can cost Rp28,45, hence the milli-rupiah precision.
 */

/** Daily free-question allowance. */
export interface FreeQuota {
  limit: number
  used: number
  remaining: number
  /** ISO-8601, next midnight Jakarta time. */
  reset_at: string
}

export interface BalanceEstimate {
  /** Caller's 30-day average cost per question (28000 when no history). */
  typical_cost_mrp: number
  /** balance_mrp / typical_cost_mrp, floored. Show with a "±". */
  questions_left: number
}

export interface TopupConfig {
  min_rp: number
  max_rp: number
  /** Admin WhatsApp number, or null when not configured. */
  wa_contact: string | null
}

/** Everything the Saldo page needs (`GET /deposit/balance`). */
export interface DepositBalance {
  /** May be slightly negative (max ±Rp30): charging happens after the answer. */
  balance_mrp: number
  balance_rp: number
  free: FreeQuota
  estimate: BalanceEstimate
  /** True below Rp250 — chat still answers, but in cheap mode. */
  low_balance: boolean
  topup: TopupConfig
}

export type TopupStatus = 'pending' | 'paid' | 'rejected'

export interface TopupRequest {
  id: number
  amount_mrp: number
  amount_rp: number
  /** What actually landed in the balance; may differ from `amount_*`. */
  credited_mrp: number | null
  credited_rp: number | null
  status: TopupStatus
  rejected_reason: string | null
  paid_at: string | null
  created_at: string
}

/** Response of `POST /deposit/topup` — a pending request plus a ready WA link. */
export interface TopupCreated {
  id: number
  amount_mrp: number
  amount_rp: number
  status: TopupStatus
  created_at: string
  wa_contact: string | null
  /** Null when the admin WhatsApp number isn't configured; show `instruction`. */
  wa_link: string | null
  instruction: string
}

export type LedgerType = 'topup' | 'bonus' | 'spend' | 'adjust'

/** One balance movement. Free questions don't appear here — see `usage`. */
export interface LedgerEntry {
  id: number
  type: LedgerType
  delta_mrp: number
  delta_rp: number
  balance_after_mrp: number
  balance_after_rp: number
  /** Set on `spend` rows — links to the question in the usage list. */
  message_id: number | null
  topup_id: number | null
  /** Mandatory to display on `adjust` rows. */
  note: string | null
  created_at: string
}

export interface UsageRate {
  id: number
  input_mrp_per_1k: number
  cached_input_mrp_per_1k: number
  output_mrp_per_1k: number
}

export interface UsageDetail {
  model: string
  /** Already includes `cached_input_tokens` — don't add them together. */
  input_tokens: number
  cached_input_tokens: number
  output_tokens: number
  rate: UsageRate
}

export interface UsageItem {
  message_id: number
  conversation_id: number
  created_at: string
  /** Up to 160 chars of the user's question, or null if not found. */
  question: string | null
  source: 'free' | 'balance'
  cost_mrp: number
  cost_rp: number
  balance_after_mrp: number | null
  /** Internal marker (e.g. `usage_unavailable`); safe to hide. */
  note: string | null
  /** Null for free questions. */
  detail: UsageDetail | null
}

export interface UsageSummary {
  from: string
  to: string
  questions: number
  free_questions: number
  paid_questions: number
  spent_mrp: number
  spent_rp: number
  avg_cost_mrp: number
  cache_saving_mrp: number
  cache_saving_rp: number
}

interface Paginated<T> {
  items: T[]
  page: number
  page_size: number
  total: number
}

type UsageResponse = Paginated<UsageItem> & { summary: UsageSummary }

interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
}

/** Format whole rupiah for display, e.g. `Rp25.000` / `-Rp20`. */
export function formatRp(rp: number): string {
  const sign = rp < 0 ? '-' : ''
  return `${sign}Rp${Math.abs(rp).toLocaleString('id-ID')}`
}

/** Format a ledger delta with an explicit sign, e.g. `+Rp25.000`. */
export function formatDeltaRp(rp: number): string {
  return `${rp > 0 ? '+' : ''}${formatRp(rp)}`
}

/**
 * Deposit balance endpoints (`/deposit/*`). All requests are authenticated with
 * the user's Bearer token; the server always scopes data to the session, so no
 * user id is ever sent.
 */
export const useDepositApi = () => {
  const config = useRuntimeConfig()
  const { getAuthHeader } = useAuth()

  const base = `${config.public.apiV2BaseUrl}/deposit`
  const headers = () => getAuthHeader() as Record<string, string>

  async function getBalance() {
    const res = await $fetch<ApiEnvelope<DepositBalance>>(`${base}/balance`, {
      headers: headers(),
    })
    return res.data
  }

  /** Create a pending topup. The balance only moves once an admin verifies it. */
  async function createTopup(amountRp: number) {
    const res = await $fetch<ApiEnvelope<TopupCreated>>(`${base}/topup`, {
      method: 'POST',
      headers: headers(),
      body: { amount_rp: amountRp },
    })
    return res.data
  }

  async function listTopups(page = 1, pageSize = 20) {
    const res = await $fetch<ApiEnvelope<Paginated<TopupRequest>>>(`${base}/topups`, {
      headers: headers(),
      query: { page, page_size: pageSize },
    })
    return res.data
  }

  async function listLedger(page = 1, pageSize = 20) {
    const res = await $fetch<ApiEnvelope<Paginated<LedgerEntry>>>(`${base}/ledger`, {
      headers: headers(),
      query: { page, page_size: pageSize },
    })
    return res.data
  }

  async function listUsage(
    options: { from?: string; to?: string; page?: number; pageSize?: number } = {},
  ) {
    const { from, to, page = 1, pageSize = 20 } = options
    const res = await $fetch<ApiEnvelope<UsageResponse>>(`${base}/usage`, {
      headers: headers(),
      query: {
        page,
        page_size: pageSize,
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      },
    })
    return res.data
  }

  return { getBalance, createTopup, listTopups, listLedger, listUsage }
}
