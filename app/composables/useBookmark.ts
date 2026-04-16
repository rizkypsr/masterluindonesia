import { useAuth } from '~/lib/auth'

export interface BookmarkFolder {
  id: number
  title: string
}

export interface VideoLink {
  videoId: number | null
  video_category_id: number
  lang: string
}

export interface AudioLink {
  audioId: number
  audio_category_id: number
}

export interface BookLink {
  bookId: number
  chapterId: number
  page: number
}

export interface Topic2Link {
  contentId: number
  page: number
}

export interface Topic1Link {
  subId: number
  title: string
}

export interface Topic3Link {
  contentId: number
}

export interface BookmarkPayload {
  id: number | null
  type: number // 1=video, 2=audio, 3=book, 4=topic1, 5=topic2, 6=topic3
  folderId: number | null
  title: string
  videoLink: VideoLink | null
  audioLink: AudioLink | null
  bookLink: BookLink | null
  topic1Link: Topic1Link | null
  topic2Link: Topic2Link | null
  topic3Link: Topic3Link | null
  recipeLink: null
}

export interface BookmarkItem {
  id: number
  pengguna_id: number
  parent_id: number | null
  title: string
  data: any
  type: number
}

export interface BookmarkResponse {
  success: boolean
  message: string
}

// Shared state - defined outside the composable function
const isModalOpen = ref(false)
const isLoading = ref(false)
const folders = ref<BookmarkFolder[]>([])
const currentPayload = ref<BookmarkPayload | null>(null)
const selectedFolderId = ref<number | null>(null)
const bookmarkTitle = ref('')
const bookmarksByType = ref<Record<number, BookmarkItem[]>>({})
const loadingBookmarks = ref<Record<number, boolean>>({})

export const useBookmark = () => {
  const { getAuthHeader, isAuthenticated } = useAuth()
  const toast = useToast()
  const config = useRuntimeConfig()

  // Fetch bookmark folders (type=0 returns folders)
  const fetchFolders = async () => {
    try {
      const headers = getAuthHeader()
      const response = await $fetch<{ success: boolean; data: BookmarkFolder[] }>(
        `${config.public.apiBaseUrl}/bookmark/detail?type=0`,
        { headers: headers as Record<string, string> }
      )
      if (response.success) {
        folders.value = response.data || []
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error)
    }
  }

  // Fetch bookmarks by type
  const fetchBookmarksByType = async (type: number) => {
    if (!isAuthenticated.value) return []
    if (loadingBookmarks.value[type]) return bookmarksByType.value[type] || []
    
    loadingBookmarks.value[type] = true
    try {
      const headers = getAuthHeader()
      const response = await $fetch<{ success: boolean; data: BookmarkItem[] }>(
        `${config.public.apiBaseUrl}/bookmark/detail?type=${type}`,
        { headers: headers as Record<string, string> }
      )
      if (response.success) {
        bookmarksByType.value[type] = response.data || []
      }
      return bookmarksByType.value[type] || []
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error)
      return []
    } finally {
      loadingBookmarks.value[type] = false
    }
  }

  // Check if item is bookmarked
  const isBookmarked = (type: number, title: string) => {
    const bookmarks = bookmarksByType.value[type] || []
    return bookmarks.some(b => b.title === title)
  }

  // Get bookmark by title
  const getBookmarkByTitle = (type: number, title: string) => {
    const bookmarks = bookmarksByType.value[type] || []
    return bookmarks.find(b => b.title === title)
  }

  // Open bookmark modal
  const openBookmarkModal = (payload: Omit<BookmarkPayload, 'id' | 'folderId'>) => {
    if (!isAuthenticated.value) {
      toast.add({
        title: 'Silakan login terlebih dahulu',
        color: 'warning'
      })
      navigateTo('/lainnya')
      return
    }

    currentPayload.value = {
      ...payload,
      id: null,
      folderId: null
    }
    bookmarkTitle.value = payload.title
    selectedFolderId.value = null
    isModalOpen.value = true
    fetchFolders()
  }

  // Save bookmark
  const saveBookmark = async () => {
    if (!currentPayload.value) return

    isLoading.value = true
    try {
      const payload: BookmarkPayload = {
        ...currentPayload.value,
        title: bookmarkTitle.value,
        folderId: selectedFolderId.value
      }

      const response = await $fetch<BookmarkResponse>(`${config.public.apiBaseUrl}/bookmark`, {
        method: 'POST',
        headers: getAuthHeader() as Record<string, string>,
        body: payload
      })

      if (response.success) {
        toast.add({
          title: 'Bookmark berhasil disimpan',
          color: 'success'
        })
        isModalOpen.value = false
        // Refresh bookmarks for this type
        await fetchBookmarksByType(currentPayload.value.type)
      } else {
        toast.add({
          title: response.message || 'Gagal menyimpan bookmark',
          color: 'error'
        })
      }
    } catch (error) {
      toast.add({
        title: 'Gagal menyimpan bookmark',
        color: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  // Helper functions to create payloads for different types
  const createVideoBookmark = (title: string, videoCategoryId: number, lang: string = 'ID') => {
    openBookmarkModal({
      type: 1,
      title,
      videoLink: {
        videoId: null,
        video_category_id: videoCategoryId,
        lang
      },
      audioLink: null,
      bookLink: null,
      topic1Link: null,
      topic2Link: null,
      topic3Link: null,
      recipeLink: null
    })
  }

  const createAudioBookmark = (title: string, audioId: number, audioCategoryId: number) => {
    openBookmarkModal({
      type: 2,
      title,
      videoLink: null,
      audioLink: {
        audioId,
        audio_category_id: audioCategoryId
      },
      bookLink: null,
      topic1Link: null,
      topic2Link: null,
      topic3Link: null,
      recipeLink: null
    })
  }

  const createBookBookmark = (title: string, bookId: number, chapterId?: number, page?: number) => {
    const bookLink: BookLink = { bookId } as BookLink
    
    // Only add chapterId and page if they are provided and valid
    if (chapterId !== undefined && chapterId !== null && chapterId !== 0) {
      bookLink.chapterId = chapterId
      bookLink.page = page || 1
    }
    
    openBookmarkModal({
      type: 3,
      title,
      videoLink: null,
      audioLink: null,
      bookLink,
      topic1Link: null,
      topic2Link: null,
      topic3Link: null,
      recipeLink: null
    })
  }

  const createTopic1Bookmark = (title: string, subId: number) => {
    openBookmarkModal({
      type: 4,
      title,
      videoLink: null,
      audioLink: null,
      bookLink: null,
      topic1Link: {
        subId,
        title
      },
      topic2Link: null,
      topic3Link: null,
      recipeLink: null
    })
  }

  const createTopic2Bookmark = (title: string, contentId: number, page: number = 1) => {
    openBookmarkModal({
      type: 5,
      title,
      videoLink: null,
      audioLink: null,
      bookLink: null,
      topic1Link: null,
      topic2Link: {
        contentId,
        page
      },
      topic3Link: null,
      recipeLink: null
    })
  }

  const createTopic3Bookmark = (title: string, contentId: number, itemId?: number) => {
    const topic3Link: Topic3Link = { contentId }
    
    // Add itemId if provided
    if (itemId !== undefined && itemId !== null) {
      (topic3Link as any).itemId = itemId
    }
    
    openBookmarkModal({
      type: 6,
      title,
      videoLink: null,
      audioLink: null,
      bookLink: null,
      topic1Link: null,
      topic2Link: null,
      topic3Link,
      recipeLink: null
    })
  }

  return {
    isModalOpen,
    isLoading,
    folders,
    bookmarkTitle,
    selectedFolderId,
    bookmarksByType,
    loadingBookmarks,
    saveBookmark,
    fetchFolders,
    fetchBookmarksByType,
    isBookmarked,
    getBookmarkByTitle,
    createVideoBookmark,
    createAudioBookmark,
    createBookBookmark,
    createTopic1Bookmark,
    createTopic2Bookmark,
    createTopic3Bookmark
  }
}
