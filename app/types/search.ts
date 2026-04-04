export interface SearchItem {
  id: number
  header_id: string | number
  title: string
  detail: string
  full_detail: string
  timestamp: number
  type: string
  description_wa: string
  sub_group_name?: string
  timestamp_formatted?: string
  related_chapters?: Array<{
    type: string
    chapter_id: number
    chapter_title: string
    parent_title: string
  }>
}

export interface ApiResponse {
  success: boolean
  message: string
  data: SearchItem[]
}

export interface FilterPayload {
  keyword: string
  year: number[]
  selectedCategory: string[]
  selectedKeyword: string[]
  listShowKeyword: string[]
  listHideKeyword: string[]
  chapter_ids?: number[]
  audio_ids?: number[]
  video_ids?: number[]
  topic1_category_ids?: number[]
  topic2_chapter_ids?: number[]
  topic3_chapter_ids?: number[]
}

export interface BookChapter {
  id: number
  title: string
  have_child: number
  children?: BookChapter[]
}

export interface Book {
  id: number
  title: string
  chapters: BookChapter[]
}

export interface BookGroup {
  id: number
  title: string
  books: Book[]
}

export interface AudioVideo {
  id: number
  title: string
}

export interface AudioSubGroup {
  id: number
  name: string
  audios: AudioVideo[]
}

export interface AudioCategory {
  id: number
  title: string
  sub_groups: AudioSubGroup[]
}

export interface AudioGroup {
  id: number
  title: string
  children: AudioCategory[]
}

export interface VideoSubGroup {
  id: number
  name: string
  videos: AudioVideo[]
}

export interface VideoChild {
  id: number
  title: string
  sub_groups: VideoSubGroup[]
}

export interface VideoCategory {
  id: number
  title: string
  children: VideoChild[]
}

export interface VideoYearGroup {
  id: number
  title: string
  video_categories: VideoCategory[]
}

export interface VideoGroup {
  id: number
  title: string
  children: VideoYearGroup[]
}

export interface Topic1Child {
  id: number
  title: string
}

export interface Topic1Category {
  id: number
  title: string
  children?: Topic1Child[]
}

export interface Topic1Group {
  topic_id: number
  topic_title: string
  categories: Topic1Category[]
}

export interface Topic2Chapter {
  id: number
  title: string
  children?: Topic2Chapter[]
}

export interface Topic2Topic {
  id: number
  title: string
  chapters: Topic2Chapter[]
}

export interface Topic2Group {
  id: number
  title: string
  topics: Topic2Topic[]
}

export interface Topic3Chapter {
  id: number
  title: string
  children?: Topic3Chapter[]
}

export interface Topic3Topic {
  id: number
  title: string
  chapters: Topic3Chapter[]
}

export interface Topic3Group {
  id: number
  title: string
  topics: Topic3Topic[]
}

export interface DynamicFilter {
  title: string
  keyword: string[]
}
