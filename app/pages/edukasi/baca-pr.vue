<template>
    <div class="h-screen bg-white flex flex-col">
        <!-- Header (Fixed) -->
        <div class="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <BackButton to="/?tab=edukasi" />
            <span class="text-sm text-gray-600">Pekerjaan Rumah Setiap Hari</span>
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
                        <button 
                            v-for="item in menuItems" 
                            :key="item.id" 
                            @click="scrollToSection(item.id)"
                            class="block text-gray-900 text-base py-2 hover:text-yellow-600 text-left w-full"
                        >
                            {{ item.title }}
                        </button>
                    </div>
                </div>
            </template>
        </USlideover>

        <!-- Content (Scrollable) -->
        <div ref="contentRef" class="flex-1 overflow-y-auto px-4 py-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Pembacaan PR Setiap</h1>
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Hari Untuk Pemula</h1>

            <!-- Hero Image -->
            <div class="mb-6">
                <img src="https://masterluindonesia.com/assets/assets/images/pr/image_1.png" alt="Baca PR"
                    class="w-full rounded-lg" />
            </div>

            <!-- Section: Mengapa membaca paritta -->
            <div id="mengapa-membaca-paritta" class="mb-6">
                <h2 class="text-4xl font-bold mb-1">Mengapa</h2>
                <h2 class="text-4xl font-bold mb-4">membaca paritta?</h2>

                <p class="text-gray-700 text-sm mb-4">
                    Membaca paritta sangatlah penting bagi kita, karena dengan membaca paritta setiap hari bisa
                    menghubungkan aura kita dengan aura Bodhisattva,
                </p>
                <hr class="border-black mb-4" />

                <p class="text-gray-700 text-sm mb-4">
                    menerima berkat dari Bodhisattva dan dengan kekuatan yang diterima,
                </p>
                <hr class="border-black mb-4" />

                <p class="text-gray-700 text-sm mb-4">
                    kita pun mampu bersikap lebih bijaksana dalam menyelesaikan permasalahan yang dihadapi,
                </p>
                <hr class="border-black mb-4" />

                <p class="text-gray-700 text-sm mb-4">
                    serta membawa kedamaian dan ketenangan dalam hati kita.
                </p>
                <hr class="border-black mb-4" />

                <p class="text-gray-700 text-sm mb-4">
                    Di dalam Kitab Suci Buddhis tertulis : "Pahala dan kebajikan yang diperoleh dari membaca paritta
                    luar biasa besarnya",
                </p>
                <hr class="border-blue-400 mb-4" />

                <p class="text-gray-700 text-sm">
                    Membaca paritta juga merupakan salah satu bentuk kebajikan, yang dapat digunakan untuk menghapus
                    karma buruk dari kehidupan sebelumnya dan sekarang.
                </p>
            </div>

            <!-- Section 2: Perlengkapan Untuk Membaca PR -->
            <div id="perlengkapan" class="bg-gray-100 -mx-4 px-4 py-6 mb-6">
                <h2 class="text-xl font-bold text-gray-900 mb-1">Perlengkapan Untuk</h2>
                <h2 class="text-xl font-bold text-gray-900 mb-6">Membaca PR</h2>

                <div class="relative">
                    <img src="https://masterluindonesia.com/assets/assets/images/pr/image_2.png"
                        alt="Perlengkapan Membaca PR" class="w-full rounded-lg" />

                    <!-- Plus button 1: PR Sheet -->
                    <button @click="showTooltip(0)"
                        class="absolute w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold hover:bg-gray-800 transition-colors"
                        style="left: 60%; top: 5%;">+</button>
                    <div v-if="activeTooltip === 0"
                        class="absolute bg-black text-white text-xs rounded-lg px-3 py-2 w-40 text-center z-10"
                        style="left: 45%; top: 14%;">
                        Kertas Panduan PR
                    </div>

                    <!-- Plus button 2: Counter -->
                    <button @click="showTooltip(1)"
                        class="absolute w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold hover:bg-gray-800 transition-colors"
                        style="left: 87%; top: 2%;">+</button>
                    <div v-if="activeTooltip === 1"
                        class="absolute bg-black text-white text-xs rounded-lg px-3 py-2 w-40 text-center z-10"
                        style="left: 55%; top: 11%;">
                        Tally Counter
                    </div>

                    <!-- Plus button 3: Book -->
                    <button @click="showTooltip(2)"
                        class="absolute w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold hover:bg-gray-800 transition-colors"
                        style="left: 70%; top: 35%;">+</button>
                    <div v-if="activeTooltip === 2"
                        class="absolute bg-black text-white text-xs rounded-lg px-3 py-2 w-40 text-center z-10"
                        style="left: 55%; top: 44%;">
                        Buku Paritta
                    </div>
                </div>
            </div>

            <!-- Section 3: Manfaat Membaca Paritta -->
            <div id="manfaat" class="bg-linear-60 from-[#f5eada] to-[#f6f2ef] -mx-4 px-4 py-6 mb-6">
                <h2 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Manfaat Membaca Paritta</h2>

                <!-- Da Bei Zhou -->
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">Da Bei Zhou</h3>
                    <div class="bg-linear-to-r from-[#e6d0a9] to-[#efdfc2] rounded-lg p-4">
                        <p class="font-semibold text-[#353026]">
                            Mewujudkan segala permohonan, dan juga mengobati segala macam penyakit, dilindungi oleh para
                            Naga Langit dan Dewa Pelindung Dharma.
                        </p>
                    </div>
                </div>

                <!-- Xin Jing -->
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">Xin Jing</h3>
                    <div class="bg-linear-to-r from-[#e6d0a9] to-[#efdfc2] rounded-lg p-4">
                        <p class="font-semibold text-[#353026]">
                            Anak kecil yang tidak menurut, orang dewasa yang tidak percaya Ajaran Buddha Dharma, orang
                            tua terlalu keras kepala, perasaan tidak stabil, kurang pintar atau tidak terbuka
                            pikirannya, Depresi.
                        </p>
                    </div>
                </div>

                <!-- Li Fo Da Chan Hui Wen -->
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">Li Fo Da Chan Hui Wen</h3>
                    <div class="bg-linear-to-r from-[#e6d0a9] to-[#efdfc2] rounded-lg p-4">
                        <p class="font-semibold text-[#353026] mb-1">
                            Untuk bertobat atau menyesali semua karma buruk yang pernah dilakukan
                        </p>
                        <p class="font-bold text-gray-900 mb-1">Contohnya:</p>
                        <p class="text-[#353026] mb-3">
                            pernah menyakiti perasaan orang lain
                        </p>
                        <p class="text-[#353026] mb-3">
                            Dendam permusuhan yang sudah berlangsung selama puluhan tahun
                        </p>
                        <p class="text-[#353026] mb-3">
                            Karma buruk masa lalu
                        </p>
                        <p class="text-[#353026]">
                            Pernah bersikap tidak hormat pada Bodhisattva, merusak gambar atau rupang Bodhisattva dan
                            lain-lain.
                        </p>
                    </div>
                </div>

                <!-- Wang Sheng Zhou -->
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">Wang Sheng Zhou</h3>
                    <div class="bg-linear-to-r from-[#e6d0a9] to-[#efdfc2] rounded-lg p-4">
                        <p class="font-semibold text-[#353026] mb-1">
                            Wang Sheng Zhou Memohon berkat dari Guan Shi Yin Pu Sa, agar bisa mendapatkan kebahagiaan
                            dan kedamaian duniawi Bisa mendapatkan kebahagiaan dan kedamaian di surga, Mendoakan arwah
                            binatang kecil, unggas, hewan laut, serangga, dan lain-lain yang pernah dibunuh agar bisa
                            terlahir ke alam yang lebih baik
                        </p>
                    </div>
                </div>

                <!-- Jie Jie Zhou -->
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">Jie Jie Zhou</h3>
                    <div class="bg-linear-to-r from-[#e6d0a9] to-[#efdfc2] rounded-lg p-4">
                        <p class="font-semibold text-[#353026] mb-1">
                            Jie Jie Zhou Kesalahpahaman antara pasangan Ketidakharmonisan suami istri Ketidakakuran
                            orang tua dan anak Pertikaian dengan rekan kerja Hubungan buruk bos dengan karyawan Utang
                            karma di kehidupan lalu. </p>
                    </div>
                </div>

                <!-- Zhan Ti Shen Zhou -->
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">Zhan Ti Shen Zhou</h3>
                    <div class="bg-linear-to-r from-[#e6d0a9] to-[#efdfc2] rounded-lg p-4">
                        <p class="font-semibold text-[#353026] mb-2">
                            Keberhasilan dalam pekerjaan, Pernikahan yang harmonis, Hasil akademis yang bagus.
                        </p>
                        <p class="font-semibold text-[#353026]">
                            angat membantu bagi anak muda yang sedang mencari pekerjaan, mencari jodoh, sekolah dan
                            karir, namun harus dilakukan untuk memohon sesuatu hal yang sesuai dengan aturan dan hukum
                            serta masih dalam batas kewajaran.
                        </p>
                    </div>
                </div>

                <!-- Xiao Zai Ji Xiang Shen Zhou -->
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">Xiao Zai Ji Xiang Shen Zhou</h3>
                    <div class="bg-linear-to-r from-[#e6d0a9] to-[#efdfc2] rounded-lg p-4">
                        <p class="font-semibold text-[#353026] mb-2">
                            Xiao Zai Ji Xiang Shen Zhou Terbebas dari sengketa hukum Kerugian harta benda Perkelahian,
                            denda, sakit mendadak Terhindar dari bencana yang akan datang Bermimpi buruk, dan lain-lain.
                        </p>

                    </div>
                </div>

                <!-- Hal Yang Perlu Diperhatikan -->
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-6">Hal Yang Perlu Diperhatikan</h3>
                    <ol class="text-[#353026] font-semibold list-decimal list-outside space-y-2 px-4">
                        <li>Boleh kali membaca paritta bila kamu membaca judul paritanya</li>
                        <li>Tidak membaca paritta dari jam 5 pagi sampai jam 5 sore</li>
                        <li>Saat membaca paritta lalu terhenti karena ada gangguan, sebelumnya ulang paritta dari
                            awal</li>
                        <li>Xin Jing dan Wang Sheng Zhou boleh dibaca di pagi atau siang tapi hingga jam 10 malam
                            walaupun cuaca mendung</li>
                        <li>Setelah jam 10 malam, hindari membaca Xin Jing, Li Fo Da Chan Hui Wen, dan Wang Sheng
                            Zhou, membaca dan lanjut dengan paritta lain</li>
                        <li>Sebelum jam pagi membaca boleh paritta tersebut saat cuaca bisa, membaca dan lanjut
                            dengan paritta lain</li>
                        <li>Jika kondisi mau membaca Xin Jing dan Wang Sheng Zhou, maka usahakan membaca Da Bei Zhou
                            sebanyak 7x atau lebih sebelumnya dan jangan sampai 5 sore</li>
                        <li>Sebaiknya jangan membaca paritta apapun dari jam 2 sampai jam 5 pagi</li>
                    </ol>
                </div>
            </div>

            <!-- Section 4: Langkah Pertama -->
            <div id="langkah-langkah" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Pertama</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/pr/langkah_pertama_1.png"
                        alt="Jing Kou Ye Zhen Yan" class="w-full rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 mb-1">Membaca Jing</h3>
                        <h3 class="text-2xl font-bold text-gray-900 mb-1">Kou Ye Zhen Yan</h3>
                        <h3 class="text-2xl font-bold text-gray-900">sebanyak 7x</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 5: Langkah Kedua (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Kedua</h2>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKedua()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
                    </button>
                    <button @click="scrollNextLangkahKedua()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <UCarousel ref="langkahKeduaRef" v-slot="{ item }" :items="langkahKeduaItems" :ui="{ item: 'basis-full' }" @select="onSelectLangkahKedua">
                    <UCard class="border-2 border-[#eedcb4] shadow-xl">
                        <img :src="item.image" :alt="item.title" class="w-full rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-2xl font-bold text-gray-900">{{ item.title }}</h3>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 6: Langkah Ketiga -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Ketiga</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/pr/langkah_ketiga_1.png"
                        alt="Langkah Ketiga" class="w-full rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Ucapkan</h3>
                        <p class="text-gray-700">"Terima kasih Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa"</p>
                    </div>
                </UCard>
            </div>

            <!-- Section 7: Langkah Keempat (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Langkah Keempat</h2>
                <p class="text-gray-600 mb-4">Membaca 3 Paritta Utama</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKeempat()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
                    </button>
                    <button @click="scrollNextLangkahKeempat()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <UCarousel ref="langkahKeempatRef" v-slot="{ item }" :items="langkahKeempatItems" :ui="{ item: 'basis-full' }" @select="onSelectLangkahKeempat">
                    <UCard class="border-2 border-[#eedcb4] shadow-xl">
                        <img :src="item.image" :alt="item.title" class="w-full rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ item.title }}</h3>
                            <p class="text-gray-700 text-sm mb-2">"{{ item.description }}"</p>
                            <p class="text-gray-500 text-sm">{{ item.count }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 8: Langkah Keempat - Membaca Paritta Pendek (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Langkah Keempat</h2>
                <p class="text-gray-600 mb-4">Membaca Paritta Pendek</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKeempat2()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
                    </button>
                    <button @click="scrollNextLangkahKeempat2()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <UCarousel ref="langkahKeempat2Ref" v-slot="{ item }" :items="langkahKeempat2Items" :ui="{ item: 'basis-full' }" @select="onSelectLangkahKeempat2">
                    <UCard class="border-2 border-[#eedcb4] shadow-xl">
                        <img :src="item.image" :alt="item.title" class="w-full rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ item.title }}</h3>
                            <p class="text-gray-700 text-sm mb-2">"{{ item.description }}"</p>
                            <p class="text-gray-500 text-sm">{{ item.count }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 9: Langkah Kelima -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Kelima</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/pr/langkah_kelima_1.png"
                        alt="Bu Que Zhen Yan" class="w-full rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Bu Que Zhen Yan</h3>
                        <p class="text-gray-700">sebanyak 3x atau 7x setelah selesai membaca PR harian</p>
                    </div>
                </UCard>
            </div>

            <!-- Section 10: Langkah Keenam -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Keenam</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/pr/langkah_keenam_1.png"
                        alt="Qi Fo Mie Zui Zhen Yan" class="w-full rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Qi Fo Mie Zui Zhen Yan</h3>
                        <p class="text-gray-700">Sebanyak 3x</p>
                    </div>
                </UCard>
            </div>

            <!-- Section 11: Langkah Ketujuh -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Ketujuh</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/pr/langkah_ketiga_1.png"
                        alt="Langkah Ketujuh" class="w-full rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 mb-1">Setelah selesai</h3>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Ucapkan</h3>
                        <p class="text-gray-700">"Terima kasih Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa telah memberkati dan melindungi saya XXX (nama sendiri)."</p>
                    </div>
                </UCard>
            </div>

            <!-- Section 12: Video Tutorial -->
            <div id="video-tutorial" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Video Tutorial</h2>

                <div class="aspect-video rounded-lg overflow-hidden">
                    <iframe 
                        src="https://www.youtube.com/embed/YO9nN8nkF5E" 
                        title="Video Tutorial Baca PR"
                        class="w-full h-full"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                    ></iframe>
                </div>
            </div>

            <!-- Section 13: Contoh Gambar -->
            <div id="unduh" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Contoh Gambar</h2>
                <p class="text-gray-600 mb-4">*Download gambar di tab Beranda Unduh</p>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/pr/pedoman_pr.png"
                        alt="Pedoman PR" class="w-full rounded-lg" />
                </UCard>
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
    { id: 'mengapa-membaca-paritta', title: 'Mengapa Perlu Membaca Paritta?' },
    { id: 'perlengkapan', title: 'Perlengkapan Untuk Membaca PR' },
    { id: 'manfaat', title: 'Manfaat Membaca Paritta' },
    { id: 'langkah-langkah', title: 'Langkah - Langkah Membaca PR' },
    { id: 'video-tutorial', title: 'Video Tutorial' },
    { id: 'unduh', title: 'Unduh' }
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

const activeTooltip = ref<number | null>(null)

function showTooltip(index: number) {
    if (activeTooltip.value === index) {
        activeTooltip.value = null
    } else {
        activeTooltip.value = index
    }
}

// Langkah Kedua Carousel
const langkahKeduaRef = useTemplateRef('langkahKeduaRef')
const langkahKeduaIndex = ref(0)

function onSelectLangkahKedua(index: number) {
    langkahKeduaIndex.value = index
}

function scrollPrevLangkahKedua() {
    langkahKeduaRef.value?.emblaApi?.scrollPrev()
}

function scrollNextLangkahKedua() {
    langkahKeduaRef.value?.emblaApi?.scrollNext()
}

const langkahKeduaItems = [
    {
        id: 1,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_kedua_1.png',
        title: 'Jika memiliki Altar, Pasang dupa di Altar'
    },
    {
        id: 2,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_kedua_2.png',
        title: 'Jika tidak memiliki altar, lakukan dupa hati'
    },
    {
        id: 3,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_kedua_3.png',
        title: 'Jika tidak memiliki altar, sembahyang di altar kecil'
    }
]

// Langkah Keempat Carousel (3 Paritta Utama)
const langkahKeempatRef = useTemplateRef('langkahKeempatRef')
const langkahKeempatIndex = ref(0)

function onSelectLangkahKeempat(index: number) {
    langkahKeempatIndex.value = index
}

function scrollPrevLangkahKeempat() {
    langkahKeempatRef.value?.emblaApi?.scrollPrev()
}

function scrollNextLangkahKeempat() {
    langkahKeempatRef.value?.emblaApi?.scrollNext()
}

const langkahKeempatItems = [
    {
        id: 1,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_keempat_1_1.png',
        title: 'Qian Shou Qian Yan Wu Ai Da Bei Xin Tuo Luo Ni / Da Bei Zhou',
        description: 'Dengan hormat memohon pada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa memberkati saya XXX (nama sendiri) dengan kesehatan dan kekuatan.',
        count: 'Sebanyak 3 - 7x'
    },
    {
        id: 2,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_keempat_1_2.png',
        title: 'Bo Re Buo Luo Mi Duo Xin Jing',
        description: 'Dengan hormat memohon pada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa memberkati saya XXX (nama sendiri) dengan kebijaksanaan, ketenangan pikiran, dan menghilangkan kekhawatiran yang berlebihan.',
        count: 'Sebanyak 3 - 7x'
    },
    {
        id: 3,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_keempat_1_3.png',
        title: 'Li Fo Da Chan Hui Wen',
        description: 'Dengan hormat memohon pada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa memberkati saya XXX (nama sendiri), membantu saya untuk bertobat dan menghilangkan karma buruk yang ada di tubuh saya (bisa menyebutkan bagian tertentu), memberkati saya dengan kesehatan dan kebijaksanaan.',
        count: 'Sebanyak 1 - 7x'
    }
]

// Langkah Keempat Carousel 2 (Paritta Pendek)
const langkahKeempat2Ref = useTemplateRef('langkahKeempat2Ref')
const langkahKeempat2Index = ref(0)

function onSelectLangkahKeempat2(index: number) {
    langkahKeempat2Index.value = index
}

function scrollPrevLangkahKeempat2() {
    langkahKeempat2Ref.value?.emblaApi?.scrollPrev()
}

function scrollNextLangkahKeempat2() {
    langkahKeempat2Ref.value?.emblaApi?.scrollNext()
}

const langkahKeempat2Items = [
    {
        id: 1,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_ketiga_1.png',
        title: 'Catatan',
        description: 'Membaca Paritta Pendek disesuaikan dengan keadaan atau permasalahan yang dihadapi sebanyak 21x, 27x atau 49x. Bagi para pemula perlu membaca paritta Wang Sheng Jing Tu Shen Zhou',
        count: 'Sebanyak 21, 27 atau 49x'
    },
    {
        id: 2,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_keempat_2_2.png',
        title: 'Wang Sheng Jing Tu Shen Zhou',
        description: 'Dengan hormat memohon pada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa memberkati saya XXX (nama sendiri), mendoakan arwah kecil (binatang) yang mati karena saya agar bisa pergi ke alam yang lebih baik, membantu saya menghapus karma buruk saya.',
        count: 'Sebanyak 21, 27 atau 49x'
    },
    {
        id: 3,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_keempat_2_3.png',
        title: 'Jie Jie Zhou',
        description: 'Dengan hormat memohon pada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa mengurai hubungan buruk antara saya XXX (nama sendiri) dengan YYY (nama anggota keluarga / nama teman / nama rekan kerja).',
        count: 'Sebanyak 21, 27 atau 49x'
    },
    {
        id: 4,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_keempat_2_4.png',
        title: 'Xiao Zai Ji Xiang Shen Zhou',
        description: 'Dengan hormat memohon pada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa membantu saya XXX (nama sendiri) agar terhindar dari bencana, memberkati saya dengan kesehatan dan kebijaksanaan.',
        count: 'Sebanyak 21, 27 atau 49x'
    },
    {
        id: 5,
        image: 'https://masterluindonesia.com/assets/assets/images/pr/langkah_keempat_2_5.png',
        title: 'Zhun Ti Shen Zhou',
        description: 'Dengan hormat memohon pada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa memberkati saya XXX (nama sendiri), agar apa yang diharapkan tercapai (boleh dalam pekerjaan / keluarga yang bahagia dan harmonis, berprestasi dalam pendidikan).',
        count: 'Sebanyak 21, 27 atau 49x'
    }
]
</script>
