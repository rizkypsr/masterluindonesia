<template>
  <div class="pb-6">
    <!-- Section 1: Xin Ling Fa Men -->
    <div class="relative bg-gradient-to-b from-white via-yellow-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Xin Ling Fa Men</h2>
        <p class="text-gray-700 dark:text-gray-300 text-base mb-1">Xin Ling adalah Gembok</p>
        <p class="text-gray-700 dark:text-gray-300 text-base mb-1">Fa Men adalah kuncinya</p>
        <p class="text-gray-700 dark:text-gray-300 text-base mb-4">
          Menggunakan Pintu Dharma untuk membuka jiwamu, maka itu adalah "Xin Ling Fa Men"
        </p>
        <NuxtLink to="/tentang/xin-ling-fa-men?from=tentang"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden flex justify-center">
        <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage1.png?alt=media&token=c5343a10-a496-4db8-b3dc-2cf22a13b19b" alt="Xin Ling Fa Men"
          class="w-full" />
      </div>
    </div>

    <!-- Section 2: Master Lu Jun Hong -->
    <div class="relative mb-6 bg-[#ffefce] dark:bg-gray-800">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Master Lu Jun Hong</h2>
        <p class="text-gray-800 dark:text-gray-300 text-sm mb-4">
          Master Jun Hong Lu (Justice of the Peace) adalah Presiden, Direktur dan Pendiri stasiun TV dan Radio 2OR
          Australia Oriental yang sangat dihormati dan pemimpin terkemuka Komunitas Tionghoa di Australia.
        </p>
        <NuxtLink to="/tentang/master-lu-jun-hong"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-200 dark:hover:bg-gray-700 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage2.png?alt=media&token=c86c2712-00e9-45ff-9052-54a2a1ae8cbc" alt="Master Lu Jun Hong"
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
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lima Pusaka XLFM</h2>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">{{ item.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ item.description }}
            </p>
            <NuxtLink :to="item.href"
              class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-50 dark:hover:bg-gray-800 transition-colors">
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
              ? 'w-8 h-2 bg-yellow-600 dark:bg-yellow-500 rounded-full'
              : 'w-2 h-2 bg-yellow-200 dark:bg-gray-600 rounded-full'
          ]" :aria-label="`Go to slide ${index + 1}`" />
        </div>

        <!-- Arrow Right -->
        <button @click="scrollNext()" class="p-2" aria-label="Next slide">
          <Icon name="heroicons:arrow-right" class="w-6 h-6 text-gray-800 dark:text-white" />
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
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage3.png?alt=media&token=98afcfd4-3ed7-474d-8deb-2bd750862666',
    href: '/tentang/lima-pusaka/membaca-paritta'
  },
  {
    id: 2,
    title: 'Berikrar',
    description: 'Berikrar adalah memohon di dalam hati atau dengan pelan di depan Guan Shi Yin Pu Sa berwelas asih memberikati. Anda dari membiarkan Anda menyelesaikan suatu masalah, kebingungan, depresi, menguraikan bencana besar dan kecil.',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage4.png?alt=media&token=949f6ff0-4895-4e81-bdde-4ab0fb843841',
    href: '/tentang/lima-pusaka/berikrar'
  },
  {
    id: 3,
    title: 'Melepaskan makhluk hidup',
    description: 'Melepaskan makhluk hidup berarti membina dengan uang, berdana dengan Dharma, berdana dengan membebaskan makhluk lain dari ketakutan, berdana dalam tiga hal ini, adalah pahala yang tak terhingga.',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage5.png?alt=media&token=a6fa4b53-0752-4321-b8fa-2886386ba1c4',
    href: '/tentang/lima-pusaka/melepaskan-makhluk-hidup'
  },
  {
    id: 4,
    title: 'Membaca Bai Hua Fo Fa',
    description: 'BHFF adalah ajaran Buddhis mendalam yang disajikan dari bahasa sehari-hari agar semua makhluk yang berkarma bisa membina diri di zaman akhir Dharma ini untuk memahami kebenaran akan duniawi ini dan terbebas dari alam reinkarnasi.',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage6.png?alt=media&token=8c71ab9b-52c7-4785-bcbe-15f714a05c1b',
    href: '/tentang/lima-pusaka/membaca-bai-hua-fo-fa'
  },
  {
    id: 5,
    title: 'Pertobatan Agung',
    description: 'Kehidupan manusia tidak bisa terlepas dari Pertobatan. Terlalu banyak kesalahan yang telah kita lakukan, hanya dengan bertobat setulus hati baru bisa mengharapkan karma buruk di dalam hati dan penyesalan.',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage7.png?alt=media&token=22f42218-523d-4450-9875-cba0144c16e6',
    href: '/tentang/lima-pusaka/pertobatan-agung'
  }
]
</script>
