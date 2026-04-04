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
    <div v-for="audioGroup in filters.filteredAudioList.value" :key="`agroup-${audioGroup.id}`" 
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button @click="emit('toggleAccordion', `audio-group-${audioGroup.id}`)" 
        class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <div class="flex items-center gap-2">
          <input type="checkbox" :id="`audio-group-checkbox-${audioGroup.id}`"
            :checked="helpers.isAudioGroupSelected(audioGroup)"
            @click.stop="helpers.toggleAudioGroupSelection(audioGroup)"
            class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <h2 class="text-lg font-bold text-black dark:text-white text-left">
            {{ audioGroup.title }}
          </h2>
        </div>
        <Icon :name="expandedAccordions.has(`audio-group-${audioGroup.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
          class="w-5 h-5 text-black dark:text-white" />
      </button>

      <div v-if="expandedAccordions.has(`audio-group-${audioGroup.id}`)" class="p-3 space-y-3">
        <div v-for="category in audioGroup.children" :key="`acat-${category.id}`" 
          class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button @click="emit('toggleAccordion', `audio-cat-${category.id}`)"
            class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div class="flex items-center gap-2">
              <input type="checkbox" :id="`audio-cat-checkbox-${category.id}`"
                :checked="helpers.isAudioCategorySelected(category)"
                @click.stop="helpers.toggleAudioCategorySelection(category)"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <h3 class="text-lg font-semibold text-black dark:text-white text-left">
                {{ category.title }}
              </h3>
            </div>
            <Icon :name="expandedAccordions.has(`audio-cat-${category.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-5 h-5 text-black dark:text-white" />
          </button>

          <div v-if="expandedAccordions.has(`audio-cat-${category.id}`)" class="p-3 space-y-2">
            <div v-for="subGroup in category.sub_groups" :key="`asg-${subGroup.id}`"
              class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button @click="emit('toggleAccordion', `audio-subgroup-${subGroup.id}`)"
                class="w-full flex items-center justify-between p-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div class="flex items-center gap-2">
                  <input type="checkbox" :id="`audio-group-${subGroup.id}`" :checked="helpers.isSubGroupSelected(subGroup)"
                    @click.stop="helpers.toggleSubGroupVideos(subGroup)"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label :for="`audio-group-${subGroup.id}`"
                    class="text-lg font-semibold text-black dark:text-white cursor-pointer text-left">
                    {{ subGroup.name }}
                  </label>
                </div>
                <Icon :name="expandedAccordions.has(`audio-subgroup-${subGroup.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                  class="w-5 h-5 text-black dark:text-white" />
              </button>

              <div v-if="expandedAccordions.has(`audio-subgroup-${subGroup.id}`)" class="p-3">
                <div class="space-y-1 ml-6">
                  <div v-for="audio in subGroup.audios" :key="`av-${audio.id}`" class="flex items-start gap-2 py-1">
                    <input type="checkbox" :id="`audio-${audio.id}`" :checked="deepSearch.selectedVideoIds.value.includes(audio.id)"
                      @change="helpers.toggleAudioSelection(audio.id)"
                      class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <label :for="`audio-${audio.id}`"
                      class="text-lg text-black dark:text-white cursor-pointer flex-1">
                      {{ audio.title }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filters.filteredAudioList.value.length === 0 && !deepSearch.isLoadingAudioList.value" class="text-center py-8">
      <p class="text-lg text-gray-500 dark:text-gray-400">
        {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data audio' }}
      </p>
    </div>

    <div v-if="deepSearch.isLoadingAudioList.value && deepSearch.audioList.value.length > 0" class="flex justify-center py-4">
      <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
    </div>

    <div v-if="deepSearch.audioList.value.length === 0 && deepSearch.isLoadingAudioList.value" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
    </div>
  </div>
</template>
