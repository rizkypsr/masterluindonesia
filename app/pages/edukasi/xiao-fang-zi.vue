<template>
    <div class="h-screen flex flex-col bg-linear-to-r from-[#f3ebd9] to-[#fbfaf9] dark:from-gray-900 dark:to-gray-800">
        <!-- Header (Fixed) -->
        <div
            class="flex items-center justify-between px-4 py-3 border-b border-[#e8d5b0] dark:border-gray-700 shrink-0 bg-transparent">
            <BackButton to="/?tab=edukasi" />
            <span class="text-lg text-gray-600 dark:text-gray-400">Xiao Fang Zi</span>
            <button @click="isMenuOpen = true" class="p-1">
                <Icon name="heroicons:bars-3" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
        </div>

        <!-- Slideover Menu -->
        <USlideover v-model:open="isMenuOpen" side="bottom">
            <template #content>
                <div class="p-4 bg-white dark:bg-gray-800 max-h-[50vh] flex flex-col">
                    <!-- Handle bar -->
                    <div class="flex justify-center mb-4 shrink-0">
                        <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>

                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 shrink-0">DAFTAR MENU</h3>

                    <div class="space-y-4 overflow-y-auto flex-1">
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
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">Panduan</h1>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">Pembacaan</h1>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Xiao Fang Zi</h1>

            <!-- Hero Image -->
            <div class="mb-8">
                <img src="https://masterluindonesia.com/assets/assets/images/xfz/xfz-2.png" alt="Xiao Fang Zi"
                    class="w-full object-contain rounded-lg" />
            </div>

            <!-- Section 1: Apa itu Xiao Fang Zi -->
            <div id="apa-itu-xfz" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Apa itu Xiao Fang Zi?</h2>

                <div class="space-y-0">
                    <div v-for="item in apaItuXfzItems" :key="item"
                        class="py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <p class="text-black text-xl dark:text-white">{{ item }}</p>
                    </div>
                </div>
            </div>

            <!-- Section 2: Perlengkapan Wajib -->
            <div id="perlengkapan-wajib" class="mb-8">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Perlengkapan Wajib Xiao Fang Zi?</h2>

                <div class="relative dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 min-h-150">
                    <!-- Xiao Fang Zi Paper - Left -->
                    <div class="absolute left-4 top-8 w-40">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/xfz_full.png"
                            alt="Xiao Fang Zi" class="w-full object-contain drop-shadow-lg" />
                        <button @click="showPerlengkapanDetail('xfz')"
                            class="absolute -bottom-2 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Counter - Right Top -->
                    <div class="absolute right-8 top-4 w-20">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/counter.png" alt="Counter"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showPerlengkapanDetail('counter')"
                            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Kain Merah - Right Middle -->
                    <div class="absolute right-6 top-36 w-24">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/kain.png" alt="Kain Merah"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showPerlengkapanDetail('kain')"
                            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Pena Merah - Left Middle -->
                    <div class="absolute left-4 top-72 w-28">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/pen_full.png" alt="Pena Merah"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showPerlengkapanDetail('pena-merah')"
                            class="absolute top-10 left-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Pena Hitam - Right Middle -->
                    <div class="absolute right-8 top-64 w-24">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/black_pen.png" alt="Pena Hitam"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showPerlengkapanDetail('pena-hitam')"
                            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Amplop - Left Bottom -->
                    <div class="absolute left-8 top-96 w-28">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/amplop.png" alt="Amplop"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showPerlengkapanDetail('amplop')"
                            class="absolute -bottom-2 left-4 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Buku - Right Bottom -->
                    <div class="absolute right-4 bottom-8 w-28">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/book.png" alt="Buku Paritta"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showPerlengkapanDetail('buku')"
                            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal for Perlengkapan Detail -->
            <UModal v-model:open="isPerlengkapanModalOpen">
                <template #content>
                    <div class="p-6 bg-white dark:bg-gray-800">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedPerlengkapan?.title
                                }}</h3>
                            <button @click="isPerlengkapanModalOpen = false" class="p-1">
                                <Icon name="heroicons:x-mark" class="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <img :src="selectedPerlengkapan?.image" :alt="selectedPerlengkapan?.title"
                            class="w-32 h-32 object-contain mx-auto mb-4" />
                        <p class="text-gray-700 dark:text-gray-300 text-center">{{ selectedPerlengkapan?.description }}
                        </p>
                    </div>
                </template>
            </UModal>

            <!-- Section 3: Persyaratan Membaca -->
            <div id="persyaratan" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Persyaratan Membaca Xiao Fang Zi</h2>

                <div class="space-y-0">
                    <div v-for="item in persyaratanItems" :key="item"
                        class="py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <p class="text-black text-xl dark:text-white">{{ item }}</p>
                    </div>
                </div>
            </div>

            <!-- Section 4: Bagian Bacaan -->
            <div id="bagian-bacaan" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Bagian Bacaan di Xiao Fang Zi</h2>

                <img src="https://masterluindonesia.com/assets/assets/images/xfz/bagian_baca_xfz.png"
                    alt="Bagian Bacaan" class="w-full object-contain rounded-lg mb-4" />
                <div class="px-2 space-y-2">
                    <div class="flex items-start gap-2">
                        <span class="font-bold text-gray-900 dark:text-white">Da Bei Zhou:</span>
                        <span class="text-gray-700 dark:text-gray-300">27 titik, Dibaca 27 kali</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-bold text-gray-900 dark:text-white">Xin Jing:</span>
                        <span class="text-gray-700 dark:text-gray-300">49 titik, Dibaca 49 kali</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-bold text-gray-900 dark:text-white">Wang Sheng Zhou:</span>
                        <span class="text-gray-700 dark:text-gray-300">84 titik, Dibaca 84 kali</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-bold text-gray-900 dark:text-white">Qi Fo Mie Zui Zhen Yan:</span>
                        <span class="text-gray-700 dark:text-gray-300">87 titik, Dibaca 87 kali</span>
                    </div>
                </div>
            </div>

            <!-- Section 5: Tempat Membaca -->
            <div id="tempat-membaca" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Tempat Membaca Xiao Fang Zi</h2>

                <div class="space-y-6">
                    <!-- Item 1: Clock -->
                    <div class="space-y-2">
                        <Icon name="heroicons:clock" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-lg dark:text-white">Da Bei Zhou dan Qi Fo Mie Zui Zhen Yan boleh
                            dibaca dari
                            jam 05.00 sampai 00.00</p>
                    </div>

                    <!-- Item 2: Cloud/Weather -->
                    <div class="space-y-2">
                        <Icon name="heroicons:cloud" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-lg dark:text-white">Xin Jing dan Wang Sheng Zhou boleh dibaca di pagi,
                            siang,
                            cuaca cerah dan sebelum jam 22.00</p>

                        <!-- Note box -->
                        <div class="bg-[#f5e6c8] dark:bg-yellow-900/30 rounded-lg p-4 mt-2">
                            <p class="text-gray-800 dark:text-gray-200">Catatan: Jika sudah menulis nama penerima di
                                XFZ, boleh
                                membaca Xin Jing dan Wang Sheng Zhou sampai jam 00.00 saat cuaca cerah</p>
                        </div>
                    </div>

                    <!-- Item 3: Thunder -->
                    <div class="space-y-2">
                        <Icon name="heroicons:bolt" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-lg dark:text-white">Saat ada petir hanya boleh membaca Da Bei Zhou</p>
                    </div>
                </div>
            </div>

            <!-- Section 6: Komponen di Xiao Fang Zi -->
            <div id="komponen-xfz" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Komponen di Xiao Fang Zi</h2>

                <div class="relative">
                    <img src="https://masterluindonesia.com/assets/assets/images/xfz/xfz_full.png"
                        alt="Komponen Xiao Fang Zi" class="w-full object-contain" />

                    <!-- Button: Jing Zeng (敬贈) - Right top -->
                    <button @click="showKomponenDetail('jing-zeng')"
                        class="absolute top-44 right-[8%] w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                        <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                    </button>

                    <!-- Button: Nama Penerima - Left middle -->
                    <button @click="showKomponenDetail('nama-penerima')"
                        class="absolute top-[42%] left-6 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                        <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                    </button>

                    <!-- Button: Nian (年) - Left bottom -->
                    <button @click="showKomponenDetail('nian')"
                        class="absolute top-[66%] left-3 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                        <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                    </button>

                    <!-- Button: Yue (月) - Left bottom -->
                    <button @click="showKomponenDetail('yue')"
                        class="absolute top-[76%] left-3 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                        <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                    </button>

                    <!-- Button: Ri (日) - Left bottom -->
                    <button @click="showKomponenDetail('ri')"
                        class="absolute top-[87%] left-3 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                        <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            <!-- Modal for Komponen Detail -->
            <UModal v-model:open="isKomponenModalOpen">
                <template #content>
                    <div class="p-6 bg-white dark:bg-gray-800">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedKomponen?.title }}
                            </h3>
                            <button @click="isKomponenModalOpen = false" class="p-1">
                                <Icon name="heroicons:x-mark" class="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <p class="text-gray-700 dark:text-gray-300">{{ selectedKomponen?.description }}</p>
                    </div>
                </template>
            </UModal>

            <!-- Section 7: Tempat Membaca XFZ (Larangan) -->
            <div id="larangan-tempat" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Tempat Membaca Xiao Fang Zi</h2>

                <div class="space-y-6">
                    <!-- Item 1: Toilet -->
                    <div class="space-y-2">
                        <Icon name="mdi:toilet" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-lg dark:text-white">Jangan membaca paritta di toilet, memasak non
                            vegetarian,
                            dan tempat kotor lainnya</p>
                    </div>

                    <!-- Item 2: Car/Travel -->
                    <div class="space-y-2">
                        <Icon name="mdi:car" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-lg dark:text-white">Saat berpergian ke luar kota, tempat terpencil,
                            mobil,
                            tempat bising, jangan membaca Xin Jing dan Wang Sheng Zhou di malam hari</p>
                    </div>

                    <!-- Item 3: Health -->
                    <div class="space-y-2">
                        <Icon name="mdi:emoticon-sick-outline" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-lg dark:text-white">Hentikan pembacaan Xin Jing dan Wang Sheng Zhou
                            jika
                            merasa sakit kepala, pusing dan tubuh tidak nyaman</p>
                    </div>

                    <!-- Item 4: Cemetery -->
                    <div class="space-y-2">
                        <Icon name="mdi:grave-stone" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-lg dark:text-white">Jangan membaca Xin Jing dan Wang Sheng Zhou di
                            kuburan,
                            krematorium, badai, hujan, petir, cuaca mendung, dan langit gelap</p>
                    </div>

                    <!-- Item 5: Hospital -->
                    <div class="space-y-2">
                        <Icon name="mdi:hospital-building" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-lg dark:text-white">Di rumah sakit boleh membaca semua paritta di
                            siang hari
                            dan hanya membaca Da Bei Zhou di malam hari</p>
                    </div>

                    <!-- Item 6: Calendar -->
                    <div class="space-y-2">
                        <Icon name="mdi:calendar-clock" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-lg dark:text-white">Satu lembar XFZ biasanya diselesaikan dalam 7
                            hari. Jika
                            bisa diisi dan diselesaikan lebih baik, maka hasil akan lebih baik</p>
                    </div>
                </div>
            </div>

            <!-- Section 8: Hal yang Perlu Diperhatikan -->
            <div id="hal-perhatikan" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Hal yang Perlu Diperhatikan</h2>

                <div class="space-y-0">
                    <div v-for="(item, index) in halPerhatikanItems" :key="index"
                        class="py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <p class="text-black text-lg dark:text-white">
                            <span class="font-bold">{{ index + 1 }}.</span> <span v-html="item"></span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 9: Cara Penulisan Nama -->
            <div id="penulisan-nama" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Cara Penulisan Nama Penerima</h2>

                <!-- Language Toggle -->
                <div class="flex justify-center mb-6">
                    <span class="text-lg text-gray-700 dark:text-gray-300">
                        Inggris &lt;-&gt; Mandarin
                    </span>
                </div>

                <!-- Carousel -->
                <UCarousel :items="penulisanNamaImages" :ui="{
                    item: 'basis-full'
                }" indicators class="w-full">
                    <template #default="{ item }">
                        <img :src="item.src" :alt="item.alt" class="w-full object-contain rounded-lg" />
                    </template>
                </UCarousel>

                <!-- Keterangan -->
                <div class="space-y-0 mt-6">
                    <div v-for="(item, index) in penulisanNamaItems" :key="index"
                        class="py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <p class="text-black text-lg dark:text-white">
                            <span
                                class="inline-flex items-center justify-center w-6 h-6 bg-red-600 text-white text-lg font-bold rounded mr-2">{{
                                    index + 1 }}</span>
                            {{ item }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 10: Langkah-Langkah Mengisi XFZ -->
            <div id="langkah-mengisi" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Langkah - Langkah Mengisi XFZ</h2>

                <!-- Step indicator and navigation -->
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="font-bold text-gray-900 dark:text-white">Langkah {{ currentLangkahIndex + 1
                        }}</span>
                        <span class="text-gray-500 dark:text-gray-400"> dari {{ langkahMengisiItems.length }}</span>
                    </div>
                    <div class="flex gap-4">
                        <button @click="prevLangkah" :disabled="currentLangkahIndex === 0"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-left" class="w-6 h-6" />
                        </button>
                        <button @click="nextLangkah" :disabled="currentLangkahIndex === langkahMengisiItems.length - 1"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-right" class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Card Carousel -->
                <UCard v-if="langkahMengisiItems[currentLangkahIndex]"
                    class="border-0 shadow-xl bg-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <img :src="langkahMengisiItems[currentLangkahIndex]!.image"
                            :alt="langkahMengisiItems[currentLangkahIndex]!.title"
                            class="w-full h-64 object-contain mb-4" />
                    </div>
                    <div class="px-4 pb-6">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ langkahMengisiItems[currentLangkahIndex]!.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            {{ langkahMengisiItems[currentLangkahIndex]!.description }}
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- Section 11: Langkah-Langkah Membaca XFZ -->
            <div id="langkah-membaca" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Langkah - Langkah Membaca XFZ</h2>

                <!-- Step indicator and navigation -->
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="font-bold text-gray-900 dark:text-white">Langkah {{ currentMembacaIndex + 1
                        }}</span>
                        <span class="text-gray-500 dark:text-gray-400"> dari {{ langkahMembacaItems.length }}</span>
                    </div>
                    <div class="flex gap-4">
                        <button @click="prevMembaca" :disabled="currentMembacaIndex === 0"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-left" class="w-6 h-6" />
                        </button>
                        <button @click="nextMembaca" :disabled="currentMembacaIndex === langkahMembacaItems.length - 1"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-right" class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Card Carousel -->
                <UCard v-if="langkahMembacaItems[currentMembacaIndex]"
                    class="border-0 shadow-xl bg-linear-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <img :src="langkahMembacaItems[currentMembacaIndex]!.image"
                            :alt="langkahMembacaItems[currentMembacaIndex]!.title"
                            class="w-full h-64 object-contain mb-4" />
                    </div>
                    <div class="px-4 pb-6">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ langkahMembacaItems[currentMembacaIndex]!.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            {{ langkahMembacaItems[currentMembacaIndex]!.description }}
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- Section 12: Memberi Titik pada XFZ -->
            <div id="memberi-titik" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Memberi Titik pada XFZ</h2>

                <!-- Step indicator and navigation -->
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="font-bold text-gray-900 dark:text-white">Langkah {{ currentTitikIndex + 1 }}</span>
                        <span class="text-gray-500 dark:text-gray-400"> dari {{ langkahTitikItems.length }}</span>
                    </div>
                    <div class="flex gap-4">
                        <button @click="prevTitik" :disabled="currentTitikIndex === 0"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-left" class="w-6 h-6" />
                        </button>
                        <button @click="nextTitik" :disabled="currentTitikIndex === langkahTitikItems.length - 1"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-right" class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Card Carousel -->
                <UCard v-if="langkahTitikItems[currentTitikIndex]"
                    class="border-0 shadow-xl bg-linear-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <img :src="langkahTitikItems[currentTitikIndex]!.image"
                            :alt="langkahTitikItems[currentTitikIndex]!.title"
                            class="w-full h-64 object-contain mb-4" />
                    </div>
                    <div class="px-4 pb-6">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ langkahTitikItems[currentTitikIndex]!.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            {{ langkahTitikItems[currentTitikIndex]!.description }}
                        </p>
                        <p v-if="langkahTitikItems[currentTitikIndex]!.note"
                            class="text-gray-500 dark:text-gray-500 mt-2 text-lg">
                            {{ langkahTitikItems[currentTitikIndex]!.note }}
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- Section 13: Cara Penanganan XFZ yang salah Tulis -->
            <div id="penanganan-salah" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Cara Penanganan XFZ yang salah Tulis</h2>

                <!-- Step indicator and navigation -->
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="font-bold text-gray-900 dark:text-white">Langkah {{ currentSalahIndex + 1 }}</span>
                        <span class="text-gray-500 dark:text-gray-400"> dari {{ langkahSalahItems.length }}</span>
                    </div>
                    <div class="flex gap-4">
                        <button @click="prevSalah" :disabled="currentSalahIndex === 0"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-left" class="w-6 h-6" />
                        </button>
                        <button @click="nextSalah" :disabled="currentSalahIndex === langkahSalahItems.length - 1"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-right" class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Card Carousel -->
                <UCard v-if="langkahSalahItems[currentSalahIndex]"
                    class="border-0 shadow-xl bg-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <img :src="langkahSalahItems[currentSalahIndex]!.image"
                            :alt="langkahSalahItems[currentSalahIndex]!.title"
                            class="w-full h-64 object-contain mb-4" />
                    </div>
                    <div class="px-4 pb-6">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ langkahSalahItems[currentSalahIndex]!.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            {{ langkahSalahItems[currentSalahIndex]!.description }}
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- Section 14: Perlengkapan Membakar XFZ -->
            <div id="perlengkapan-bakar" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Perlengkapan Membakar XFZ</h2>

                <div class="relative dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 min-h-175">
                    <!-- Piring - Left Top -->
                    <div class="absolute left-8 top-8 w-28">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/ic_piring.png" alt="Piring"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showBakarDetail('piring')"
                            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Penjepit - Right Top -->
                    <div class="absolute right-12 top-12 w-24">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/ic_pinset.png" alt="Penjepit"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showBakarDetail('pinset')"
                            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Tisu - Right -->
                    <div class="absolute right-8 top-36 w-28">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/ic_tissue.png" alt="Tisu"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showBakarDetail('tisu')"
                            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Kain Merah - Left -->
                    <div class="absolute left-4 top-52 w-28">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/ic_kain_merah_tools.png"
                            alt="Kain Merah" class="w-full object-contain drop-shadow-lg" />
                        <button @click="showBakarDetail('kain-bakar')"
                            class="absolute -bottom-2 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Amplop Putih - Right Middle -->
                    <div class="absolute right-8 top-72 w-24">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/ic_amplop_putih.png"
                            alt="Amplop Putih" class="w-full object-contain drop-shadow-lg" />
                        <button @click="showBakarDetail('amplop-putih')"
                            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Korek Api - Center -->
                    <div class="absolute right-8 top-96 w-32">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/ic_korek.png" alt="Korek Api"
                            class="w-full object-contain drop-shadow-lg" />
                        <button @click="showBakarDetail('korek')"
                            class="absolute -bottom-2 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <!-- Meja Kecil - Bottom -->
                    <div class="absolute left-4 bottom-32 w-36">
                        <img src="https://masterluindonesia.com/assets/assets/images/xfz/ic_meja_kayu.png"
                            alt="Meja Kecil" class="w-full object-contain drop-shadow-lg" />
                        <button @click="showBakarDetail('meja')"
                            class="absolute -bottom-3 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="heroicons:plus" class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal for Perlengkapan Bakar Detail -->
            <UModal v-model:open="isBakarModalOpen">
                <template #content>
                    <div class="p-6 bg-white dark:bg-gray-800">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedBakar?.title }}</h3>
                            <button @click="isBakarModalOpen = false" class="p-1">
                                <Icon name="heroicons:x-mark" class="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <img :src="selectedBakar?.image" :alt="selectedBakar?.title"
                            class="w-32 h-32 object-contain mx-auto mb-4" />
                        <p class="text-gray-700 dark:text-gray-300 text-center">{{ selectedBakar?.description }}</p>
                    </div>
                </template>
            </UModal>

            <!-- Section 15: Waktu Membakar XFZ -->
            <div id="waktu-bakar" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Waktu Membakar Xiao Fang Zi</h2>

                <div class="grid grid-cols-2 gap-6">
                    <!-- Item 1: Best Time -->
                    <div class="space-y-2">
                        <Icon name="heroicons:clock" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-base dark:text-white">Paling baik membakar di jam 08.00 atau 16.00</p>
                    </div>

                    <!-- Item 2: Other Time -->
                    <div class="space-y-2">
                        <Icon name="heroicons:clock" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-base dark:text-white">Waktu lainnya adalah membakar setelah jam 05.00
                            sampai
                            sebelum langit gelap di cuaca cerah</p>
                    </div>

                    <!-- Item 3: Rain/Cloudy -->
                    <div class="space-y-2">
                        <Icon name="mdi:weather-cloudy" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-base dark:text-white">Jangan membakar XFZ saat hujan atau mendung
                            kecuali
                            memiliki Altar besar</p>
                    </div>

                    <!-- Item 4: Night -->
                    <div class="space-y-2">
                        <Icon name="mdi:weather-night-partly-cloudy" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-base dark:text-white">Jangan membakar XFZ saat langit gelap atau malam
                            hari,
                            kecuali dalam keadaan tertentu seperti arwah penagih utang karma mendesak atau sakit kritis
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 16: Tempat Membakar XFZ -->
            <div id="tempat-bakar" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Tempat Membakar Xiao Fang Zi</h2>

                <div class="space-y-4">
                    <!-- Item 1 -->
                    <div class="space-y-2">
                        <Icon name="mdi:grill-outline" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-base dark:text-white">Membakar XFZ dengan piring dan kayu baru di
                            samping
                            altar</p>
                    </div>

                    <!-- Item 2 -->
                    <div class="space-y-2">
                        <Icon name="mdi:table-furniture" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <p class="text-black text-base dark:text-white">Jangan meletakkan piring diatas meja Altar dan
                            langsung
                            di lantai</p>
                    </div>
                </div>
            </div>

            <!-- Section 17: Contoh Kertas XFZ yang Sudah Diisi -->
            <div id="contoh-xfz" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Contoh Kertas XFZ yang Sudah Diisi</h2>

                <UAccordion :items="contohXfzItems" :ui="{ label: 'text-xl' }">
                    <template #body="{ item }">
                        <div class="py-4">
                            <img :src="item.image" :alt="item.label" class="w-full object-contain rounded-lg" />
                        </div>
                    </template>
                </UAccordion>
            </div>

            <!-- Section 18: Membakar XFZ Tanpa Altar -->
            <div id="bakar-tanpa-altar" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Membakar XFZ Tanpa Altar</h2>

                <!-- Step indicator and navigation -->
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="font-bold text-gray-900 dark:text-white">Langkah {{ currentTanpaAltarIndex + 1
                            }}</span>
                        <span class="text-gray-500 dark:text-gray-400"> dari {{ langkahTanpaAltarItems.length }}</span>
                    </div>
                    <div class="flex gap-4">
                        <button @click="prevTanpaAltar" :disabled="currentTanpaAltarIndex === 0"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-left" class="w-6 h-6" />
                        </button>
                        <button @click="nextTanpaAltar"
                            :disabled="currentTanpaAltarIndex === langkahTanpaAltarItems.length - 1"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-right" class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Card Carousel -->
                <UCard v-if="langkahTanpaAltarItems[currentTanpaAltarIndex]"
                    class="border-0 shadow-xl bg-linear-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <img :src="langkahTanpaAltarItems[currentTanpaAltarIndex]!.image"
                            :alt="langkahTanpaAltarItems[currentTanpaAltarIndex]!.title"
                            class="w-full h-64 object-contain mb-4" />
                    </div>
                    <div class="px-4 pb-6">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ langkahTanpaAltarItems[currentTanpaAltarIndex]!.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            {{ langkahTanpaAltarItems[currentTanpaAltarIndex]!.description }}
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- Section 19: Membakar XFZ di Altar Kecil -->
            <div id="bakar-altar-kecil" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Membakar XFZ di Altar Kecil</h2>

                <!-- Step indicator and navigation -->
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="font-bold text-gray-900 dark:text-white">Langkah {{ currentAltarKecilIndex + 1
                            }}</span>
                        <span class="text-gray-500 dark:text-gray-400"> dari {{ langkahAltarKecilItems.length }}</span>
                    </div>
                    <div class="flex gap-4">
                        <button @click="prevAltarKecil" :disabled="currentAltarKecilIndex === 0"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-left" class="w-6 h-6" />
                        </button>
                        <button @click="nextAltarKecil"
                            :disabled="currentAltarKecilIndex === langkahAltarKecilItems.length - 1"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-right" class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Card Carousel -->
                <UCard v-if="langkahAltarKecilItems[currentAltarKecilIndex]"
                    class="border-0 shadow-xl bg-linear-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <img :src="langkahAltarKecilItems[currentAltarKecilIndex]!.image"
                            :alt="langkahAltarKecilItems[currentAltarKecilIndex]!.title"
                            class="w-full h-64 object-contain mb-4" />
                    </div>
                    <div class="px-4 pb-6">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ langkahAltarKecilItems[currentAltarKecilIndex]!.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            {{ langkahAltarKecilItems[currentAltarKecilIndex]!.description }}
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- Section 20: Membakar XFZ di Altar Besar -->
            <div id="bakar-altar-besar" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Membakar XFZ di Altar Besar</h2>

                <!-- Step indicator and navigation -->
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="font-bold text-gray-900 dark:text-white">Langkah {{ currentAltarBesarIndex + 1
                            }}</span>
                        <span class="text-gray-500 dark:text-gray-400"> dari {{ langkahAltarBesarItems.length }}</span>
                    </div>
                    <div class="flex gap-4">
                        <button @click="prevAltarBesar" :disabled="currentAltarBesarIndex === 0"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-left" class="w-6 h-6" />
                        </button>
                        <button @click="nextAltarBesar"
                            :disabled="currentAltarBesarIndex === langkahAltarBesarItems.length - 1"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-right" class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Card Carousel -->
                <UCard v-if="langkahAltarBesarItems[currentAltarBesarIndex]"
                    class="border-0 shadow-xl bg-linear-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <img :src="langkahAltarBesarItems[currentAltarBesarIndex]!.image"
                            :alt="langkahAltarBesarItems[currentAltarBesarIndex]!.title"
                            class="w-full h-64 object-contain mb-4" />
                    </div>
                    <div class="px-4 pb-6">
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ langkahAltarBesarItems[currentAltarBesarIndex]!.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            {{ langkahAltarBesarItems[currentAltarBesarIndex]!.description }}
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- Section 21: Permohonan Sebelum Membakar XFZ -->
            <div id="permohonan-bakar" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Permohonan Sebelum Membakar XFZ</h2>

                <UAccordion :items="permohonanBakarItems" :ui="{ label: 'text-xl' }">
                    <template #body="{ item }">
                        <div class="py-4 px-4 bg-[#e8d5b0] dark:bg-yellow-900/30 rounded-lg">
                            <p class="text-gray-800 dark:text-gray-200">{{ item.content }}</p>
                        </div>
                    </template>
                </UAccordion>
            </div>

            <!-- Section 22: Langkah-Langkah Membakar XFZ (Video) -->
            <div id="video-bakar" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Langkah-Langkah Membakar XFZ</h2>

                <div class="aspect-video rounded-xl overflow-hidden">
                    <iframe src="https://www.youtube.com/embed/R_Ny2NaiEP4" title="Langkah-Langkah Membakar XFZ"
                        class="w-full h-full" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>

            <!-- Section 23: Permohonan Setelah Membakar XFZ -->
            <div id="permohonan-setelah" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-4">Permohonan Setelah Membakar XFZ</h2>

                <!-- Step indicator and navigation -->
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="font-bold text-gray-900 dark:text-white">Langkah {{ currentSetelahBakarIndex + 1
                            }}</span>
                        <span class="text-gray-500 dark:text-gray-400"> dari {{ langkahSetelahBakarItems.length
                            }}</span>
                    </div>
                    <div class="flex gap-4">
                        <button @click="prevSetelahBakar" :disabled="currentSetelahBakarIndex === 0"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-left" class="w-6 h-6" />
                        </button>
                        <button @click="nextSetelahBakar"
                            :disabled="currentSetelahBakarIndex === langkahSetelahBakarItems.length - 1"
                            class="text-gray-700 dark:text-gray-300 disabled:opacity-30">
                            <Icon name="heroicons:arrow-right" class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Card Carousel -->
                <UCard v-if="langkahSetelahBakarItems[currentSetelahBakarIndex]"
                    class="border-0 shadow-xl bg-linear-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    <div class="p-4">
                        <img :src="langkahSetelahBakarItems[currentSetelahBakarIndex]!.image"
                            :alt="langkahSetelahBakarItems[currentSetelahBakarIndex]!.description"
                            class="w-full h-64 object-contain mb-4" />
                    </div>
                    <div class="px-4 pb-6">
                        <p class="text-gray-900 dark:text-white mb-2">
                            {{ langkahSetelahBakarItems[currentSetelahBakarIndex]!.description }}
                        </p>
                        <p class="text-gray-600 dark:text-gray-400">
                            {{ langkahSetelahBakarItems[currentSetelahBakarIndex]!.subdescription }}
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- Section 24: Penjelasan Dalam Video -->
            <div id="penjelasan-video" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Penjelasan Dalam Video</h2>

                <div class="aspect-video rounded-xl overflow-hidden">
                    <iframe src="https://www.youtube.com/embed/WehTxYyMTFg" title="Penjelasan Dalam Video"
                        class="w-full h-full" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>

            <!-- Section 25: Frequently Asked Question -->
            <div id="faq" class="mb-8">
                <h2 class="text-3xl font-bold dark:text-white mb-6">Frequently Asked Question</h2>

                <UAccordion :items="faqItems" :ui="{ label: 'text-lg' }">
                    <template #body="{ item }">
                        <div class="py-4 px-4 bg-[#e8d5b0] dark:bg-yellow-900/30 rounded-lg">
                            <div class="text-gray-800 dark:text-gray-200 faq- text-lg" v-html="item.content"></div>
                            <img v-if="item.image" :src="item.image" :alt="item.label" class="w-full object-contain rounded-lg mt-4" />
                            <p v-if="item.imageCaption" class="text-center text-lg text-black dark:text-gray-400 mt-2">{{ item.imageCaption }}</p>
                            <div v-if="item.contentAfterImage" class="text-gray-800 text-lg dark:text-gray-200 faq-content mt-4" v-html="item.contentAfterImage"></div>
                        </div>
                    </template>
                </UAccordion>
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
    { id: 'apa-itu-xfz', title: 'Apa itu Xiao Fang Zi?' },
    { id: 'perlengkapan-wajib', title: 'Perlengkapan Wajib' },
    { id: 'persyaratan', title: 'Persyaratan Membaca' },
    { id: 'bagian-bacaan', title: 'Bagian Bacaan' },
    { id: 'tempat-membaca', title: 'Waktu Membaca' },
    { id: 'komponen-xfz', title: 'Komponen XFZ' },
    { id: 'larangan-tempat', title: 'Tempat Membaca' },
    { id: 'hal-perhatikan', title: 'Hal Perlu Diperhatikan' },
    { id: 'penulisan-nama', title: 'Cara Penulisan Nama' },
    { id: 'langkah-mengisi', title: 'Langkah Mengisi XFZ' },
    { id: 'langkah-membaca', title: 'Langkah Membaca XFZ' },
    { id: 'memberi-titik', title: 'Memberi Titik XFZ' },
    { id: 'penanganan-salah', title: 'Penanganan XFZ Salah' },
    { id: 'perlengkapan-bakar', title: 'Perlengkapan Membakar' },
    { id: 'waktu-bakar', title: 'Waktu Membakar' },
    { id: 'tempat-bakar', title: 'Tempat Membakar' },
    { id: 'contoh-xfz', title: 'Contoh XFZ Diisi' },
    { id: 'bakar-tanpa-altar', title: 'Bakar Tanpa Altar' },
    { id: 'bakar-altar-kecil', title: 'Bakar di Altar Kecil' },
    { id: 'bakar-altar-besar', title: 'Bakar di Altar Besar' },
    { id: 'permohonan-bakar', title: 'Permohonan Sebelum Bakar' },
    { id: 'video-bakar', title: 'Video Membakar XFZ' },
    { id: 'permohonan-setelah', title: 'Permohonan Setelah Bakar' },
    { id: 'penjelasan-video', title: 'Penjelasan Dalam Video' },
    { id: 'faq', title: 'FAQ' }
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

// Perlengkapan Wajib Detail
const isPerlengkapanModalOpen = ref(false)
const selectedPerlengkapan = ref<{ title: string; image: string; description: string } | null>(null)

const perlengkapanWajibDetails: Record<string, { title: string; image: string; description: string }> = {
    'xfz': {
        title: 'Xiao Fang Zi',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/xfz_full.png',
        description: 'Kertas kuning khusus untuk mencatat bacaan paritta. Terdiri dari 4 kolom untuk Da Bei Zhou, Xin Jing, Wang Sheng Zhou, dan Qi Fo Mie Zui Zhen Yan.'
    },
    'counter': {
        title: 'Counter / Penghitung',
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

function showPerlengkapanDetail(key: string) {
    selectedPerlengkapan.value = perlengkapanWajibDetails[key] || null
    isPerlengkapanModalOpen.value = true
}

// Komponen XFZ Detail
const isKomponenModalOpen = ref(false)
const selectedKomponen = ref<{ title: string; description: string } | null>(null)

const komponenDetails: Record<string, { title: string; description: string }> = {
    'jing-zeng': {
        title: 'Nama Penerima',
        description: ''
    },
    'nama-penerima': {
        title: 'Nama Pembaca',
        description: ''
    },
    // 'zeng': {
    //     title: '贈 (Zeng)',
    //     description: 'Menandakan bahwa Xiao Fang Zi ini adalah pemberian/hadiah spiritual.'
    // },
    'nian': {
        title: 'Tahun',
        description: ''
    },
    'yue': {
        title: 'Bulan',
        description: ''
    },
    'ri': {
        title: 'Tanggal',
        description: ''
    }
}

function showKomponenDetail(key: string) {
    selectedKomponen.value = komponenDetails[key] || null
    isKomponenModalOpen.value = true
}

// Apa itu Xiao Fang Zi items
const apaItuXfzItems = [
    'Salah Satu Pusaka Guan Shi Yin Pu Sa',
    'Gabungan dari 4 Jenis Paritta Buddha',
    'Setara Dengan Cek Bernilai Tinggi',
    'Menghapus Karma Buruk',
    'Memperbaiki Kualitas Hidup',
    'Menyeberangkan Keluarga yang Sudah Meninggal',
    'Mengatasi Perselisihan Sosial dan Keluarga'
]

// Persyaratan Membaca Xiao Fang Zi items
const persyaratanItems = [
    'Menyelesaikan pembacaan PR sebelum memulai membaca Xiao Fang Zi',
    'Menjamin untuk memberikan Xiao Fang Zi kepada diri sendiri terlebih dulu baru membantu memberikan Xiao Fang Zi untuk orang lain',
    'Membaca Xiao Fang Zi dengan tulus untuk menjamin kualitas pembacaan',
    'Siapapun boleh membaca Xiao Fang Zi'
]

// Hal yang Perlu Diperhatikan items (with HTML for bold text)
const halPerhatikanItems = [
    'Hasil akan <strong>lebih baik</strong> jika bisa membaca beberapa kali <strong>Da Bei Zhou</strong> sebelum memulai membaca XFZ',
    '<strong>Urutan</strong> pembacaan paritta di dalam XFZ <strong>tidak dipermasalahkan</strong>',
    'Jangan membaca XFZ jika dalam keadaan <strong>tidak sehat</strong> atau <strong>gelisah</strong>, lalu perbanyak membaca <strong>Da Bei Zhou</strong>',
    'Pilih <strong>waktu</strong> dan <strong>tempat yang tenang</strong> di rumah',
    'Perlu membaca <strong>judul</strong> dan <strong>isi</strong> dari setiap jenis paritta',
    'Boleh membaca dengan <strong>mengeluarkan suara</strong> ataupun <strong>membaca di dalam hati</strong>'
]

// Penulisan Nama Carousel Images
const penulisanNamaImages = [
    { src: 'https://masterluindonesia.com/assets/assets/images/xfz/write_name_6_eng.jpeg', alt: 'Penulisan Nama (English)' },
    { src: 'https://masterluindonesia.com/assets/assets/images/xfz/write_name_6.jpeg', alt: 'Penulisan Nama (Mandarin)' }
]

const penulisanNamaItems = [
    'Untuk Diri Sendiri',
    'Untuk Almarhum',
    'Untuk Arwah Anak Keguguran',
    'Untuk Arwah Penunggu Rumah',
    'Untuk Menguraikan Ikatan Karma Buruk',
    'Untuk Cadangan'
]

// Langkah-Langkah Mengisi XFZ
const currentLangkahIndex = ref(0)

const langkahMengisiItems = [
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_kain_merah.png',
        title: 'Letakan Kain Merah',
        description: 'Letakan kain merah di atas meja untuk menjadi alas saat menulis di kertas Xiao Fang Zi'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_pen_left_big.png',
        title: 'Siapkan Pena Hitam',
        description: 'Gunakan pena hitam untuk menulis nama pembaca dan nama penerima'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/01-rev.gif',
        title: 'Tulis Nama Pembaca',
        description: 'Tulis nama pembaca dengan pena hitam di sebelah kiri kertas Xiao Fang Zi'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/02-rev.gif',
        title: 'Tulis Nama Penerima',
        description: 'Tulis nama penerima dengan pena hitam di sebelah kanan kertas Xiao Fang Zi'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/03-rev.gif',
        title: 'Masukkan Ke Amplop Merah',
        description: 'Masukkan kertas Xiao Fang Zi yang sudah diberi nama ke amplop merah'
    }
]

function prevLangkah() {
    if (currentLangkahIndex.value > 0) {
        currentLangkahIndex.value--
    }
}

function nextLangkah() {
    if (currentLangkahIndex.value < langkahMengisiItems.length - 1) {
        currentLangkahIndex.value++
    }
}

// Langkah-Langkah Membaca XFZ
const currentMembacaIndex = ref(0)

const langkahMembacaItems = [
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_image_pr.png',
        title: 'Membaca Pekerjaan Rumah',
        description: 'Membaca pekerjaan rumah terlebih dahulu sebelum membaca Xiao Fang Zi'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_wish.png',
        title: 'Ucapkan Permohonan',
        description: 'Memohon kepada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa menjadi saksi saya XXX ingin membaca Xiao Fang Zi'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_xiao_fang_zi.png',
        title: 'Membaca Xiao Fang Zi',
        description: 'Mulai membaca Xiao Fang Zi'
    }
]

function prevMembaca() {
    if (currentMembacaIndex.value > 0) {
        currentMembacaIndex.value--
    }
}

function nextMembaca() {
    if (currentMembacaIndex.value < langkahMembacaItems.length - 1) {
        currentMembacaIndex.value++
    }
}

// Langkah-Langkah Memberi Titik XFZ
const currentTitikIndex = ref(0)

const langkahTitikItems = [
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_kain_merah_tools.png',
        title: 'Letakkan Kain Merah',
        description: 'Letakan kain merah diatas meja untuk menjadi alas saat menulis di kertas Xiao Fang Zi'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_red_pen_big.png',
        title: 'Siapkan Spidol Merah',
        description: 'Gunakan spidol merah untuk memberi titik pada kertas Xiao Fang Zi'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/bonus-rev.gif',
        title: 'Beri Titik',
        description: 'Memberi titik dengan spidol merah diawali dari sisi bawah'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/04-rev.gif',
        title: 'Memberi Tanggal',
        description: 'Setelah selesai menitikkan SEMUA tulis tanggal sesuai kalendar masehi',
        note: 'Catatan: Boleh tulis tanggal di hari selesai atau di hari bakar'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/05-rev.gif',
        title: 'Masukkan Ke Amplop Merah',
        description: 'Masukkan kertas Xiao Fang Zi yang sudah diberi titik ke amplop merah'
    }
]

function prevTitik() {
    if (currentTitikIndex.value > 0) {
        currentTitikIndex.value--
    }
}

function nextTitik() {
    if (currentTitikIndex.value < langkahTitikItems.length - 1) {
        currentTitikIndex.value++
    }
}

// Langkah-Langkah Penanganan XFZ Salah Tulis
const currentSalahIndex = ref(0)

const langkahSalahItems = [
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_wish.png',
        title: 'Ucapkan Permohonan',
        description: 'Memohon kepada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa, saya XXX salah menulis Xiao Fang Zi ini, maka Xiao Fang Zi ini dianggap hangus'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/06-rev-1.gif',
        title: 'Pindahkan Titik',
        description: 'Memindahkan titik dari kertas XFZ yang salah ke kertas XFZ yang baru'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/07-rev.gif',
        title: 'Coret Nama',
        description: 'Coret kedua nama pembaca dan nama penerima dari kertas XFZ yang salah menggunakan pena hitam'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/08-rev.gif',
        title: 'Lipat Jadi Kecil',
        description: 'Lipat kertas XFZ yang telah dicoret menjadi kecil, sehingga muat dimasukkan ke dalam amplop putih'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/09-rev.gif',
        title: 'Bungkus Kertas XFZ',
        description: 'Bungkus kertas XFZ yang salah menggunakan amplop putih sebelum dibuang ke tong sampah'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/10-rev.gif',
        title: 'Buang ke Tong Sampah',
        description: 'Buang kertas XFZ yang sudah dibungkus amplop putih ke tong sampah'
    }
]

function prevSalah() {
    if (currentSalahIndex.value > 0) {
        currentSalahIndex.value--
    }
}

function nextSalah() {
    if (currentSalahIndex.value < langkahSalahItems.length - 1) {
        currentSalahIndex.value++
    }
}

// Perlengkapan Membakar XFZ Detail
const isBakarModalOpen = ref(false)
const selectedBakar = ref<{ title: string; image: string; description: string } | null>(null)

const perlengkapanBakarDetails: Record<string, { title: string; image: string; description: string }> = {
    'piring': {
        title: 'Piring Keramik',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_piring.png',
        description: 'Piring keramik atau porselen digunakan sebagai wadah untuk membakar Xiao Fang Zi. Pastikan piring tahan panas.'
    },
    'pinset': {
        title: 'Pinset',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_pinset.png',
        description: 'Pinset digunakan untuk memegang kertas Xiao Fang Zi saat dibakar agar tangan tidak terkena api.'
    },
    'tisu': {
        title: 'Tisu Putih',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_tissue.png',
        description: 'Tisu digunakan untuk membersihkan piring setelah selesai membakar Xiao Fang Zi.'
    },
    'kain-bakar': {
        title: 'Kain Merah',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_kain_merah_tools.png',
        description: 'Kain merah digunakan sebagai alas meja saat membakar Xiao Fang Zi untuk menunjukkan rasa hormat.'
    },
    'amplop-putih': {
        title: 'Amplop Putih',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_amplop_putih.png',
        description: 'Amplop putih digunakan untuk membungkus abu sisa pembakaran sebelum dibuang.'
    },
    'korek': {
        title: 'Pemantik/Korek Api',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_korek.png',
        description: 'Korek api gas panjang digunakan untuk menyalakan api saat membakar Xiao Fang Zi.'
    },
    'meja': {
        title: 'Meja/Papan Kayu',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_meja_kayu.png',
        description: 'Meja/Papan Kayu digunakan sebagai tempat untuk meletakkan perlengkapan membakar Xiao Fang Zi.'
    }
}

function showBakarDetail(key: string) {
    selectedBakar.value = perlengkapanBakarDetails[key] || null
    isBakarModalOpen.value = true
}

// Contoh XFZ yang Sudah Diisi
const contohXfzItems = [
    {
        label: 'Untuk Diri Sendiri',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_for_my_self.png'
    },
    {
        label: 'Untuk Almarhum',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_for_almarhum.png'
    },
    {
        label: 'Untuk Anak Keguguran',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_anak_keguguran.png'
    },
    {
        label: 'Untuk Menguraikan Ikatan Karma Buruk',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_bad_karma.png'
    },
    {
        label: 'Untuk Penunggu Rumah',
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_penunggu_rumah.png'
    }
]

// Langkah-Langkah Membakar XFZ Tanpa Altar
const currentTanpaAltarIndex = ref(0)

const langkahTanpaAltarItems = [
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ta1.png',
        title: 'Di Rumah',
        description: 'Jika Anda tidak memiliki altar di rumah, boleh membakar XFZ di balkon, dekat jendela ruang tamu, atau di halaman belakang'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ta2.png',
        title: 'Visualisasi Sembahyang',
        description: 'Membayangkan ada Rupang Pu Sa, Menyalakan minyak lalu dupa, Mengangkat dupa di atas dahi, pasang dupa di tempat dupa'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ta3.png',
        title: 'Baca XFZ',
        description: 'Baca Da Bei Zhou 1x dan Xin Jing 1x'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ta4.png',
        title: 'Angkat Kertas XFZ',
        description: 'Angkat kertas XFZ setinggi dahi'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ta5.png',
        title: 'Ucapkan Permohonan',
        description: 'Dengan hormat memohon kepada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa membantu saya XXX memberikan berapa lembar XFZ untuk YYY'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ta6.png',
        title: 'Sebelum Membakar',
        description: 'Saat membakar XFZ jangan mengatakan apapun maupun membaca paritta, cukup katakan "Dengan hormat memohon pada Da Ci Da Bei Guan Shi Yin Pu Sa berwelas asih"'
    }
]

function prevTanpaAltar() {
    if (currentTanpaAltarIndex.value > 0) {
        currentTanpaAltarIndex.value--
    }
}

function nextTanpaAltar() {
    if (currentTanpaAltarIndex.value < langkahTanpaAltarItems.length - 1) {
        currentTanpaAltarIndex.value++
    }
}

// Langkah-Langkah Membakar XFZ di Altar Kecil
const currentAltarKecilIndex = ref(0)

const langkahAltarKecilItems = [
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ak1.png',
        title: 'Altar Kecil',
        description: 'Siapkan dan rapikan altar kecil'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ak2.png',
        title: 'Sembahyang',
        description: 'Menyalakan dupa, kemudian mengangkat dupa di atas dahi. Pasang dupa di tempat dupa'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ak3.png',
        title: 'Baca XFZ',
        description: 'Baca Da Bei Zhou 1x dan Xin Jing 1x'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ak4.png',
        title: 'Angkat Kertas XFZ',
        description: 'Angkat kertas XFZ setinggi dahi'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ak5.png',
        title: 'Ucapkan Permohonan',
        description: 'Dengan hormat memohon kepada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa membantu saya XXX memberikan berapa lembar XFZ untuk YYY'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ak6.png',
        title: 'Sebelum Membakar',
        description: 'Saat membakar XFZ jangan mengatakan apapun maupun membaca paritta, cukup katakan "Dengan hormat memohon pada Da Ci Da Bei Guan Shi Yin Pu Sa berwelas asih"'
    }
]

function prevAltarKecil() {
    if (currentAltarKecilIndex.value > 0) {
        currentAltarKecilIndex.value--
    }
}

function nextAltarKecil() {
    if (currentAltarKecilIndex.value < langkahAltarKecilItems.length - 1) {
        currentAltarKecilIndex.value++
    }
}

// Langkah-Langkah Membakar XFZ di Altar Besar
const currentAltarBesarIndex = ref(0)

const langkahAltarBesarItems = [
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ab1.png',
        title: 'Altar Besar',
        description: 'Siapkan dan rapikan altar besar'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ab2.png',
        title: 'Sembahyang',
        description: 'Menyalakan dupa, kemudian mengangkat dupa di atas dahi. Pasang dupa di tempat dupa'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ab3.png',
        title: 'Ucapkan',
        description: '"Terima kasih Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa" sebanyak 3x'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ab4.png',
        title: 'Angkat Kertas XFZ',
        description: 'Angkat kertas XFZ setinggi dahi lalu letakkan di atas altar'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ab6.png',
        title: 'Letakkan XFZ di Atas Altar',
        description: 'Lihat contoh di gambar untuk cara memegang kertas XFZ'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ab3.png',
        title: 'Ucapkan Permohonan',
        description: 'Dengan hormat memohon kepada Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Mo He Sa membantu saya XXX memberikan berapa lembar XFZ untuk YYY'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ab5.png',
        title: 'Sebelum Membakar',
        description: 'Saat membakar XFZ jangan mengatakan apapun maupun membaca paritta, cukup katakan "Dengan hormat memohon pada Da Ci Da Bei Guan Shi Yin Pu Sa berwelas asih"'
    }
]

function prevAltarBesar() {
    if (currentAltarBesarIndex.value > 0) {
        currentAltarBesarIndex.value--
    }
}

function nextAltarBesar() {
    if (currentAltarBesarIndex.value < langkahAltarBesarItems.length - 1) {
        currentAltarBesarIndex.value++
    }
}

// Permohonan Sebelum Membakar XFZ
const permohonanBakarItems = [
    {
        label: 'Untuk Diri Sendiri',
        content: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Membantu memberikan berapa lembar XFZ untuk XXX De Yao Jing Zhe'
    },
    {
        label: 'Untuk Orang Lain',
        content: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Membantu memberikan berapa lembar XFZ untuk XXX De Yao Jing Zhe'
    },
    {
        label: 'Untuk Almarhum',
        content: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Membantu memberikan berapa lembar XFZ untuk YYY'
    },
    {
        label: 'Untuk Anak Keguguran',
        content: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Membantu memberikan berapa lembar XFZ untuk XXX De Hai Zi'
    },
    {
        label: 'Untuk Menguraikan Ikatan Karma Buruk',
        content: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa Membantu memberikan berapa lembar XFZ untuk YYY, mohon membantu menguraikan ikatan antara XXX dengan YYY'
    }
]

// Permohonan Setelah Membakar XFZ
const currentSetelahBakarIndex = ref(0)

const langkahSetelahBakarItems = [
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ta21.png',
        description: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa',
        subdescription: 'Telah membantu saya memberikan berapa lembar Xiao Fang Zi untuk YYY'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ak3.png',
        description: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa',
        subdescription: 'Telah membantu saya memberikan berapa lembar Xiao Fang Zi untuk YYY'
    },
    {
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/ic_ta23.png',
        description: 'Memohon kepada Na Mo Da Ci Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa',
        subdescription: 'Telah membantu saya memberikan berapa lembar Xiao Fang Zi untuk YYY'
    }
]

function prevSetelahBakar() {
    if (currentSetelahBakarIndex.value > 0) {
        currentSetelahBakarIndex.value--
    }
}

function nextSetelahBakar() {
    if (currentSetelahBakarIndex.value < langkahSetelahBakarItems.length - 1) {
        currentSetelahBakarIndex.value++
    }
}

// FAQ Items
const faqItems = [
    {
        label: '1. Mengapa Xiao Fang Zi bisa mendoakan arwah asing ke alam yang lebih baik?',
        content: `<p>Xiao Fang Zi adalah pusaka yang diberikan Guan Shi Yin Pu Sa kepada manusia di periode akhir Dharma.</p>
<p class="mt-3">Empat paritta yang ada di dalam Xiao Fang Zi berasal dari kitab suci paritta agama Buddha dan Kumpulan Paritta Buddhist oleh Zhao Pu Chu, yaitu Da Bei Zhou, Xin Jing, Wang Sheng Zhou dan Qi Fo Mie Zui Zhen Yan.</p>
<p class="mt-3">Keempat rangkaian khusus memiliki kekuatan untuk mendoakan arwah ke alam yang lebih baik dan memiliki hasil yang akurat.</p>
<p class="mt-3">Praktik adalah satu-satunya cara untuk menguji kebenaran suatu teori.</p>
<p class="mt-3">Sudah tak terhitung berapa banyak penderita penyakit kronis dan penyakit mental setelah mempraktikkan tiga pusaka utama dari Xin Ling Fa Men adalah membaca paritta, berikrar, melepaskan makhluk hidup, dan melafalkan Xiao Fang Zi bisa sembuh dengan ajaib.</p>
<p class="mt-3">Paritta yang berbeda seperti obat yang berbeda, semuanya untuk menyadarkan dan menyelamatkan umat manusia, campuran obat yang berbeda akan memiliki khasiat pengobatan yang berbeda, seperti halnya empat rangkaian paritta dalam Xiao Fang Zi, adalah pusaka untuk mendoakan arwah-arwah ini juga baru diberikan Guan Shi Yin Pu Sa ke dunia di saat zaman akhir Dharma, agar kita semua bisa membina diri di rumah, tidak perlu menghabiskan uang sedikit pun untuk melakukan ritual untuk mendoakan arwah-arwah tersebut, menyelesaikan permasalahan pribadi, menghapus karma buruk, meningkatkan kesadaran spiritual.</p>
<p class="mt-3">Oleh karena itu, dilarang mengubah perpaduan dari keempat paritta ini selain dari yang sudah ditentukan.</p>`
    },
    {
        label: '2. Xiao Fang Zi sangat berharga, apakah setelah melafalkannya akan mengundang arwah asing yang lain?',
        content: `<p>Penagih hutang karma (yao jing zhe) tidak akan mendatangi kita bila tidak berjodoh atau kita tidak berhutang pada mereka.</p>
<p class="mt-3">Di Alam Akhirat juga berlaku peraturan dan hukum yang ketat, para arwah tidak bisa menagih hutang karma atau meminta paritta kepada setiap orang.</p>
<p class="mt-3">Bila memang berhutang, sudah seharusnya dilunasi, sekarang Guan Shi Yin Pu Sa sudah berwelas asih mengajarkan kita cara yang luar biasa ini, kita dapat membayar hutang karma dengan menggunakan Xiao Fang Zi, menghindarkan bencana dan mengubah nasib.</p>
<p class="mt-3">Jika tidak dilafalkan sekarang, maka hutang karma tersebut tetap harus dibayar di masa mendatang, seperti sakit, dilanda kesialan, tertabrak mobil dan sebagainya.</p>`
    },
    {
        label: '3. Apa hubungan PR harian dengan Xiao Fang Zi?',
        content: `<p>PR harian seperti biaya pengeluaran harian, sedangkan Xiao Fang Zi seperti tagihan hutang yang harus dibayarkan, paritta yang dilafalkan dalam PR harian tidak bisa dihitung ke dalam Xiao Fang Zi, harus mengucapkan permohonan yang berbeda dan membedakan jumlah paritta yang dilafalkan.</p>
<p class="mt-3">Melafalkan Xiao Fang Zi perlu didasari dengan (melafalkan) PR harian Xin Ling Fa Men.</p>
<p class="mt-3">Setelah melafalkan sebagian atau semua paritta di dalam PR harian baru melafalkan Xiao Fang Zi, hasilnya akan lebih baik.</p>`
    },
    {
        label: '4. Apakah boleh memohon untuk diri sendiri pada saat melafalkan Xiao Fang Zi?',
        content: `<p>Xiao Fang Zi yang dilafalkan untuk diberikan kepada penagih hutang karma atau arwah orang yang sudah meninggal, Xiao Fang Zi berfungsi untuk membayar hutang karma, maka dari itu paritta-paritta ini tidak boleh digunakan untuk memohon untuk kepentingan diri sendiri.</p>
<p class="mt-3">Jika saat melafalkan Xiao Fang Zi, apabila pemikiran atau niat memohon untuk kepentingan diri sendiri terlalu kuat, dan setelah selesai melafalkan tidak langsung membubuhkan titik merah ke dalam kertas Xiao Fang Zi, maka paritta-paritta yang dilafalkan mungkin saja akan terpakai oleh si pelafalkan paritta seperti paritta yang dilafalkan dalam PR harian.</p>
<p class="mt-3">Dengan kata lain, pada saat membubuhkan titik merah pada Xiao Fang Zi, energi dari paritta-paritta tersebut sudah habis terpakai, dan Xiao Fang Zi ini sudah tidak memiliki kekuatan lagi.</p>
<p class="mt-3">Ini juga merupakan salah satu sebab mengapa banyak teman se-Dharma yang meskipun sudah membakar banyak Xiao Fang Zi, tetapi tetap tidak terlihat hasilnya.</p>
<p class="mt-3">Oleh karena itu, pada saat melafalkan PR harian, jangan menitikkan paritta yang dilafalkan ke dalam Xiao Fang Zi, dan pada saat melafalkan Xiao Fang Zi jangan memohon untuk kepentingan diri sendiri.</p>`
    },
    {
        label: '5. Memakai nama yang mana untuk mengisi Xiao Fang Zi?',
        content: `<ul class="list-disc list-inside space-y-2">
<li>Harus memakai nama resmi asli, tidak boleh menggunakan nama panggilan atau nama samaran. Bagi para biksu atau biksuni boleh menggunakan gelar atau nama pentahbisan sendiri.</li>
<li>Jika biasanya sering menggunakan nama Mandarin dan Inggris atau kedua nama sudah dikukuhkan melalui ritual penyampaian nama, boleh menuliskan kedua nama (Mandarin dan Inggris) pada Xiao Fang Zi.</li>
</ul>`,
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/faq_5.png',
        imageCaption: '(Gambar 30 - Dua cara penulisan nama Mandarin dan Inggris yang dapat digunakan)',
        contentAfterImage: `<ul class="list-disc list-inside">
<li>Jika sebelumnya pernah mengganti nama, harus menggunakan nama yang sudah lama dipanggil (sudah melekat), sebaiknya melakukan ritual perubahan nama (perihal ritual perubahan nama, silakan membaca buku {Panduan Pengenalan Xin Ling Fa Men}, {Tanya Jawab Seputar Dharma})</li>
</ul>`
    },
    {
        label: '6. Bagaimana jika terhenti di tengah saat melafalkan paritta?',
        content: `<p>Jika muncul gangguan pada saat Anda melafalkan paritta, dan dalam keadaan belum selesai melafalkan satu paritta, maka Anda bisa melafalkan 1x <em>"Om lai mu suo he"</em>, dan setelah menyelesaikan urusan tersebut, lafalkan sekali lagi <em>"Om lai mu suo he"</em>, lalu Anda boleh langsung melanjutkan pelafalan yang belum selesai.</p>
<p class="mt-3">Jika paritta yang dilafalkan pendek, maka sebaiknya diulang dari awal.</p>
<p class="mt-3">Jika jeda waktu berhenti lebih dari 2 jam, maka paritta tersebut perlu diulang kembali dari awal.</p>`
    },
    {
        label: '7. Bagaimana urutan pelafalan Paritta dalam Xiao Fang Zi?',
        content: `<ul class="list-disc list-inside space-y-2">
<li>Pelafalan keempat jenis paritta di dalam Xiao Fang Zi boleh tidak berurutan.</li>
<li>Juga boleh menggunakan urutan di bawah ini:
  <ul class="list-none ml-4 mt-2 space-y-2">
    <li class="flex items-start"><span class="mr-2">○</span><span>Diawali dan diakhiri dengan Da Bei Zhou, sewaktu melafalkan paritta lain di tengah pelafalan diawali lagi dengan Da Bei Zhou.</span></li>
    <li class="flex items-start"><span class="mr-2">○</span><span>Contoh: 9x Da Bei Zhou → 3x Da Bei Zhou, 49x Xin Jing → 3x Da Bei Zhou, 84x Wang Sheng Zhou → 3x Da Bei Zhou, 87x Qi Fo Mie Zui Zhen Yan → 9x Da Bei Zhou.</span></li>
    <li class="flex items-start"><span class="mr-2">○</span><span>Dengan demikian, energi Xiao Fang Zi akan sangat kuat, dan ini seperti membungkus Xiao Fang Zi ini dengan Da Bei Zhou, untuk Xiao Fang Zi yang dilafalkan akan memiliki kekuatan lebih dan juga terlindungi.</span></li>
    <li class="flex items-start"><span class="mr-2">○</span><span>Contoh pelafalan di atas bukanlah acuan satu-satunya. Karena ada beberapa orang yang melafalkan beberapa lembar Xiao Fang Zi dalam waktu yang bersamaan, ada juga yang dibagi-bagi menjadi beberapa bagian untuk melafalkan satu lembar Xiao Fang Zi maka bisa diatur sesuai dengan keadaan masing-masing.</span></li>
    <li class="flex items-start"><span class="mr-2">○</span><span>Jika karena keterbatasan waktu dan tempat yang tidak memungkinkan sehingga tidak bisa mengikuti contoh di atas, maka tidak harus mengikutinya, asalkan dilafalkan dengan sungguh-sungguh sudah bagus.</span></li>
  </ul>
</li>
</ul>`
    },
    {
        label: '8. Satu lembar Xiao Fang Zi dilafalkan berapa lama?',
        content: `<p>Jumlah keseluruhan dari 4 jenis paritta yang ada di dalam satu lembar Xiao Fang Zi, tidak harus selesai dilafalkan dalam satu hari, tetapi sebaiknya juga jangan sampai tertunda terlalu lama.</p>`
    },
    {
        label: '9. Apakah boleh satu lembar Xiao Fang Zi dilafalkan oleh 2 orang?',
        content: `<p>Boleh saja 2 orang bersama-sama melafalkan 1 lembar Xiao Fang Zi, juga boleh keduanya membaca satu jenis paritta yang sama. Kedua orang yang melafalkan ini harus menuliskan sendiri namanya masing-masing di bagian kiri bagian nama pelafal, nama keduanya boleh ditulis tegak lurus.</p>
<p class="mt-3">Biasanya tidak disarankan untuk melafalkan seperti ini, jika tidak ada kondisi khusus, sebaiknya melafalkan Xiao Fang Zi sendiri-sendiri.</p>`,
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/faq_6.png',
        imageCaption: '(Gambar 31 - Xiao Fang Zi yang dilafal 2 orang, masing-masing harus tulis sendiri namanya di kertas Xiao Fang Zi)'
    },
    {
        label: '10. Adakah urutan pembubuhan titik merah pada Xiao Fang Zi?',
        content: `<ul class="list-disc list-inside space-y-2">
<li>Boleh membubuhkan titik merah dalam lingkaran pada kertas Xiao Fang Zi setiap kali selesai melafalkan satu kali paritta, juga bisa mengingat jumlah paritta yang dilafalkan lalu dititikkan sekaligus, atau setelah selesai melafalkan satu lembar Xiao Fang Zi baru membubuhkan titik merah.</li>
<li>Membubuhkan titik merah dimulai dari bawah ke atas, boleh dari salah satu jenis paritta dititikkan dahulu dari bawah ke atas, kemudian melanjutkan paritta yang lain dari bawah ke atas; juga boleh membubuhkan titik merah 4 jenis paritta secara bersamaan dari bawah ke atas.</li>
</ul>`
    },
    {
        label: '11. Apa yang harus diperhatikan pada saat membubuhkan titik merah Xiao Fang Zi?',
        content: `<p>Jangan sampai titik merah yang dititikkan keluar dari lingkaran, lingkaran tidak boleh dititik penuh, tidak boleh dicentang. Titik merah yang dititik paling sedikit memenuhi 50%-80% lingkaran, tidak boleh terlalu kecil.</p>`,
        image: 'https://masterluindonesia.com/assets/assets/images/xfz/faq_11.png',
        imageCaption: '(Gambar 32 - Berbagai contoh titik merah yang salah)'
    },
    {
        label: '12. Apakah bermimpi tentang suatu angka berhubungan dengan jumlah Xiao Fang Zi?',
        content: `<ul class="list-disc list-inside space-y-3">
<li>Jika di dalam mimpi muncul penagih hutang karma yang menagih paritta dan angka, maka biasanya angka yang muncul di dalam mimpi berhubungan dengan jumlah Xiao Fang Zi yang harus dilafalkan. Contohnya, bila ada orang asing yang mengatakan bahwa Anda berhutang padanya 30 Yuan, biasanya ini berarti Anda harus melafalkan 30 lembar Xiao Fang Zi untuk penagih hutang karma Anda sendiri. Jika muncul angka yang lebih besar seperti 18000, dengan kondisi Anda tidak bermimpi tentang suatu kejadian khusus, maka boleh hanya mengambil angka yang paling depan yaitu 18 lembar, jika angkanya terlalu besar seperti 3.600.000, maka bisa dihitung dengan 3.600.000 dibagi 30.000, hasilnya adalah 120 lembar Xiao Fang Zi, akan tetapi mungkin juga yang diminta 36 lembar atau 360 lembar. Bila Anda bermimpi mengenai suatu kejadian khusus, dan muncul angka yang sangat besar, maka angka ini mungkin adalah jumlah Xiao Fang Zi yang diminta, contohnya 30.000 Yuan, dalam kondisi tertentu ini berarti 30.000 lembar Xiao Fang Zi. (ditentukan berdasarkan keadaan dalam mimpi, contoh di atas hanya sebagai referensi.)</li>
<li>Oleh karena itu, hal ini tidak bisa disamakan, harus berdasarkan kejadian yang sebenarnya di dalam mimpi dan pertimbangan dengan dunia nyata, dan dirangkumkan kembali, misalnya jika seorang penderita penyakit kronis bermimpi 500 Yuan, berarti 500 lembar, akan tetapi jika orang yang kondisi biasa-biasa saja bermimpi 500 Yuan, mungkin berarti 50 lembar.</li>
<li>Seringkali kita tidak bisa menentukan jumlah yang tepat, maka sebaiknya melanjutkan melafalkan Xiao Fang Zi untuk penagih hutang karma sendiri, walaupun tidak bisa menafsirkan jumlah Xiao Fang Zi yang benar, tetapi bila Anda melafalkan Xiao Fang Zi terus-menerus maka cepat lambat juga bisa mendoakan arwah mereka ke alam yang lebih baik.</li>
</ul>`
    },
    {
        label: '13. Apakah boleh melafalkan Xiao Fang Zi sambil mengerjakan pekerjaan rumah tangga?',
        content: `<p>Saat melafalkan Xiao Fang Zi harus menjamin kualitasnya, jika saat mengerjakan pekerjaan rumah tangga sambil melafalkan Xiao Fang Zi, yang penting Anda bisa melafalkannya dengan tulus, serta dapat konsentrasi, jangan sampai salah melafal, maka berkah kebajikan dan hasil yang didapatkan sama baiknya.</p>
<p class="mt-3">Tetapi jika Anda tidak bisa memusatkan pikiran, sepenuhnya perhatian pada hal lain atau tidak bisa berkonsentrasi sama sekali, maka kualitas Xiao Fang Zi yang dilafalkan menjadi tidak bagus, sebaiknya melafalkan Xiao Fang Zi di tempat yang lebih tenang agar bisa memusatkan pikiran untuk melafalkan Xiao Fang Zi.</p>
<p class="mt-3">Jangan melafalkan paritta di toilet dan tempat-tempat kotor lainnya, atau di dapur saat memasak masakan non-vegetarian.</p>`
    },
    {
        label: '14. Bagi pemula yang baru melafalkan PR harian, apakah boleh langsung melafalkan Xiao Fang Zi?',
        content: `<p>Boleh. Jika sudah mulai melafalkan PR harian, boleh mulai melafalkan Xiao Fang Zi.</p>`
    },
    {
        label: '15. Bagaimana mengisi Xiao Fang Zi untuk rumah sewaan?',
        content: `<p>Di bagian penerima Xiao Fang Zi di sebelah kanan, ditulis: <strong>"XXX 房子的要经者"</strong>, (XXX adalah nama orang yang tinggal di dalam rumah tersebut).</p>`
    },
    {
        label: '16. Apakah boleh membubuhkan titik merah Xiao Fang Zi di rumah sakit?',
        content: `<p>Sebaiknya jangan melafalkan dan membubuhkan titik merah Xiao Fang Zi di tempat dengan medan aura yang kurang baik, setelah selesai melafalkan, sesampainya di rumah baru dititikkan.</p>
<p class="mt-3">Jika dalam keadaan terdesak, harus menginap di rumah sakit dalam waktu yang lama, harus menulis terlebih dahulu nama penerima di dalam Xiao Fang Zi, lalu melafalkannya di pagi atau siang hari, dan setelah selesai melafalkan langsung membubuhkan titik merah.</p>`
    },
    {
        label: '17. Bagaimana mengisi tanggal dalam Xiao Fang Zi?',
        content: `<p>Tanggal di pojok kiri bawah Xiao Fang Zi boleh diisi dengan tanggal membakar Xiao Fang Zi atau tanggal selesai melafalkan Xiao Fang Zi.</p>
<p class="mt-3">Penanggalan yang digunakan adalah penanggalan masehi, tidak boleh menggunakan penanggalan lunar.</p>`
    },
    {
        label: '18. Fenomena apa yang muncul pada saat membakar Xiao Fang Zi?',
        content: `<p>Warna abu setelah membakar Xiao Fang Zi, besar kecilnya api dan hal-hal lainnya mungkin berhubungan dengan warna kertas yang digunakan, arah angin dan sebagainya, jangan terlalu terpengaruh dengan hal-hal ini.</p>`
    },
    {
        label: '19. Apakah berguna jika melafalkan Xiao Fang Zi untuk orang yang tidak percaya?',
        content: `<p>Berguna, tetapi hasilnya tidak bagus.</p>
<p class="mt-3">Sebaiknya setiap hari melafalkan 7x Xin Jing atau lebih untuk orang yang tidak percaya, dan memohon Guan Shi Yin Pu Sa untuk memberkati dia, menumbuhkan kebijaksanaan dan membuka pikirannya supaya bisa percaya pada Ajaran Buddha Dharma dan melafalkan paritta secepatnya.</p>`
    },
    {
        label: '20. Hal-hal apa yang perlu diperhatikan pada saat membantu orang lain melafalkan Xiao Fang Zi?',
        content: `<ul class="list-disc list-inside space-y-3">
<li>Menolong diri sendiri dan orang lain, saat membantu orang lain melafalkan Xiao Fang Zi harus menanggung akibatnya, jika kekuatan sendiri tidak cukup, maka penagih hutang karma orang tersebut mungkin akan beralih ke diri Anda.</li>
<li>Seseorang yang memiliki kekuatan untuk membantu orang lain melafalkan Xiao Fang Zi, biasanya memiliki persyaratan berikut: jarang mimpi buruk; tidak sering merasa lelah atau lemas; memiliki masa depan yang lebih cerah atau lancar; kondisi kesehatan dan raut wajah bagus; sebaliknya, jika seseorang sering sakit, sering bermimpi buruk, mengalami banyak ketidaklancaran, aura yang tidak bagus, takut dingin ... Maka sebaiknya melafalkan Xiao Fang Zi untuk diri sendiri terlebih dahulu.</li>
<li>Jika benar-benar ingin membantu orang lain melafalkan Xiao Fang Zi, maka orang tersebut harus banyak melafalkan Da Bei Zhou. Sebaiknya dilafalkan dalam bentuk Xiao Fang Zi cadangan dan sebelum melafalkan Xiao Fang Zi memohon kepada Guan Shi Yin Pu Sa: <em>"Qing Da Ci Da Bei Guan Shi Yin Pu Sa bao you wo XXX, xian zai wo wei YYY nian ... zhang xiao fang zi, qi yu de xiao fang zi qing yao jing zhe zhao YYY ben ren."</em> (Arti: Dengan hormat memohon Guan Shi Yin Pu Sa memberkati saya XXX, sekarang saya akan melafalkan Xiao Fang Zi untuk YYY sejumlah .... lembar, bila tidak mencukupi silakan penagih hutang karma memintanya dari YYY). Dengan demikian dalam keadaan tertentu, Anda bisa mencegah arwah asing di tubuh orang tersebut mendatangi Anda. Pelafalan Xiao Fang Zi untuk orang lain harus disertai juga melafalkan Xiao Fang Zi untuk penagih hutang karma diri sendiri.</li>
</ul>`
    },
    {
        label: '21. Apakah boleh meminta orang lain untuk membantu melafalkan Xiao Fang Zi?',
        content: `<ul class="list-disc list-inside space-y-3">
<li>Xiao Fang Zi sebaiknya dilafalkan sendiri dengan sungguh-sungguh untuk membayar hutang karma sendiri, karena uang tidak dapat membeli jasa kebajikan.</li>
<li>Jika Xiao Fang Zi yang dilafalkan untuk membantu seseorang bermasalah, ini berarti berbohong kepada langit, bumi dan arwah asing, akan menerima hukuman yang berat, sekarang kami sudah mendapatkan beberapa laporan, yang menyatakan bahwa karena kualitas Xiao Fang Zi yang dilafalkan tidak bagus, maka setelah dibakar malah menyebabkan penyakit orang yang dibantu bertambah parah.</li>
<li>Jika dalam keadaan khusus dan memang sangat memerlukan bantuan untuk melafalkan Xiao Fang Zi, harus mencari orang yang dikenal baik dan bisa dipercaya.</li>
</ul>`
    },
    {
        label: '22. Penglihatan ibu saya kurang bagus, apakah saya boleh membantunya untuk membubuhkan titik merah dan membakarkan Xiao Fang Zi yang dilafalkannya?',
        content: `<p>Nama pelafal Xiao Fang Zi harus ditulis oleh si pelafal Xiao Fang Zi itu sendiri, jika tidak maka Xiao Fang Zi tersebut tidak akan berguna. Jika penglihatan ibu Anda kurang bagus, Anda bisa memegangi tangan ibu dan menuntunnya untuk mengisi nama pelafal Xiao Fang Zi, dengan demikian energi dia akan masuk ke dalam Xiao Fang Zi tersebut. Kemudian, Anda boleh membantunya untuk membubuhkan titik merah dan membakarkan Xiao Fang Zi yang dilafalkannya.</p>`
    },
    {
        label: '23. Anak perempuan saya menderita penyakit skizofrenia, bagaimana cara melafalkan dan membakar Xiao Fang Zi?',
        content: `<ul class="list-disc list-inside space-y-3">
<li>Menderita penyakit skizofrenia berarti memiliki karma buruk yang sangat berat, ada arwah yang kuat di tubuhnya, dan arwah tersebut mendapatkan ijin dari Alam Akhirat untuk mendatanginya, agar orang tersebut menerima balasan dari karma buruknya. Dalam kondisi seperti ini, selain melafalkan Xiao Fang Zi, juga perlu melafalkan Li Fo Da Chan Hui Wen untuk bertobat dan menyesali dengan sungguh-sungguh atas karma buruk yang pernah diperbuatnya.</li>
<li>Dalam beberapa keadaan, jika pada masa awal melafalkan dan membakar Xiao Fang Zi tiba-tiba penyakitnya kambuh, maka ada 2 kemungkinan: pertama, mungkin kualitas Xiao Fang Zi yang dilafalkan kurang baik, maka arwah di tubuhnya merasa tidak senang; yang kedua, jumlah Xiao Fang Zi yang dibakar jauh dari yang diminta, arwahnya jadi panik, mendesak. Oleh karena itu, biasanya penderita penyakit mental harus berikrar sendiri jumlah Xiao Fang Zi yang akan dilafalkan, contohnya 800 lembar, dan harus berjanji akan diselesaikan dalam jangka waktu tertentu, selain itu juga harus menjamin kualitas Xiao Fang Zi dan dilafalkan sesegera mungkin. Diimbangi dengan berikrar dan melepaskan makhluk hidup, setelah beberapa waktu, pasti keadaan penderita akan membaik, sudah ada banyak orang yang menderita penyakit mental selama puluhan tahun bisa sembuh total dengan melafalkan Xiao Fang Zi.</li>
</ul>`
    }
]
</script>
