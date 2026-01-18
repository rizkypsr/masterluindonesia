<template>
    <div class="h-screen bg-white flex flex-col">
        <!-- Header (Fixed) -->
        <div class="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <BackButton to="/?tab=edukasi" />
            <span class="text-sm text-gray-600">Altar Kecil</span>
            <button @click="isMenuOpen = true" class="p-1">
                <Icon name="heroicons:bars-3" class="w-5 h-5 text-gray-700" />
            </button>
        </div>

        <!-- Slideover Menu -->
        <USlideover v-model:open="isMenuOpen" side="bottom">
            <template #content>
                <div class="p-4">
                    <!-- Handle bar -->
                    <div class="flex justify-center mb-4">
                        <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
                    </div>

                    <h3 class="text-lg font-bold text-gray-900 mb-4">DAFTAR MENU</h3>

                    <div class="space-y-4">
                        <button v-for="item in menuItems" :key="item.id" @click="scrollToSection(item.id)"
                            class="block text-gray-900 text-base py-2 hover:text-yellow-600 text-left w-full">
                            {{ item.title }}
                        </button>
                    </div>
                </div>
            </template>
        </USlideover>

        <!-- Content (Scrollable) -->
        <div ref="contentRef" class="flex-1 overflow-y-auto px-4 py-6">
            <!-- Hero Image -->
            <div class="mb-6">
                <img src="https://masterluindonesia.com/assets/assets/images/altarkecil/altar_kecil.png"
                    alt="Altar Kecil" class="w-full rounded-lg" />
            </div>

            <!-- Section 1: Altar Kecil Khusus Melafalkan Paritta -->
            <div id="altar-kecil" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">171. Altar Kecil Khusus</h2>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Melafalkan Paritta</h2>

                <div class="space-y-4 text-black">
                    <p><span class="font-bold">Tanya [171]:</span> Ada seorang saudara se-Dharma yang menggunakan satu meja kecil khusus untuk melafalkan paritta, Master pernah mengatakan bahwa dia boleh meletakkan satu lembar foto Bodhisattva, lalu menyalakan satu batang dupa ketika melafalkan paritta, begitu lebih bagus. Mohon tanya, bagaimana detail pelaksanaannya?</p>
                    
                    <p class="font-bold">Jawab [171] :</p>
                    
                    <p>Jika Anda menggunakan satu meja khusus untuk melafalkan paritta, dan harus selalu dijaga kebersihannya.</p>
                    
                    <p>Apabila Anda ingin kualitas pelafalan Xiao Fang Zi Anda lebih bagus, maka boleh memasang satu batang dupa menggunakan tempat dupa (hiolo) berukuran kecil.</p>
                    
                    <p>Kemudian Anda bisa menitik Xiao Fang Zi sambil melafalkan paritta, kekuatannya akan bertambah beberapa kali lipat.</p>
                    
                    <p>Ini adalah praktik khusus dalam agama Buddha. Dulu Master pernah mengunjungi banyak biksu-biksu besar.</p>
                    
                    <p>Di dalam ruangan mereka pasti terdapat satu altar kecil, yang merupakan tempat melafalkan paritta di dalam kamar, di atasnya ada satu buku paritta, satu tempat dupa kecil, dan memasang satu foto Bodhisattva.</p>
                    
                    <p>Kalau kita ingin membuat altar kecil seperti ini, maka kita bisa memuja foto Guan Shi Yin Pu Sa.</p>
                    
                    <p>Sebaiknya meletakkan satu lembar foto Bodhisattva di atas meja, boleh berukuran 6 inchi atau sebesar ukuran kartu pelindung.</p>
                    
                    <p>Besar foto maksimal tidak boleh lebih besar dari kertas A4, ditegakkan di atas meja, jangan langsung bersandar ke tembok (jangan menempel ke tembok).</p>
                    
                    <p>Foto Bodhisattva boleh dibingkai, lalu ditegakkan menggunakan penopang bingkai foto di belakangnya.</p>
                    
                    <p>(meja dan foto Bodhisattva berukuran kecil boleh tidak bersandar ke tembok, namun altar resmi harus bersandar ke tembok).</p>
                    
                    <p>Di bawah foto Bodhisattva sebaiknya dialasi dengan kain berwarna merah atau kuning. Ketika tidak bersembahyang, silakan menutup foto Bodhisattva dan tempat dupa menggunakan kain merah yang baru.</p>
                    
                    <p>Pada saat bersembahyang, sebaiknya terlebih dahulu memasang dupa di altar resmi (Sebaiknya memasang satu dupa untuk setiap rupang Bodhisattva.</p>
                    
                    <p>Jika memang keadaannya tidak memungkinkan, maka boleh hanya memasang satu dupa di tempat dupa Guan Shi Yin Pu Sa).</p>
                    
                    <p>Kemudian baru memasang dupa di altar kecil, setelah itu lampu minyak di altar resmi boleh dipadamkan.</p>
                    
                    <p>Jika dupa yang dinyalakan di altar kecil sudah terbakar habis, tetapi kita masih ingin melanjutkan pelafalan paritta.</p>
                    
                    <p>Namun lampu minyak di altar resmi sudah dipadamkan, maka boleh menyalakan dupa menggunakan korek api atau mancis dan langsung memasangnya di altar kecil.</p>
                    
                    <p>(tidak perlu terus memasang dupa di altar resmi pada saat yang sama).</p>
                    
                    <p>Apabila Anda tidak memiliki altar resmi di rumah, maka sebaiknya membuat meja kecil khusus untuk melafalkan paritta seperti ini.</p>
                    
                    <p>Tetap lebih baik daripada tidak ada altar sama sekali.</p>
                    
                    <p>Hanya memerlukan satu foto Bodhisattva dan satu tempat dupa, sudah bisa menjadi satu altar kecil, setidaknya di hati kita ada medan pembinaan Bodhisattva.</p>
                    
                    <p>Altar kecil ini boleh ditempatkan di dalam ruangan altar, juga bisa ditempatkan di dalam kamar atau ruangan lain yang bersih.</p>
                    
                    <p>Tidak perlu mempersembahkan (gelas) air minum dan lampu minyak di altar kecil, karena altar ini bukan altar resmi.</p>
                    
                    <p>Biasanya hanya memerlukan satu foto Bodhisattva dan satu tempat dupa. Gelas air persembahan, bunga, dan buah boleh dipersembahkan menyesuaikan keadaan.</p>
                    
                    <p>Tidak boleh bersembah sujud di depan altar kecil, hanya boleh memberi hormat dengan bersikap anjali setelah menyalakan dupa.</p>
                    
                    <p>Biasanya saat melafalkan paritta di meja altar kecil, Anda cukup duduk (di depannya) saja.</p>
                    
                    <p>Jika Anda ingin membakar Xiao Fang Zi, maka sebaiknya Anda bersembah sujud terlebih dahulu di depan altar resmi dan mengucapkan permohonan sesuai tata cara yang ditentukan,</p>
                    
                    <p>Baru membakar Xiao Fang Zi. Jika Anda tidak memiliki altar resmi di rumah, tetap tidak disarankan untuk membakar Xiao Fang Zi di altar kecil,</p>
                    
                    <p>Anda boleh memasang dupa di altar kecil, kemudian menjalankan tata cara membakar Xiao Fang Zi tanpa altar.</p>
                    
                    <p>Yang diawali dengan melakukan pemasangan dupa hati – bervisualisasi, kemudian membakar Xiao Fang Zi sesuai dengan aturan.</p>
                    
                    <p>Altar kecil di atas meja belajar ini, tidak boleh digunakan untuk bersembah sujud sebagaimana fungsi altar resmi.</p>
                    
                    <p>Jika Anda belum memasang altar resmi di rumah, tetapi Anda ingin bersembah sujud di depan altar atau membakar Xiao Fang Zi.</p>
                    
                    <p>Maka silakan memasang altar sementara (altar sementara memerlukan tempat dupa, gelas air persembahan, minyak pelita dan lainnya,</p>
                    
                    <p>Altar sementara tidak sama dengan altar kecil sejenis ini yang ditempatkan di atas meja tulis).</p>
                    
                    <p>Foto Bodhisattva dan tempat dupa yang digunakan di altar kecil bisa dibungkus dengan kain merah dan dibawa ke mana pun Anda pergi.</p>
                    
                    <p>Jika Anda menginap di hotel, juga bisa langsung memasang altar kecil, lalu melafalkan paritta di sana,</p>
                    
                    <p>Karena Anda sudah terbiasa menggunakan altar kecil ini di rumah.</p>
                    
                    <p>Sehingga dia sudah memiliki kekuatannya atau medan auranya sendiri, ini lebih baik daripada bersembahyang di altar orang lain.</p>
                    
                    <p>Jika ada saudara se-Dharma yang ketika pulang kampung atau berdinas keluar ingin bersembah sujud,</p>
                    
                    <p>Maka sebaiknya membawa foto altar resmi di rumah, jadi Anda bisa memotret dan membawa fotonya.</p>
                    
                    <p>Kemudian mendirikan altar sementara (perlu mempersembahkan tempat dupa, air gelas persembahan, minyak pelita, buah dan bunga, dan lain-lain).</p>
                    
                    <p>Jika Anda tidak mau memasang altar sementara, juga bisa memasang altar kecil di atas meja kerja seperti ini.</p>
                    
                    <p>Sesuai dengan tata cara memasang altar kecil di atas, ketika ingin melafalkan paritta bisa langsung memasang dupa,</p>
                    
                    <p>Tetapi tidak boleh digunakan untuk bersembah sujud.</p>
                    
                    <p>Jika Anda ingin berikrar atau mengucapkan permohonan, juga hanya bisa mengucapkannya dengan memasang dupa hati atau bervisualisasi.</p>
                    
                    <p>Namun hasilnya akan jauh berkurang dibandingkan altar resmi.</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'blank'
})

// Menu
const isMenuOpen = ref(false)
const menuItems = [
    { id: 'altar-kecil', title: 'Altar Kecil Khusus Melafalkan Paritta' }
]

// Content ref for scrolling
const contentRef = useTemplateRef('contentRef')

function scrollToSection(id: string) {
    isMenuOpen.value = false
    nextTick(() => {
        const element = document.getElementById(id)
        const container = contentRef.value
        if (element && container) {
            const offsetTop = element.offsetTop - container.offsetTop
            container.scrollTo({ top: offsetTop, behavior: 'smooth' })
        }
    })
}
</script>
