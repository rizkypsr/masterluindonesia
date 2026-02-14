import { useAuth } from '~/lib/auth'

export interface HistoryPayload {
  id: null
  type: number // 1=video, 2=audio, 3=book
  folderId: null
  title: string
  videoLink: {
    videoId: number | null
    video_category_id: number | null
    lang: string
  } | null
  audioLink: {
    audioId: number
    subtitleId: number | null
    lang: string
  } | null
  bookLink: {
    book_id: number
    contentId: number | null
    page: number | null
  } | null
  recipeLink: null
}

export const useHistory = () => {
  const { getAuthHeader, isAuthenticated } = useAuth()
  const config = useRuntimeConfig()

  const saveHistory = async (payload: HistoryPayload) => {
    if (!isAuthenticated.value) return

    try {
      await $fetch(`${config.public.apiBaseUrl}/history`, {
        method: 'POST',
        headers: getAuthHeader() as Record<string, string>,
        body: payload
      })
    } catch (error) {
      console.error('Failed to save history:', error)
    }
  }

  // Helper for book list page (books/[id].vue)
  const saveBookHistory = (title: string, bookId: number) => {
    saveHistory({
      id: null,
      type: 3,
      folderId: null,
      title,
      videoLink: null,
      audioLink: null,
      bookLink: {
        book_id: bookId,
        contentId: null,
        page: null
      },
      recipeLink: null
    })
  }

  // Helper for book chapter page (book/[bookId]/[chapterId].vue)
  const saveBookChapterHistory = (bookTitle: string, chapterTitle: string, bookId: number, chapterId: number) => {
    const title = `${bookTitle} - ${chapterTitle}`
    saveHistory({
      id: null,
      type: 3,
      folderId: null,
      title,
      videoLink: null,
      audioLink: null,
      bookLink: {
        book_id: bookId,
        contentId: chapterId,
        page: null
      },
      recipeLink: null
    })
  }

  // Helper for video
  const saveVideoHistory = (title: string, videoId: number | null, videoCategoryId: number | null, lang: string = 'ID') => {
    saveHistory({
      id: null,
      type: 1,
      folderId: null,
      title,
      videoLink: {
        videoId,
        video_category_id: videoCategoryId,
        lang
      },
      audioLink: null,
      bookLink: null,
      recipeLink: null
    })
  }

  // Helper for audio (audio/[id].vue - when clicking audio item)
  const saveAudioHistory = (title: string, audioId: number, subtitleId: number | null = null, lang: string = 'CN') => {
    saveHistory({
      id: null,
      type: 2,
      folderId: null,
      title,
      videoLink: null,
      audioLink: {
        audioId,
        subtitleId,
        lang
      },
      bookLink: null,
      recipeLink: null
    })
  }

  // Helper for audio detail (audio/detail.vue)
  const saveAudioDetailHistory = (title: string, audioId: number, subtitleId: number | null, lang: string = 'CN') => {
    saveHistory({
      id: null,
      type: 2,
      folderId: null,
      title,
      videoLink: null,
      audioLink: {
        audioId,
        subtitleId,
        lang
      },
      bookLink: null,
      recipeLink: null
    })
  }

  return {
    saveHistory,
    saveBookHistory,
    saveBookChapterHistory,
    saveVideoHistory,
    saveAudioHistory,
    saveAudioDetailHistory
  }
}
