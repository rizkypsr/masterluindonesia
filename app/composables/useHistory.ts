import { useAuth } from '~/lib/auth'

export interface HistoryPayload {
  type: number // 1=video, 2=audio, 3=book
  title: string
  videoLink?: {
    videoId: number | null
    video_category_id: number | null
    lang: string
  }
  audioLink?: {
    audioId: number
    subtitleId: number | null
    lang: string
  }
  bookLink?: {
    book_id: number
    contentId: number | null
    page: number | null
  }
}

export const useHistory = () => {
  const { getAuthHeader, isAuthenticated } = useAuth()
  const config = useRuntimeConfig()

  const saveHistory = async (payload: HistoryPayload) => {
    if (!isAuthenticated.value) return

    try {
      await $fetch(`${config.public.apiV2BaseUrl}/history`, {
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
      type: 3,
      title,
      bookLink: {
        book_id: bookId,
        contentId: null,
        page: null
      }
    })
  }

  // Helper for book chapter page (book/[bookId]/[chapterId].vue)
  const saveBookChapterHistory = (bookTitle: string, chapterTitle: string, bookId: number, chapterId: number) => {
    const title = `${bookTitle} - ${chapterTitle}`
    saveHistory({
      type: 3,
      title,
      bookLink: {
        book_id: bookId,
        contentId: chapterId,
        page: null
      }
    })
  }

  // Helper for video
  const saveVideoHistory = (title: string, videoId: number | null, videoCategoryId: number | null, lang: string = 'ID') => {
    saveHistory({
      type: 1,
      title,
      videoLink: {
        videoId,
        video_category_id: videoCategoryId,
        lang
      }
    })
  }

  // Helper for audio (audio/[id].vue - when clicking audio item)
  const saveAudioHistory = (title: string, audioId: number, subtitleId: number | null = null, lang: string = 'CN') => {
    saveHistory({
      type: 2,
      title,
      audioLink: {
        audioId,
        subtitleId,
        lang
      }
    })
  }

  // Helper for audio detail (audio/detail.vue)
  const saveAudioDetailHistory = (title: string, audioId: number, subtitleId: number | null, lang: string = 'CN') => {
    saveHistory({
      type: 2,
      title,
      audioLink: {
        audioId,
        subtitleId,
        lang
      }
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
