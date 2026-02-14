<template>
  <div class="pb-2 px-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-black dark:text-white">Hubungi Xin Ling Fa Men</h1>
    <p class="text-2xl font-bold text-black dark:text-white mb-4">心灵法门</p>

    <!-- Search Input -->
    <UInput
      v-model="searchQuery"
      placeholder="Cari Kontak"
      icon="i-heroicons-magnifying-glass"
      size="xl"
      class="mb-6 w-full"
    />

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 dark:text-red-400">Gagal memuat data</p>
      <UButton @click="() => refresh()" class="mt-4" variant="outline">Coba Lagi</UButton>
    </div>

    <!-- Content -->
    <div v-else class="space-y-3">
      <div v-for="country in filteredCountries" :key="country.flag">
        <!-- Country Collapsible -->
        <UCollapsible class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <template #default="{ open }">
            <UButton
              variant="ghost"
              class="w-full justify-between px-4 py-5"
              :ui="{ base: 'hover:bg-transparent' }"
            >
              <div class="flex items-center gap-3">
                <NuxtImg
                  :src="`https://flagsapi.com/${country.flag}/flat/64.png`"
                  :alt="country.country"
                  class="w-8 h-6 object-cover"
                />
                <span class="font-medium text-black dark:text-white text-left text-lg">{{ country.country }}</span>
              </div>
              <UIcon
                name="i-heroicons-chevron-down"
                class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform"
                :class="{ 'rotate-180': open }"
              />
            </UButton>
          </template>

          <template #content>
            <!-- Cities -->
            <div class="space-y-2 px-4 pb-4">
              <div v-for="city in country.contact" :key="city.city">
                <!-- City Collapsible -->
                <UCollapsible class="bg-[#fffbeb] dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                  <template #default="{ open: cityOpen }">
                    <UButton
                      variant="ghost"
                      class="w-full justify-between px-4 py-3"
                      :ui="{ base: 'hover:bg-transparent' }"
                    >
                      <span class="font-medium text-black dark:text-white text-lg">{{ city.city }}</span>
                      <div class="flex items-center gap-2">
                        <span class="bg-[#f8cb45] dark:bg-yellow-500 text-black text-lg font-semibold px-2.5 py-0.5 rounded-full">
                          {{ city.detail.length }}
                        </span>
                        <UIcon
                          name="i-heroicons-chevron-down"
                          class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform"
                          :class="{ 'rotate-180': cityOpen }"
                        />
                      </div>
                    </UButton>
                  </template>

                  <template #content>
                    <!-- Contact Details -->
                    <div class="space-y-4 px-4 pb-4">
                      <div
                        v-for="detail in city.detail"
                        :key="detail.id"
                        class="bg-amber-50 dark:bg-gray-600 rounded-xl p-4"
                      >
                        <!-- Name -->
                        <h3 class="font-bold text-black dark:text-white whitespace-pre-line mb-3">{{ detail.name }}</h3>

                        <!-- Address -->
                        <div v-if="detail.address" class="flex gap-2 mb-2">
                          <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-black dark:text-white shrink-0 mt-0.5" />
                          <p class="text-gray-700 dark:text-gray-300 text-lg whitespace-pre-line">{{ detail.address }}</p>
                        </div>

                        <!-- Phone -->
                        <div v-if="detail.telp" class="flex gap-2 mb-2">
                          <UIcon name="i-heroicons-phone" class="w-5 h-5 text-black dark:text-white shrink-0" />
                          <p class="text-gray-700 dark:text-gray-300 text-lg">{{ detail.telp }}</p>
                        </div>

                        <!-- Email -->
                        <div v-if="detail.email" class="flex gap-2 mb-2">
                          <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-black dark:text-white shrink-0" />
                          <p class="text-gray-700 dark:text-gray-300 text-lg">{{ detail.email }}</p>
                        </div>

                        <!-- Website -->
                        <div v-if="detail.website" class="flex gap-2 mb-4">
                          <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-black dark:text-white shrink-0" />
                          <p class="text-gray-700 dark:text-gray-300 text-lg break-all">{{ detail.website }}</p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex justify-center gap-4 mt-4">
                          <button
                            v-if="detail.telp"
                            @click="handleCall(detail.telp)"
                            class="w-10 h-10 rounded-full bg-[#f8d177] dark:bg-yellow-500 flex items-center justify-center"
                          >
                            <UIcon name="i-heroicons-phone" class="w-5 h-5 text-white" />
                          </button>
                          <button
                            v-if="detail.email"
                            @click="handleEmail(detail.email)"
                            class="w-10 h-10 rounded-full bg-[#f8d177] dark:bg-yellow-500 flex items-center justify-center"
                          >
                            <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-white" />
                          </button>
                          <button
                            v-if="detail.website"
                            @click="handleWebsite(detail.website)"
                            class="w-10 h-10 rounded-full bg-[#f8d177] dark:bg-yellow-500 flex items-center justify-center"
                          >
                            <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-white" />
                          </button>
                          <button
                            v-if="detail.maps"
                            @click="handleMaps(detail.maps)"
                            class="w-10 h-10 rounded-full bg-[#f8d177] dark:bg-yellow-500 flex items-center justify-center"
                          >
                            <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-white" />
                          </button>
                          <button
                            @click="handleShare(detail)"
                            class="w-10 h-10 rounded-full bg-[#f8d177] dark:bg-yellow-500 flex items-center justify-center"
                          >
                            <UIcon name="i-heroicons-share" class="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>
                </UCollapsible>
              </div>
            </div>
          </template>
        </UCollapsible>
      </div>

      <!-- No Results -->
      <div v-if="filteredCountries.length === 0 && searchQuery" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil untuk "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

interface ContactDetail {
  id: number
  name: string
  address: string
  telp: string
  email: string
  website: string
  maps: string
}

interface City {
  city: string
  detail: ContactDetail[]
}

interface Country {
  flag: string
  country: string
  contact: City[]
}

interface ApiResponse {
  success: boolean
  message: string
  data: Country[]
}

const searchQuery = ref('')

const { data, pending, error, refresh } = await useFetch<ApiResponse>(
  `${config.public.apiBaseUrl}/contact`
)

const countries = computed(() => data.value?.data || [])

const filteredCountries = computed(() => {
  if (!searchQuery.value) return countries.value

  const query = searchQuery.value.toLowerCase()
  return countries.value
    .map(country => {
      const filteredCities = country.contact
        .map(city => {
          const filteredDetails = city.detail.filter(
            d =>
              d.name.toLowerCase().includes(query) ||
              d.address.toLowerCase().includes(query) ||
              city.city.toLowerCase().includes(query) ||
              country.country.toLowerCase().includes(query)
          )
          return filteredDetails.length > 0 ? { ...city, detail: filteredDetails } : null
        })
        .filter(Boolean) as City[]

      return filteredCities.length > 0 ? { ...country, contact: filteredCities } : null
    })
    .filter(Boolean) as Country[]
})

const handleCall = (phone: string) => {
  const cleanPhone = phone.replace(/[^\d+]/g, '').split('/')[0]?.trim()
  window.open(`tel:${cleanPhone}`, '_self')
}

const handleEmail = (email: string) => {
  window.open(`mailto:${email}`, '_self')
}

const handleWebsite = (website: string) => {
  const url = website.startsWith('http') ? website : `https://${website}`
  window.open(url, '_blank')
}

const handleMaps = (maps: string) => {
  window.open(maps, '_blank')
}

const handleShare = async (detail: ContactDetail) => {
  const text = `${detail.name}\n${detail.address}\nTelp: ${detail.telp}\nEmail: ${detail.email}\nWebsite: ${detail.website}`
  if (navigator.share) {
    try {
      await navigator.share({ title: detail.name, text })
    } catch {}
  } else {
    await navigator.clipboard.writeText(text)
  }
}
</script>
