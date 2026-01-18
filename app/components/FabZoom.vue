<template>
  <div 
    class="fixed right-4 flex items-center gap-2 z-10 max-w-md transition-all duration-300" 
    :class="hasDrawer ? 'bottom-36' : 'bottom-4'"
    style="right: max(1rem, calc((100vw - 448px) / 2 + 1rem));"
  >
    <!-- Expanded Menu -->
    <transition-group 
      name="fab-menu"
      tag="div"
      class="flex items-center gap-2"
    >
      <button 
        v-if="isOpen"
        key="zoom-out"
        @click="$emit('zoomOut')" 
        class="w-12 h-12 bg-[#fff3be] rounded-full flex items-center justify-center shadow-lg"
      >
        <Icon name="mdi:magnify-minus" class="w-6 h-6 text-black" />
      </button>
      <button 
        v-if="isOpen"
        key="zoom-in"
        @click="$emit('zoomIn')" 
        class="w-12 h-12 bg-[#fff3be] rounded-full flex items-center justify-center shadow-lg"
      >
        <Icon name="mdi:magnify-plus" class="w-6 h-6 text-black" />
      </button>
      <button 
        v-if="isOpen"
        key="scroll-top"
        @click="scrollToTop" 
        class="w-12 h-12 bg-[#fff3be] rounded-full flex items-center justify-center shadow-lg"
      >
        <Icon name="mdi:arrow-up" class="w-6 h-6 text-black" />
      </button>
    </transition-group>
    
    <!-- Main FAB Button -->
    <button 
      @click="$emit('update:isOpen', !isOpen)" 
      class="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
    >
      <Icon :name="isOpen ? 'mdi:close' : 'mdi:menu'" class="w-6 h-6 text-black" />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  hasDrawer?: boolean
}>()

defineEmits<{
  'update:isOpen': [value: boolean]
  'zoomIn': []
  'zoomOut': []
}>()

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* FAB Menu Animation */
.fab-menu-enter-active {
  transition: all 0.3s ease-out;
}

.fab-menu-leave-active {
  transition: all 0.2s ease-in;
}

.fab-menu-enter-from {
  opacity: 0;
  transform: translateX(50px) translateY(20px);
}

.fab-menu-leave-to {
  opacity: 0;
  transform: translateX(50px) translateY(20px);
}
</style>
