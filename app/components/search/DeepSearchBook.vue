<script setup lang="ts">
const props = defineProps<{
  deepSearch: ReturnType<typeof useDeepSearch>
  deepSearchQuery: string
  expandedAccordions: Set<string>
}>()

const emit = defineEmits<{
  toggleAccordion: [key: string]
}>()

const helpers = useDeepSearchHelpers(props.deepSearch)
const filters = useDeepSearchFilters(props.deepSearch, toRef(props, 'deepSearchQuery'))
</script>

<template>
  <div class="space-y-4">
    <div v-for="bookGroup in filters.filteredBookChapters.value" :key="`group-${bookGroup.id}`" 
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button @click="emit('toggleAccordion', `book-group-${bookGroup.id}`)" 
        class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <div class="flex items-center gap-2">
          <input type="checkbox" :id="`book-group-checkbox-${bookGroup.id}`"
            :checked="helpers.isBookGroupExplicitlySelected(bookGroup)"
            @click.stop="helpers.toggleBookGroupSelection(bookGroup)"
            class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <h2 class="text-lg font-bold text-black dark:text-white text-left">
            {{ bookGroup.title }}
          </h2>
        </div>
        <Icon :name="expandedAccordions.has(`book-group-${bookGroup.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
          class="w-5 h-5 text-black dark:text-white" />
      </button>

      <div v-if="expandedAccordions.has(`book-group-${bookGroup.id}`)" class="p-3 space-y-3">
        <div v-for="book in bookGroup.books" :key="`book-${book.id}`"
          class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button @click="emit('toggleAccordion', `book-${book.id}`)"
            class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div class="flex items-center gap-2">
              <input type="checkbox" :id="`book-checkbox-${book.id}`"
                :checked="helpers.isBookExplicitlySelected(book)"
                @click.stop="helpers.toggleBookSelection(book)"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <h3 class="font-semibold text-black dark:text-white text-left">
                {{ book.title }}
              </h3>
            </div>
            <Icon :name="expandedAccordions.has(`book-${book.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-5 h-5 text-black dark:text-white" />
          </button>

          <div v-if="expandedAccordions.has(`book-${book.id}`)" class="p-3">
            <div class="space-y-2">
              <template v-for="chapter in book.chapters" :key="`ch-${chapter.id}`">
                <div v-if="chapter.children && chapter.children.length > 0"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button @click="emit('toggleAccordion', `chapter-${chapter.id}`)"
                    class="w-full flex items-center justify-between p-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" :id="`deep-chapter-${chapter.id}`"
                        :checked="deepSearch.selectedChapterIds.value.includes(chapter.id)"
                        @click.stop="helpers.toggleChapterSelection(chapter.id, chapter)"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label :for="`deep-chapter-${chapter.id}`"
                        class="text-lg text-black dark:text-white cursor-pointer text-left flex-1">
                        {{ chapter.title }}
                      </label>
                    </div>
                    <Icon :name="expandedAccordions.has(`chapter-${chapter.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                      class="w-4 h-4 text-black dark:text-white" />
                  </button>

                  <div v-if="expandedAccordions.has(`chapter-${chapter.id}`)" class="p-3">
                    <div class="ml-6 space-y-2">
                      <template v-for="child in chapter.children" :key="`chd-${child.id}`">
                        <div v-if="child.children && child.children.length > 0"
                          class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <button @click="emit('toggleAccordion', `chapter-${child.id}`)"
                            class="w-full flex items-center justify-between p-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div class="flex items-center gap-2">
                              <input type="checkbox" :id="`deep-chapter-${child.id}`"
                                :checked="deepSearch.selectedChapterIds.value.includes(child.id)"
                                @click.stop="helpers.toggleChapterSelection(child.id, child)"
                                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                              <label :for="`deep-chapter-${child.id}`"
                                class="text-lg text-black dark:text-white cursor-pointer text-left flex-1">
                                {{ child.title }}
                              </label>
                            </div>
                            <Icon :name="expandedAccordions.has(`chapter-${child.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                              class="w-4 h-4 text-black dark:text-white" />
                          </button>

                          <div v-if="expandedAccordions.has(`chapter-${child.id}`)" class="p-3">
                            <div class="ml-6 space-y-1">
                              <div v-for="grandchild in child.children" :key="`gch-${grandchild.id}`"
                                class="flex items-start gap-2 py-1">
                                <input type="checkbox" :id="`deep-chapter-${grandchild.id}`"
                                  :checked="deepSearch.selectedChapterIds.value.includes(grandchild.id)"
                                  @change="helpers.toggleChapterSelection(grandchild.id, grandchild)"
                                  class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <label :for="`deep-chapter-${grandchild.id}`"
                                  class="text-lg text-black dark:text-white cursor-pointer flex-1">
                                  {{ grandchild.title }}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-else class="flex items-start gap-2 py-1">
                          <input type="checkbox" :id="`deep-chapter-${child.id}`"
                            :checked="deepSearch.selectedChapterIds.value.includes(child.id)"
                            @change="helpers.toggleChapterSelection(child.id, child)"
                            class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <label :for="`deep-chapter-${child.id}`"
                            class="text-lg text-black dark:text-white cursor-pointer flex-1">
                            {{ child.title }}
                          </label>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <div v-else class="flex items-start gap-2 py-1">
                  <input type="checkbox" :id="`deep-chapter-${chapter.id}`"
                    :checked="deepSearch.selectedChapterIds.value.includes(chapter.id)"
                    @change="helpers.toggleChapterSelection(chapter.id, chapter)"
                    class="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label :for="`deep-chapter-${chapter.id}`"
                    class="text-lg text-black dark:text-white cursor-pointer flex-1">
                    {{ chapter.title }}
                  </label>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filters.filteredBookChapters.value.length === 0 && !deepSearch.isLoadingBookChapters.value" class="text-center py-8">
      <p class="text-lg text-gray-500 dark:text-gray-400">
        {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data bab buku' }}
      </p>
    </div>

    <div v-if="deepSearch.isLoadingBookChapters.value && deepSearch.bookChapters.value.length > 0" class="flex justify-center py-4">
      <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
    </div>

    <div v-if="deepSearch.bookChapters.value.length === 0 && deepSearch.isLoadingBookChapters.value" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
    </div>
  </div>
</template>
