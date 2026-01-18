<template>
  <div class="pb-6">
    <!-- Section 1: Baca PR -->
    <div class="relative bg-white">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 mb-4">Baca PR</h2>
        <NuxtLink to="/edukasi/baca-pr"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-50 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <img src="https://masterluindonesia.com/assets/assets/images/pr/image_1.png" alt="Baca PR" class="w-full" />
      </div>
    </div>

    <!-- Section 2: Xiao Fang Zi Carousel -->
    <div class="relative bg-[#ffefce]">
      <UCarousel ref="xiaoFangZiRef" v-slot="{ item }" :items="xiaoFangZiItems" :ui="{ item: 'basis-full' }" @select="onSelectXiaoFangZi">
        <div class="px-4 pt-6 pb-4">
          <h2 class="text-4xl font-semibold text-gray-900 mb-4">{{ item.title }}</h2>
          <NuxtLink to="/edukasi/xiao-fang-zi"
            class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors">
            Selengkapnya
            <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
          </NuxtLink>
          
          <!-- Images -->
          <div class="mt-6">
            <!-- 1 image -->
            <div v-if="item.images.length === 1">
              <img :src="item.images[0]" :alt="item.title" :class="['w-full rounded-lg object-contain', item.height]" />
            </div>
            <!-- 2 images: side by side -->
            <div v-else-if="item.images.length === 2" class="grid grid-cols-2 gap-4">
              <img v-for="(img, idx) in item.images" :key="idx" :src="img" :alt="item.title" :class="['w-full rounded-lg object-contain', item.height]" />
            </div>
            <!-- More than 2 images: grid -->
            <div v-else class="grid grid-cols-2 gap-2">
              <img v-for="(img, idx) in item.images" :key="idx" :src="img" :alt="item.title" :class="['w-full rounded-lg object-contain', item.height]" />
            </div>
          </div>
          
          <!-- Text Content -->
          <div v-if="item.content" class="mt-4">
            <h3 v-if="item.contentTitle" class="font-bold text-gray-900 mb-2">{{ item.contentTitle }}</h3>
            <p class="text-gray-700 text-sm whitespace-pre-line">{{ item.content }}</p>
          </div>
        </div>
      </UCarousel>

      <!-- Custom Navigation: Dots + Arrow -->
      <div class="flex items-center justify-between px-4 pb-6">
        <div class="flex items-center gap-2">
          <button v-for="(item, index) in xiaoFangZiItems" :key="item.id" @click="scrollToXiaoFangZi(index)" :class="[
            'transition-all duration-300',
            xiaoFangZiIndex === index
              ? 'w-8 h-2 bg-yellow-600 rounded-full'
              : 'w-2 h-2 bg-yellow-300 rounded-full'
          ]" :aria-label="`Go to slide ${index + 1}`" />
        </div>
        <button @click="scrollNextXiaoFangZi()" class="p-2" aria-label="Next slide">
          <Icon name="heroicons:arrow-right" class="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </div>

    <!-- Section 3: Tata Cara Sembahyang -->
    <div class="relative bg-[#ffefce]">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 mb-1">Tata Cara</h2>
        <h2 class="text-4xl font-semibold text-gray-900 mb-4">Sembahyang</h2>
        <NuxtLink to="/edukasi/tata-cara-sembahyang"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <img src="https://masterluindonesia.com/assets/assets/images/sembayang/image_1.png" alt="Tata Cara Sembahyang"
          class="w-full" />
      </div>
    </div>

    <!-- Section 4: Altar Besar -->
    <div class="relative bg-white">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 mb-4">Altar Besar</h2>
        <NuxtLink to="/edukasi/altar-besar"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-50 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <img src="https://masterluindonesia.com/assets/assets/images/altarbesar/image_1.png" alt="Altar Besar"
          class="w-full" />
      </div>
    </div>

    <!-- Section 5: Altar Kecil -->
    <div class="relative bg-[#ffefce]">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 mb-4">Altar Kecil</h2>
        <NuxtLink to="/edukasi/altar-kecil"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <img src="https://masterluindonesia.com/assets/assets/images/altarkecil/altar_kecil.png" alt="Altar Kecil"
          class="w-full" />
      </div>
    </div>

    <!-- Section 6: Permohonan Bimbingan Spiritual -->
    <div class="relative bg-white">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 mb-1">Permohonan</h2>
        <h2 class="text-4xl font-semibold text-gray-900 mb-4">Bimbingan Spiritual</h2>
        <NuxtLink to="/edukasi/permohonan-bimbingan-spiritual"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-50 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <img src="https://masterluindonesia.com/assets/assets/images/bimbingan/bimbingan.png"
          alt="Permohonan Bimbingan Spiritual" class="w-full" />
      </div>
    </div>

    <!-- Section 7: Permohonan Penggantian Nama -->
    <div class="relative bg-[#ffefce]">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 mb-1">Permohonan</h2>
        <h2 class="text-4xl font-semibold text-gray-900 mb-4">Penggantian Nama</h2>
        <NuxtLink to="/edukasi/permohonan-penggantian-nama"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 text-gray-800 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <img src="https://masterluindonesia.com/assets/assets/images/bimbingan/ganti_nama.png"
          alt="Permohonan Penggantian Nama" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const xiaoFangZiRef = useTemplateRef('xiaoFangZiRef')
const xiaoFangZiIndex = ref(0)

function onSelectXiaoFangZi(index: number) {
  xiaoFangZiIndex.value = index
}

function scrollToXiaoFangZi(index: number) {
  xiaoFangZiRef.value?.emblaApi?.scrollTo(index)
}

function scrollNextXiaoFangZi() {
  xiaoFangZiRef.value?.emblaApi?.scrollNext()
}

const xiaoFangZiItems = [
  {
    id: 1,
    title: 'Xiao Fang Zi',
    height: 'h-72',
    images: [
      'https://masterluindonesia.com/assets/assets/images/xfz/pen.png',
      'https://masterluindonesia.com/assets/assets/images/xfz/xfz.png'
    ]
  },
  {
    id: 2,
    title: 'Perlengkapan Xiao Fang Zi',
    height: 'h-32',
    images: [
      'https://masterluindonesia.com/assets/assets/images/xfz/xfz_full.png',
      'https://masterluindonesia.com/assets/assets/images/xfz/counter.png',
      'https://masterluindonesia.com/assets/assets/images/xfz/pen_full.png',
      'https://masterluindonesia.com/assets/assets/images/xfz/kain.png',
      'https://masterluindonesia.com/assets/assets/images/xfz/amplop.png',
      'https://masterluindonesia.com/assets/assets/images/xfz/black_pen.png',
      'https://masterluindonesia.com/assets/assets/images/xfz/book.png'
    ]
  },
  {
    id: 3,
    title: 'Bagian Bacaan di Xiao Fang Zi',
    height: 'h-auto',
    images: [
      'https://masterluindonesia.com/assets/assets/images/xfz/bagian_baca_xfz.png'
    ]
  },
  {
    id: 4,
    title: 'Cara Penulisan Nama Penerima',
    height: 'h-72',
    images: [
      'https://masterluindonesia.com/assets/assets/images/xfz/write_name.png'
    ],
    contentTitle: 'Keterangan',
    content: '1. Untuk Diri Sendiri\nUntuk Almarhum\nUntuk Arwah Anak Keguguran\nUntuk Arwah Penunggu Rumah\nUntuk Menguraikan Ikatan Karma Buruk'
  },
  {
    id: 5,
    title: 'Memberi Titik Pada Xiao Fang Zi',
    height: 'h-72',
    images: [
      'https://masterluindonesia.com/assets/assets/images/xfz/xfz_full.png'
    ],
    contentTitle: 'Beri Titik',
    content: 'Memberi titik dengan pena merah diawali dari sisi bawah terlebih dahulu'
  },
  {
    id: 6,
    title: 'Permohonan Setelah Membakar XFZ',
    height: 'h-auto',
    images: [
      'https://masterluindonesia.com/assets/assets/images/xfz/animasi_permohonan.png'
    ],
    content: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Telah membantu saya memberikan berapa lembar Xiao Fang Zi untuk YYY'
  }
]
</script>
