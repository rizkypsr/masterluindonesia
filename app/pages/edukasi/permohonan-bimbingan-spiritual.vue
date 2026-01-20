<template>
    <div class="h-screen bg-white flex flex-col">
        <!-- Header (Fixed) -->
        <div class="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <BackButton to="/?tab=edukasi" />
            <span class="text-sm text-gray-600">Permohonan Bimbingan Spiritual</span>
            <div class="w-6"></div>
        </div>

        <!-- Content (Scrollable) -->
        <div ref="contentRef" class="flex-1 overflow-y-auto px-4 py-6">
            <!-- Section 1: Permohonan Bimbingan Spiritual -->
            <div id="bimbingan-spiritual" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Permohonan Bimbingan Spiritual</h2>

                <!-- Hero Image -->
                <img src="https://masterluindonesia.com/assets/assets/images/bimbingan/bimbingan.png"
                    alt="Permohonan Bimbingan Spiritual" class="w-full h-96 object-cover rounded-lg mb-6" />
            </div>

            <!-- Section 2: Permohonan Bimbingan Spiritual untuk Keluarga -->
            <div id="bimbingan-keluarga" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Permohonan Bimbingan</h2>
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Spiritual untuk Keluarga</h2>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">(Quan Dao Sheng Wen)</h2>

                <div class="space-y-4 text-black">
                    <p>Untuk membuat pasangan suami-istri membina diri dalam Dharma sampai seluruh anggota keluarga menekuni Ajaran Buddha Dharma bersama membutuhkan pahala yang sangat besar.</p>
                    
                    <p>Jika kita sendiri sudah mulai berlatih, bisa mengarahkan anggota keluarga secara perlahan-lahan, memberikan buku-buku dari Master Jun Hong Lu, mendengarkan siaran radio dan rekaman, bisa mengatakan:</p>
                    
                    <p>"Ini sangat menarik, mari kita bahas bersama."</p>
                    
                    <p>Jika mereka tetap tidak tertarik, sebaiknya jangan dipaksakan, biarkan berjalan sesuai karma mereka.</p>
                    
                    <p>Boleh membaca Xin Jing 7x atau lebih setiap hari untuk anggota keluarga Anda dan memohon:</p>
                    
                    <p class="font-bold">"Mohon Guan Shi Yin Pu Sa yang Maha Welas Asih memberkati XXX (nama anggota keluarga), membantu membuka pikirannya dan menumbuhkan kebijaksanaan, percaya Ajaran Buddha Dharma dan bersedia membaca paritta".</p>
                    
                    <p>Hal ini boleh terus Anda lakukan.</p>
                    
                    <p>Jika Anda sudah membaca 7x Xin Jing setiap hari selama satu bulan bagi anggota keluarga tersebut,</p>
                    
                    <p>Sebaiknya dilakukan secara diam-diam, jangan sampai menimbulkan ketidaksukaan dari keluarga Anda.</p>
                    
                    <p>Malah akan menyebabkan karma mulut yang buruk, jika mereka masih tidak percaya, maka bisa memohon di hadapan Guan Shi Yin Pu Sa.</p>
                    
                    <p class="font-bold text-lg mt-6">Tata cara melakukan permohonan bimbingan spiritual serta penjelasan</p>
                    
                    <p>• Kertas permohonan bimbingan spiritual (Quan Dao Sheng Wen) dicetak di kertas kuning A4. (Ingat bahwa formulir permohonan ini tidak boleh dibakar)</p>
                    
                    <p>• Gunakan pena hitam atau biru untuk menulis nama lengkap dan tanggal lahir keluarga Anda (menurut penanggalan masehi), dan nama lengkap Anda.</p>
                    
                    <p>• Setiap hari (sebaiknya pukul 6 atau 8 pagi, pukul 4 sore, pukul 10 malam, tetapi tidak disarankan untuk dilakukan pada malam hari), boleh dilakukan di depan altar rumah sendiri, nyalakan lampu minyak, lalu memasang dupa.</p>
                    
                    <p>• Selanjutnya, bacakan dengan isi formulir permohonan satu kali, dan letakkan formulir tersebut di meja altar. Jika altar Anda kecil, letakkan formulir permohonan di bawah tempat dupa.</p>
                    
                    <p>• Setelah itu, bersembah sujud memberi hormat.</p>
                    
                    <p>• Membaca Xin Jing, biasanya sebanyak 7x atau lebih.</p>
                    
                    <p>• Setelah selesai membaca paritta atau dupa terbakar habis, bungkus formulir tersebut dengan baik. Formulir ini tidak boleh diletakkan di altar terus-menerus. Bila tidak, orang yang tertulis namanya akan sering marah tanpa sebab, dan jiwanya menjadi tidak utuh.</p>
                    
                    <p>• Permohonan ini bisa diulang sebanyak 1x dalam sehari.</p>
                    
                    <p>• Setelah melakukan ritual ini selama 1 bulan, maka hentikan dulu selama 1 minggu, jika terus-menerus memohon, maka pahala si pemohon akan berpindah kepada orang yang didoakan. Selama seminggu masa tenggang ini, Anda bisa terus membaca Xin Jing untuknya.</p>
                    
                    <p>• Ini adalah ritual yang sangat serius dan sebaiknya dilakukan setelah Anda sudah membaca 7x Xin Jing setiap hari untuk anggota keluarga Anda selama waktu tertentu (biasanya lebih dari satu bulan). Sebaiknya jangan sampai anggota keluarga tersebut tahu, supaya tidak menimbulkan kekesalan dan membuatnya menanam karma ucapan.</p>
                    
                    <p>• Setelah permohonan berhasil, formulir permohonan quan dao sheng wen disimpan selama 1-2 bulan, lalu dimasukkan dalam amplop dan dibuang.</p>
                </div>
            </div>

            <!-- Section 3: Unduh -->
            <div id="unduh" class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">Contoh Gambar</h2>
                <p class="text-gray-600 mb-4">*Download gambar di tab Beranda Unduh</p>

                <UCard class="border-2 border-[#eedcb4] shadow-xl">
                    <img src="https://masterlu.buildbyriz.io/assets/assets/images/bimbingan/unduh.png"
                        alt="Contoh Gambar Permohonan Bimbingan Spiritual" class="w-full h-96 object-cover rounded-lg" />
                </UCard>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'blank'
})
</script>
