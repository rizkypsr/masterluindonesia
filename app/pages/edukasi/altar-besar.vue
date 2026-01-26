<template>
    <div class="h-screen bg-white dark:bg-gray-900 flex flex-col">
        <!-- Header (Fixed) -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <BackButton to="/?tab=edukasi" />
            <span class="text-lg text-gray-600 dark:text-gray-400">Altar Besar</span>
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
            <!-- Hero Image -->
            <div class="mb-6">
                <img src="https://masterluindonesia.com/assets/assets/images/altarbesar/image_1.png" alt="Altar Besar"
                    class="w-full h-96 object-cover rounded-lg" />
            </div>

            <!-- Section 1: Makna Altar Buddha -->
            <div id="makna-altar" class="mb-14">
                <h2 class="text-2xl font-semibold text-black dark:text-white mb-4">Makna Altar Buddha</h2>

                <div class="space-y-4 text-black dark:text-gray-300">
                    <p>Kita sendiri tinggal di rumah yang sebegitu luasnya, apakah kita tidak bisa menyediakan sedikit
                        ruang
                        untuk memasang altar bagi para Buddha dan Bodhisattva (Pu Sa)?</p>

                    <p>Apakah ini buktinya bahwa Anda sedang membina pikiran dengan baik? Hasil pembacaan paritta Anda
                        tentu
                        tidak akan bagus!</p>

                    <p>Bila Anda memiliki altar di rumah, bahkan Pu Sa sendiri mengatakan</p>

                    <p class="italic">"Cahaya dari puluhan ribu rumah".</p>

                    <p>Pu Sa mendatangi rumah Anda, namun Anda malah tidak bisa menyediakan tempat untuknya, padahal Pu
                        Sa
                        datang untuk memberkati Anda!</p>

                    <p>Sudah berapa banyak bantuan yang diberikan Pu Sa kepada Anda! Memasang altar Pu Sa itu untuk
                        kebaikan
                        Anda sendiri!</p>
                </div>
            </div>

            <!-- Section 2: Apa Keuntungan Memiliki Altar? -->
            <div id="keuntungan-altar" class="mb-12 text-black dark:text-gray-300">
                <h2 class="text-4xl font-semibold mb-4 dark:text-white">Apa Keuntungan Memiliki Altar?</h2>

                <div class="space-y-3">
                    <p
                        class="font-semibold text-xl border-b pb-8 text-gray-800 dark:text-gray-300 dark:border-gray-700">
                        Hasil
                        Pembacaan Paritta dan Berikrar
                        Menjadi
                        Jauh Lebih Baik</p>

                    <p
                        class="font-semibold text-xl border-b pb-8 text-gray-800 dark:text-gray-300 dark:border-gray-700">
                        Terasa
                        Berbeda Juga Sewaktu Bersembah
                        Sujud</p>

                    <p
                        class="font-semibold text-xl border-b pb-8 text-gray-800 dark:text-gray-300 dark:border-gray-700">
                        Daripada Memasang Dupa Hati
                        (Bervisualisasi),
                        Lebih Baik Memasang Dupa Asli.</p>

                    <p
                        class="font-semibold text-xl border-b pb-8 text-gray-800 dark:text-gray-300 dark:border-gray-700">
                        Boleh
                        Memasang Dupa Pertama Serta
                        Melafalkan
                        Paritta Semalaman pada Hari Raya Besar Tertentu</p>

                    <p
                        class="font-semibold text-xl border-b pb-8 text-gray-800 dark:text-gray-300 dark:border-gray-700">
                        Hasil
                        Dari Membakar Paritta Cadangan
                        dan Xiao
                        Fang Zi Akan Jauh Berkurang.</p>

                    <p
                        class="font-semibold text-xl border-b pb-8 text-gray-800 dark:text-gray-300 dark:border-gray-700">
                        Memasang Altar di Rumah dan Membantu
                        Orang Lain
                        Memasang Altar, Merupakan Pahala yang Sangat Besar</p>
                </div>
            </div>

            <!-- Section 3: Pengenalan Para Bodhisattva -->
            <div id="pengenalan-bodhisattva" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Pengenalan Para Bodhisattva</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-4">di dalam Xin Ling Fa Men</p>

                <!-- Buddha Sakyamuni -->
                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl mb-4">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_2.png"
                        alt="Buddha Sakyamuni" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Buddha Sakyamuni</h3>
                        <p class="text-gray-700 dark:text-gray-300 text-lg mb-2">Kita sendiri tinggal di dunia yang
                            sebegitu
                            luasnya,
                            apakah kita
                            tidak bisa menyediakan sedikit ruang untuk memasang altar bagi para Buddha dan Bodhisattva
                            (Pu Sa)?
                        </p>
                        <p class="text-gray-700 dark:text-gray-300 text-lg">Beliau bersaksi atas semua kita yang
                            bersedia,
                            dengan tekad
                            yang luhur
                            untuk mau dan siap untuk menyebarluaskan Buddha Sakyamuni.</p>
                    </div>
                </UCard>

                <!-- Guan Shi Yin Pu Sa -->
                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl mb-4">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_3.png"
                        alt="Guan Shi Yin Pu Sa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Guan Shi Yin Pu Sa</h3>
                        <p class="text-gray-700 dark:text-gray-300 text-lg mb-2">Guan Shi Yin Pu Sa Merupakan Maha
                            Mahakarya,
                            Maha-Jubilasi
                            Segala
                            Kemulyaan Esa Aneka Nusena di Dalam Nusantara.</p>
                        <p class="text-gray-700 dark:text-gray-300 text-lg">Dikenal dengan Nama Guan Shi Yin Pu Sa.</p>
                    </div>
                </UCard>

                <!-- Nan Jing Pu Sa -->
                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl mb-4">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_4.png"
                        alt="Nan Jing Pu Sa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Nan Jing Pu Sa</h3>
                        <p class="text-gray-700 dark:text-gray-300 text-lg">Nan Jing Pu Sa adalah Merupakan salah satu
                            Dewa
                            budaya Daoisme
                            Tiongkok
                            Buddhisme yang Keberadaannya Tinggi di Alam Langit, yang Bisa Memberikan Ketenangan Bersama
                            Keselamatan Hidup.</p>
                    </div>
                </UCard>

                <!-- Tai Sui Pu Sa -->
                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl mb-4">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_5.png"
                        alt="Tai Sui Pu Sa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Tai Sui Pu Sa</h3>
                        <p class="text-gray-700 dark:text-gray-300 text-lg">Tai Sui Pu Sa adalah Bodhisattva yang
                            Bertugas Untuk
                            Menjaga
                            Umur
                            Manusia. Bagi Mereka yang Sedang Dalam Tahun Tai Sui-nya, Bisa Memohon Doa Kepada Beliau.
                        </p>
                    </div>
                </UCard>

                <!-- Guan Di Pu Sa, Zhou Cang Pu Sa, Guan Ping Pu Sa -->
                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_6.png"
                        alt="Guan Di Pu Sa" class="w-full h-96 object-cover rounded-lg mb-4" />
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Guan Di Pu Sa, Zhou Cang Pu Sa,
                            Guan
                            Ping Pu Sa
                        </h3>
                        <p class="text-gray-700 dark:text-gray-300 text-lg">Guan Di Pu Sa Adalah Pelindung Dharma
                            Bodhisattva.
                            Tiap Hari
                            Dharma
                            Pelindung Mengawasi Kita Apakah Kita Melakukan Hal yang Baik atau Buruk, Semua Dicatat oleh
                            Beliau.
                        </p>
                    </div>
                </UCard>
            </div>

            <!-- Section 4: Hal-hal Penting dalam Penempatan Altar -->
            <div id="penempatan-altar" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Hal-hal Penting dalam</h2>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Penempatan Altar</h2>

                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_7.png"
                    alt="Penempatan Altar" class="w-full h-96 object-cover rounded-lg mb-4" />

                <div class="space-y-3 text-gray-700 dark:text-gray-300 text-lg">
                    <p><span class="font-bold">1.</span> Tidak boleh ditempatkan di dalam kamar tidur suami – istri</p>
                    <p><span class="font-bold">2.</span> Tidak boleh ditempatkan tepat di atas TV, kulkas dan lainnya,
                        atau
                        tepat di bawah AC.</p>
                    <p><span class="font-bold">3.</span> Tidak boleh berada dalam posisi menggantung</p>
                    <p><span class="font-bold">4.</span> Tidak boleh membelakangi jendela, altar harus bersandar pada
                        tembok</p>
                    <p><span class="font-bold">5.</span> Tidak boleh ditempatkan di balkon rumah yang menjorok keluar
                        dan tidak
                        berpijak ke tanah.</p>
                    <p><span class="font-bold">6.</span> Altar tidak boleh terlalu rendah juga tidak boleh terlalu
                        tinggi</p>
                    <p><span class="font-bold">7.</span> Bagian belakang altar tidak boleh dapur dan kamar mandi; altar
                        juga
                        tidak boleh menghadap ke dapur dan kamar mandi, paling bagus dijauhkan dari kedua tempat ini.
                    </p>
                    <p><span class="font-bold">8.</span> Jangan ditempatkan di pinggir tangga, juga jangan ditempatkan
                        di loteng
                        rumah (bagian miring di bawah atap yang dijadikan ruangan)</p>
                    <p><span class="font-bold">9.</span> Kamar tidur suami – istri tidak boleh berada di bagian
                        belakang, atas,
                        bawah altar.</p>
                    <p><span class="font-bold">10.</span> Di sekitar altar tidak boleh ada cermin.</p>
                    <p><span class="font-bold">11.</span> Jangan menempatkan altar di dalam garasi mobil.</p>
                    <p><span class="font-bold">12.</span> Bagian kepala dan kaki pengguna ranjang tidak boleh langsung
                        berhadapan dengan altar.</p>
                    <p><span class="font-bold">13.</span> Tidak boleh menempatkan rupang atau gambar Pu Sa di dalam rak
                        bertingkat.</p>
                    <p><span class="font-bold">14.</span> Di atas altar tidak boleh ada saluran pembuangan air kotor,
                        tulang
                        utama atap rumah, dan juga kamar mandi.</p>
                </div>
            </div>

            <!-- Section 5: Penataan Meja Altar -->
            <div id="penataan-altar" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Penataan Meja Altar</h2>

                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_8.png"
                    alt="Penataan Meja Altar" class="w-full h-96 object-cover rounded-lg mb-6" />

                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Gambar Pemandangan Altar</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Pilihan 1</p>
                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_9.png"
                    alt="Gambar Pemandangan Altar Pilihan 1" class="w-full h-96 object-cover rounded-lg mb-6" />

                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Gambar Pemandangan Altar</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Pilihan 2</p>
                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_10.png"
                    alt="Gambar Pemandangan Altar Pilihan 2" class="w-full h-96 object-cover rounded-lg mb-6" />

                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Peralatan Altar</h3>
                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_11.png"
                    alt="Peralatan Altar" class="w-full h-96 object-cover rounded-lg mb-6" />

                <!-- Tempat Dupa 1 -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Tempat Dupa</h3>
                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_12.png" alt="Tempat Dupa"
                    class="w-full rounded-lg mb-4" />
                <div class="space-y-3 text-gray-700 dark:text-gray-300 text-lg mb-6">
                    <p>Harus ada tempat dupa di atas Altar. Jika tidak ada tempat dupa, Pu Sa tidak akan datang dan
                        tidak bisa
                        disebut sebagai Altar.</p>
                    <p>Tempat dupa dari keramik lebih bagus untuk membakar dupa.</p>
                    <p>Tempat dupa tidak boleh bertuliskan paritta Xin Jing atau bergambar hewan langit, pilihan terbaik
                        adalah
                        tempat dupa tanpa tulisan</p>
                    <p>Jika bertuliskan "福 (fú) – keberuntungan" dan "寿(shòu) – panjang umur" maka itu bukan masalah
                        besar,
                        tulisan juga tidak masalah.</p>
                    <p>Jika kondisi tidak memungkinkan dan hanya bisa ada 1 tempat dupa, maka itu tidak mengapa.</p>
                    <p>Jika kondisinya memungkinkan, lebih baik jumlah tempat dupa disesuaikan dengan jumlah Pu Sa
                        sebagai tanda
                        penghormatan.</p>
                </div>

                <!-- Tempat Dupa 2 -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Tempat Dupa</h3>
                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_13.png" alt="Tempat Dupa"
                    class="w-full rounded-lg mb-4" />
                <div class="space-y-3 text-gray-700 dark:text-gray-300 text-lg mb-6">
                    <p>Harus menyembahyangi Altar dengan dupa, jika tidak Pu Sa tidak akan datang.</p>
                    <p>Jika tidak menyembahyangi Altar untuk waktu yang cukup lama, tidak hanya tidak hormat tapi juga
                        bisa
                        mengundang Arwah.</p>
                    <p>Gunakan dupa tanpa asap sebagai pilihan terbaik. Dupa cendana adalah untuk mengundang Guan Shi
                        Yin Pu Sa
                    </p>
                    <p>Jangan menggunakan dupa melingkar, atau jenis lainnya, karena beda jenis dupa, maka Pu Sa yang
                        datang
                        juga akan berbeda</p>
                    <p>Boleh sembahyang dengan 1 batang dupa atau 3 bareng dupa</p>
                    <p>3 batang dupa lebih hormat</p>
                    <p>Jangan menggunakan dupa yang sudah patah.</p>
                </div>

                <!-- Gelas Persembahan -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Gelas Persembahan</h3>
                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_14.png"
                    alt="Gelas Persembahan" class="w-fullrounded-lg mb-4" />
                <div class="space-y-3 text-gray-700 dark:text-gray-300 text-lg mb-6">
                    <p><span class="font-bold">Mempersembahkan air kepada Pu Sa, membuat pikiran kita bersih dan
                            tenang</span>
                    </p>
                    <p>Gelas persembahan paritta pada gelas tidak boleh menggunakan gelas kaca (tembus pandang)</p>
                    <p>Jangan ada tulisan paritta pada gelas persembahan tutupnya.</p>
                    <p>Tidak disarankan untuk memanaskan air Da Bei Shui dengan menggunakan microwave</p>
                </div>

                <!-- Lampu Minyak -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Lampu Minyak</h3>
                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_15.png"
                    alt="Lampu Minyak" class="w-full rounded-lg mb-4" />
                <div class="space-y-3 text-gray-700 dark:text-gray-300 text-lg mb-6">
                    <p><span class="font-bold">Mempersembahkan minyak kepada Pu Sa, membuat pendengaran dan penglihatan
                            menjadi
                            tajam, menumbuhkan kebijaksanaan</span></p>
                    <p>Minyak mentega yak tidak boleh dipersembahkan kepada Bodhisattva (Pu Sa)</p>
                    <p>Minyak untuk lampu minyak paling bagus menggunakan minyak sayur.</p>
                    <p>Minyak untuk lampu minyak paling bagus menggunakan yang encer.</p>
                    <p>Tidak disarankan untuk menyalakan lilin.</p>
                    <p>Minyak yang sudah dipersembahkan boleh digunakan untuk memasak makanan vegetarian.</p>
                </div>

                <!-- Buah Persembahan -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Buah Persembahan</h3>
                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_16.png"
                    alt="Buah Persembahan" class="w-full rounded-lg mb-4" />
                <div class="space-y-3 text-gray-700 dark:text-gray-300 text-lg mb-6">
                    <p><span class="font-bold">Sering mempersembahkan buah-buahan pada Bodhisattva (Pu Sa), bisa membuat
                            permohonan yang diinginkan segera terwujud.</span></p>
                    <p>Hindari mempersembahkan buah pir</p>
                    <p>Tidak boleh mempersembahkan buah-buahan kering pada Bodhisattva (Pu Sa)</p>
                    <p>Makanan vegetarian dan nasi tidak cocok untuk dipersembahkan kepada Buddha</p>
                    <p>Tidak boleh mempersembahkan buah-buahan palsu di altar.</p>
                    <p>Buah persembahan untuk leluhur tidak boleh dimakan.</p>
                    <p>Buah persembahan bila terjatuh ke lantai tidak boleh dipersembahkan lagi.</p>
                </div>

                <!-- Bunga Persembahan -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Bunga Persembahan</h3>
                <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_17.png"
                    alt="Bunga Persembahan" class="w-full rounded-lg mb-4" />
                <div class="space-y-3 text-gray-700 dark:text-gray-300 text-lg">
                    <p><span class="font-bold">Orang yang memiliki wajah yang baik berarti pernah membina dirinya di
                            kehidupan
                            sebelumnya, mempersembahkan bunga kepada Buddha, akan memiliki rupa yang baik.</span></p>
                    <p>Seringlah mempersembahkan bunga, akan membuat kultmu semakin lama semakin bersih, wajahmu akan
                        semakin
                        cantik.</p>
                    <p>Bambu keberuntungan atau bambu rejeki (dracaena sanderiana Sander) sangat bagus diletakkan di
                        meja altar.
                    </p>
                    <p>Bunga krisan, lili, anggrek dan daffodil boleh dipersembahkan di meja altar. Bunga mawar tidak
                        boleh
                        dipersembahkan di meja altar.</p>
                    <p>Bunga yang boleh dipersembahkan di altar bisa dilihat dari namanya, seperti bunga peach blossom
                        atau
                        morning gory tidak cocok untuk dipersembahkan di altar.</p>
                    <p>Selain itu, pot tanaman yang berisi tanah tidak boleh diletakkan di meja altar.</p>
                    <p>Bunga mahatari tidak boleh dipersembahkan untuk Bodhisattva (Pu Sa).</p>
                </div>
            </div>

            <!-- Section 6: Unduh -->
            <div id="unduh" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Contoh Gambar</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-4">*Download gambar di tab Beranda Unduh</p>

                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Tata Cara Mengundang Buddha Bodhisattva
                </h3>

                <UCard class="border-2 border-[#eedcb4] dark:border-gray-700 shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/altarbesar/image_19.png"
                        alt="Tata Cara Mengundang Buddha Bodhisattva" class="w-full h-96 object-cover rounded-lg" />
                </UCard>
            </div>

            <!-- Section 7: FAQ -->
            <div id="faq" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Question</h2>

                <UAccordion :items="faqItems" :ui="{ trigger: 'text-black dark:text-white text-lg' }">
                    <template #content="{ item }">
                        <p
                            class="text-black dark:text-gray-200 bg-[#edd9af] dark:bg-gray-700 px-4 py-3 rounded-2xl shadow-md text-lg">
                            {{ item.label }}
                        </p>
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
    { id: 'makna-altar', title: 'Makna Altar Buddha' },
    { id: 'keuntungan-altar', title: 'Apa Keuntungan Memiliki Altar?' },
    { id: 'pengenalan-bodhisattva', title: 'Pengenalan Para Bodhisattva' },
    { id: 'penempatan-altar', title: 'Hal-hal Penting dalam Penempatan Altar' },
    { id: 'penataan-altar', title: 'Penataan Meja Altar' },
    { id: 'unduh', title: 'Unduh' },
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

// FAQ Items
const faqItems = [
    {
        label: 'Permohonan saat membakar Xiao Fang Zi dan pembacaan paritta, apakah masih tetap memohon kepada Guan Shi Yin Pu Sa?',
        content: 'Tetap tidak berubah.'
    },
    {
        label: 'Permohonan pada saat melepaskan makhluk hidup (setelah sampai di tempat pelepasan makhluk hidup, pertama-tama menghadap langit dan menyebut “Gan en Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa”, kemudian melafalkan paritta dan mengucapkan permohonan pelepasan makhluk hidup), dan juga berikrar (“Mohon Guan Shi Yin Pu Sa yang Maha Welas Asih berwelas asih memberkati, saya XXX berikrar ...”), semuanya memohon kepada Guan Shi Yin Pu Sa, apakah tetap sama tidak berubah?',
        content: 'Tidak berubah'
    },
    {
        label: 'Setelah melafalkan paritta dan pada saat akhir berterima kasih, apakah boleh mengatakan “Gan en Na Mo Shi Jia Mou Ni Fo, Gan en Guan Shi Yin Pu Sa” – (terima kasih kepada Buddha Sakyamuni, terima kasih kepada Guan Shi Yin Pu Sa)?',
        content: 'Boleh.'
    },
    {
        label: 'Setelah melafalkan paritta dan para saat akhir berikrar kita buat, apakah boleh mengucapkan "Gan En Na Mo Shi Jia Mo Ni Fo, Gan En Na Mo Da Ci Da Bei Jiu Ku Jiu Nan Guang Da Ling Gan Guan Shi Yin Pu Sa" – Hormat kasih kepada Buddha Sakyamuni, hormat kasih kepada Guan Shi Yin Pu Sa?',
        content: 'Menurut tata urutan penempatan rupang (atau foto) Bodhisattva dalam altar Xin Ling Fa Men, sekarang seharusnya diletakkan di sebelah tangan kiri Guan Shi Yin Pu Sa (ketika kita menghadap altar, kedua rupang atau foto Bodhisattva berada di tengah, Guan Shi Yin Pu Sa di sebelah kiri, Sang Buddha di sebelah kanan). Jika memang keadaan tidak memungkinkan, boleh menempatkan rupang (atau foto) Sang Buddha di depan foto Guan Shi Yin Pu Sa, namun ukuran tidak boleh terlalu besar (tidak boleh menutupi rupang atau foto Guan Shi Yin Pu Sa terlalu banyak), juga tidak boleh terlalu kecil (tidak boleh terlalu kecil jika dibandingkan dengan rupang atau foto Bodhisattva lainnya).'
    },
    {
        label: 'Pada saat hari besar, apakah kita memasang 3 batang dupa pada tempat dupa Buddha Sakyamuni dan Guan Shi Yin Pu Sa, kemudian 1 batang dupa di tempat dupa lainnya, atau seluruh tempat dupa dipasang 3 batang dupa?',
        content: 'Ya.'
    },
    {
        label: 'Jika untuk sementara ini tidak bisa melebarkan altar, apakah boleh tetap mempertahankan altar yang sekarang?',
        content: 'Sebaiknya menambah satu rupang atau foto Buddha Sakyamuni, foto yang dipasang boleh berukuran kecil, akan tetapi tidak boleh lebih kecil dari rupang atau foto Nan Jing Pu Sa dan Bodhisattva lainnya.'
    },
    {
        label: 'Apakah abu dupa Bodhisattva Xin Ling Fa Men lainnya boleh dimasukkan (digunakan) ke dalam tempat dupa Sang Buddha?',
        content: 'Boleh'
    },
    {
        label: 'Jika altar di rumah sudah menyembahyangi Buddha Sakyamuni, apakah boleh tidak menyembahyangi Guan Shi Yin Pu Sa?',
        content: 'Tidak boleh, ini sudah bukan altar Xin Ling Fa Men.'
    },
    {
        label: 'Ada sebagian teman se-Dharma yang karena tempat di altarnya terbatas, foto Guan Shi Yin Pu Sa yang disembahyangi sekarang sangat besar, ditempatkan di paling belakang, foto Bodhisattva lainnya lebih kecil, semuanya ditempatkan di depan foto Guan Shi Yin Pu Sa, dalam keadaan seperti ini, apakah boleh meletakkan foto Buddha Sakyamuni persis di depan foto Guan Shi Yin Pu Sa?',
        content: 'Boleh. Foto Buddha Sakyamuni tidak boleh lebih kecil daripada foto Nan Jing Pu Sa dan Bodhisattva lainnya.'
    },
    {
        label: 'Apakah ada ketentuan tentang ukuran besar kecilnya foto Buddha Sakyamuni?',
        content: 'Jika memang tulus, sebaiknya foto Buddha Sakyamuni sama besarnya dengan foto Guan Shi Yin Pu Sa; jika memang keadaan yang tidak memungkinkan, foto Buddha Sakyamuni tetap tidak boleh lebih kecil daripada foto Nan Jing Pu Sa dan Bodhisattva lainnya.'
    },
    {
        label: 'Ketika menyambung dupa di altar, sebelumnya boleh hanya memasang dupa pada tempat dupa Guan Shi Yin Pu Sa, sekarang bagaimana seharusnya kita menyambung dupa?',
        content: 'Sekarang harus menyambung dupa pada kedua tempat dupa, yakni tempat dupa Buddha Sakyamuni dan tempat dupa Guan Shi Yin Pu Sa. Jika menyambung dupa di altar Guan Yin Tang, temanteman se-Dharma bisa menyambung dupa pada salah satu tempat dupa dari kedua tempat dupa ini, namun harus tetap dijaga ada dupa yang menyala di dalam kedua tempat dupa; bila menyambung dupa di altar rumah, maka perlu menyambung dupa di kedua tempat dupa pada saat yang sama.'
    },
]
</script>
