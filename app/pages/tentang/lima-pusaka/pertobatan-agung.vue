<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <BackButton to="/?tab=tentang" />
      <span class="text-sm text-gray-600 dark:text-gray-400 flex-1 text-center">5. Pertobatan Agung</span>
      <div class="flex items-center gap-2">
        <button @click="shareContent" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Icon name="mdi:share-variant" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <TentangMenu type="lima-pusaka" />
      </div>
    </div>

    <!-- Hero Image -->
    <div class="relative bg-linear-to-b from-yellow-100 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage7.png?alt=media&token=22f42218-523d-4450-9875-cba0144c16e6"
        alt="Pertobatan Agung" class="w-full" />
    </div>

    <!-- Content -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pertobatan Agung</h1>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">Pertobatan Agung</p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Kehidupan manusia tidak bisa terlepas dari Pertobatan.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Terlalu banyak kesalahan yang telah kita lakukan,
        hanya dengan bertobat setulus hati baru bisa menghilangkan karma buruk di dalam hati dan penyesalan.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Kesalahan yang kita lakukan entah dengan sadar atau tidak, semua itu tetap berarti telah melakukan kesahalan.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Meski dosa yang kamu lakukan tidak kamu sadari, tapi tetap akan mendapatkan balasannya.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Entah pernah melakukan kesalahan besar atau kecil dalam perbuatan ataupun pikirkan, semua itu akan tersimpan di
        dalam tingkat kesadaran ke delapanmu dan mengotori sifat dasarmu yang baik.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Membaca Li Fo Da Chan Hui Wen itu berarti sedang memohon kepada Pu Sa untuk memberkatimu mengikis karma buruk
        yang pernah kamu lakukan agar bibit karma buruk ini tidak berkembang menjadi dosa.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Perlakuan burukmu terhadap orang lain mungkin tidak bisa membuat dia melupakannya
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Hanya dengan bertobat setulus hati, dia bisa merasakan betapa besarnya penyesalanmu terhadapnya.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Dengan pertobatan, Anda bisa mendapatkan kedamaian hati dan kesehatan mental.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Jadi, Li Fo Da Chan Hui Wen adalah sebuah pusaka Dharma untuk menyelesaikan rasa sakit hati dirimu dan
        menghilangkan rasa sakit hati orang lain terhadapmu.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Seseorang yang tidak bersedia bertobat, maka dia tidak bisa mengubah kekotoran batinnya.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Ini seperti seseorang yang tidak bersedia mandi dan tubuhnya tidak akan pernah bersih. Hanya orang yang memahami
        untuk mandi, baru bisa membersihkan tubuhnya.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Bertobat adalah untuk memandikan jiwa yang kotor.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Oleh karena itu, belajarnya untuk bisa bertobat karena bisa membuatmu terbebaskan dan melepaskannya.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Bertobat atas kesalahan yang pernah dilakukan itu seperti sebuah baju yang telah dicuci bersih dan dikenakan
        lagi.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Jika baju kotor yang telah melewati reinkarnasi puluhan tahun ini semakin usang, kotor, dan robek, bagaimana
        kamu bisa mengenakannya?
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Jika inign mencuci pakaian ini hingga bersih, maka kamu perlu melakukan pertobatan besar untuk mengubah dirimu
        menjadi pribadi yang lebih baik lagi.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Hidup menderita itu berarti sedang mengikis karma. Bertobat itu bisa lebih mengikis karma.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Terkadang, bertobat malah bisa lebih cepat mengikis karma daripada hidup menderita
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Hidup menderita untuk mengikis karma adalah semacam hukuman agar kamu menyadari untuk tidak boleh melakukan hal
        ini, dan pertobatan yntuk macam ini sangatlah terbatas.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Pertobatan yang sebenarnya adalah keluar dari dalam lubuk hati dan kamu benar-benar menyadari bahwa kamu telah
        melakukan kesalahan dalam hubungan
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Kamu perlu melakukan pertobatan atas segala tindakan, ucapan, dan pikiran.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Sangat penting untuk bisa sering bertobat di zaman akhir Dharma ini.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Di zaman akhir Dharma ini, Shifu sangat berharap para umat XLFM bisa menggunakan 5 Pusaka Dharma mulai dari
        sekarang untuk lebih cepat engikis karma dan jangan sampai karma buruk mengikuti kita.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Shifu memelopori untuk Bertobat, berharap para umat juga bisa bertobat
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Hanya dengan sering bertobat, karma buruk akan terkikis dan keberuntungan menghampiri kita.
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Ini adalah Pusaka Dharma ke 5 XLFM yang terbaru
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Berikrar, melepaskan makhluk hidup, membaca Bai Hua Fo Fa, membaca paritta dan pertobatan agung.
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
  const shareTitle = 'Pertobatan Agung - Master Lu Indonesia'

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
