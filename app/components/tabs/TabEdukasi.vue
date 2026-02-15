<template>
  <div class="pb-6">
    <!-- Section 1: Baca PR -->
    <div class="relative bg-white dark:bg-gray-900">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-4">Baca PR</h2>
        <NuxtLink to="/edukasi/baca-pr"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-50 dark:hover:bg-gray-800 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <NuxtImg src="https://masterluindonesia.com/assets/assets/images/pr/image_1.png" alt="Baca PR" 
          class="w-full" format="webp" loading="lazy" width="768" height="400" />
      </div>
    </div>

    <!-- Section 2: Xiao Fang Zi Carousel -->
    <div class="relative bg-[#ffefce] dark:bg-gray-800">
      <UCarousel ref="xiaoFangZiRef" v-slot="{ item }" :items="xiaoFangZiItems" :ui="{ item: 'basis-full' }"
        @select="onSelectXiaoFangZi">
        <div class="px-4 pt-6">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Xiao Fang Zi</p>
            <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-4">{{ item.title }}</h2>
            <NuxtLink to="/edukasi/xiao-fang-zi"
              class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-200 dark:hover:bg-gray-700 transition-colors">
              Selengkapnya
              <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
            </NuxtLink>

            <!-- Text Content -->
            <div v-if="item.content" class="mt-4">
              <h3 v-if="item.contentTitle" class="font-bold text-gray-900 dark:text-white mb-2">{{ item.contentTitle }}
              </h3>
              <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">{{ item.content }}</p>
            </div>
          </div>

          <!-- Images -->
          <div class="mt-4">
            <!-- Perlengkapan layout with plus buttons -->
            <div v-if="item.id === 2" class="relative min-h-125">
              <!-- XFZ Paper - Left -->
              <div class="absolute left-0 top-0 w-36">
                <NuxtImg src="https://masterluindonesia.com/assets/assets/images/xfz/xfz_full.png" alt="Xiao Fang Zi"
                  class="w-full object-contain" format="webp" loading="lazy" width="144" height="200" />
                <button @click="showPerlengkapanInfo('xfz')"
                  class="absolute bottom-4 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Counter - Right Top -->
              <div class="absolute right-8 top-0 w-16">
                <NuxtImg src="https://masterluindonesia.com/assets/assets/images/xfz/counter.png" alt="Counter"
                  class="w-full object-contain" format="webp" loading="lazy" width="64" height="80" />
                <button @click="showPerlengkapanInfo('counter')"
                  class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Kain Merah - Right -->
              <div class="absolute right-4 top-24 w-24">
                <NuxtImg src="https://masterluindonesia.com/assets/assets/images/xfz/kain.png" alt="Kain Merah"
                  class="w-full object-contain" format="webp" loading="lazy" width="96" height="120" />
                <button @click="showPerlengkapanInfo('kain')"
                  class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Pena Merah - Left Middle -->
              <div class="absolute left-10 top-[48%] w-28">
                <NuxtImg src="https://masterluindonesia.com/assets/assets/images/xfz/pen_full.png" alt="Pena Merah"
                  class="w-full object-contain" format="webp" loading="lazy" width="112" height="140" />
                <button @click="showPerlengkapanInfo('pena-merah')"
                  class="absolute top-4 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Pena Hitam - Right Middle -->
              <div class="absolute right-8 top-[50%] w-24">
                <NuxtImg src="https://masterluindonesia.com/assets/assets/images/xfz/black_pen.png" alt="Pena Hitam"
                  class="w-full object-contain" format="webp" loading="lazy" width="96" height="120" />
                <button @click="showPerlengkapanInfo('pena-hitam')"
                  class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Amplop - Left Bottom -->
              <div class="absolute left-4 top-[76%] w-24">
                <NuxtImg src="https://masterluindonesia.com/assets/assets/images/xfz/amplop.png" alt="Amplop"
                  class="w-full object-contain" format="webp" loading="lazy" width="96" height="120" />
                <button @click="showPerlengkapanInfo('amplop')"
                  class="absolute -bottom-2 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Buku - Right Bottom -->
              <div class="absolute right-4 top-[80%] w-24">
                <NuxtImg src="https://masterluindonesia.com/assets/assets/images/xfz/book.png" alt="Buku Paritta"
                  class="w-full object-contain" format="webp" loading="lazy" width="96" height="120" />
                <button @click="showPerlengkapanInfo('buku')"
                  class="absolute top-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <!-- 1 image -->
            <div v-else-if="item.images.length === 1">
              <NuxtImg :src="item.images[0]" :alt="item.title" :class="['w-full rounded-lg object-contain', item.height]" 
                format="webp" loading="lazy" width="600" height="400" />
            </div>
            <!-- 2 images: side by side, aligned to bottom -->
            <div v-else-if="item.images.length === 2" class="grid grid-cols-2 gap-4 items-end">
              <NuxtImg v-for="(img, idx) in item.images" :key="idx" :src="img" :alt="item.title"
                class="w-full rounded-lg object-contain max-h-72" format="webp" loading="lazy" width="300" height="288" />
            </div>
            <!-- More than 2 images: grid -->
            <div v-else class="grid grid-cols-2 gap-2 items-end">
              <NuxtImg v-for="(img, idx) in item.images" :key="idx" :src="img" :alt="item.title"
                :class="['w-full rounded-lg object-contain', item.height]" format="webp" loading="lazy" width="300" height="200" />
            </div>
          </div>
        </div>
      </UCarousel>

      <!-- Custom Navigation: Dots + Arrow -->
      <div class="flex items-center justify-between px-4 py-4">
        <button @click="scrollPrevXiaoFangZi()" class="p-2" aria-label="Previous slide">
          <Icon name="heroicons:arrow-left" class="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div class="flex items-center gap-2">
          <button v-for="(item, index) in xiaoFangZiItems" :key="item.id" @click="scrollToXiaoFangZi(index)" :class="[
            'transition-all duration-300',
            xiaoFangZiIndex === index
              ? 'w-8 h-2 bg-yellow-600 dark:bg-yellow-500 rounded-full'
              : 'w-2 h-2 bg-yellow-300 dark:bg-gray-600 rounded-full'
          ]" :aria-label="`Go to slide ${index + 1}`" />
        </div>
        <button @click="scrollNextXiaoFangZi()" class="p-2" aria-label="Next slide">
          <Icon name="heroicons:arrow-right" class="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
      </div>
    </div>

    <!-- Modal for Perlengkapan Info -->
    <UModal v-model:open="isPerlengkapanModalOpen">
      <template #content>
        <div class="p-6 bg-white dark:bg-gray-800">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedPerlengkapan?.title }}</h3>
            <button @click="isPerlengkapanModalOpen = false" class="p-1">
              <Icon name="heroicons:x-mark" class="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <NuxtImg :src="selectedPerlengkapan?.image" :alt="selectedPerlengkapan?.title"
            class="w-32 h-32 object-contain mx-auto mb-4" format="webp" loading="lazy" width="128" height="128" />
          <p class="text-gray-700 dark:text-gray-300 text-center">{{ selectedPerlengkapan?.description }}</p>
        </div>
      </template>
    </UModal>

    <!-- Section 3: Tata Cara Sembahyang -->
    <div class="relative bg-[#ffefce] dark:bg-gray-800">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-1">Tata Cara</h2>
        <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-4">Sembahyang</h2>
        <NuxtLink to="/edukasi/tata-cara-sembahyang"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-200 dark:hover:bg-gray-700 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <NuxtImg src="https://masterluindonesia.com/assets/assets/images/sembayang/image_1.png" alt="Tata Cara Sembahyang"
          class="w-full" format="webp" loading="lazy" width="768" height="400" />
      </div>
    </div>

    <!-- Section 4: Altar Besar -->
    <div class="relative bg-white dark:bg-gray-900">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-4">Altar Besar</h2>
        <NuxtLink to="/edukasi/altar-besar"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-50 dark:hover:bg-gray-800 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <NuxtImg src="https://masterluindonesia.com/assets/assets/images/altarbesar/image_1.png" alt="Altar Besar"
          class="w-full" format="webp" loading="lazy" width="768" height="400" />
      </div>
    </div>

    <!-- Section 5: Altar Kecil -->
    <div class="relative bg-[#ffefce] dark:bg-gray-800">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-4">Altar Kecil</h2>
        <NuxtLink to="/edukasi/altar-kecil"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-200 dark:hover:bg-gray-700 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <NuxtImg src="https://masterluindonesia.com/assets/assets/images/altarkecil/altar_kecil.png" alt="Altar Kecil"
          class="w-full" format="webp" loading="lazy" width="768" height="400" />
      </div>
    </div>

    <!-- Section 6: Permohonan Bimbingan Spiritual -->
    <div class="relative bg-white dark:bg-gray-900">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-1">Permohonan</h2>
        <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-4">Bimbingan Spiritual</h2>
        <NuxtLink to="/edukasi/permohonan-bimbingan-spiritual"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-50 dark:hover:bg-gray-800 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <NuxtImg src="https://masterluindonesia.com/assets/assets/images/bimbingan/bimbingan.png"
          alt="Permohonan Bimbingan Spiritual" class="w-full" format="webp" loading="lazy" width="768" height="400" />
      </div>
    </div>

    <!-- Section 7: Permohonan Penggantian Nama -->
    <div class="relative bg-[#ffefce] dark:bg-gray-800">
      <div class="px-4 pt-6 pb-4">
        <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-1">Permohonan</h2>
        <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-4">Penggantian Nama</h2>
        <NuxtLink to="/edukasi/permohonan-penggantian-nama"
          class="inline-flex items-center px-4 py-2 border border-yellow-600 dark:border-yellow-500 text-gray-800 dark:text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-200 dark:hover:bg-gray-700 transition-colors">
          Selengkapnya
          <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="relative overflow-hidden">
        <NuxtImg src="https://masterluindonesia.com/assets/assets/images/bimbingan/ganti_nama.png"
          alt="Permohonan Penggantian Nama" class="w-full" format="webp" loading="lazy" width="768" height="400" />
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

function scrollPrevXiaoFangZi() {
  xiaoFangZiRef.value?.emblaApi?.scrollPrev()
}

// Perlengkapan Modal
const isPerlengkapanModalOpen = ref(false)
const selectedPerlengkapan = ref<{ title: string; image: string; description: string } | null>(null)

const perlengkapanDetails: Record<string, { title: string; image: string; description: string }> = {
  'xfz': {
    title: 'Kertas Xiao Fang Zi Kosong',
    image: 'https://masterluindonesia.com/assets/assets/images/xfz/xfz_full.png',
    description: 'Kertas kuning khusus untuk mencatat bacaan paritta. Terdiri dari 4 kolom untuk Da Bei Zhou, Xin Jing, Wang Sheng Zhou, dan Qi Fo Mie Zui Zhen Yan.'
  },
  'counter': {
    title: 'Alat Penghitung',
    image: 'https://masterluindonesia.com/assets/assets/images/xfz/counter.png',
    description: 'Alat penghitung untuk membantu menghitung jumlah bacaan paritta yang telah dibaca.'
  },
  'kain': {
    title: 'Kain Merah',
    image: 'https://masterluindonesia.com/assets/assets/images/xfz/kain.png',
    description: 'Kain merah digunakan sebagai alas saat membakar Xiao Fang Zi untuk menunjukkan rasa hormat.'
  },
  'pena-merah': {
    title: 'Pena Merah',
    image: 'https://masterluindonesia.com/assets/assets/images/xfz/pen_full.png',
    description: 'Pena merah digunakan untuk memberi titik pada Xiao Fang Zi setiap kali selesai membaca satu kali paritta.'
  },
  'pena-hitam': {
    title: 'Pena Hitam',
    image: 'https://masterluindonesia.com/assets/assets/images/xfz/black_pen.png',
    description: 'Pena hitam digunakan untuk menulis nama penerima dan tanggal pada Xiao Fang Zi.'
  },
  'amplop': {
    title: 'Amplop Merah',
    image: 'https://masterluindonesia.com/assets/assets/images/xfz/amplop.png',
    description: 'Amplop merah digunakan untuk menyimpan Xiao Fang Zi yang sudah selesai sebelum dibakar.'
  },
  'buku': {
    title: 'Buku Paritta',
    image: 'https://masterluindonesia.com/assets/assets/images/xfz/book.png',
    description: 'Buku kumpulan paritta Buddha yang berisi bacaan Da Bei Zhou, Xin Jing, Wang Sheng Zhou, dan Qi Fo Mie Zui Zhen Yan.'
  }
}

function showPerlengkapanInfo(key: string) {
  selectedPerlengkapan.value = perlengkapanDetails[key] || null
  isPerlengkapanModalOpen.value = true
}

const xiaoFangZiItems = [
  {
    id: 1,
    title: 'Xiao Fang Zi',
    height: 'h-auto',
    images: [
      'https://masterluindonesia.com/assets/assets/images/xfz/xfz-2.png'
    ]
  },
  {
    id: 2,
    title: 'Perlengkapan Wajib Xiao Fang Zi',
    height: 'h-32',
    images: []
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
    height: 'h-96',
    images: [
      'https://masterluindonesia.com/assets/assets/images/xfz/write_name.png'
    ],
    contentTitle: 'Keterangan',
    content: '1. Untuk Diri Sendiri\nUntuk Almarhum\nUntuk Arwah Anak Keguguran\nUntuk Arwah Penunggu Rumah\nUntuk Menguraikan Ikatan Karma Buruk'
  },
  {
    id: 5,
    title: 'Memberi Titik Pada Xiao Fang Zi',
    height: 'h-96',
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
