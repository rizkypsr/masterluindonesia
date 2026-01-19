<template>
  <div 
    class="flex justify-end pb-4 pr-4"
  >
    <div class="flex items-center gap-2">
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
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'zoomIn': []
  'zoomOut': []
  'scrollTop': []
}>()

const scrollToTop = () => {
  emit('scrollTop')
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
