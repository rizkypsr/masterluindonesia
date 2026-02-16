<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <BackButton to="/?tab=tentang" />
      <span class="text-sm text-gray-600 dark:text-gray-400">Pengenalan profil XLFM</span>
      <TentangMenu type="tentang-main" />
    </div>

    <!-- Hero Image -->
    <div class="relative">
      <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage8.png?alt=media&token=44885b91-8155-4160-85a3-f358a9237924" alt="Master Lu Jun Hong"
        class="w-full" />
    </div>

    <!-- Content -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Master Jun Hong Lu</h1>

      <!-- Decorative element -->
      <div class="flex justify-center mb-4">
        <img src="https://masterluindonesia.com/assets/assets/images/tentang/ornament.png" alt=""
          class="w-12 h-auto opacity-50" onerror="this.style.display='none'" />
      </div>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Master Lu terkenal secara internasional atas upayanya dalam mempromosikan Budaya tradisional Tiongkok,
        Perdamaian Dunia, dan membantu orang melalui Ajaran Buddha.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Hanya dalam beberapa tahun, ada lebih dari 10 juta orang yang mengikuti ajaran Master Lu dengan semangat dan
        welas asih aliran Buddha Mahayana.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Dengan misi untuk mempromosikan budaya tradisional Tiongkok, Master Jun Hong Lu memberikan ajaran "Cinta kasih
        dan welas asih", serta inti dari filosofi Buddhis.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Master Jun Hong Lu mendorong orang untuk menahan diri dari perbuatan salah dan melakukan perbuatan baik.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Selain itu, Master Lu adalah ketua dan direktur Asosiasi Amal Buddha Media Oriental Australia (AOMB).
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        AOMB terdaftar di Australian Charities and Non profit Commission-ACNC.Charity ABN: 96169422664.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Setahun kemudian, terdaftar di United Nations Global Compact sebagai NGO-Non Government Organization sejak Juli
        2015.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Master Jun Hong Lu juga menjabat sebagai Anggota Kehormatan Dewan Penasihat Federasi Dunia untuk Perdamaian dan
        Cinta (WFPL).
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Beliau telah menerima berbagai penghargaan internasional atas kontribusinya dalam mempromosikan perdamaian dunia
        dan harmoni antar agama.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Melalui ceramah Dharma dan acara amal di seluruh dunia, Master Lu telah menginspirasi jutaan orang untuk
        menjalani kehidupan yang lebih bermakna dan penuh welas asih.
      </p>
    </div>

    <!-- Penghargaan Dunia Section -->
    <div class="bg-white dark:bg-gray-900 px-4 py-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Penghargaan Dunia</h2>

      <UCarousel ref="carouselRef" v-slot="{ item }" :items="penghargaanItems" :ui="{ item: 'basis-full' }"
        @select="onSelect">
        <div class="pr-4 h-[700px] overflow-y-auto">
          <!-- Title -->
          <h3 class="text-gray-900 dark:text-white font-semibold mb-3">{{ item.title }}</h3>

          <!-- Navigation Arrows -->
          <div class="flex justify-end gap-2 mb-3">
            <button @click="scrollPrev" class="p-1">
              <Icon name="mdi:arrow-left" class="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
            <button @click="scrollNext" class="p-1">
              <Icon name="mdi:arrow-right" class="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
          </div>

          <!-- Image -->
          <div class="mb-4">
            <img :src="item.image" :alt="item.title" class="w-full rounded-lg" />
          </div>

          <!-- Content -->
          <div class="text-gray-700 dark:text-gray-300 text-sm space-y-3">
            <p v-for="(paragraph, idx) in item.content" :key="idx">{{ paragraph }}</p>
          </div>
        </div>
      </UCarousel>

      <!-- Dots -->
      <div class="flex justify-center gap-2 mt-4">
        <button v-for="(item, index) in penghargaanItems" :key="item.id" @click="scrollTo(index)" :class="[
          'w-2 h-2 rounded-full transition-all',
          activeIndex === index ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
        ]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

const carouselRef = useTemplateRef('carouselRef')
const activeIndex = ref(0)

function onSelect(index: number) {
  activeIndex.value = index
}

function scrollTo(index: number) {
  carouselRef.value?.emblaApi?.scrollTo(index)
}

function scrollPrev() {
  carouselRef.value?.emblaApi?.scrollPrev()
}

function scrollNext() {
  carouselRef.value?.emblaApi?.scrollNext()
}

const penghargaanItems = [
  {
    id: 1,
    title: 'Penghargaan Perdamaian Dunia (Buddha)',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage9.png?alt=media&token=81bc03a8-2ba0-416c-8363-4afa2b615a04',
    content: [
      '8 Juli 2012 Master Jun Hong Lu diundang ke London untuk berpartisipasi dalam "Kongres Agama Sedunia", salah satu perayaan ulang tahun ke-60 Ratu Inggris dan Keluarga Kerajaan Inggris.',
      'Master Jun Hong Lu dianugerahi "Penghargaan Perdamaian Dunia (Buddhisme)" dan gelar "Duta Besar untuk Perdamaian Dunia" tahun ini.',
      'Ini sebagai penubuhan atas kontribusinya terhadap penyebaran kemanusiaan, budaya tradisional Tiongkok, dan agama Buddha selama beberapa dekade terakhir.',
      'Penghargaan tersebut diserahkan oleh Wakil Walikota London dan anggota parlemen.'
    ]
  },
  {
    id: 2,
    title: 'Penghargaan untuk Kontribusi Luar Biasa dan Advokasi Perdamaian kepada Komunitas Global',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage10.png?alt=media&token=21ddc863-7907-4da7-998c-78a878f9ce14',
    content: [
      '18 Desember 2013 – Jun Hong Lu JP menerima Penghargaan untuk Kontribusi Luar Biasa dan Advokasi Perdamaian kepada Komunitas Global di Berlin, Jerman.',
      'Institut untuk Diplomasi Budaya mengakui dengan kontribusi yang luar biasa kepada Master Jun Hong Lu yang telah melampaui tugasnya.',
      'Master Lu memiliki pengaruh besar pada komunitas global dan telah melayani sebagai penganjur perdamaian terkemuka.',
      'Dia telah diakui atas komitmennya dalam memberikan bimbingan spiritual dan memperkuat komunitas melalui karyanya.',
      'Usahanya dalam mempromosikan prinsip-prinsip Diplomasi Budaya sangat diapresiasi.'
    ]
  },
  {
    id: 3,
    title: 'Konferensi Tahunan Tentang Diplomasi Budaya 2013',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage11.png?alt=media&token=3229c10a-e7c0-422b-819a-88c30c8002a2',
    content: [
      '18 Desember 2013, Master Jun Hong Lu menghadiri Konferensi Tahunan tentang Diplomasi Budaya, "Diplomasi Budaya & Kerjasama Lintas Benua: Membangun Jembatan untuk Komunitas Global Bersatu" 17-20 Desember 2013, bersama dengan para pemimpin politik dan agama dari seluruh dunia di Berlin, Jerman.',
      'Konferensi Tahunan tentang Diplomasi Budaya adalah acara terkemuka dunia di bidang diplomasi budaya yang diselenggarakan bersama dan disponsori oleh Institute for Cultural Diplomacy dan The IIAN Foundation.',
      'Hon. Simon Crean (Mantan Menteri Pembangunan Daerah Australia)',
      'Presiden Emil Constantinescu (Mantan Presiden Rumania)',
      'The Hon. Halldór Ásgrímsson (Mantan Perdana Menteri Islandia)',
      'The Hon. Bertie Ahern (Mantan Perdana Menteri Irlandia)',
      'Amb. Katalin Bogyay (Presiden Konferensi Umum UNESCO 2011-3) dan banyak pemimpin politik dan agama lainnya telah menghadiri pertemuan tersebut.',
      '(ref: http://www.culturaldiplomacy.org/academy/index.php?en_accd-2013)'
    ]
  },
  {
    id: 4,
    title: 'Honorary Visiting Professorship - Universitas Siena',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage12.png?alt=media&token=29587abe-d031-4a0e-9a39-01f1a5f2a9b0',
    content: [
      'Pada tanggal 1 April 2014, Master Jun Hong Lu, Duta Besar untuk Perdamaian Dunia dan seorang guru Buddhis yang terkenal di dunia, dianugerahi "Guest Professor" dari Universitas Siena.',
      'Profesor turut datang di bawah Program Magister Tata Kelola Global dan Diplomasi Budaya Universitas Siena, bekerja sama dengan Institute for Cultural Diplomacy (ICD).',
      'Acara berlawan ini diadakan di Aula Hotel di Roma, Italia.'
    ]
  },
  {
    id: 5,
    title: 'Duta Perdamaian Dunia - Kongres AS',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage13.png?alt=media&token=1c76c681-b501-46ec-a90e-6200d8a715df',
    content: [
      '24 Maret 2014, Master Lu diundang untuk menghadiri KTT yang diadakan PBB mengenakan global di markas besar PBB di New York. KTT ini bertujuan untuk membangun pola pikir yang bisa memberikan solusi atas pengurangan dan mediasi konflik.',
      'Sebagai penghargaan atas dedikasi Master Lu, kepemimpinan dan kerja keras untuk promosi perdamaian, budaya dan kemanusiaan, KTT yang digelar PBB menganugerahi Master Lu dengan gelar "Duta Perdamaian Dunia".',
      'Penghargaan tersebut diberikan oleh Bapak Tom Christofferson, mantan menteri Perancis, dan Bu Joanna, direktur eksekutif Komite Aliansi Strategis Internasional.'
    ]
  },
  {
    id: 6,
    title: 'Menghadiri KTT Budaya Perdamaian yang diadakan di Markas Besar PBB',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage14.png?alt=media&token=da1b81eb-6fbf-425e-be22-797afc1313e2',
    content: [
      '24 Maret 2014 – Jun Hong Lu JP diundang untuk menghadiri dan berbicara pada KTT Budaya Perdamaian yang diadakan di Markas Besar PBB di New York.',
      'Sebagai pembicara kunci, Jun Hong Lu JP membawakan pidato tentang "Bagaimana Meneruskan Buddhisme dan Budaya Tradisional China Untuk Mempromosikan Perdamaian Dunia".',
      'Ketua konferensi dan pemimpin agama dari 23 negara, penasihat dari Universitas Yale dan PBB telah menghadiri pertemuan puncak tersebut.'
    ]
  },
  {
    id: 7,
    title: 'Konferensi Buddhis Internasional 2015',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage15.png?alt=media&token=eb7d7d50-dcf9-4ed9-8acf-09c5d87bb99b',
    content: [
      '29-30 Mei 2015 – Master Jun Hong Lu telah menghadiri "Konferensi Buddhis Internasional 2015" pada Hari Raya Waisak PBB dengan para pemimpin agama dari seluruh dunia di Bangkok, Thailand. (Foto: Baris Pertama, Kesepuluh dari Kiri).',
      'Ia diundang oleh PBB untuk menghadiri konferensi tersebut sebagai tamu istimewa di United Nations Conference Centre, Thailand.',
      'Master Lu bertemu dengan Donsak Phra Mahaveeranuvat/Brahmapundit, Perdana Tertinggi Thailand, dan politisi terkemuka serta "Konferensi Buddhis Internasional 2015".',
      'Ribuan pemimpin politik dan agama dari 80 negara telah menghadiri konferensi 3 hari ini.'
    ]
  },
  {
    id: 8,
    title: 'Menghadiri Forum Tingkat Tinggi PBB tentang Budaya Perdamaian',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage16.png?alt=media&token=ee684184-086c-4186-b657-aa9d62fddda5',
    content: [
      'September 2015, Jun Hong Lu JP diundang untuk menghadiri "Forum Tingkat Tinggi PBB tentang Budaya Perdamaian" di Trusteeship Council Chamber, Markas Besar PBB di New York, bersama dengan para pemimpin dari seluruh dunia.',
      'Forum tersebut diselenggarakan oleh Presiden Sidang Umum ke-69 Yang Mulia Bapak Sam K. Kutesa bersama sama dengan Dewan Dunia untuk Perdamaian Budaya (SWCPC).',
      'Jun Hong Lu JP juga diundang untuk menghadiri dan berbicara pada KTT Budaya Perdamaian di Markas Besar PBB pada September 2015.'
    ]
  },
  {
    id: 9,
    title: 'Undangan oleh Presiden Sri Lanka untuk mengunjungi Sri Lanka',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage17.png?alt=media&token=58ff332a-a26b-465c-ab51-c36d3348ad2a',
    content: [
      '17 Maret 2017 – Presiden Sri Lanka, Maithripala Sirisena telah mengundang Master Jun Hong Lu untuk berdiskusi tentang perkembangan dan kontribusi agama Buddha di Sri Lanka.',
      'Presiden telah memberikan penghargaan sebagai penghargaan atas kontribusi luar biasa Master Lu pada pertukaran ekonomi dan budaya antara Sri Lanka dan Asosiasi Amal Buddha Media Oriental Australia.'
    ]
  },
  {
    id: 10,
    title: 'Festival Waisak PBB',
    image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage18.png?alt=media&token=dc829f82-ba68-43ff-a2fe-33ee5602f120',
    content: [
      '24 Mei 2018, UNESCO mengadakan "Festival Waisak Persekutuan Bangsa-Bangsa 2018" di kantor pusatnya di Paris, Prancis. Tema tahun ini adalah "Promosi Perdamaian dan Non-Kekerasan: Cara Hidup Buddha".',
      'Sesi diadakan untuk mempromosikan dialog antar budaya dan antar agama untuk perdamaian yang berkelanjutan.',
      'Profesor Jun Hong Lu JP, guru spiritual terkenal dunia dan Ketua dari Yayasan Parlemen Agama Dunia dan Asosiasi Amal Buddha Media Oriental Australia, diundang untuk memberikan pidato utama.'
    ]
  }
]
</script>
