// Audio 2 — episodes with per-caller transcripts. Contract:
// masterlu_api/docs/AUDIO2_API.md. Categories are CMS-managed: never
// hardcode their names or ids.

export interface Audio2Category {
  id: number
  title: string
  seq: number
  episode_count: number
  episode_with_transcript_count: number
}

export interface Audio2CategoryRef {
  id: number
  title: string
}

export interface Audio2Episode {
  id: number
  title: string
  url: string
  duration: string | null
  aired_on: string | null
  segment_count: number
}

export interface Audio2TimelineEpisode extends Audio2Episode {
  category: Audio2CategoryRef
}

export interface Audio2MonthGroup<E = Audio2Episode> {
  month: number | null
  episodes: E[]
}

export interface Audio2YearGroup {
  year: number | null
  months: Audio2MonthGroup[]
}

export interface Audio2EpisodesData {
  category: Audio2CategoryRef
  years: Audio2YearGroup[]
}

export interface Audio2TimelineData {
  years: { year: number | null; months: number[] }[]
  year: number | null
  months: Audio2MonthGroup<Audio2TimelineEpisode>[]
}

export interface Audio2Segment {
  id: number
  code: string | null
  timestamp: number
  timestamp_formatted: string
  title: string | null
  title_plain: string | null
  content: string
}

export interface Audio2Caller {
  caller: number
  label: string
  segments: Audio2Segment[]
}

export interface Audio2Detail {
  episode: Audio2Episode & { year: number | null; month: number | null }
  category: Audio2CategoryRef
  callers: Audio2Caller[]
}

export interface Audio2ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

/** Deep-search picker: GET /api/search/audio/list */
export interface Audio2PickerCategory {
  id: number
  title: string
  years: { year: number | null; audios: { id: number; title: string }[] }[]
}
