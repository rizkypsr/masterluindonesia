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
        <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fimage_1.png?alt=media&token=1b87c221-01cd-4b24-a4a2-0f2f22288c10" alt="Baca PR" 
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
                <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fxfz_full.png?alt=media&token=a3ecb219-8552-4f51-acc0-9c4688c48a93" alt="Xiao Fang Zi"
                  class="w-full object-contain" format="webp" loading="lazy" width="144" height="200" />
                <button @click="showPerlengkapanInfo('xfz')"
                  class="absolute bottom-4 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Counter - Right Top -->
              <div class="absolute right-8 top-0 w-16">
                <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fcounter.png?alt=media&token=b5437729-203e-4107-a12a-b06cd45a9c1f" alt="Counter"
                  class="w-full object-contain" format="webp" loading="lazy" width="64" height="80" />
                <button @click="showPerlengkapanInfo('counter')"
                  class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Kain Merah - Right -->
              <div class="absolute right-4 top-24 w-24">
                <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fkain.png?alt=media&token=77715de1-05ab-4e7a-ab7e-90e8df7461bf" alt="Kain Merah"
                  class="w-full object-contain" format="webp" loading="lazy" width="96" height="120" />
                <button @click="showPerlengkapanInfo('kain')"
                  class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Pena Merah - Left Middle -->
              <div class="absolute left-10 top-[48%] w-28">
                <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fpen_full.png?alt=media&token=2bf2ef24-256a-4921-a2a1-223b7237394e" alt="Pena Merah"
                  class="w-full object-contain" format="webp" loading="lazy" width="112" height="140" />
                <button @click="showPerlengkapanInfo('pena-merah')"
                  class="absolute top-4 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Pena Hitam - Right Middle -->
              <div class="absolute right-8 top-[50%] w-24">
                <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fblack_pen.png?alt=media&token=596786cf-9bd4-4ad2-af2f-52e5093a82a9" alt="Pena Hitam"
                  class="w-full object-contain" format="webp" loading="lazy" width="96" height="120" />
                <button @click="showPerlengkapanInfo('pena-hitam')"
                  class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Amplop - Left Bottom -->
              <div class="absolute left-4 top-[76%] w-24">
                <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Famplop.png?alt=media&token=c1698c89-0335-483b-ae36-28825a315908" alt="Amplop"
                  class="w-full object-contain" format="webp" loading="lazy" width="96" height="120" />
                <button @click="showPerlengkapanInfo('amplop')"
                  class="absolute -bottom-2 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                </button>
              </div>

              <!-- Buku - Right Bottom -->
              <div class="absolute right-4 top-[80%] w-24">
                <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fbook.png?alt=media&token=c0b11515-be28-4df3-8f11-0edd6bc21222" alt="Buku Paritta"
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
        <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6" alt="Tata Cara Sembahyang"
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
        <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Faltarbesar%2Fimage_1.png?alt=media&token=4c54233e-4de3-4982-ba38-cd3f80e78b97" alt="Altar Besar"
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
        <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Faltarkecil%2Faltar_kecil.png?alt=media&token=339fefa9-d2be-4124-9d98-98cca6501f41" alt="Altar Kecil"
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
        <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fbimbingan%2Fbimbingan.png?alt=media&token=379734c5-fa12-405e-be7b-7eef64a333a7"
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
        <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fbimbingan%2Fganti_nama.png?alt=media&token=c0817a04-41c5-4588-8d6b-872108ad5f6b"
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
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fxfz_full.png?alt=media&token=a3ecb219-8552-4f51-acc0-9c4688c48a93',
    description: 'Kertas kuning khusus untuk mencatat bacaan paritta. Terdiri dari 4 kolom untuk Da Bei Zhou, Xin Jing, Wang Sheng Zhou, dan Qi Fo Mie Zui Zhen Yan.'
  },
  'counter': {
    title: 'Alat Penghitung',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fcounter.png?alt=media&token=b5437729-203e-4107-a12a-b06cd45a9c1f',
    description: 'Alat penghitung untuk membantu menghitung jumlah bacaan paritta yang telah dibaca.'
  },
  'kain': {
    title: 'Kain Merah',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fkain.png?alt=media&token=77715de1-05ab-4e7a-ab7e-90e8df7461bf',
    description: 'Kain merah digunakan sebagai alas saat membakar Xiao Fang Zi untuk menunjukkan rasa hormat.'
  },
  'pena-merah': {
    title: 'Pena Merah',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fpen_full.png?alt=media&token=2bf2ef24-256a-4921-a2a1-223b7237394e',
    description: 'Pena merah digunakan untuk memberi titik pada Xiao Fang Zi setiap kali selesai membaca satu kali paritta.'
  },
  'pena-hitam': {
    title: 'Pena Hitam',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fblack_pen.png?alt=media&token=596786cf-9bd4-4ad2-af2f-52e5093a82a9',
    description: 'Pena hitam digunakan untuk menulis nama penerima dan tanggal pada Xiao Fang Zi.'
  },
  'amplop': {
    title: 'Amplop Merah',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Famplop.png?alt=media&token=c1698c89-0335-483b-ae36-28825a315908',
    description: 'Amplop merah digunakan untuk menyimpan Xiao Fang Zi yang sudah selesai sebelum dibakar.'
  },
  'buku': {
    title: 'Buku Paritta',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fbook.png?alt=media&token=c0b11515-be28-4df3-8f11-0edd6bc21222',
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
      'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fxfz-2.png?alt=media&token=882e2ea1-1778-4d65-8a18-b71fb8deea82'
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
      'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fbagian_baca_xfz.png?alt=media&token=35da47a8-2795-428c-9f93-47ec8faa9db4'
    ]
  },
  {
    id: 4,
    title: 'Cara Penulisan Nama Penerima',
    height: 'h-96',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fwrite_name.png?alt=media&token=466f754a-c696-4cac-b2d1-6c4a3683f76a'
    ],
    contentTitle: 'Keterangan',
    content: '1. Untuk Diri Sendiri\nUntuk Almarhum\nUntuk Arwah Anak Keguguran\nUntuk Arwah Penunggu Rumah\nUntuk Menguraikan Ikatan Karma Buruk'
  },
  {
    id: 5,
    title: 'Memberi Titik Pada Xiao Fang Zi',
    height: 'h-96',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fxfz_full.png?alt=media&token=a3ecb219-8552-4f51-acc0-9c4688c48a93'
    ],
    contentTitle: 'Beri Titik',
    content: 'Memberi titik dengan pena merah diawali dari sisi bawah terlebih dahulu'
  },
  {
    id: 6,
    title: 'Permohonan Setelah Membakar XFZ',
    height: 'h-auto',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fxfz%2Fanimasi_permohonan.png?alt=media&token=a108f19b-2919-4a16-aad6-6fc16ade839d'
    ],
    content: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Telah membantu saya memberikan berapa lembar Xiao Fang Zi untuk YYY'
  }
]
</script>
