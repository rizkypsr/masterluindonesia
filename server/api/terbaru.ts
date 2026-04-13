interface MenuSetting {
  id: number
  nama: string
  code: string
  status: boolean
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

interface TerbaruData {
  media: any[]
  topics: any[]
  books: any[]
  agenda: any[]
  topics2: any[]
  topics3: any[]
  menuSettings: MenuSetting[]
}

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  try {
    // Fetch menu settings first to determine what to load
    const menuRes = await $fetch<ApiResponse<MenuSetting[]>>(`${baseUrl}/menumobile`)
    const menuSettings = menuRes.data || []

    // Determine which data to fetch based on menu settings
    const shouldFetchTopics = menuSettings.find(m => m.code === 'topic')?.status === true
    const shouldFetchAgenda = menuSettings.find(m => m.code === 'agenda')?.status === true
    const shouldFetchTopics2 = menuSettings.find(m => m.code === 'topic2')?.status === true
    const shouldFetchTopics3 = menuSettings.find(m => m.code === 'topic3')?.status === true

    // Build fetch promises array
    const fetchPromises = [
      $fetch<ApiResponse<any[]>>(`${baseUrl}/app/media`),
      shouldFetchTopics 
        ? $fetch<ApiResponse<any[]>>(`${baseUrl}/topics?limit=3`)
        : Promise.resolve({ success: true, data: [] }),
      $fetch<ApiResponse<any[]>>(`${baseUrl}/bookspaginate?page=1`),
      shouldFetchAgenda
        ? $fetch<ApiResponse<any[]>>(`${baseUrl}/app/agenda`)
        : Promise.resolve({ success: true, data: [] }),
      shouldFetchTopics2
        ? $fetch<ApiResponse<any[]>>(`${baseUrl}/topics2?limit=5`)
        : Promise.resolve({ success: true, data: [] }),
      shouldFetchTopics3
        ? $fetch<ApiResponse<any[]>>(`${baseUrl}/topics3?limit=5`)
        : Promise.resolve({ success: true, data: [] })
    ]

    // Parallel fetch all required data from external API
    const [mediaRes, topicsRes, booksRes, agendaRes, topics2Res, topics3Res] = await Promise.all(fetchPromises)

    return {
      success: true,
      data: {
        media: mediaRes?.data || [],
        topics: topicsRes?.data || [],
        books: booksRes?.data || [],
        agenda: agendaRes?.data || [],
        topics2: topics2Res?.data || [],
        topics3: topics3Res?.data || [],
        menuSettings
      } as TerbaruData
    }
  } catch (error) {
    console.error('Error fetching terbaru data:', error)
    
    const emptyData: TerbaruData = {
      media: [],
      topics: [],
      books: [],
      agenda: [],
      topics2: [],
      topics3: [],
      menuSettings: []
    }

    return {
      success: false,
      error: 'Failed to fetch data',
      data: emptyData
    }
  }
}, {
  maxAge: 60, // Cache for 60 seconds
  getKey: () => 'terbaru-data'
})
