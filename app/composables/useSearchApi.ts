import type { SearchItem, FilterPayload } from '~/types/search'

export interface SelectedNodes {
  books?: {
    book_group_ids?: number[]
    book_ids?: number[]
    chapter_ids?: number[]
  }
  topic1?: {
    topic_group_ids?: number[]
    category_ids?: number[]
    child_ids?: number[]
  }
  topic2?: {
    group_ids?: number[]
    topic_ids?: number[]
    chapter_ids?: number[]
  }
  topic3?: {
    group_ids?: number[]
    topic_ids?: number[]
    chapter_ids?: number[]
  }
  audio?: {
    group_ids?: number[]
    category_ids?: number[]
    audio_ids?: number[]
  }
  video?: {
    group_ids?: number[]
    year_group_ids?: number[]
    category_ids?: number[]
    video_ids?: number[]
  }
}

export interface SearchRequestBody {
  keyword?: string
  page: number
  paginate: number
  selectedCategory?: string[]
  year?: number[]
  selectedKeyword?: string[]
  listShowKeyword?: string[]
  listHideKeyword?: string[]
  selected_nodes?: SelectedNodes
}

export interface SearchApiResponse {
  success: boolean
  message: string
  data: SearchItem[]
  data_category_video?: string | null
  data_category_audio?: string | null
  data_category_book?: string | null
  data_category_topic1?: string | null
  data_category_topic2?: string | null
  data_category_topic3?: string | null
}

/**
 * Build the `selected_nodes` block from a flat FilterPayload.
 * Empty arrays are omitted so the body stays compact.
 */
export function buildSelectedNodes(
  filterPayload: Partial<FilterPayload>
): SelectedNodes | undefined {
  const nodes: SelectedNodes = {}

  if (filterPayload.chapter_ids?.length || filterPayload.categoryBookId?.length) {
    nodes.books = {}
    if (filterPayload.categoryBookId?.length) {
      nodes.books.book_ids = filterPayload.categoryBookId
    }
    if (filterPayload.chapter_ids?.length) {
      nodes.books.chapter_ids = filterPayload.chapter_ids
    }
  }

  if (filterPayload.topic1_category_ids?.length || filterPayload.categoryTopic1Id?.length) {
    nodes.topic1 = {}
    if (filterPayload.categoryTopic1Id?.length) {
      nodes.topic1.topic_group_ids = filterPayload.categoryTopic1Id
    }
    if (filterPayload.topic1_category_ids?.length) {
      nodes.topic1.category_ids = filterPayload.topic1_category_ids
    }
  }

  if (filterPayload.topic2_chapter_ids?.length || filterPayload.categoryTopic2Id?.length) {
    nodes.topic2 = {}
    if (filterPayload.categoryTopic2Id?.length) {
      nodes.topic2.group_ids = filterPayload.categoryTopic2Id
    }
    if (filterPayload.topic2_chapter_ids?.length) {
      nodes.topic2.chapter_ids = filterPayload.topic2_chapter_ids
    }
  }

  if (filterPayload.topic3_chapter_ids?.length || filterPayload.categoryTopic3Id?.length) {
    nodes.topic3 = {}
    if (filterPayload.categoryTopic3Id?.length) {
      nodes.topic3.group_ids = filterPayload.categoryTopic3Id
    }
    if (filterPayload.topic3_chapter_ids?.length) {
      nodes.topic3.chapter_ids = filterPayload.topic3_chapter_ids
    }
  }

  if (filterPayload.audio_ids?.length || filterPayload.categoryAudioId?.length) {
    nodes.audio = {}
    if (filterPayload.categoryAudioId?.length) {
      nodes.audio.group_ids = filterPayload.categoryAudioId
    }
    if (filterPayload.audio_ids?.length) {
      nodes.audio.audio_ids = filterPayload.audio_ids
    }
  }

  if (filterPayload.video_ids?.length || filterPayload.categoryVideoId?.length) {
    nodes.video = {}
    if (filterPayload.categoryVideoId?.length) {
      nodes.video.group_ids = filterPayload.categoryVideoId
    }
    if (filterPayload.video_ids?.length) {
      nodes.video.video_ids = filterPayload.video_ids
    }
  }

  return Object.keys(nodes).length > 0 ? nodes : undefined
}

/**
 * Build a SearchRequestBody from the form's FilterPayload + pagination.
 * Empty arrays / undefined fields are stripped so the body stays compact.
 */
export function buildSearchBody(
  filterPayload: Partial<FilterPayload>,
  options: {
    keyword?: string
    page?: number
    paginate?: number
  } = {}
): SearchRequestBody {
  const body: SearchRequestBody = {
    page: options.page ?? 1,
    paginate: options.paginate ?? 20
  }

  const keyword = options.keyword ?? filterPayload.keyword
  if (keyword && keyword.trim()) {
    body.keyword = keyword.trim()
  }

  if (filterPayload.selectedCategory?.length) {
    body.selectedCategory = filterPayload.selectedCategory
  }
  if (filterPayload.year?.length) {
    body.year = filterPayload.year
  }
  if (filterPayload.selectedKeyword?.length) {
    body.selectedKeyword = filterPayload.selectedKeyword
  }
  if (filterPayload.listShowKeyword?.length) {
    body.listShowKeyword = filterPayload.listShowKeyword
  }
  if (filterPayload.listHideKeyword?.length) {
    body.listHideKeyword = filterPayload.listHideKeyword
  }

  const nodes = buildSelectedNodes(filterPayload)
  if (nodes) {
    body.selected_nodes = nodes
  }

  return body
}

/**
 * POST /api/search wrapper. Returns the raw API response.
 */
export async function postSearch(body: SearchRequestBody): Promise<SearchApiResponse> {
  const config = useRuntimeConfig()
  return await $fetch<SearchApiResponse>(`${config.public.apiBaseUrl}/search`, {
    method: 'POST',
    body
  })
}
