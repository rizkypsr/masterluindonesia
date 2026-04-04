import type {
  BookChapter,
  Book,
  BookGroup,
  AudioGroup,
  AudioCategory,
  AudioSubGroup,
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

export const useDeepSearchHelpers = (deepSearch: ReturnType<typeof useDeepSearch>) => {
  // Book helpers
  function toggleChapterSelection(chapterId: number, chapter: BookChapter) {
    const idx = deepSearch.selectedChapterIds.value.indexOf(chapterId)
    if (idx > -1) {
      deepSearch.selectedChapterIds.value.splice(idx, 1)
      if (chapter.children) {
        deepSearch.unselectAllChildren(chapter.children)
      }
    } else {
      deepSearch.selectedChapterIds.value.push(chapterId)
      if (chapter.children) {
        deepSearch.selectAllChildren(chapter.children)
      }
    }
  }

  function isBookChapterSelected(chapter: BookChapter): boolean {
    if (!deepSearch.selectedChapterIds.value.includes(chapter.id)) {
      return false
    }
    if (chapter.children && chapter.children.length > 0) {
      return chapter.children.every(child => isBookChapterSelected(child))
    }
    return true
  }

  function toggleBookSelection(book: Book) {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: BookChapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    
    collectChapterIds(book.chapters)
    
    const allSelected = allChapterIds.length > 0 && allChapterIds.every(id => deepSearch.selectedChapterIds.value.includes(id))
    
    if (allSelected) {
      allChapterIds.forEach(id => {
        const idx = deepSearch.selectedChapterIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedChapterIds.value.splice(idx, 1)
        }
      })
    } else {
      allChapterIds.forEach(id => {
        if (!deepSearch.selectedChapterIds.value.includes(id)) {
          deepSearch.selectedChapterIds.value.push(id)
        }
      })
    }
  }

  function isBookExplicitlySelected(book: Book): boolean {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: BookChapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    
    collectChapterIds(book.chapters)
    
    if (allChapterIds.length === 0) return false
    return allChapterIds.every(id => deepSearch.selectedChapterIds.value.includes(id))
  }

  function toggleBookGroupSelection(bookGroup: BookGroup) {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: BookChapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    
    bookGroup.books.forEach(book => {
      collectChapterIds(book.chapters)
    })
    
    const allSelected = allChapterIds.length > 0 && allChapterIds.every(id => deepSearch.selectedChapterIds.value.includes(id))
    
    if (allSelected) {
      allChapterIds.forEach(id => {
        const idx = deepSearch.selectedChapterIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedChapterIds.value.splice(idx, 1)
        }
      })
    } else {
      allChapterIds.forEach(id => {
        if (!deepSearch.selectedChapterIds.value.includes(id)) {
          deepSearch.selectedChapterIds.value.push(id)
        }
      })
    }
  }

  function isBookGroupExplicitlySelected(bookGroup: BookGroup): boolean {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: BookChapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    
    bookGroup.books.forEach(book => {
      collectChapterIds(book.chapters)
    })
    
    if (allChapterIds.length === 0) return false
    return allChapterIds.every(id => deepSearch.selectedChapterIds.value.includes(id))
  }

  // Audio/Video helpers
  function toggleAudioSelection(audioId: number) {
    const idx = deepSearch.selectedVideoIds.value.indexOf(audioId)
    if (idx > -1) {
      deepSearch.selectedVideoIds.value.splice(idx, 1)
    } else {
      deepSearch.selectedVideoIds.value.push(audioId)
    }
  }

  function toggleVideoSelection(videoId: number) {
    const idx = deepSearch.selectedVideoIds.value.indexOf(videoId)
    if (idx > -1) {
      deepSearch.selectedVideoIds.value.splice(idx, 1)
    } else {
      deepSearch.selectedVideoIds.value.push(videoId)
    }
  }

  function toggleSubGroupVideos(subGroup: AudioSubGroup) {
    const items = subGroup.audios
    const allSelected = items.every(item => deepSearch.selectedVideoIds.value.includes(item.id))

    if (allSelected) {
      items.forEach(item => {
        const idx = deepSearch.selectedVideoIds.value.indexOf(item.id)
        if (idx > -1) {
          deepSearch.selectedVideoIds.value.splice(idx, 1)
        }
      })
    } else {
      items.forEach(item => {
        if (!deepSearch.selectedVideoIds.value.includes(item.id)) {
          deepSearch.selectedVideoIds.value.push(item.id)
        }
      })
    }
  }

  function isSubGroupSelected(subGroup: AudioSubGroup): boolean {
    const items = subGroup.audios
    if (!items || items.length === 0) return false
    return items.every(item => deepSearch.selectedVideoIds.value.includes(item.id))
  }

  function toggleAudioCategorySelection(category: AudioCategory) {
    const allAudioIds: number[] = []
    
    category.sub_groups.forEach(subGroup => {
      subGroup.audios.forEach(audio => {
        allAudioIds.push(audio.id)
      })
    })
    
    const allSelected = allAudioIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
    
    if (allSelected) {
      allAudioIds.forEach(id => {
        const idx = deepSearch.selectedVideoIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedVideoIds.value.splice(idx, 1)
        }
      })
    } else {
      allAudioIds.forEach(id => {
        if (!deepSearch.selectedVideoIds.value.includes(id)) {
          deepSearch.selectedVideoIds.value.push(id)
        }
      })
    }
  }

  function isAudioCategorySelected(category: AudioCategory): boolean {
    const allAudioIds: number[] = []
    
    category.sub_groups.forEach(subGroup => {
      subGroup.audios.forEach(audio => {
        allAudioIds.push(audio.id)
      })
    })
    
    if (allAudioIds.length === 0) return false
    return allAudioIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
  }

  function toggleAudioGroupSelection(audioGroup: AudioGroup) {
    const allAudioIds: number[] = []
    
    audioGroup.children.forEach(category => {
      category.sub_groups.forEach(subGroup => {
        subGroup.audios.forEach(audio => {
          allAudioIds.push(audio.id)
        })
      })
    })
    
    const allSelected = allAudioIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
    
    if (allSelected) {
      allAudioIds.forEach(id => {
        const idx = deepSearch.selectedVideoIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedVideoIds.value.splice(idx, 1)
        }
      })
    } else {
      allAudioIds.forEach(id => {
        if (!deepSearch.selectedVideoIds.value.includes(id)) {
          deepSearch.selectedVideoIds.value.push(id)
        }
      })
    }
  }

  function isAudioGroupSelected(audioGroup: AudioGroup): boolean {
    const allAudioIds: number[] = []
    
    audioGroup.children.forEach(category => {
      category.sub_groups.forEach(subGroup => {
        subGroup.audios.forEach(audio => {
          allAudioIds.push(audio.id)
        })
      })
    })
    
    if (allAudioIds.length === 0) return false
    return allAudioIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
  }

  // Video helpers
  function toggleVideoCategorySelection(category: VideoCategory) {
    const allVideoIds: number[] = []
    
    if (!category.children) return
    
    category.children.forEach(video => {
      allVideoIds.push(video.id)
    })
    
    const allSelected = allVideoIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
    
    if (allSelected) {
      allVideoIds.forEach(id => {
        const idx = deepSearch.selectedVideoIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedVideoIds.value.splice(idx, 1)
        }
      })
    } else {
      allVideoIds.forEach(id => {
        if (!deepSearch.selectedVideoIds.value.includes(id)) {
          deepSearch.selectedVideoIds.value.push(id)
        }
      })
    }
  }

  function isVideoCategorySelected(category: VideoCategory): boolean {
    const allVideoIds: number[] = []
    
    if (!category.children) return false
    
    category.children.forEach(video => {
      allVideoIds.push(video.id)
    })
    
    if (allVideoIds.length === 0) return false
    return allVideoIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
  }

  function toggleYearGroupSelection(yearGroup: VideoYearGroup) {
    const allVideoIds: number[] = []
    
    yearGroup.video_categories.forEach(category => {
      if (!category.children) return
      category.children.forEach(video => {
        allVideoIds.push(video.id)
      })
    })
    
    const allSelected = allVideoIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
    
    if (allSelected) {
      allVideoIds.forEach(id => {
        const idx = deepSearch.selectedVideoIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedVideoIds.value.splice(idx, 1)
        }
      })
    } else {
      allVideoIds.forEach(id => {
        if (!deepSearch.selectedVideoIds.value.includes(id)) {
          deepSearch.selectedVideoIds.value.push(id)
        }
      })
    }
  }

  function isYearGroupSelected(yearGroup: VideoYearGroup): boolean {
    const allVideoIds: number[] = []
    
    yearGroup.video_categories.forEach(category => {
      if (!category.children) return
      category.children.forEach(video => {
        allVideoIds.push(video.id)
      })
    })
    
    if (allVideoIds.length === 0) return false
    return allVideoIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
  }

  function toggleVideoGroupSelection(videoGroup: VideoGroup) {
    const allVideoIds: number[] = []
    
    if (!videoGroup.children || videoGroup.children.length === 0) return
    
    videoGroup.children.forEach(yearGroup => {
      if (!yearGroup.video_categories) return
      yearGroup.video_categories.forEach(category => {
        if (!category.children) return
        category.children.forEach(video => {
          allVideoIds.push(video.id)
        })
      })
    })
    
    const allSelected = allVideoIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
    
    if (allSelected) {
      allVideoIds.forEach(id => {
        const idx = deepSearch.selectedVideoIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedVideoIds.value.splice(idx, 1)
        }
      })
    } else {
      allVideoIds.forEach(id => {
        if (!deepSearch.selectedVideoIds.value.includes(id)) {
          deepSearch.selectedVideoIds.value.push(id)
        }
      })
    }
  }

  function isVideoGroupSelected(videoGroup: VideoGroup): boolean {
    const allVideoIds: number[] = []
    
    if (!videoGroup.children || videoGroup.children.length === 0) return false
    
    videoGroup.children.forEach(yearGroup => {
      if (!yearGroup.video_categories) return
      yearGroup.video_categories.forEach(category => {
        if (!category.children) return
        category.children.forEach(video => {
          allVideoIds.push(video.id)
        })
      })
    })
    
    if (allVideoIds.length === 0) return false
    return allVideoIds.every(id => deepSearch.selectedVideoIds.value.includes(id))
  }

  // Topic1 helpers
  function toggleTopic1CategorySelection(categoryId: number, category: Topic1Category) {
    const idx = deepSearch.selectedTopic1CategoryIds.value.indexOf(categoryId)
    if (idx > -1) {
      deepSearch.selectedTopic1CategoryIds.value.splice(idx, 1)
      if (category.children) {
        category.children.forEach(child => {
          const childIdx = deepSearch.selectedTopic1CategoryIds.value.indexOf(child.id)
          if (childIdx > -1) {
            deepSearch.selectedTopic1CategoryIds.value.splice(childIdx, 1)
          }
        })
      }
    } else {
      deepSearch.selectedTopic1CategoryIds.value.push(categoryId)
      if (category.children) {
        category.children.forEach(child => {
          if (!deepSearch.selectedTopic1CategoryIds.value.includes(child.id)) {
            deepSearch.selectedTopic1CategoryIds.value.push(child.id)
          }
        })
      }
    }
  }

  function isTopic1CategorySelected(category: Topic1Category): boolean {
    const allIds: number[] = [category.id]
    if (category.children) {
      category.children.forEach(child => allIds.push(child.id))
    }
    if (allIds.length === 0) return false
    return allIds.every(id => deepSearch.selectedTopic1CategoryIds.value.includes(id))
  }

  function toggleTopic1GroupSelection(topic1Group: Topic1Group) {
    const allCategoryIds: number[] = []
    
    topic1Group.categories.forEach(category => {
      allCategoryIds.push(category.id)
      if (category.children) {
        category.children.forEach(child => {
          allCategoryIds.push(child.id)
        })
      }
    })
    
    const allSelected = allCategoryIds.every(id => deepSearch.selectedTopic1CategoryIds.value.includes(id))
    
    if (allSelected) {
      allCategoryIds.forEach(id => {
        const idx = deepSearch.selectedTopic1CategoryIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedTopic1CategoryIds.value.splice(idx, 1)
        }
      })
    } else {
      allCategoryIds.forEach(id => {
        if (!deepSearch.selectedTopic1CategoryIds.value.includes(id)) {
          deepSearch.selectedTopic1CategoryIds.value.push(id)
        }
      })
    }
  }

  function isTopic1GroupSelected(topic1Group: Topic1Group): boolean {
    const allCategoryIds: number[] = []
    
    topic1Group.categories.forEach(category => {
      allCategoryIds.push(category.id)
      if (category.children) {
        category.children.forEach(child => {
          allCategoryIds.push(child.id)
        })
      }
    })
    
    if (allCategoryIds.length === 0) return false
    return allCategoryIds.every(id => deepSearch.selectedTopic1CategoryIds.value.includes(id))
  }

  // Topic2 helpers
  function toggleTopic2ChapterSelection(chapterId: number, chapter: Topic2Chapter) {
    const idx = deepSearch.selectedTopic2ChapterIds.value.indexOf(chapterId)
    if (idx > -1) {
      deepSearch.selectedTopic2ChapterIds.value.splice(idx, 1)
      if (chapter.children) {
        deepSearch.unselectAllTopic2Children(chapter.children)
      }
    } else {
      deepSearch.selectedTopic2ChapterIds.value.push(chapterId)
      if (chapter.children) {
        deepSearch.selectAllTopic2Children(chapter.children)
      }
    }
  }

  function isTopic2ChapterSelected(chapter: Topic2Chapter): boolean {
    const allIds: number[] = [chapter.id]
    
    function collectIds(ch: Topic2Chapter) {
      if (ch.children) {
        ch.children.forEach(child => {
          allIds.push(child.id)
          collectIds(child)
        })
      }
    }
    collectIds(chapter)
    
    if (allIds.length === 0) return false
    return allIds.every(id => deepSearch.selectedTopic2ChapterIds.value.includes(id))
  }

  function toggleTopic2TopicSelection(topic: Topic2Topic) {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: Topic2Chapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    collectChapterIds(topic.chapters)
    
    const allSelected = allChapterIds.every(id => deepSearch.selectedTopic2ChapterIds.value.includes(id))
    
    if (allSelected) {
      allChapterIds.forEach(id => {
        const idx = deepSearch.selectedTopic2ChapterIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedTopic2ChapterIds.value.splice(idx, 1)
        }
      })
    } else {
      allChapterIds.forEach(id => {
        if (!deepSearch.selectedTopic2ChapterIds.value.includes(id)) {
          deepSearch.selectedTopic2ChapterIds.value.push(id)
        }
      })
    }
  }

  function isTopic2TopicSelected(topic: Topic2Topic): boolean {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: Topic2Chapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    collectChapterIds(topic.chapters)
    
    if (allChapterIds.length === 0) return false
    return allChapterIds.every(id => deepSearch.selectedTopic2ChapterIds.value.includes(id))
  }

  function toggleTopic2GroupSelection(topic2Group: Topic2Group) {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: Topic2Chapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    
    topic2Group.topics.forEach(topic => {
      collectChapterIds(topic.chapters)
    })
    
    const allSelected = allChapterIds.every(id => deepSearch.selectedTopic2ChapterIds.value.includes(id))
    
    if (allSelected) {
      allChapterIds.forEach(id => {
        const idx = deepSearch.selectedTopic2ChapterIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedTopic2ChapterIds.value.splice(idx, 1)
        }
      })
    } else {
      allChapterIds.forEach(id => {
        if (!deepSearch.selectedTopic2ChapterIds.value.includes(id)) {
          deepSearch.selectedTopic2ChapterIds.value.push(id)
        }
      })
    }
  }

  function isTopic2GroupSelected(topic2Group: Topic2Group): boolean {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: Topic2Chapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    
    topic2Group.topics.forEach(topic => {
      collectChapterIds(topic.chapters)
    })
    
    if (allChapterIds.length === 0) return false
    return allChapterIds.every(id => deepSearch.selectedTopic2ChapterIds.value.includes(id))
  }

  // Topic3 helpers
  function toggleTopic3ChapterSelection(chapterId: number, chapter: Topic3Chapter) {
    const idx = deepSearch.selectedTopic3ChapterIds.value.indexOf(chapterId)
    if (idx > -1) {
      deepSearch.selectedTopic3ChapterIds.value.splice(idx, 1)
      if (chapter.children) {
        deepSearch.unselectAllTopic3Children(chapter.children)
      }
    } else {
      deepSearch.selectedTopic3ChapterIds.value.push(chapterId)
      if (chapter.children) {
        deepSearch.selectAllTopic3Children(chapter.children)
      }
    }
  }

  function isTopic3ChapterSelected(chapter: Topic3Chapter): boolean {
    const allIds: number[] = [chapter.id]
    
    function collectIds(ch: Topic3Chapter) {
      if (ch.children) {
        ch.children.forEach(child => {
          allIds.push(child.id)
          collectIds(child)
        })
      }
    }
    collectIds(chapter)
    
    if (allIds.length === 0) return false
    return allIds.every(id => deepSearch.selectedTopic3ChapterIds.value.includes(id))
  }

  function toggleTopic3TopicSelection(topic: Topic3Topic) {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: Topic3Chapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    collectChapterIds(topic.chapters)
    
    const allSelected = allChapterIds.every(id => deepSearch.selectedTopic3ChapterIds.value.includes(id))
    
    if (allSelected) {
      allChapterIds.forEach(id => {
        const idx = deepSearch.selectedTopic3ChapterIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedTopic3ChapterIds.value.splice(idx, 1)
        }
      })
    } else {
      allChapterIds.forEach(id => {
        if (!deepSearch.selectedTopic3ChapterIds.value.includes(id)) {
          deepSearch.selectedTopic3ChapterIds.value.push(id)
        }
      })
    }
  }

  function isTopic3TopicSelected(topic: Topic3Topic): boolean {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: Topic3Chapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    collectChapterIds(topic.chapters)
    
    if (allChapterIds.length === 0) return false
    return allChapterIds.every(id => deepSearch.selectedTopic3ChapterIds.value.includes(id))
  }

  function toggleTopic3GroupSelection(topic3Group: Topic3Group) {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: Topic3Chapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    
    topic3Group.topics.forEach(topic => {
      collectChapterIds(topic.chapters)
    })
    
    const allSelected = allChapterIds.every(id => deepSearch.selectedTopic3ChapterIds.value.includes(id))
    
    if (allSelected) {
      allChapterIds.forEach(id => {
        const idx = deepSearch.selectedTopic3ChapterIds.value.indexOf(id)
        if (idx > -1) {
          deepSearch.selectedTopic3ChapterIds.value.splice(idx, 1)
        }
      })
    } else {
      allChapterIds.forEach(id => {
        if (!deepSearch.selectedTopic3ChapterIds.value.includes(id)) {
          deepSearch.selectedTopic3ChapterIds.value.push(id)
        }
      })
    }
  }

  function isTopic3GroupSelected(topic3Group: Topic3Group): boolean {
    const allChapterIds: number[] = []
    
    function collectChapterIds(chapters: Topic3Chapter[]) {
      chapters.forEach(chapter => {
        allChapterIds.push(chapter.id)
        if (chapter.children) {
          collectChapterIds(chapter.children)
        }
      })
    }
    
    topic3Group.topics.forEach(topic => {
      collectChapterIds(topic.chapters)
    })
    
    if (allChapterIds.length === 0) return false
    return allChapterIds.every(id => deepSearch.selectedTopic3ChapterIds.value.includes(id))
  }

  return {
    // Book
    toggleChapterSelection,
    isBookChapterSelected,
    toggleBookSelection,
    isBookExplicitlySelected,
    toggleBookGroupSelection,
    isBookGroupExplicitlySelected,
    // Audio/Video
    toggleAudioSelection,
    toggleVideoSelection,
    toggleSubGroupVideos,
    isSubGroupSelected,
    toggleAudioCategorySelection,
    isAudioCategorySelected,
    toggleAudioGroupSelection,
    isAudioGroupSelected,
    // Video
    toggleVideoCategorySelection,
    isVideoCategorySelected,
    toggleYearGroupSelection,
    isYearGroupSelected,
    toggleVideoGroupSelection,
    isVideoGroupSelected,
    // Topic1
    toggleTopic1CategorySelection,
    isTopic1CategorySelected,
    toggleTopic1GroupSelection,
    isTopic1GroupSelected,
    // Topic2
    toggleTopic2ChapterSelection,
    isTopic2ChapterSelected,
    toggleTopic2TopicSelection,
    isTopic2TopicSelected,
    toggleTopic2GroupSelection,
    isTopic2GroupSelected,
    // Topic3
    toggleTopic3ChapterSelection,
    isTopic3ChapterSelected,
    toggleTopic3TopicSelection,
    isTopic3TopicSelected,
    toggleTopic3GroupSelection,
    isTopic3GroupSelected
  }
}
