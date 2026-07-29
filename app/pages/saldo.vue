<script setup lang="ts">
import { useAuth } from '~/lib/auth'
import {
  useDepositApi,
  formatDeltaRp,
  formatRp,
  type DepositBalance,
  type LedgerEntry,
  type LedgerType,
  type TopupRequest,
  type TopupStatus,
  type UsageItem,
  type UsageSummary,
} from '~/composables/useDepositApi'

const { isAuthenticated } = useAuth()
const deposit = useDepositApi()
const toast = useToast()

const balance = ref<DepositBalance | null>(null)
const loadingBalance = ref(true)

type Tab = 'topups' | 'ledger' | 'usage'
const tab = ref<Tab>('topups')

const topups = ref<TopupRequest[]>([])
const ledger = ref<LedgerEntry[]>([])
const usage = ref<UsageItem[]>([])
const usageSummary = ref<UsageSummary | null>(null)
const loadingTab = ref(false)
// Tabs are fetched lazily, once each.
const loadedTabs = ref<Set<Tab>>(new Set())

// Topup sheet
const showTopup = ref(false)
const amountRp = ref<number | null>(null)
const creatingTopup = ref(false)
const QUICK_AMOUNTS = [10000, 25000, 50000, 100000]

// Usage detail rows expanded by message_id
const openDetails = ref<Set<number>>(new Set())

onMounted(async () => {
  if (!isAuthenticated.value) {
    toast.add({ title: 'Anda harus login untuk mengakses halaman ini', color: 'error' })
    navigateTo('/lainnya')
    return
  }
  await fetchBalance()
  await loadTab('topups')
})

async function fetchBalance() {
  loadingBalance.value = true
  try {
    balance.value = await deposit.getBalance()
  } catch {
    toast.add({ title: 'Gagal memuat saldo', color: 'error' })
  } finally {
    loadingBalance.value = false
  }
}

async function loadTab(next: Tab, force = false) {
  tab.value = next
  if (loadedTabs.value.has(next) && !force) return

  loadingTab.value = true
  try {
    if (next === 'topups') {
      topups.value = (await deposit.listTopups(1, 50)).items
    } else if (next === 'ledger') {
      ledger.value = (await deposit.listLedger(1, 50)).items
    } else {
      const data = await deposit.listUsage({ page: 1, pageSize: 50 })
      usage.value = data.items
      usageSummary.value = data.summary
    }
    loadedTabs.value = new Set(loadedTabs.value).add(next)
  } catch {
    toast.add({ title: 'Gagal memuat riwayat', color: 'error' })
  } finally {
    loadingTab.value = false
  }
}

function openTopup() {
  amountRp.value = null
  showTopup.value = true
}

function closeTopup() {
  showTopup.value = false
}

const minRp = computed(() => balance.value?.topup.min_rp ?? 10000)
const maxRp = computed(() => balance.value?.topup.max_rp ?? 10000000)

const amountError = computed(() => {
  const v = amountRp.value
  if (v == null || v === 0) return null
  if (!Number.isInteger(v)) return 'Nominal harus bilangan bulat'
  if (v < minRp.value) return `Minimum topup ${formatRp(minRp.value)}`
  if (v > maxRp.value) return `Maksimum topup ${formatRp(maxRp.value)}`
  return null
})

const canSubmitTopup = computed(
  () => amountRp.value != null && amountRp.value > 0 && !amountError.value && !creatingTopup.value,
)

async function submitTopup() {
  if (!canSubmitTopup.value || amountRp.value == null) return

  creatingTopup.value = true
  try {
    const created = await deposit.createTopup(amountRp.value)
    showTopup.value = false
    if (created.wa_link) {
      window.open(created.wa_link, '_blank')
      toast.add({
        title: `Permintaan topup #${created.id} dibuat`,
        description: 'Kirim bukti transfer ke WhatsApp admin.',
        color: 'success',
      })
    } else {
      toast.add({
        title: `Permintaan topup #${created.id} dibuat`,
        description: created.instruction,
        color: 'success',
      })
    }
    await loadTab('topups', true)
  } catch (e: any) {
    const data = e?.data
    toast.add({
      title: data?.code === 'too_many_pending' ? 'Permintaan tertunda terlalu banyak' : 'Gagal membuat topup',
      description: data?.message,
      color: 'error',
    })
    if (data?.code === 'too_many_pending') {
      showTopup.value = false
      await loadTab('topups', true)
    }
  } finally {
    creatingTopup.value = false
  }
}

function openWhatsApp(t: TopupRequest) {
  const wa = balance.value?.topup.wa_contact
  if (!wa) {
    toast.add({ title: 'Nomor WhatsApp admin tidak tersedia', color: 'error' })
    return
  }
  const text = encodeURIComponent(
    `Halo admin, saya mau topup Saldo Deposit #${t.id} sebesar ${formatRp(t.amount_rp)}.`,
  )
  window.open(`https://wa.me/${wa}?text=${text}`, '_blank')
}

function toggleDetail(id: number) {
  const next = new Set(openDetails.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openDetails.value = next
}

const TOPUP_STATUS: Record<TopupStatus, { label: string; class: string }> = {
  pending: { label: 'Menunggu konfirmasi', class: 'text-yellow-700 dark:text-yellow-400 border-yellow-500' },
  paid: { label: 'Berhasil', class: 'text-green-700 dark:text-green-400 border-green-500' },
  rejected: { label: 'Ditolak', class: 'text-red-600 dark:text-red-400 border-red-500' },
}

const LEDGER_LABEL: Record<LedgerType, string> = {
  topup: 'Topup',
  bonus: 'Bonus',
  spend: 'Pertanyaan',
  adjust: 'Koreksi admin',
}

const LEDGER_ICON: Record<LedgerType, string> = {
  topup: 'mdi:plus-circle-outline',
  bonus: 'mdi:gift-outline',
  spend: 'mdi:chat-question-outline',
  adjust: 'mdi:tune',
}

// Shadow-accounting rows during the billing trial move no money — hide them.
const visibleLedger = computed(() => ledger.value.filter((l) => l.delta_mrp !== 0))

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatResetAt(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

useHead({ title: 'Saldo Deposit' })
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="px-4 py-4 shadow-sm bg-white dark:bg-gray-800">
      <div class="flex items-center gap-3">
        <BackButton />
        <h1 class="text-lg font-semibold text-black dark:text-white">Saldo Deposit</h1>
      </div>
    </div>

    <div class="px-4 py-4 space-y-4">
      <!-- Balance card -->
      <div v-if="loadingBalance" class="flex justify-center py-10">
        <Icon name="mdi:loading" class="w-8 h-8 animate-spin text-[#bf9638] dark:text-yellow-400" />
      </div>

      <div
        v-else-if="balance"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <p class="text-sm text-secondary dark:text-gray-400">Saldo Anda</p>
        <p class="text-3xl font-bold text-black dark:text-white mt-0.5">
          {{ formatRp(balance.balance_rp) }}
        </p>
        <p class="text-sm text-secondary dark:text-gray-400 mt-1">
          Cukup untuk ±{{ balance.estimate.questions_left }} pertanyaan lagi
        </p>

        <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
          <div class="flex items-center gap-2 text-sm">
            <Icon name="mdi:gift-outline" class="w-4 h-4 text-primary dark:text-yellow-400 shrink-0" />
            <span class="text-gray-700 dark:text-gray-300">
              Jatah gratis hari ini: {{ balance.free.remaining }}/{{ balance.free.limit }}
            </span>
          </div>
          <p v-if="balance.free.remaining <= 0" class="text-sm text-secondary dark:text-gray-400 pl-6">
            Kembali {{ formatResetAt(balance.free.reset_at) }}
          </p>
        </div>

        <div
          v-if="balance.low_balance"
          class="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/40"
        >
          <Icon name="mdi:alert-outline" class="w-4 h-4 text-yellow-700 dark:text-yellow-400 shrink-0 mt-0.5" />
          <p class="text-sm text-yellow-800 dark:text-yellow-300">
            Saldo menipis. Jawaban sementara dalam mode hemat (tanpa ringkasan bab).
          </p>
        </div>

        <button
          class="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#bf9638] hover:opacity-90 text-black text-base font-medium transition-opacity"
          @click="openTopup"
        >
          <Icon name="mdi:plus" class="w-5 h-5" />
          Isi Saldo
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
        <button
          v-for="t in ([
            { key: 'topups', label: 'Topup' },
            { key: 'ledger', label: 'Mutasi' },
            { key: 'usage', label: 'Pemakaian' },
          ] as { key: Tab; label: string }[])"
          :key="t.key"
          type="button"
          class="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="tab === t.key
            ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm'
            : 'text-secondary dark:text-gray-400'"
          @click="loadTab(t.key)"
        >
          {{ t.label }}
        </button>
      </div>

      <div v-if="loadingTab" class="flex justify-center py-10">
        <Icon name="mdi:loading" class="w-7 h-7 animate-spin text-[#bf9638] dark:text-yellow-400" />
      </div>

      <!-- Topup history -->
      <div v-else-if="tab === 'topups'">
        <p v-if="!topups.length" class="py-10 text-center text-base text-secondary dark:text-gray-400">
          Belum ada permintaan topup.
        </p>
        <div v-else class="space-y-2">
          <div
            v-for="t in topups"
            :key="t.id"
            class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-base font-semibold text-black dark:text-white">
                  {{ formatRp(t.amount_rp) }}
                  <span class="text-sm font-normal text-secondary dark:text-gray-400">#{{ t.id }}</span>
                </p>
                <p class="text-sm text-secondary dark:text-gray-400 mt-0.5">
                  {{ formatDateTime(t.created_at) }}
                </p>
              </div>
              <span
                class="shrink-0 px-2 py-0.5 rounded-full text-sm font-medium border"
                :class="TOPUP_STATUS[t.status].class"
              >
                {{ TOPUP_STATUS[t.status].label }}
              </span>
            </div>

            <p
              v-if="t.status === 'paid' && t.credited_rp !== null && t.credited_rp !== t.amount_rp"
              class="mt-1.5 text-sm text-gray-700 dark:text-gray-300"
            >
              Masuk ke saldo: <strong>{{ formatRp(t.credited_rp) }}</strong>
            </p>
            <p v-if="t.rejected_reason" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {{ t.rejected_reason }}
            </p>

            <button
              v-if="t.status === 'pending'"
              class="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
              @click="openWhatsApp(t)"
            >
              <Icon name="mdi:whatsapp" class="w-4 h-4" />
              Buka WhatsApp
            </button>
          </div>
        </div>
      </div>

      <!-- Ledger -->
      <div v-else-if="tab === 'ledger'">
        <p v-if="!visibleLedger.length" class="py-10 text-center text-base text-secondary dark:text-gray-400">
          Belum ada mutasi saldo.
        </p>
        <div v-else class="space-y-2">
          <div
            v-for="l in visibleLedger"
            :key="l.id"
            class="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <Icon
              :name="LEDGER_ICON[l.type]"
              class="w-5 h-5 shrink-0 mt-0.5 text-primary dark:text-yellow-400"
            />
            <div class="min-w-0 flex-1">
              <p class="text-base font-medium text-black dark:text-white">{{ LEDGER_LABEL[l.type] }}</p>
              <p class="text-sm text-secondary dark:text-gray-400 mt-0.5">
                {{ formatDateTime(l.created_at) }} · Saldo {{ formatRp(l.balance_after_rp) }}
              </p>
              <p v-if="l.note" class="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{{ l.note }}</p>
            </div>
            <p
              class="shrink-0 text-base font-semibold"
              :class="l.delta_mrp > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
            >
              {{ formatDeltaRp(l.delta_rp) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Usage -->
      <div v-else>
        <div
          v-if="usageSummary"
          class="mb-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div class="grid grid-cols-3 gap-2 text-center">
            <div>
              <p class="text-lg font-semibold text-black dark:text-white">{{ usageSummary.questions }}</p>
              <p class="text-sm text-secondary dark:text-gray-400">Pertanyaan</p>
            </div>
            <div>
              <p class="text-lg font-semibold text-black dark:text-white">{{ usageSummary.free_questions }}</p>
              <p class="text-sm text-secondary dark:text-gray-400">Gratis</p>
            </div>
            <div>
              <p class="text-lg font-semibold text-black dark:text-white">{{ formatRp(usageSummary.spent_rp) }}</p>
              <p class="text-sm text-secondary dark:text-gray-400">Terpakai</p>
            </div>
          </div>
          <p
            v-if="usageSummary.cache_saving_rp > 0"
            class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-sm text-green-700 dark:text-green-400"
          >
            Cache menghemat {{ formatRp(usageSummary.cache_saving_rp) }} untuk Anda.
          </p>
        </div>

        <p v-if="!usage.length" class="py-10 text-center text-base text-secondary dark:text-gray-400">
          Belum ada pemakaian.
        </p>
        <div v-else class="space-y-2">
          <div
            v-for="u in usage"
            :key="u.message_id"
            class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-base text-black dark:text-white break-words">
                  {{ u.question || 'Pertanyaan tidak tersedia' }}
                </p>
                <p class="text-sm text-secondary dark:text-gray-400 mt-0.5">
                  {{ formatDateTime(u.created_at) }}
                </p>
              </div>
              <span
                class="shrink-0 text-base font-semibold"
                :class="u.source === 'free' ? 'text-green-600 dark:text-green-400' : 'text-black dark:text-white'"
              >
                {{ u.source === 'free' ? 'Gratis' : formatRp(u.cost_rp) }}
              </span>
            </div>

            <button
              v-if="u.detail"
              class="mt-1.5 flex items-center gap-1 text-sm text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400 transition-colors"
              @click="toggleDetail(u.message_id)"
            >
              <Icon
                name="mdi:chevron-down"
                class="w-4 h-4 transition-transform"
                :class="openDetails.has(u.message_id) ? 'rotate-180' : ''"
              />
              Rincian
            </button>

            <dl
              v-if="u.detail && openDetails.has(u.message_id)"
              class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1 text-sm"
            >
              <div class="flex justify-between gap-2">
                <dt class="text-secondary dark:text-gray-400">Model</dt>
                <dd class="text-gray-800 dark:text-gray-200 truncate">{{ u.detail.model }}</dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-secondary dark:text-gray-400">Token masuk</dt>
                <dd class="text-gray-800 dark:text-gray-200">
                  {{ u.detail.input_tokens.toLocaleString('id-ID') }}
                  <span v-if="u.detail.cached_input_tokens > 0" class="text-secondary dark:text-gray-400">
                    ({{ u.detail.cached_input_tokens.toLocaleString('id-ID') }} dari cache)
                  </span>
                </dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-secondary dark:text-gray-400">Token keluar</dt>
                <dd class="text-gray-800 dark:text-gray-200">
                  {{ u.detail.output_tokens.toLocaleString('id-ID') }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Topup sheet -->
    <UModal v-model:open="showTopup">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-black dark:text-white mb-1">Isi Saldo</h3>
          <p class="text-sm text-secondary dark:text-gray-400 mb-4">
            Nominal bebas, minimum {{ formatRp(minRp) }}. Saldo masuk setelah admin memverifikasi
            bukti transfer di WhatsApp.
          </p>

          <div class="grid grid-cols-4 gap-2 mb-3">
            <button
              v-for="a in QUICK_AMOUNTS"
              :key="a"
              type="button"
              class="px-2 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="amountRp === a
                ? 'border-[#bf9638] bg-[#bf9638]/10 text-black dark:text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'"
              @click="amountRp = a"
            >
              {{ (a / 1000).toLocaleString('id-ID') }}rb
            </button>
          </div>

          <label class="block text-black dark:text-white font-medium mb-2">Nominal (Rp)</label>
          <input
            v-model.number="amountRp"
            type="number"
            inputmode="numeric"
            :min="minRp"
            :max="maxRp"
            class="w-full px-4 py-3 border rounded-lg focus:outline-none text-black dark:text-white bg-white dark:bg-gray-800"
            :class="amountError
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-[#bf9638]'"
            placeholder="25000"
          />
          <p v-if="amountError" class="mt-1.5 text-sm text-red-600 dark:text-red-400">{{ amountError }}</p>

          <div class="flex gap-3 justify-end mt-6">
            <UButton variant="outline" @click="closeTopup">
              Batal
            </UButton>
            <UButton
              :loading="creatingTopup"
              :disabled="!canSubmitTopup"
              class="bg-green-600 hover:bg-green-700 text-white"
              @click="submitTopup"
            >
              <Icon name="mdi:whatsapp" class="w-4 h-4" />
              Lanjut ke WhatsApp
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
