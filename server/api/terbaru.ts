export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  try {
    // Fetch menu settings first to determine what to load
    const menuRes = await $fetch<{ success: boolean; data: Array<{ id: number; nama: string; code: string; status: boolean }> }>(
      `${baseUrl}/menumobile`
    )
    const menuSettings = menuRes.data || []

    // Determine which data to fetch based on menu settings
    const shouldFetchTopics = menuSettings.find(m => m.code === 'topic')?.status === true
    const shouldFetchAgenda = menuSettings.find(m => m.code === 'agenda')?.status === true

    // Parallel fetch all required data from external API
    const [mediaRes, topicsRes, booksRes, agendaRes] = await Promise.all([
      $fetch<{ success: boolean; data: any[] }>(`${baseUrl}/app/media`),
      shouldFetchTopics 
        ? $fetch<{ success: boolean; data: any[] }>(`${baseUrl}/topics`)
        : Promise.resolve({ success: true, data: [] }),
      $fetch<{ success: boolean; data: any[] }>(`${baseUrl}/bookspaginate?page=1`),
      shouldFetchAgenda
        ? $fetch<{ success: boolean; data: any[] }>(`${baseUrl}/app/agenda`)
        : Promise.resolve({ success: true, data: [] })
    ])

    return {
      success: true,
      data: {
        media: mediaRes.data || [],
        topics: topicsRes.data || [],
        books: booksRes.data || [],
        agenda: agendaRes.data || [],
        menuSettings
      }
    }
  } catch (error) {
    console.error('Error fetching terbaru data:', error)
    return {
      success: false,
      error: 'Failed to fetch data',
      data: {
        media: [],
        topics: [],
        books: [],
        agenda: [],
        menuSettings: []
      }
    }
  }
}, {
  maxAge: 60, // Cache for 60 seconds
  getKey: () => 'terbaru-data'
})
