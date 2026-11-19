import type { RouteLocationRaw } from 'vue-router'

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export const audio2MonthLabel = (month: number | null) =>
  month == null ? 'Tanpa bulan' : (MONTHS[month - 1] ?? String(month))

export const audio2YearLabel = (year: number | null) => (year == null ? 'Tanpa tahun' : String(year))

/** "2020-01-03" → "3 Jan 2020" */
export const audio2FormatDate = (iso: string | null) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`
}

/** "2020-01-03" → { day: "3", month: "Jan" } */
export const audio2DayParts = (iso: string | null) => {
  if (!iso) return null
  const [, m, d] = iso.split('-').map(Number)
  if (!m || !d) return null
  return { day: String(d), month: MONTHS_SHORT[m - 1] ?? '' }
}

/** "00:41:20" → "41:20", "01:01:09" stays. */
export const audio2ShortDuration = (duration: string | null) => {
  if (!duration) return ''
  return duration.startsWith('00:') ? duration.slice(3) : duration
}

/** Route to the Audio 2 detail, optionally seeking to a segment. */
export const audio2DetailRoute = (episodeId: number | string, opts: { timestamp?: number | null; segmentId?: number | string | null } = {}): RouteLocationRaw => {
  const query: Record<string, string> = {}
  if (opts.timestamp != null) query.t = String(opts.timestamp)
  if (opts.segmentId != null && opts.segmentId !== '') query.segment = String(opts.segmentId)
  return { path: `/audio2/${episodeId}`, query }
}

/**
 * Route for a search result that belongs to Audio 2: `type: "audio2"` rows,
 * and Topik 1 rows linked to Audio 2 (`audio_source: "audio2"`). Returns
 * null for anything else so callers keep their existing handling.
 */
export const audio2SearchResultRoute = (item: { type: string; header_id: string | number; id: number; timestamp?: number; audio_source?: string; audio2?: { id: number } | null }): RouteLocationRaw | null => {
  const type = item.type.toLowerCase()
  if (type === 'audio2') {
    return audio2DetailRoute(item.header_id, { timestamp: item.timestamp, segmentId: item.id })
  }
  if ((type === 'topic1' || type === 'topik1') && item.audio_source === 'audio2') {
    const episodeId = item.audio2?.id ?? item.header_id
    // The API keys these rows by audio2_segment id (same as type "audio2").
    return audio2DetailRoute(episodeId, { timestamp: item.timestamp, segmentId: item.id })
  }
  return null
}
