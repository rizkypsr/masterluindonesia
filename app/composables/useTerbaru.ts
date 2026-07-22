/**
 * Aggregated "Terbaru" home-tab data.
 *
 * Previously a Nitro route (`server/api/terbaru.ts`) with a 60s server cache.
 * The app is built as a static SPA now, so there is no server to run it —
 * the aggregation happens in the browser and talks to the external API
 * directly. Callers wrap this in `useAsyncData` with a stable key so it is
 * fetched once per session, not once per navigation.
 */

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

export interface TerbaruData<
  M = any,
  T = any,
  B = any,
  A = any,
  T2 = any,
  T3 = any,
> {
  media: M[]
  topics: T[]
  books: B[]
  agenda: A[]
  topics2: T2[]
  topics3: T3[]
  menuSettings: MenuSetting[]
}

const emptyData = (): TerbaruData => ({
  media: [],
  topics: [],
  books: [],
  agenda: [],
  topics2: [],
  topics3: [],
  menuSettings: [],
})

export const fetchTerbaru = async (): Promise<{
  success: boolean
  error?: string
  data: TerbaruData
}> => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  try {
    // Fetch menu settings first to determine what to load
    const menuRes = await $fetch<ApiResponse<MenuSetting[]>>(`${baseUrl}/menumobile`)
    const menuSettings = menuRes.data || []

    const isEnabled = (code: string) =>
      menuSettings.find(m => m.code === code)?.status === true

    const skip = Promise.resolve({ success: true, data: [] as any[] })

    // Parallel fetch all required data from external API
    const [mediaRes, topicsRes, booksRes, agendaRes, topics2Res, topics3Res] = await Promise.all([
      $fetch<ApiResponse<any[]>>(`${baseUrl}/app/media`),
      isEnabled('topic')
        ? $fetch<ApiResponse<any[]>>(`${baseUrl}/topics?limit=3`)
        : skip,
      $fetch<ApiResponse<any[]>>(`${baseUrl}/bookspaginate?page=1`),
      isEnabled('agenda')
        ? $fetch<ApiResponse<any[]>>(`${baseUrl}/app/agenda`)
        : skip,
      isEnabled('topic2')
        ? $fetch<ApiResponse<any[]>>(`${baseUrl}/topics2?limit=5`)
        : skip,
      isEnabled('topic3')
        ? $fetch<ApiResponse<any[]>>(`${baseUrl}/topics3?limit=5`)
        : skip,
    ])

    return {
      success: true,
      data: {
        media: mediaRes?.data || [],
        topics: topicsRes?.data || [],
        books: booksRes?.data || [],
        agenda: agendaRes?.data || [],
        topics2: topics2Res?.data || [],
        topics3: topics3Res?.data || [],
        menuSettings,
      },
    }
  } catch (error) {
    console.error('Error fetching terbaru data:', error)

    return {
      success: false,
      error: 'Failed to fetch data',
      data: emptyData(),
    }
  }
}
