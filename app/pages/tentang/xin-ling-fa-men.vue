<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <BackButton to="/?tab=tentang" />
      <span class="text-sm text-gray-600 dark:text-gray-400 flex-1 text-center">Pengenalan profil XLFM</span>
      <div class="flex items-center gap-2">
        <button @click="shareContent" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Icon name="mdi:share-variant" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <TentangMenu type="tentang-main" />
      </div>
    </div>

    <!-- Hero Image -->
    <div class="relative">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage1.png?alt=media&token=c5343a10-a496-4db8-b3dc-2cf22a13b19b" 
        alt="Xin Ling Fa Men" 
        class="w-full"
      />
    </div>

    <!-- Content -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Xin Ling Fa Men</h1>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4 italic">
        "Xin Ling Fa Men" atau Pintu Dharma Guan Yin Citta adalah Pintu Dharma yang diajarkan Guan Shi Yin Pu Sa dalam misi untuk menyelamatkan semua makhluk.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Ini adalah Pintu Dharma yang sudah terbukti nyata hasilnya dan sesuai bagi semua orang dengan beraneka ragam dasar pembinaan diri, termasuk dalam Aliran Mahayana.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Master Jun Hong Lu melalui siaran radio dan internet bersedia setiur tenaga untuk menyebarkan aliran Xin Ling Fa Men.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Selama tiga puluh tahun ini Beliau tidak pernah berhenti bekerja keras untuk menolong orang-orang yang mengharapkan lindungan apsara.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Dan dari dalam diri Master Jun Hong Lu, kita bisa merasakan welas asih dan tekad yang luar biasa besar dari Guan Shi Yin Pu Sa untuk menolong semua makhluk.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Di abad 21 ini, juga atas seruang bjakasananya yang ciemat menerbitkan dan menyebarkan tekad dari Guan Shi Yin Pu Sa untuk menyelamatkan semua makhluk, Beliau adalah pendiri stasiun radio 2OR Australia Radio Oriental (Dong Fang Tai) di Sydney, Australia – Master Jun Hong Lu.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Master Jun Hong Lu memiliki kemampuan supranatural, dengan berdasarkan tahun lahir, shio, dan jenis kelamin seseorang, tidak dibutuh oleh ruang dan waktu.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Beliau bisa melihat trean pasangan, benda di alam maya, berbicara, dan sebagainya, dan juga bisa mengungkap orang tersebut pada keadaan yang sebenarnya dan yang sekarang, saja apakah orang tersebut itu dibebankan oleh ekluhat yang dikerjamasa, dan sebagainya.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Dengan cara ini, Master Jun Hong Lu membuat orang-orang percaya bahwa karma menyertai kita bagaikan bayangan.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Maka jangan melakukan segala kesalahan dan perilakunya melakukan segala kebajikan, dan dari itu lalu membuat orang-orang percaya akan Ajaran Budha Dharma, bersedia membaca paritta, membina diri dan pikiran dalam Dharma.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Dengan demikian mereka bisa mengubah nasibnya sendiri, sehingga bisa membuat masyarakat kita menjadi lebih baik, menciptakan rung kehidupan manusia, sebagai dasar yang kuat untuk menolong umat manusia agar terbebas dari enam alam reinkarnasi.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

const toast = useToast()

function shareContent() {
  const shareUrl = `${window.location.origin}${window.location.pathname}`
  const shareTitle = 'Xin Ling Fa Men - Master Lu Indonesia'
  
  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: shareTitle,
      url: shareUrl
    }).catch(err => {
      console.log('Share cancelled or failed:', err)
    })
  } else {
    const shareText = `${shareTitle}\n${shareUrl}`
    navigator.clipboard.writeText(shareText).then(() => {
      toast.add({
        title: 'Link disalin ke clipboard',
        color: 'success'
      })
    }).catch(err => {
      console.error('Failed to copy:', err)
      toast.add({
        title: 'Gagal menyalin link',
        color: 'error'
      })
    })
  }
}
</script>
