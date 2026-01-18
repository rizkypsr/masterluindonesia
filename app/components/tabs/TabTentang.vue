<template>
  <div class="pb-6">
    <!-- Section 1: Xin Ling Fa Men -->
    <div class="relative bg-gradient-to-b from-white via-yellow-50 to-yellow-100">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Xin Ling Fa Men</h2>
        <p class="text-gray-700 text-base mb-1">Xin Ling adalah Gembok</p>
        <p class="text-gray-700 text-base mb-1">Fa Men adalah kuncinya</p>
        <p class="text-gray-700 text-base mb-4">
          Menggunakan Pintu Dharma untuk membuka jiwamu, maka itu adalah "Xin Ling Fa Men"
        </p>
        <NuxtLink to="/tentang/xin-ling-fa-men?from=tentang"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-50 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden flex justify-center">
        <img src="https://masterluindonesia.com/assets/assets/images/tentang/image1.png" alt="Xin Ling Fa Men"
          class="w-full" />
      </div>
    </div>

    <!-- Section 2: Master Lu Jun Hong -->
    <div class="relative mb-6 bg-[#ffefce]">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Master Lu Jun Hong</h2>
        <p class="text-gray-800 text-sm mb-4">
          Master Jun Hong Lu (Justice of the Peace) adalah Presiden, Direktur dan Pendiri stasiun TV dan Radio 2OR
          Australia Oriental yang sangat dihormati dan pemimpin terkemuka Komunitas Tionghoa di Australia.
        </p>
        <NuxtLink to="/tentang/master-lu-jun-hong"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <img src="https://masterluindonesia.com/assets/assets/images/tentang/image2.png" alt="Master Lu Jun Hong"
          class="w-full" />
      </div>
    </div>

    <!-- Section 3: Lima Pusaka XLFM Carousel -->
    <div class="relative">
      <UCarousel ref="carouselRef" v-slot="{ item }" :items="limaPusakaItems" :ui="{
        item: 'basis-full'
      }" @select="onSelect">
        <div>
          <!-- Content Section -->
          <div class="px-4 pt-6 pb-4">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Lima Pusaka XLFM</h2>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ item.title }}</h3>
            <p class="text-gray-600 text-sm mb-4">
              {{ item.description }}
            </p>
            <NuxtLink :to="item.href"
              class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-50 transition-colors">
              Selengkapnya
              <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
            </NuxtLink>
          </div>

          <!-- Image Section -->
          <div class="relative overflow-hidden">
            <img :src="item.image" :alt="item.title" class="w-full" />
          </div>
        </div>
      </UCarousel>

      <!-- Custom Navigation: Dots + Arrow -->
      <div class="flex items-center justify-between px-4 mt-4">
        <!-- Custom Dots -->
        <div class="flex items-center gap-2">
          <button v-for="(item, index) in limaPusakaItems" :key="item.id" @click="scrollTo(index)" :class="[
            'transition-all duration-300',
            activeIndex === index
              ? 'w-8 h-2 bg-yellow-600 rounded-full'
              : 'w-2 h-2 bg-yellow-200 rounded-full'
          ]" :aria-label="`Go to slide ${index + 1}`" />
        </div>

        <!-- Arrow Right -->
        <button @click="scrollNext()" class="p-2" aria-label="Next slide">
          <Icon name="heroicons:arrow-right" class="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const carouselRef = useTemplateRef('carouselRef')
const activeIndex = ref(0)

// Watch for carousel select event
function onSelect(index: number) {
  activeIndex.value = index
}

function scrollTo(index: number) {
  carouselRef.value?.emblaApi?.scrollTo(index)
}

function scrollNext() {
  carouselRef.value?.emblaApi?.scrollNext()
}

const limaPusakaItems = [
  {
    id: 1,
    title: 'Membaca paritta',
    description: 'Membina diri tanpa membaca paritta, itu sama dengan tidak membina diri. Sembahyang kepada Buddha tanpa membaca paritta, itu sama dengan tidak sembahyang kepada Buddha.',
    image: 'https://masterluindonesia.com/assets/assets/images/tentang/image3.png',
    href: '/tentang/lima-pusaka/membaca-paritta'
  },
  {
    id: 2,
    title: 'Berikrar',
    description: 'Berikrar adalah memohon di dalam hati atau dengan pelan di depan Guan Shi Yin Pu Sa berwelas asih memberikati. Anda dari membiarkan Anda menyelesaikan suatu masalah, kebingungan, depresi, menguraikan bencana besar dan kecil.',
    image: 'https://masterluindonesia.com/assets/assets/images/tentang/image4.png',
    href: '/tentang/lima-pusaka/berikrar'
  },
  {
    id: 3,
    title: 'Melepaskan makhluk hidup',
    description: 'Melepaskan makhluk hidup berarti membina dengan uang, berdana dengan Dharma, berdana dengan membebaskan makhluk lain dari ketakutan, berdana dalam tiga hal ini, adalah pahala yang tak terhingga.',
    image: 'https://masterluindonesia.com/assets/assets/images/tentang/image5.png',
    href: '/tentang/lima-pusaka/melepaskan-makhluk-hidup'
  },
  {
    id: 4,
    title: 'Membaca Bai Hua Fo Fa',
    description: 'BHFF adalah ajaran Buddhis mendalam yang disajikan dari bahasa sehari-hari agar semua makhluk yang berkarma bisa membina diri di zaman akhir Dharma ini untuk memahami kebenaran akan duniawi ini dan terbebas dari alam reinkarnasi.',
    image: 'https://masterluindonesia.com/assets/assets/images/tentang/image6.png',
    href: '/tentang/lima-pusaka/membaca-bai-hua-fo-fa'
  },
  {
    id: 5,
    title: 'Pertobatan Agung',
    description: 'Kehidupan manusia tidak bisa terlepas dari Pertobatan. Terlalu banyak kesalahan yang telah kita lakukan, hanya dengan bertobat setulus hati baru bisa mengharapkan karma buruk di dalam hati dan penyesalan.',
    image: 'https://masterluindonesia.com/assets/assets/images/tentang/image7.png',
    href: '/tentang/lima-pusaka/pertobatan-agung'
  }
]
</script>
