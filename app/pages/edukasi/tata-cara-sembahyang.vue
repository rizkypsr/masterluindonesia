<template>
    <div class="h-screen bg-white dark:bg-gray-900 flex flex-col">
        <!-- Header (Fixed) -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <BackButton to="/?tab=edukasi" />
            <span class="text-lg text-gray-600 dark:text-gray-400">Tata Cara Sembahyang Setiap Hari</span>
            <button @click="isMenuOpen = true" class="p-1">
                <Icon name="heroicons:bars-3" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
        </div>

        <!-- Slideover Menu -->
        <USlideover v-model:open="isMenuOpen" side="bottom">
            <template #content>
                <div class="p-4 bg-white dark:bg-gray-800">
                    <!-- Handle bar -->
                    <div class="flex justify-center mb-4">
                        <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>

                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">DAFTAR MENU</h3>

                    <div class="space-y-4">
                        <button v-for="item in menuItems" :key="item.id" @click="scrollToSection(item.id)"
                            class="block text-gray-900 dark:text-white text-base py-2 hover:text-yellow-600 dark:hover:text-yellow-400 text-left w-full">
                            {{ item.title }}
                        </button>
                    </div>
                </div>
            </template>
        </USlideover>

        <!-- Content (Scrollable) -->
        <div ref="contentRef" class="flex-1 overflow-y-auto px-4 py-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Tata Cara Sembahyang</h1>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Bagi Yang Memiliki Altar</p>

            <!-- Hero Image -->
            <div class="mb-6">
                <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6"
                    alt="Tata Cara Sembahyang" class="w-full h-96 object-cover rounded-lg" />
            </div>

            <!-- Section 1: Langkah Pertama -->
            <div id="langkah-langkah" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Pertama</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_pertama.png?alt=media&token=aef7e12b-2b3a-409f-ac92-fe1193f32e5e"
                        alt="Cuci Tangan" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Cuci Tangan</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 2: Langkah Kedua -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Kedua</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_kedua.png?alt=media&token=04dbe340-5a72-41a8-903e-0e0724ad8038"
                        alt="Nyalakan Dupa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nyalakan dupa dengan api lampu
                            minyak
                        </h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 3: Langkah Ketiga -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Ketiga</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_ketiga_keempat.png?alt=media&token=600fecde-f726-4117-aabf-cc022527689e"
                        alt="Pegang Dupa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pegang dupa dengan kedua
                            tangan dan
                            angkat
                            dupa
                            setinggi dahi</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 4: Langkah Keempat -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Keempat</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_ketiga_keempat.png?alt=media&token=600fecde-f726-4117-aabf-cc022527689e"
                        alt="Ucapkan" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ucapkan:</h3>
                        <p class="text-gray-700 dark:text-gray-300">Saya XXX memberi hormat kepada ... Pu Sa</p>
                    </div>
                </UCard>
            </div>

            <!-- Section 5: Langkah Kelima -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Kelima</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_kelima.png?alt=media&token=89e67793-2420-47d2-8bb8-3ddfc1f8946b"
                        alt="Tancap Dupa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Tancap dupa dengan kedua tangan
                            ke
                            dalam tempat
                            dupa
                        </h3>
                        <p class="font-bold text-gray-900 dark:text-white mb-1">Catatan:</p>
                        <p class="text-gray-700 dark:text-gray-300 text-lg mb-3">Jika Anda memegang beberapa batang dupa
                            sekaligus, maka
                            Anda bisa
                            menancapkan dupa ke dalam tempat dupa dengan 1 tangan</p>
                        <p class="text-gray-700 dark:text-gray-300 text-lg">Jika menancapkan 3 batang dupa sekaligus,
                            tidak
                            perlu
                            menancapkan
                            secara terpisah</p>
                    </div>
                </UCard>
            </div>

            <!-- Section 6: Langkah Keenam (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Langkah Keenam</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Ucapkan</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKeenam()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button @click="scrollNextLangkahKeenam()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <UCarousel ref="langkahKeenamRef" v-slot="{ item }" :items="langkahKeenamItems"
                    :ui="{ item: 'basis-full' }" @select="onSelectLangkahKeenam">
                    <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                        <img :src="item.image" :alt="item.title" class="w-full h-96 object-cover rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
                            <p class="text-gray-700 dark:text-gray-300 text-lg mb-2">{{ item.description }}</p>
                            <p class="text-gray-500 dark:text-gray-400 text-lg">{{ item.note }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 7: Langkah Ketujuh (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Langkah Ketujuh</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Cara Bersembah sujud</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKetujuh()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button @click="scrollNextLangkahKetujuh()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <UCarousel ref="langkahKetujuhRef" v-slot="{ item }" :items="langkahKetujuhItems"
                    :ui="{ item: 'basis-full' }" @select="onSelectLangkahKetujuh">
                    <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                        <img :src="item.image" :alt="item.title" class="w-full h-96 object-cover rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
                            <p v-if="item.note" class="text-gray-500 dark:text-gray-400 text-lg">{{ item.note }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 8: Langkah Kedelapan -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Kedelapan</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6"
                        alt="Langkah Kedelapan" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Baca 1x Da Bei Zhou dan 1x Xin Jing
                        </h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 9: Langkah Kesembilan (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Langkah Kesembilan</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Berdoa atau berikrar</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKesembilan()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button @click="scrollNextLangkahKesembilan()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <UCarousel ref="langkahKesembilanRef" v-slot="{ item }" :items="langkahKesembilanItems"
                    :ui="{ item: 'basis-full' }" @select="onSelectLangkahKesembilan">
                    <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                        <img :src="item.image" :alt="item.title" class="w-full h-96 object-cover rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
                            <p class="text-gray-700 dark:text-gray-300 text-lg mb-2">{{ item.description }}</p>
                            <p v-if="item.note" class="text-gray-500 dark:text-gray-400 text-lg">{{ item.note }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 10: Langkah Kesepuluh (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Langkah Kesepuluh</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Membaca Paritta</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevLangkahKesepuluh()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button @click="scrollNextLangkahKesepuluh()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <UCarousel ref="langkahKesepuluhRef" v-slot="{ item }" :items="langkahKesepuluhItems"
                    :ui="{ item: 'basis-full' }" @select="onSelectLangkahKesepuluh">
                    <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                        <img :src="item.image" :alt="item.title" class="w-full h-96 object-cover rounded-lg mb-4" />
                        <div class="px-2">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
                            <p v-if="item.description" class="text-gray-700 dark:text-gray-300 text-lg mb-2">{{
                                item.description
                                }}</p>
                            <p v-if="item.note" class="text-gray-500 dark:text-gray-400 text-lg">{{ item.note }}</p>
                        </div>
                    </UCard>
                </UCarousel>
            </div>

            <!-- Section 11: Langkah Kesebelas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Kesebelas</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6"
                        alt="Langkah Kesebelas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Baca 7x Qi Fo Mie Zui Zhen Yan</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 12: Langkah Kedua Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Kedua Belas</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keduabelas.png?alt=media&token=14c8121f-901a-4151-a7d7-72b7dabbe905"
                        alt="Langkah Kedua Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Berdiri</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 13: Langkah Ketiga Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Ketiga Belas</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keduabelas.png?alt=media&token=14c8121f-901a-4151-a7d7-72b7dabbe905"
                        alt="Langkah Ketiga Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Bersikap Anjali</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 14: Langkah Keempat Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Keempat Belas</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keempatbelas.png?alt=media&token=c2abe6ad-cfa7-4144-b7e6-c9de55a49ffd"
                        alt="Langkah Keempat Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Memberikan hormat dengan
                            membungkukkan badan
                            sebanyak 1x atau 3x</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 15: Langkah Kelima Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Kelima Belas</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keduabelas.png?alt=media&token=14c8121f-901a-4151-a7d7-72b7dabbe905"
                        alt="Langkah Kelima Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Mundur selangkah</h3>
                    </div>
                </UCard>
            </div>

            <!-- Section 16: Langkah Enam Belas -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Langkah Enam Belas</h2>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl dark:bg-gray-800">
                    <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenambelas.png?alt=media&token=9bf71f70-b77d-4cda-90b4-887ac8f3ea97"
                        alt="Langkah Enam Belas" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Boleh pergi atau kembali melanjutkan
                            pembacaan paritta Anda.</h3>
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
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fbimbingan%2Fimage_1.png?alt=media&token=1ec51692-9daa-4ba7-af82-2b82f65e1e51',
        title: 'Mengucapkan Nama Buddha Bodhisattva',
        description: '',
        note: ''
    },
    {
        id: 2,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_2.png?alt=media&token=cd7b4b3d-54be-4adc-851f-507f3cd1b100',
        title: 'Gan En Na Mo Shi Jia Mou Ni Fo',
        description: 'Ucapkan 1x dilkuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 3,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_3.png?alt=media&token=ca818827-ca51-4ac5-89c7-b6a140c1c9b3',
        title: 'Gan En Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 4,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_4.png?alt=media&token=c858c06d-e919-494f-800a-48c4a991d99d',
        title: 'Gan En Na Mo Nan Jing Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 5,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_5.png?alt=media&token=fddc0a45-7b70-4786-9232-a9ccabf14dc8',
        title: 'Gan En Na Mo Tai Sui Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 6,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_6.png?alt=media&token=c8d7d7da-ed58-429b-a309-23910bd79925',
        title: 'Gan En Na Mo Guan Di Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 7,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_7.png?alt=media&token=cbe08b1c-4696-4107-aa31-a5c5f3a4dd29',
        title: 'Gan En Na Mo Zhou Cang Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 1x',
        note: ''
    },
    {
        id: 8,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_8.png?alt=media&token=5df7b44d-ce01-4683-a8f9-e7edcf05cea1',
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
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
        title: 'Merapatkan kedua telapak tangan (Anjali)',
        note: ''
    },
    {
        id: 2,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fsujud.gif?alt=media&token=ced8c560-235a-43fe-bf63-a6e1ead295a0',
        title: 'Bersujud membungkuk hingga dahi menyentuh alas sujud. Tidak perlu membalikkan telapak tangan ke atas',
        note: ''
    },
    {
        id: 3,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_ketujuh_2.png?alt=media&token=7d965b23-ae54-4160-83e7-bd6bf12c1c39',
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
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
        title: 'Berdoa',
        description: 'Mohon Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa memberkati dan melindungi saya XXX, memberikan saya kesehatan, keselamatan dan keberuntungan',
        note: ''
    },
    {
        id: 2,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
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
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Fimage_1.png?alt=media&token=8af4495a-5b22-4d74-a523-8c8999a185e6',
        title: 'Mengucapkan Nama Buddha Bodhisattva',
        description: '',
        note: ''
    },
    {
        id: 2,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_2.png?alt=media&token=cd7b4b3d-54be-4adc-851f-507f3cd1b100',
        title: 'Gan En Na Mo Shi Jia Mou Ni Fo',
        description: 'Ucapkan 3x diikuti dengan bersembah sujud',
        note: ''
    },
    {
        id: 3,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_3.png?alt=media&token=ca818827-ca51-4ac5-89c7-b6a140c1c9b3',
        title: 'Gan En Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa',
        description: 'Ucapkan 3x diikuti dengan bersembah sujud',
        note: ''
    },
    {
        id: 4,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_4.png?alt=media&token=c858c06d-e919-494f-800a-48c4a991d99d',
        title: 'Gan En Na Mo Nan Jing Pu. Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud',
        note: ''
    },
    {
        id: 5,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_5.png?alt=media&token=fddc0a45-7b70-4786-9232-a9ccabf14dc8',
        title: 'Gan En Na Mo Tai Sui Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 3x',
        note: ''
    },
    {
        id: 6,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_6.png?alt=media&token=c8d7d7da-ed58-429b-a309-23910bd79925',
        title: 'Gan En Na Mo Guan Di Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud',
        note: ''
    },
    {
        id: 7,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_7.png?alt=media&token=cbe08b1c-4696-4107-aa31-a5c5f3a4dd29',
        title: 'Gan En Na Mo Zhou Cang Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud 3x',
        note: ''
    },
    {
        id: 8,
        image: 'https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fsembayang%2Flangkah_keenam_8.png?alt=media&token=5df7b44d-ce01-4683-a8f9-e7edcf05cea1',
        title: 'Gan En Na Mo Guan Ping Pu Sa',
        description: 'Ucapkan 1x diikuti dengan bersembah sujud',
        note: ''
    }
]
</script>
