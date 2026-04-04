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
    <div v-for="videoGroup in filters.filteredVideoList.value" :key="`vgroup-${videoGroup.id}`" 
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button @click="emit('toggleAccordion', `video-group-${videoGroup.id}`)" 
        class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <div class="flex items-center gap-2">
          <input type="checkbox" :id="`video-group-checkbox-${videoGroup.id}`"
            :checked="helpers.isVideoGroupSelected(videoGroup)"
            @click.stop="helpers.toggleVideoGroupSelection(videoGroup)"
            class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <h2 class="text-lg font-bold text-black dark:text-white text-left">
            {{ videoGroup.title }}
          </h2>
        </div>
        <Icon :name="expandedAccordions.has(`video-group-${videoGroup.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
          class="w-5 h-5 text-black dark:text-white" />
      </button>

      <div v-if="expandedAccordions.has(`video-group-${videoGroup.id}`)" class="p-3 space-y-3">
        <div v-for="yearGroup in videoGroup.children" :key="`vyear-${yearGroup.id}`" 
          class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button @click="emit('toggleAccordion', `video-year-${yearGroup.id}`)"
            class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div class="flex items-center gap-2">
              <input type="checkbox" :id="`video-year-checkbox-${yearGroup.id}`"
                :checked="helpers.isYearGroupSelected(yearGroup)"
                @click.stop="helpers.toggleYearGroupSelection(yearGroup)"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <h3 class="text-lg font-semibold text-black dark:text-white text-left">
                {{ yearGroup.title }}
              </h3>
            </div>
            <Icon :name="expandedAccordions.has(`video-year-${yearGroup.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-5 h-5 text-black dark:text-white" />
          </button>

          <div v-if="expandedAccordions.has(`video-year-${yearGroup.id}`)" class="p-3 space-y-3">
            <div v-for="category in yearGroup.video_categories" :key="`vcat-${category.id}`"
              class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button @click="emit('toggleAccordion', `video-cat-${category.id}`)"
                class="w-full flex items-center justify-between p-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :id="`video-cat-checkbox-${category.id}`"
                    :checked="helpers.isVideoCategorySelected(category)"
                    @click.stop="helpers.toggleVideoCategorySelection(category)"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <h4 class="text-lg font-medium text-black dark:text-white text-left">
                    {{ category.title }}
                  </h4>
                </div>
                <Icon :name="expandedAccordions.has(`video-cat-${category.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                  class="w-4 h-4 text-black dark:text-white" />
              </button>

              <div v-if="expandedAccordions.has(`video-cat-${category.id}`)" class="p-3">
                <div class="space-y-1 ml-6">
                  <div v-for="video in category.children" :key="`vv-${video.id}`"
                    class="flex items-start gap-2 py-1">
                    <input type="checkbox" :id="`video-${video.id}`"
                      :checked="deepSearch.selectedVideoIds.value.includes(video.id)" @change="helpers.toggleVideoSelection(video.id)"
                      class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <label :for="`video-${video.id}`"
                      class="text-lg text-black dark:text-white cursor-pointer flex-1">
                      {{ video.title }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filters.filteredVideoList.value.length === 0 && !deepSearch.isLoadingVideoList.value" class="text-center py-8">
      <p class="text-lg text-gray-500 dark:text-gray-400">
        {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data video' }}
      </p>
    </div>

    <div v-if="deepSearch.isLoadingVideoList.value && deepSearch.videoList.value.length > 0" class="flex justify-center py-4">
      <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
    </div>

    <div v-if="deepSearch.videoList.value.length === 0 && deepSearch.isLoadingVideoList.value" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
    </div>
  </div>
</template>
