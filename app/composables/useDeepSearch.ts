import type {
  BookGroup,
  AudioGroup,
  VideoGroup,
  Topic1Group,
  Topic2Group,
  Topic3Group,
  BookChapter,
  Topic2Chapter,
  Topic3Chapter,
  Topic1Category
} from '~/types/search'

export const useDeepSearch = () => {
  const config = useRuntimeConfig()

  // Book state
  const bookChapters = ref<BookGroup[]>([])
  const selectedChapterIds = ref<number[]>([])
  const isLoadingBookChapters = ref(false)
  const bookChaptersPage = ref(1)
  const bookChaptersHasMore = ref(true)

  // Audio state
  const audioList = ref<AudioGroup[]>([])
  const selectedVideoIds = ref<number[]>([])
  const isLoadingAudioList = ref(false)
  const audioListPage = ref(1)
  const audioListHasMore = ref(true)

  // Video state
  const videoList = ref<VideoGroup[]>([])
  const isLoadingVideoList = ref(false)
  const videoListPage = ref(1)
  const videoListHasMore = ref(true)

  // Topic1 state
  const topic1List = ref<Topic1Group[]>([])
  const selectedTopic1CategoryIds = ref<number[]>([])
  const isLoadingTopic1List = ref(false)
  const topic1ListPage = ref(1)
  const topic1ListHasMore = ref(true)

  // Topic2 state
  const topic2List = ref<Topic2Group[]>([])
  const selectedTopic2ChapterIds = ref<number[]>([])
  const isLoadingTopic2List = ref(false)
  const topic2ListPage = ref(1)
  const topic2ListHasMore = ref(true)

  // Topic3 state
  const topic3List = ref<Topic3Group[]>([])
  const selectedTopic3ChapterIds = ref<number[]>([])
  const isLoadingTopic3List = ref(false)
  const topic3ListPage = ref(1)
  const topic3ListHasMore = ref(true)

  // Fetch functions
  async function fetchBookChapters(loadMore = false) {
    if (isLoadingBookChapters.value) return
    if (loadMore && !bookChaptersHasMore.value) return

    isLoadingBookChapters.value = true
    try {
      const page = bookChaptersPage.value
      const response = await $fetch<{
        success: boolean
        data: BookGroup[]
        pagination: { has_more: boolean }
      }>(`${config.public.apiBaseUrl}/search/book/chapters?page=${page}&per_page=10`)

      if (response.success && response.data) {
        if (loadMore) {
          bookChapters.value.push(...response.data)
        } else {
          bookChapters.value = response.data
        }
        bookChaptersPage.value = page + 1
        bookChaptersHasMore.value = response.pagination.has_more
      }
    } catch (error) {
      console.error('Failed to fetch book chapters:', error)
    } finally {
      isLoadingBookChapters.value = false
    }
  }

  async function fetchAudioList(loadMore = false) {
    if (isLoadingAudioList.value) return
    if (loadMore && !audioListHasMore.value) return

    isLoadingAudioList.value = true
    try {
      const page = audioListPage.value
      const response = await $fetch<{
        success: boolean
        data: AudioGroup[]
        pagination: { has_more: boolean }
      }>(`${config.public.apiBaseUrl}/search/audio/list?page=${page}&per_page=10`)

      if (response.success && response.data) {
        if (loadMore) {
          audioList.value.push(...response.data)
        } else {
          audioList.value = response.data
        }
        audioListPage.value = page + 1
        audioListHasMore.value = response.pagination.has_more
      }
    } catch (error) {
      console.error('Failed to fetch audio list:', error)
    } finally {
      isLoadingAudioList.value = false
    }
  }

  async function fetchVideoList(loadMore = false) {
    if (isLoadingVideoList.value) return
    if (loadMore && !videoListHasMore.value) return

    isLoadingVideoList.value = true
    try {
      const page = videoListPage.value
      const response = await $fetch<{
        success: boolean
        data: VideoGroup[]
        pagination: { has_more: boolean }
      }>(`${config.public.apiBaseUrl}/search/video/list?page=${page}&per_page=10`)

      if (response.success && response.data) {
        if (loadMore) {
          videoList.value.push(...response.data)
        } else {
          videoList.value = response.data
        }
        videoListPage.value = page + 1
        videoListHasMore.value = response.pagination.has_more
      }
    } catch (error) {
      console.error('Failed to fetch video list:', error)
    } finally {
      isLoadingVideoList.value = false
    }
  }

  async function fetchTopic1List(loadMore = false) {
    if (isLoadingTopic1List.value) return
    if (loadMore && !topic1ListHasMore.value) return

    isLoadingTopic1List.value = true
    try {
      const page = topic1ListPage.value
      const response = await $fetch<{
        success: boolean
        data: Topic1Group[]
        pagination: { has_more: boolean }
      }>(`${config.public.apiBaseUrl}/search/topic1/list?page=${page}&per_page=10`)

      if (response.success && response.data) {
        if (loadMore) {
          topic1List.value.push(...response.data)
        } else {
          topic1List.value = response.data
        }
        topic1ListPage.value = page + 1
        topic1ListHasMore.value = response.pagination.has_more
      }
    } catch (error) {
      console.error('Failed to fetch topic1 list:', error)
    } finally {
      isLoadingTopic1List.value = false
    }
  }

  async function fetchTopic2List(loadMore = false) {
    if (isLoadingTopic2List.value) return
    if (loadMore && !topic2ListHasMore.value) return

    isLoadingTopic2List.value = true
    try {
      const page = topic2ListPage.value
      const response = await $fetch<{
        success: boolean
        data: Topic2Group[]
        pagination: { has_more: boolean }
      }>(`${config.public.apiBaseUrl}/search/topic2/list?page=${page}&per_page=10`)

      if (response.success && response.data) {
        if (loadMore) {
          topic2List.value.push(...response.data)
        } else {
          topic2List.value = response.data
        }
        topic2ListPage.value = page + 1
        topic2ListHasMore.value = response.pagination.has_more
      }
    } catch (error) {
      console.error('Failed to fetch topic2 list:', error)
    } finally {
      isLoadingTopic2List.value = false
    }
  }

  async function fetchTopic3List(loadMore = false) {
    if (isLoadingTopic3List.value) return
    if (loadMore && !topic3ListHasMore.value) return

    isLoadingTopic3List.value = true
    try {
      const page = topic3ListPage.value
      const response = await $fetch<{
        success: boolean
        data: Topic3Group[]
        pagination: { has_more: boolean }
      }>(`${config.public.apiBaseUrl}/search/topic3/list?page=${page}&per_page=10`)

      if (response.success && response.data) {
        if (loadMore) {
          topic3List.value.push(...response.data)
        } else {
          topic3List.value = response.data
        }
        topic3ListPage.value = page + 1
        topic3ListHasMore.value = response.pagination.has_more
      }
    } catch (error) {
      console.error('Failed to fetch topic3 list:', error)
    } finally {
      isLoadingTopic3List.value = false
    }
  }

  // Helper functions for book chapters
  function selectAllChildren(children: BookChapter[]) {
    children.forEach(child => {
      if (!selectedChapterIds.value.includes(child.id)) {
        selectedChapterIds.value.push(child.id)
      }
      if (child.children) {
        selectAllChildren(child.children)
      }
    })
  }

  function unselectAllChildren(children: BookChapter[]) {
    children.forEach(child => {
      const idx = selectedChapterIds.value.indexOf(child.id)
      if (idx > -1) {
        selectedChapterIds.value.splice(idx, 1)
      }
      if (child.children) {
        unselectAllChildren(child.children)
      }
    })
  }

  // Helper functions for topic2
  function selectAllTopic2Children(children: Topic2Chapter[]) {
    children.forEach(child => {
      if (!selectedTopic2ChapterIds.value.includes(child.id)) {
        selectedTopic2ChapterIds.value.push(child.id)
      }
      if (child.children) {
        selectAllTopic2Children(child.children)
      }
    })
  }

  function unselectAllTopic2Children(children: Topic2Chapter[]) {
    children.forEach(child => {
      const idx = selectedTopic2ChapterIds.value.indexOf(child.id)
      if (idx > -1) {
        selectedTopic2ChapterIds.value.splice(idx, 1)
      }
      if (child.children) {
        unselectAllTopic2Children(child.children)
      }
    })
  }

  // Helper functions for topic3
  function selectAllTopic3Children(children: Topic3Chapter[]) {
    children.forEach(child => {
      if (!selectedTopic3ChapterIds.value.includes(child.id)) {
        selectedTopic3ChapterIds.value.push(child.id)
      }
      if (child.children) {
        selectAllTopic3Children(child.children)
      }
    })
  }

  function unselectAllTopic3Children(children: Topic3Chapter[]) {
    children.forEach(child => {
      const idx = selectedTopic3ChapterIds.value.indexOf(child.id)
      if (idx > -1) {
        selectedTopic3ChapterIds.value.splice(idx, 1)
      }
      if (child.children) {
        unselectAllTopic3Children(child.children)
      }
    })
  }

  function resetDeepSearch() {
    selectedChapterIds.value = []
    selectedVideoIds.value = []
    selectedTopic1CategoryIds.value = []
    selectedTopic2ChapterIds.value = []
    selectedTopic3ChapterIds.value = []
    bookChaptersPage.value = 1
    bookChaptersHasMore.value = true
    audioListPage.value = 1
    audioListHasMore.value = true
    videoListPage.value = 1
    videoListHasMore.value = true
    topic1ListPage.value = 1
    topic1ListHasMore.value = true
    topic2ListPage.value = 1
    topic2ListHasMore.value = true
    topic3ListPage.value = 1
    topic3ListHasMore.value = true
  }

  return {
    // State
    bookChapters,
    selectedChapterIds,
    isLoadingBookChapters,
    bookChaptersHasMore,
    audioList,
    selectedVideoIds,
    isLoadingAudioList,
    audioListHasMore,
    videoList,
    isLoadingVideoList,
    videoListHasMore,
    topic1List,
    selectedTopic1CategoryIds,
    isLoadingTopic1List,
    topic1ListHasMore,
    topic2List,
    selectedTopic2ChapterIds,
    isLoadingTopic2List,
    topic2ListHasMore,
    topic3List,
    selectedTopic3ChapterIds,
    isLoadingTopic3List,
    topic3ListHasMore,
    // Fetch functions
    fetchBookChapters,
    fetchAudioList,
    fetchVideoList,
    fetchTopic1List,
    fetchTopic2List,
    fetchTopic3List,
    // Helper functions
    selectAllChildren,
    unselectAllChildren,
    selectAllTopic2Children,
    unselectAllTopic2Children,
    selectAllTopic3Children,
    unselectAllTopic3Children,
    resetDeepSearch
  }
}
