<template>
  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md">
    <!-- Floating Search Button -->
    <NuxtLink to="/search" class="absolute left-1/2 -translate-x-1/2 -top-7 group z-10">
      <div class="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 bg-primary dark:bg-yellow-500">
        <Icon name="mdi:magnify" class="w-7 h-7 text-black" />
      </div>
    </NuxtLink>

    <!-- Bottom Nav Bar -->
    <nav class="bg-white dark:bg-gray-800 rounded-t-xl px-2 pb-1 pt-2 shadow-[0_-1px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-1px_20px_rgba(0,0,0,0.4)]">
      <div class="flex items-center justify-around">
        <!-- Beranda -->
        <NuxtLink to="/" class="flex flex-col items-center py-1 px-3 group">
          <Icon 
            name="mdi:home" 
            class="w-6 h-6 transition-colors"
            :class="isActive('/') ? 'text-[#c09637] dark:text-yellow-400' : 'text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-yellow-400'"
          />
          <span 
            class="text-md mt-1 font-medium transition-colors"
            :class="isActive('/') ? 'text-[#c09637] dark:text-yellow-400' : 'text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-yellow-400'"
          >
            Beranda
          </span>
        </NuxtLink>

        <!-- Audio -->
        <NuxtLink to="/audio" class="flex flex-col items-center py-1 px-3 group">
          <Icon 
            name="mdi:music-note" 
            class="w-6 h-6 transition-colors"
            :class="isActive('/audio') ? 'text-[#c09637] dark:text-yellow-400' : 'text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-yellow-400'"
          />
          <span 
            class="text-md mt-1 font-medium transition-colors"
            :class="isActive('/audio') ? 'text-[#c09637] dark:text-yellow-400' : 'text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-yellow-400'"
          >
            Audio
          </span>
        </NuxtLink>

        <!-- Spacer for center button -->
        <div class="w-14"></div>

        <!-- Video -->
        <NuxtLink to="/video" class="flex flex-col items-center py-1 px-3 group">
          <Icon 
            name="mdi:play-box" 
            class="w-6 h-6 transition-colors"
            :class="isActive('/video') ? 'text-[#c09637] dark:text-yellow-400' : 'text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-yellow-400'"
          />
          <span 
            class="text-md mt-1 font-medium transition-colors"
            :class="isActive('/video') ? 'text-[#c09637] dark:text-yellow-400' : 'text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-yellow-400'"
          >
            Video
          </span>
        </NuxtLink>

        <!-- Lainnya -->
        <NuxtLink to="/lainnya" class="flex flex-col items-center py-1 px-3 group">
          <Icon 
            name="mdi:view-grid" 
            class="w-6 h-6 transition-colors"
            :class="isActive('/lainnya') ? 'text-[#c09637] dark:text-yellow-400' : 'text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-yellow-400'"
          />
          <span 
            class="text-md mt-1 font-medium transition-colors"
            :class="isActive('/lainnya') ? 'text-[#c09637] dark:text-yellow-400' : 'text-secondary dark:text-gray-400 group-hover:text-primary dark:group-hover:text-yellow-400'"
          >
            Lainnya
          </span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}
</script>
