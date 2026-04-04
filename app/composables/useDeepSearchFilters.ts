import type {
  BookGroup,
  Book,
  BookChapter,
  AudioGroup,
  AudioCategory,
  VideoGroup,
  VideoYearGroup,
  VideoCategory,
  Topic1Group,
  Topic1Category,
  Topic2Group,
  Topic2Topic,
  Topic2Chapter,
  Topic3Group,
  Topic3Topic,
  Topic3Chapter
} from '~/types/search'

export const useDeepSearchFilters = (
  deepSearch: ReturnType<typeof useDeepSearch>,
  deepSearchQuery: Ref<string>
) => {
  const filteredBookChapters = computed(() => {
    if (!deepSearchQuery.value.trim()) return deepSearch.bookChapters.value

    const query = deepSearchQuery.value.toLowerCase()

    return deepSearch.bookChapters.value.map(bookGroup => {
      const groupMatches = bookGroup.title.toLowerCase().includes(query)

      if (groupMatches) {
        return bookGroup
      }

      const filteredBooks = bookGroup.books.map(book => {
        const bookMatches = book.title.toLowerCase().includes(query)

        if (bookMatches) {
          return book
        }

        const filteredChapters = book.chapters.filter(chapter => {
          const chapterMatches = chapter.title.toLowerCase().includes(query)
          const childMatches = chapter.children?.some(child =>
            child.title.toLowerCase().includes(query)
          )
          return chapterMatches || childMatches
        }).map(chapter => {
          if (chapter.title.toLowerCase().includes(query)) {
            return chapter
          }
          return {
            ...chapter,
            children: chapter.children?.filter(child =>
              child.title.toLowerCase().includes(query)
            )
          }
        })

        if (filteredChapters.length > 0) {
          return {
            ...book,
            chapters: filteredChapters
          }
        }
        return null
      }).filter(book => book !== null) as Book[]

      if (filteredBooks.length > 0) {
        return {
          ...bookGroup,
          books: filteredBooks
        }
      }
      return null
    }).filter(group => group !== null) as BookGroup[]
  })

  const filteredAudioList = computed(() => {
    if (!deepSearchQuery.value.trim()) return deepSearch.audioList.value

    const query = deepSearchQuery.value.toLowerCase()

    return deepSearch.audioList.value.map(audioGroup => {
      const groupMatches = audioGroup.title.toLowerCase().includes(query)

      if (groupMatches) {
        return audioGroup
      }

      const filteredCategories = audioGroup.children.map(category => {
        const categoryMatches = category.title.toLowerCase().includes(query)

        if (categoryMatches) {
          return category
        }

        const filteredSubGroups = category.sub_groups.filter(subGroup => {
          const subGroupMatches = subGroup.name.toLowerCase().includes(query)
          const audioMatches = subGroup.audios.some(audio =>
            audio.title.toLowerCase().includes(query)
          )
          return subGroupMatches || audioMatches
        }).map(subGroup => {
          if (subGroup.name.toLowerCase().includes(query)) {
            return subGroup
          }
          return {
            ...subGroup,
            audios: subGroup.audios.filter(audio =>
              audio.title.toLowerCase().includes(query)
            )
          }
        })

        if (filteredSubGroups.length > 0) {
          return {
            ...category,
            sub_groups: filteredSubGroups
          }
        }
        return null
      }).filter(category => category !== null) as AudioCategory[]

      if (filteredCategories.length > 0) {
        return {
          ...audioGroup,
          children: filteredCategories
        }
      }
      return null
    }).filter(group => group !== null) as AudioGroup[]
  })

  const filteredVideoList = computed(() => {
    if (!deepSearchQuery.value.trim()) return deepSearch.videoList.value

    const query = deepSearchQuery.value.toLowerCase()

    return deepSearch.videoList.value.map(videoGroup => {
      const groupMatches = videoGroup.title.toLowerCase().includes(query)

      if (groupMatches) {
        return videoGroup
      }

      const filteredChildren = videoGroup.children.map(yearGroup => {
        const yearMatches = yearGroup.title.toLowerCase().includes(query)

        if (yearMatches) {
          return yearGroup
        }

        const filteredCategories = yearGroup.video_categories.map(category => {
          const categoryMatches = category.title.toLowerCase().includes(query)

          if (categoryMatches) {
            return category
          }

          const filteredVideos = category.children.filter(video =>
            video.title.toLowerCase().includes(query)
          )

          if (filteredVideos.length > 0) {
            return {
              ...category,
              children: filteredVideos
            }
          }
          return null
        }).filter(category => category !== null) as VideoCategory[]

        if (filteredCategories.length > 0) {
          return {
            ...yearGroup,
            video_categories: filteredCategories
          }
        }
        return null
      }).filter(yearGroup => yearGroup !== null) as VideoYearGroup[]

      if (filteredChildren.length > 0) {
        return {
          ...videoGroup,
          children: filteredChildren
        }
      }
      return null
    }).filter(group => group !== null) as VideoGroup[]
  })

  const filteredTopic1List = computed(() => {
    if (!deepSearchQuery.value.trim()) return deepSearch.topic1List.value

    const query = deepSearchQuery.value.toLowerCase()

    return deepSearch.topic1List.value.map(topic1Group => {
      const groupMatches = topic1Group.topic_title.toLowerCase().includes(query)

      if (groupMatches) {
        return topic1Group
      }

      const filteredCategories = topic1Group.categories.map(category => {
        const categoryMatches = category.title.toLowerCase().includes(query)

        if (categoryMatches) {
          return category
        }

        if (category.children) {
          const filteredChildren = category.children.filter(child =>
            child.title.toLowerCase().includes(query)
          )

          if (filteredChildren.length > 0) {
            return {
              ...category,
              children: filteredChildren
            }
          }
        }

        return null
      }).filter(category => category !== null) as Topic1Category[]

      if (filteredCategories.length > 0) {
        return {
          ...topic1Group,
          categories: filteredCategories
        }
      }
      return null
    }).filter(group => group !== null) as Topic1Group[]
  })

  const filteredTopic2List = computed(() => {
    if (!deepSearchQuery.value.trim()) return deepSearch.topic2List.value

    const query = deepSearchQuery.value.toLowerCase()

    function filterChapters(chapters: Topic2Chapter[]): Topic2Chapter[] {
      return chapters.map(chapter => {
        const chapterMatches = chapter.title.toLowerCase().includes(query)

        if (chapterMatches) {
          return chapter
        }

        if (chapter.children) {
          const filteredChildren = filterChapters(chapter.children)
          if (filteredChildren.length > 0) {
            return {
              ...chapter,
              children: filteredChildren
            }
          }
        }

        return null
      }).filter(chapter => chapter !== null) as Topic2Chapter[]
    }

    return deepSearch.topic2List.value.map(topic2Group => {
      const groupMatches = topic2Group.title.toLowerCase().includes(query)

      if (groupMatches) {
        return topic2Group
      }

      const filteredTopics = topic2Group.topics.map(topic => {
        const topicMatches = topic.title.toLowerCase().includes(query)

        if (topicMatches) {
          return topic
        }

        const filteredChapters = filterChapters(topic.chapters)

        if (filteredChapters.length > 0) {
          return {
            ...topic,
            chapters: filteredChapters
          }
        }

        return null
      }).filter(topic => topic !== null) as Topic2Topic[]

      if (filteredTopics.length > 0) {
        return {
          ...topic2Group,
          topics: filteredTopics
        }
      }
      return null
    }).filter(group => group !== null) as Topic2Group[]
  })

  const filteredTopic3List = computed(() => {
    if (!deepSearchQuery.value.trim()) return deepSearch.topic3List.value

    const query = deepSearchQuery.value.toLowerCase()

    function filterChapters(chapters: Topic3Chapter[]): Topic3Chapter[] {
      return chapters.map(chapter => {
        const chapterMatches = chapter.title.toLowerCase().includes(query)

        if (chapterMatches) {
          return chapter
        }

        if (chapter.children) {
          const filteredChildren = filterChapters(chapter.children)
          if (filteredChildren.length > 0) {
            return {
              ...chapter,
              children: filteredChildren
            }
          }
        }

        return null
      }).filter(chapter => chapter !== null) as Topic3Chapter[]
    }

    return deepSearch.topic3List.value.map(topic3Group => {
      const groupMatches = topic3Group.title.toLowerCase().includes(query)

      if (groupMatches) {
        return topic3Group
      }

      const filteredTopics = topic3Group.topics.map(topic => {
        const topicMatches = topic.title.toLowerCase().includes(query)

        if (topicMatches) {
          return topic
        }

        const filteredChapters = filterChapters(topic.chapters)

        if (filteredChapters.length > 0) {
          return {
            ...topic,
            chapters: filteredChapters
          }
        }

        return null
      }).filter(topic => topic !== null) as Topic3Topic[]

      if (filteredTopics.length > 0) {
        return {
          ...topic3Group,
          topics: filteredTopics
        }
      }
      return null
    }).filter(group => group !== null) as Topic3Group[]
  })

  return {
    filteredBookChapters,
    filteredAudioList,
    filteredVideoList,
    filteredTopic1List,
    filteredTopic2List,
    filteredTopic3List
  }
}
