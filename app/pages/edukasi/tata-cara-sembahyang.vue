<template>
    <div class="h-screen bg-white flex flex-col">
        <!-- Header (Fixed) -->
        <div class="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <BackButton to="/?tab=edukasi" />
            <span class="text-sm text-gray-600">Tata Cara Sembahyang Setiap Hari</span>
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
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Tata Cara Sembahyang</h1>
            <p class="text-gray-600 mb-6">Bagi Yang Memiliki Altar</p>

            <!-- Hero Image -->
            <div class="mb-6">
                <img src="https://masterluindonesia.com/assets/assets/images/sembayang/image_1.png"
                    alt="Tata Cara Sembahyang" class="w-full h-96 object-cover rounded-lg" />
            </div>

            <!-- Section 1: Langkah Pertama -->
            <div id="langkah-langkah" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Pertama</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_pertama.png"
                        alt="Cuci Tangan" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900">Cuci Tangan</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 2: Langkah Kedua -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Kedua</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_kedua.png"
                        alt="Nyalakan Dupa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Nyalakan dupa dengan api lampu minyak</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 3: Langkah Ketiga -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Ketiga</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_ketiga_keempat.png"
                        alt="Pegang Dupa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Pegang dupa dengan kedua tangan dan angkat
                            dupa
                            setinggi dahi</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 4: Langkah Keempat -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Keempat</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_ketiga_keempat.png"
                        alt="Ucapkan" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Ucapkan:</h3>
                        <p class="text-gray-700">Saya XXX memberi hormat kepada ... Pu Sa</p>
                    </div>
                </UCard>
            </div>

            <!-- Section 5: Langkah Kelima -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Kelima</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_kelima.png"
                        alt="Tancap Dupa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Tancap dupa dengan kedua tangan ke dalam tempat
                            dupa
                        </h3>
                        <p class="font-bold text-gray-900 mb-1">Catatan:</p>
                        <p class="text-gray-700 text-sm mb-3">Jika Anda memegang beberapa batang dupa sekaligus, maka
                            Anda bisa
                            menancapkan dupa ke dalam tempat dupa dengan 1 tangan</p>
                        <p class="text-gray-700 text-sm">Jika menancapkan 3 batang dupa sekaligus, tidak perlu
                            menancapkan
                            secara terpisah</p>
                    </div>
                </UCard>
            </div>

            <!-- Section 6: Langkah Keenam (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Langkah Keenam</h2>
                <p class="text-gray-600 mb-4">Ucapkan</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKeenam()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
                    </button>
                    <button @click="scrollNextLangkahKeenam()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <UCarousel ref="langkahKeenamRef" v-slot="{ item }" :items="langkahKeenamItems"
                    :ui="{ item: 'basis-full' }" @select="onSelectLangkahKeenam">
                    <UCard class="border-2 border-[#eedcb4] shadow-xl">
                        <img :src="item.image" :alt="item.title" class="w-full h-96 object-cover rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ item.title }}</h3>
                            <p class="text-gray-700 text-sm mb-2">{{ item.description }}</p>
                            <p class="text-gray-500 text-sm">{{ item.note }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 7: Langkah Ketujuh (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Langkah Ketujuh</h2>
                <p class="text-gray-600 mb-4">Cara Bersembah sujud</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKetujuh()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
                    </button>
                    <button @click="scrollNextLangkahKetujuh()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <UCarousel ref="langkahKetujuhRef" v-slot="{ item }" :items="langkahKetujuhItems"
                    :ui="{ item: 'basis-full' }" @select="onSelectLangkahKetujuh">
                    <UCard class="border-2 border-[#eedcb4] shadow-xl">
                        <img :src="item.image" :alt="item.title" class="w-full h-96 object-cover rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ item.title }}</h3>
                            <p v-if="item.note" class="text-gray-500 text-sm">{{ item.note }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 8: Langkah Kedelapan -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Kedelapan</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/sembayang/image_1.png"
                        alt="Langkah Kedelapan" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900">Baca 1x Da Bei Zhou dan 1x Xin Jing</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 9: Langkah Kesembilan (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Langkah Kesembilan</h2>
                <p class="text-gray-600 mb-4">Berdoa atau berikrar</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKesembilan()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
                    </button>
                    <button @click="scrollNextLangkahKesembilan()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <UCarousel ref="langkahKesembilanRef" v-slot="{ item }" :items="langkahKesembilanItems"
                    :ui="{ item: 'basis-full' }" @select="onSelectLangkahKesembilan">
                    <UCard class="border-2 border-[#eedcb4] shadow-xl">
                        <img :src="item.image" :alt="item.title" class="w-full h-96 object-cover rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
                            <p class="text-gray-700 text-sm mb-2">{{ item.description }}</p>
                            <p v-if="item.note" class="text-gray-500 text-sm">{{ item.note }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 10: Langkah Kesepuluh (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Langkah Kesepuluh</h2>
                <p class="text-gray-600 mb-4">Membaca Paritta</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKesepuluh()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
                    </button>
                    <button @click="scrollNextLangkahKesepuluh()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <UCarousel ref="langkahKesepuluhRef" v-slot="{ item }" :items="langkahKesepuluhItems"
                    :ui="{ item: 'basis-full' }" @select="onSelectLangkahKesepuluh">
                    <UCard class="border-2 border-[#eedcb4] shadow-xl">
                        <img :src="item.image" :alt="item.title" class="w-full h-96 object-cover rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
                            <p v-if="item.description" class="text-gray-700 text-sm mb-2">{{ item.description }}</p>
                            <p v-if="item.note" class="text-gray-500 text-sm">{{ item.note }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 11: Langkah Kesebelas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Kesebelas</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/sembayang/image_1.png"
                        alt="Langkah Kesebelas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900">Baca 7x Qi Fo Mie Zui Zhen Yan</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 12: Langkah Kedua Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Kedua Belas</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/sembayang/langkah_keduabelas.png"
                        alt="Langkah Kedua Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900">Berdiri</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 13: Langkah Ketiga Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Ketiga Belas</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/sembayang/langkah_keduabelas.png"
                        alt="Langkah Ketiga Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900">Bersikap Anjali</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 14: Langkah Keempat Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Keempat Belas</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/sembayang/langkah_keempatbelas.png"
                        alt="Langkah Keempat Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900">Memberikan hormat dengan membungkukkan badan sebanyak 1x atau 3x</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 15: Langkah Kelima Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Kelima Belas</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterluindonesia.com/assets/assets/images/sembayang/langkah_keduabelas.png"
                        alt="Langkah Kelima Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900">Mundur selangkah</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 16: Langkah Enam Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Langkah Enam Belas</h2>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_keenambelas.png"
                        alt="Langkah Enam Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900">Boleh pergi atau kembali melanjutkan pembacaan paritta Anda.</h3>
                    </div>
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
    { id: 'langkah-langkah', title: 'Langkah - Langkah Sembahyang' },
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

// Langkah Keenam Carousel
const langkahKeenamRef = useTemplateRef('langkahKeenamRef')
const langkahKeenamIndex = ref(0)

function onSelectLangkahKeenam(index: number) {
    langkahKeenamIndex.value = index
}

function scrollPrevLangkahKeenam() {
    langkahKeenamRef.value?.emblaApi?.scrollPrev()
}

function scrollNextLangkahKeenam() {
    langkahKeenamRef.value?.emblaApi?.scrollNext()
}

const langkahKeenamItems = [
    {
        id: 1,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/image_1.png',
        title: 'Mengucapkan Nama Buddha Bodhisattva',
        description: '',
        note: ''
    },
    {
        id: 2,
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_keenam_2.png',
        title: 'Gan En Na Mo Shi Jia Mou Ni Fo',
        description: 'Ucapkan 1x dilkuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 3,
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_keenam_3.png',
        title: 'Gan En Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 4,
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_keenam_4.png',
        title: 'Gan En Na Mo Nan Jing Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 5,
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_keenam_5.png',
        title: 'Gan En Na Mo Tai Sui Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 6,
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_keenam_6.png',
        title: 'Gan En Na Mo Guan Di Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 7,
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_keenam_7.png',
        title: 'Gan En Na Mo Zhou Cang Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 8,
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_keenam_8.png',
        title: 'Gan En Na Mo Guan Ping Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    }
]

// Langkah Ketujuh Carousel
const langkahKetujuhRef = useTemplateRef('langkahKetujuhRef')
const langkahKetujuhIndex = ref(0)

function onSelectLangkahKetujuh(index: number) {
    langkahKetujuhIndex.value = index
}

function scrollPrevLangkahKetujuh() {
    langkahKetujuhRef.value?.emblaApi?.scrollPrev()
}

function scrollNextLangkahKetujuh() {
    langkahKetujuhRef.value?.emblaApi?.scrollNext()
}

const langkahKetujuhItems = [
    {
        id: 1,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/image_1.png',
        title: 'Merapatkan kedua telapak tangan (Anjali)',
        note: ''
    },
    {
        id: 2,
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/sembayang/sujud.gif',
        title: 'Bersujud membungkuk hingga dahi menyentuh alas sujud. Tidak perlu membalikkan telapak tangan ke atas',
        note: ''
    },
    {
        id: 3,
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/sembayang/langkah_ketujuh_2.png',
        title: 'Bangkit dan luruskan punggung dengan bersikap Anjali',
        note: 'Ini terhitung 1x sembah sujud dan tidak perlu berdiri setelah kali selesai sembah sujud'
    }
]

// Langkah Kesembilan Carousel
const langkahKesembilanRef = useTemplateRef('langkahKesembilanRef')
const langkahKesembilanIndex = ref(0)

function onSelectLangkahKesembilan(index: number) {
    langkahKesembilanIndex.value = index
}

function scrollPrevLangkahKesembilan() {
    langkahKesembilanRef.value?.emblaApi?.scrollPrev()
}

function scrollNextLangkahKesembilan() {
    langkahKesembilanRef.value?.emblaApi?.scrollNext()
}

const langkahKesembilanItems = [
    {
        id: 1,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/image_1.png',
        title: 'Berdoa',
        description: 'Mohon Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa memberkati dan melindungi saya XXX, memberikan saya kesehatan, keselamatan dan keberuntungan',
        note: ''
    },
    {
        id: 2,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/image_1.png',
        title: 'Berikrar',
        description: 'Saya XXX berikrar kepada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa untuk...',
        note: 'Contohnya: bervegetarian penuh dan lainnya'
    }
]

// Langkah Kesepuluh Carousel
const langkahKesepuluhRef = useTemplateRef('langkahKesepuluhRef')
const langkahKesepuluhIndex = ref(0)

function onSelectLangkahKesepuluh(index: number) {
    langkahKesepuluhIndex.value = index
}

function scrollPrevLangkahKesepuluh() {
    langkahKesepuluhRef.value?.emblaApi?.scrollPrev()
}

function scrollNextLangkahKesepuluh() {
    langkahKesepuluhRef.value?.emblaApi?.scrollNext()
}

const langkahKesepuluhItems = [
    {
        id: 1,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/image_1.png',
        title: 'Membaca Paritta',
        description: '',
        note: ''
    },
    {
        id: 2,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/langkah_kesepuluh_2.png',
        title: 'Da Bei Zhou',
        description: 'Baca minimal 3x',
        note: ''
    },
    {
        id: 3,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/langkah_kesepuluh_3.png',
        title: 'Xin Jing',
        description: 'Baca minimal 3x',
        note: ''
    },
    {
        id: 4,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/langkah_kesepuluh_4.png',
        title: 'Wang Sheng Jing Tu Shen Zhou',
        description: 'Baca minimal 21x',
        note: ''
    },
    {
        id: 5,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/langkah_kesepuluh_5.png',
        title: 'Qi Fo Mie Zui Zhen Yan',
        description: 'Baca minimal 21x',
        note: ''
    },
    {
        id: 6,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/langkah_kesepuluh_6.png',
        title: 'Zhun Ti Shen Zhou',
        description: 'Baca minimal 21x',
        note: ''
    },
    {
        id: 7,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/langkah_kesepuluh_7.png',
        title: 'Xiao Zai Ji Xiang Shen Zhou',
        description: 'Baca minimal 21x',
        note: ''
    },
    {
        id: 8,
        image: 'https://masterluindonesia.com/assets/assets/images/sembayang/langkah_kesepuluh_8.png',
        title: 'Li Fo Da Chan Hui Wen',
        description: 'Baca minimal 1x',
        note: ''
    }
]
</script>
