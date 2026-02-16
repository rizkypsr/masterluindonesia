<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <BackButton to="/?tab=tentang" />
      <span class="text-sm text-gray-600 dark:text-gray-400">2. Berikrar</span>
      <TentangMenu type="lima-pusaka" />
    </div>

    <!-- Hero Image -->
    <div class="relative bg-gradient-to-b from-yellow-100 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
      <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage4.png?alt=media&token=949f6ff0-4895-4e81-bdde-4ab0fb843841" alt="Berikrar" class="w-full" />
    </div>

    <!-- Content -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Berikrar</h1>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Berikrar adalah memohon di dalam hati atau dengan pelan di depan Guan Shi Yin Pu Sa berwelas asih memberikati
        Anda dan menolong Anda menyelesaikan suatu masalah, kebingungan, depresi, menguraikan bencana besar dan kecil.
      </p>

      <!-- Section 1 -->
      <div class="mb-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Anda bisa berjanji akan:</h2>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
          Dimulai dari hari ini akan bervegetarian setiap tanggal 1 dan 15 kalender lunar.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
          Dari detik ini tidak akan makan dewan laut lagi.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
          Dari detik ini tidak akan membunuh makhluk hidup.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
          Berjanji akan melakukan beberapa kebaikan setiap hari.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
          Menjadi patung Buddha dengan emas.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
          Dalam jangka waktu tertentu menyebarkan Ajaran Buddha Dharma pada berapa orang, membantu mereka terbebas dari
          penderitaan.
        </p>
      </div>

      <!-- Section 2 -->
      <div class="mb-6">
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
          Melakukan jasa kebaikan, berdana untuk mencetak buku-buku Buddhis dan lain-lain. Memberikan atau membagikan
          buku-buku atau CD Dharma.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
          Ada orang yang berikrar untuk bervegetarian setiap tanggal 1 dan 15 kalender lunar, lalu lupa, atau ada
          halangan tertentu tidak bisa menjalankannya, boleh menggantinya sebelumnya pada Guan Shi Yin Pu Sa, bisa
          bervegetarian lebih awal atau lebih telat, boleh juga saat berikrar tidak mengatakan bervegetarian setiap
          tanggal 1 dan 15 kalender lunar, tetapi mengatakan bervegetarian 2 hari setiap bulan, dengan demikian akan
          lebih fleksibel.
        </p>
      </div>

      <!-- Section 3 -->
      <div class="mb-6">
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
          Jika sudah berikrar harus dijalankan, jika karena alasan pribadi tidak bisa menjalankan ikrar pasti akan
          mendapatkan hukuman.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
          Wewujudkan janji adalah hal yang dilakukan setelah Bodhisattva atau Pu Sa mengabulkan permohonan Anda. Anda
          harus kembali ke kuil atau tempat di mana Anda memohon, lalu mewujudkan dupa, bersembahyang sujud, berdana,
          dan melakukan kebaikan.
        </p>
      </div>

      <!-- Section 4 -->
      <div class="mb-6">
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
          Besar dan banyaknya Anda berdana dan melakukan kebaikan tergantung dari kemampuan masing-masing, yang
          terpenting Anda sudah berikrar dan dilakukan.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
          Jika sebelumnya Anda berikrar untuk bervegetarian atau menyebarkan Dharma kepada orang lain dan lain-lainnya,
          harus terus dijalankan, ini berarti Anda sudah mewujudkan janji Anda.
        </p>
      </div>
    </div>

    <!-- Tata Cara Berikrar - Tanpa Altar -->
    <div class="bg-white dark:bg-gray-900 px-4 py-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Tata Cara Berikrar</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Tanpa Altar</p>

      <UCarousel ref="tanpaAltarRef" v-slot="{ item }" :items="tanpaAltarItems" :ui="{ item: 'basis-full' }"
        @select="onSelectTanpaAltar">
        <div class="pr-4">
          <!-- Step indicator -->
          <div class="flex items-center justify-between mb-3">
            <p class="text-gray-900 dark:text-white text-sm">Langkah {{ item.step }} <span class="text-gray-400 dark:text-gray-500">dari 7</span></p>
            <div class="flex gap-2">
              <button @click="scrollPrevTanpaAltar" class="p-1">
                <Icon name="mdi:arrow-left" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
              <button @click="scrollNextTanpaAltar" class="p-1">
                <Icon name="mdi:arrow-right" class="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>

          <!-- Card -->
          <UCard class="overflow-hidden">
            <!-- Image -->
            <div class="bg-linear-to-b from-yellow-100 to-yellow-50 dark:from-gray-700 dark:to-gray-800 mb-2">
              <img :src="item.image" :alt="item.title" class="w-full" />
            </div>

            <!-- Content -->
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white mb-2 text-xl">{{ item.title }}</h3>
              <p v-for="(text, idx) in item.content" :key="idx" class="text-gray-700 dark:text-gray-300 text-sm mb-2">{{ text }}</p>
            </div>
          </UCard>
        </div>
      </UCarousel>
    </div>

    <!-- Tata Cara Berikrar - Dengan Altar -->
    <div class="bg-white dark:bg-gray-900 px-4 py-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Tata Cara Berikrar</h2>

      <UCarousel ref="denganAltarRef" v-slot="{ item }" :items="denganAltarItems" :ui="{ item: 'basis-full' }"
        @select="onSelectDenganAltar">
        <div class="pr-4">
          <!-- Type label -->
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-2">{{ item.type }}</p>

          <!-- Step indicator -->
          <div class="flex items-center justify-between mb-3">
            <p class="text-gray-900 dark:text-white text-sm">Langkah {{ denganAltarIndex + 1 }} <span class="text-gray-400 dark:text-gray-500">dari
                3</span></p>
            <div class="flex gap-2">
              <button @click="scrollPrevDenganAltar" class="p-1">
                <Icon name="mdi:arrow-left" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
              <button @click="scrollNextDenganAltar" class="p-1">
                <Icon name="mdi:arrow-right" class="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>

          <!-- Card -->
          <UCard class="overflow-hidden">
            <div class="bg-linear-to-b from-yellow-100 to-yellow-50 dark:from-gray-700 dark:to-gray-800 -m-4 mb-0">
              <img :src="item.image" :alt="item.type" class="w-full" />
            </div>
          </UCard>
        </div>
      </UCarousel>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

// Tanpa Altar carousel
const tanpaAltarRef = useTemplateRef('tanpaAltarRef')
const tanpaAltarIndex = ref(0)

function onSelectTanpaAltar(index: number) {
  tanpaAltarIndex.value = index
}

function scrollPrevTanpaAltar() {
  tanpaAltarRef.value?.emblaApi?.scrollPrev()
}

function scrollNextTanpaAltar() {
  tanpaAltarRef.value?.emblaApi?.scrollNext()
}

// Dengan Altar carousel
const denganAltarRef = useTemplateRef('denganAltarRef')
const denganAltarIndex = ref(0)

function onSelectDenganAltar(index: number) {
  denganAltarIndex.value = index
}

function scrollPrevDenganAltar() {
  denganAltarRef.value?.emblaApi?.scrollPrev()
}

function scrollNextDenganAltar() {
  denganAltarRef.value?.emblaApi?.scrollNext()
}

const tanpaAltarItems = [
  {
    step: 1,
    title: 'Ucapkan',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
    content: [
      'Saya XXX (Nama sendiri) di sini ingin berikrar kepada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa...',
      'Guan Shi Yin Pu Sa Berwelas Asih, Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa...'
    ]
  },
  {
    step: 2,
    title: 'Berikrar',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
    content: [
      'Saya XXX (Nama sendiri) di sini ingin berikrar kepada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa...'
    ]
  },
  {
    step: 3,
    title: 'Catatan',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
    content: [
      'Boleh berikrar tidak menyusun. Bersembahyang pagi dan malam. Menyebarkan ajaran Buddha Dharma pada orang lain. Memperbanyak CD/DVD dan lainnya lagi.',
      'Disesuaikan dengan tekad kebajikan sendiri, selamanya, dan keadaan masing-masing.',
      'Setiap orang memiliki tingkat kesadaran yang berbeda-beda, sesuai dengan kemampuannya, jangan meminta orang lain harus berikrar tentang satu hal tertentu yang sama.'
    ]
  },
  {
    step: 4,
    title: 'Setelah Berikrar Bisa Memohon',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
    content: [
      'Seperti memperoleh tubuh yang sehat, ketenangan dalam hati, keluarga yang harmonis dan lainnya.',
      'Paling cepat bisa memohon 2-3 hal, tidak bisa hanya memohon kesehatan untuk satu keluarga, perlu mengajukan permohonan yang mendetail tentang seseorang atau suatu hal.',
      'Biasanya semakin besar tekad Anda, maka permohonannya akan semakin cepat terwujud.'
    ]
  },
  {
    step: 5,
    title: 'Ucapkan',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
    content: [
      'Guan Shi Yin Pu Sa Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa'
    ]
  },
  {
    step: 6,
    title: 'Menyembah 7 Kali',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
    content: [
      'Hua Po Pu Sa Da Ci Da Bei, Shou Chang Cing Jing Da Hai Zhong Pu Sa'
    ]
  },
  {
    step: 7,
    title: 'Setelah bangkit berdiri, bersikap anjali, lalu membungkuk hormat kepada Guan Shi Yin Pu Sa dan para Pu Sa',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keduabelas.png?alt=media&token=14c8121f-901a-4151-a7d7-72b7dabbe905',
    content: []
  }
]

const denganAltarItems = [
  {
    type: 'Tanpa Altar',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage25.png?alt=media&token=25418c86-484d-48ee-8557-458f932e22d1'
  },
  {
    type: 'Altar Kecil',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage26.png?alt=media&token=53ddd2cf-f711-4108-931c-a6ff7a0760e8'
  },
  {
    type: 'Altar Besar',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6'
  }
]
</script>
