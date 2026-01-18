<template>
    <div class="h-screen bg-white flex flex-col">
        <!-- Header (Fixed) -->
        <div class="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <BackButton to="/?tab=edukasi" />
            <span class="text-sm text-gray-600">Permohonan Penggantian Nama</span>
            <div class="w-6"></div>
        </div>

        <!-- Content (Scrollable) -->
        <div ref="contentRef" class="flex-1 overflow-y-auto px-4 py-6">
            <!-- Section 1: Permohonan Penggantian Nama -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Permohonan Penggantian Nama</h2>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">(Gai Ming Sheng Wen)</h2>

                <!-- Hero Image -->
                <img src="https://masterluindonesia.com/assets/assets/images/bimbingan/ganti_nama.png"
                    alt="Permohonan Penggantian Nama" class="w-full rounded-lg mb-6" />

                <div class="space-y-4 text-black">
                    <p>Nama mewakili jiwa seseorang, ketika nama seseorang dipanggil, maka jiwanya juga akan terpanggil mengikuti namanya.</p>
                    
                    <p>Ketika seseorang dilahirkan, maka nama yang tertulis di akta kelahiran, akan dicatat juga di Langit dan Alam Akhirat.</p>
                    
                    <p>Jika Anda pernah mengubah nama dan sudah digunakan selama bertahun-tahun, maka nama baru yang sudah digunakan ini pun pada dasarnya sudah memiliki kekuatan spiritual yang bersifat dinamis.</p>
                    
                    <p>Bisa digunakan dalam membaca paritta dan Xiao Fang Zi, tetapi memang lebih baik bila Anda tetap mengajukan permohonan penggantian nama.</p>
                    
                    <p>Permohonan penggantian nama adalah pemberitahuan kepada para Bodhisattva di Langit, para dewa dan setan, serta pejabat yang pencatat nama di Alam Akhirat, bahwa nama Anda sudah diganti.</p>
                    
                    <p class="font-bold">Tata cara mengisi formulir penggantian nama serta penjelasan:</p>
                    
                    <p>• Setelah dicetak pada kertas kuning dengan ukuran yang dicantumkan, pilih "善男(Laki-laki) atau 信女(Perempuan)", coret yang tidak perlu dengan pena hitam atau biru.</p>
                    
                    <p>• Lalu diisi dari atas ke bawah: nama asli atau nama sebelumnya, nama baru, dan nama yang sekarang (nama pemohon).</p>
                    
                    <p>Urutan dari atas ke bawah di dalam formulir permohonan:</p>
                    
                    <p>Nama yang pertama diisi dengan nama asli atau nama sebelumnya</p>
                    
                    <p>Nama yang kedua dituliskan nama yang baru (nama yang sudah diganti)</p>
                    
                    <p>Nama yang ketiga diisi sama dengan nama kedua (nama yang baru).</p>
                    
                    <p>Jika pengajuan dan pembakaran formulir ini diwakili oleh anggota keluarga, bagian nama pemohon tetap diisi dengan nama baru si pengganti nama, bukan nama orang yang mewakili pembakaran formulir tersebut.</p>
                    
                    <p>• Tanggal lahir pada formulir ini diisi dengan tanggal lahir orang yang ingin mengganti namanya menurut penanggalan masehi.</p>
                    
                    <p>• Kolom alamat pada formulir silakan diisi dengan nama lokasi atau alamat tempat Anda membakar formulir permohonan tersebut (contohnya Beijing – Tiongkok atau Sydney – Australia). Pada bagian tanggal diisi dengan tanggal waktu membakar formulir permohonan sesuai penanggalan masehi.</p>
                    
                    <p>• Waktu yang paling baik untuk membakar formulir permohonan ini adalah pada saat cuaca cerah, pukul 6 dan 8 tepat di pagi hari, pukul 4 tepat di sore hari. Permohonan penggantian nama akan lebih baik bila dilakukan pada tanggal 1 dan 15 penanggalan lunar, ini adalah hari baik.</p>
                    
                    <p>• Jika Anda memiliki altar di rumah, maka perlu menyalakan lampu minyak, memasang dupa, membacakan isi formulir permohonan Anda sebanyak 1x di depan altar (bisa sambil bersujud), lalu bacakan 7x (Da Bei Zhou) dan 7x (Xin Jing), kemudian bakar formulir permohonan dari atas ke bawah.</p>
                    
                    <p>• Jika Anda tidak memiliki altar di rumah, maka Anda perlu pergi ke kuil atau kelenteng untuk mengajukan permohonan Anda.</p>
                    
                    <p>Lakukan sembah-sujud hormat kepada setiap Buddha dan Bodhisattva yang ada di dalam kuil, kemudian membaca isi formulir permohonan di depan Guan Shi Yin Pu Sa:</p>
                    
                    <p>"Hari ini, saya XXX (nama sendiri) datang ke ZZZ (nama kuil) memberi penghormatan kepada semua Buddha dan Bodhisattva di sini. Saya memohon kepada Guan Shi Yin Pu Sa yang Maha Welas Asih menjadi saksinya, nama asli saya adalah XXX, sekarang diganti menjadi YYY (nama baru). Mohon semua Buddha dan Bodhisattva menjadi saksi"</p>
                    
                    <p>Lalu membaca 7x Da Bei Zhou dan 7x Xin Jing.</p>
                    
                    <p>Kemudian Anda bisa membakar formulir di tempat pembakaran yang ada di dalam kuil tersebut (bakar dari atas ke bawah).</p>
                    
                    <p>• Biasanya Anda hanya perlu mengajukan permohonan ini satu kali, jika tidak berhasil, boleh mengajukan permohonan ulang.</p>
                    
                    <p>• Akan lebih baik bila pengajuan permohonan penggantian nama dilakukan oleh diri sendiri. Jika anak Anda masih terlalu kecil dan mengalami kesulitan untuk melakukannya sendiri, bisa meminta orang tua atau anggota keluarga lain untuk mengajukan permohonan ini.</p>
                    
                    <p>• Untuk orang yang sudah meninggal tidak perlu mengajukan permohonan penggantian nama, cukup menggunakan nama yang digunakan sebelum dia meninggal.</p>
                    
                    <p>• Jika Anda pernah menggunakan banyak nama, silakan gunakan nama yang Anda gunakan paling lama sebagai nama asli atau nama awal (biasanya jika nama seseorang sudah dipanggil atau digunakan selama 10 tahun atau lebih, mungkin akan lebih memiliki kekuatan), Anda juga bisa mengisi semua nama yang pernah Anda gunakan di bagian kolom nama asli atau awal.</p>
                    
                    <p>• Untuk mengetahui apakah permohonan Anda berhasil atau tidak, Anda dapat membaca Xiao Fang Zi dengan menggunakan nama yang baru.</p>
                    
                    <p>• Setelah membakar Xiao Fang Zi, perhatikan apakah Anda merasa pusing, gelisah atau bermimpi buruk? Dari sini bisa diketahui berhasil tidaknya penggantian nama Anda.</p>
                    
                    <p>• Jika Anda bisa merasakan hasil positif dari Xiao Fang Zi Anda, berarti penggantian nama Anda sudah berhasil.</p>
                    
                    <p>• Setelah mengajukan ritual penggantian nama, setiap hari saat sebelum membaca paritta, di hadapan Pu Sa seringlah menyebutkan nama Anda yang baru, ini baik dilakukan agar nama baru Anda bisa berlaku.</p>
                    
                    <p>• Biasanya setelah melakukan ritual penggantian nama, boleh segera menggunakan nama yang baru untuk mengisi Xiao Fang Zi.</p>
                    
                    <p>• Apabila untuk sementara waktu tidak tahu apakah permohonan ini berhasil atau tidak, maka di bagian penerima Xiao Fang Zi (敬赠) boleh ditulis "XX (YY) 的要经者", di sini XX adalah nama yang baru, YY adalah nama yang lama.</p>
                    
                    <p>• Namun penulisan seperti ini hanya bisa digunakan dalam jangka pendek, untuk sementara waktu saja, tidak boleh digunakan dalam jangka panjang.</p>
                    
                    <p>• Walaupun pengajuan permohonan penggantian nama untuk saat pertama tidak berhasil, tetapi Anda sudah menggunakan nama yang baru untuk mengisi dan membaca Xiao Fang Zi, maka, setelah pengajuan permohonan penggantian nama Anda berhasil, Xiao Fang Zi tersebut tetap berlaku.</p>
                </div>
            </div>

            <!-- Section 2: Contoh Gambar (Carousel) -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Contoh Gambar</h2>
                <p class="text-gray-600 mb-4">*Download gambar di tab Beranda Unduh</p>

                <!-- Navigation arrows -->
                <div class="flex justify-end gap-2 mb-4">
                    <button @click="scrollPrevUnduh()" class="p-1" aria-label="Previous slide">
                        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
                    </button>
                    <button @click="scrollNextUnduh()" class="p-1" aria-label="Next slide">
                        <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <UCarousel ref="unduhRef" v-slot="{ item }" :items="unduhItems" :ui="{ item: 'basis-full' }"
                    @select="onSelectUnduh">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">{{ item.title }}</h3>
                        <UCard class="border-2 border-[#eedcb4] shadow-xl">
                            <img :src="item.image" :alt="item.title" class="w-full rounded-lg" />
                        </UCard>
                        <p v-if="item.description" class="text-black mt-4">{{ item.description }}</p>
                    </div>
                </UCarousel>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'blank'
})

// Unduh Carousel
const unduhRef = useTemplateRef('unduhRef')
const unduhIndex = ref(0)

function onSelectUnduh(index: number) {
    unduhIndex.value = index
}

function scrollPrevUnduh() {
    unduhRef.value?.emblaApi?.scrollPrev()
}

function scrollNextUnduh() {
    unduhRef.value?.emblaApi?.scrollNext()
}

const unduhItems = [
    {
        id: 1,
        title: 'Gai Ming Sheng Wen',
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/bimbingan/unduh.png',
        description: ''
    },
    {
        id: 2,
        title: 'Zheng Ming Sheng Wen',
        image: 'https://masterlu.buildbyriz.io/assets/assets/images/bimbingan/unduh.png',
        description: 'Jika Anda tidak yakin dengan nama asli Anda, misalnya anak adopsi. Maka Anda bisa menggunakan formulir penggantian nama "正名升文 Zheng Ming Sheng Wen"'
    }
]
</script>
