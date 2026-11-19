import type {
  Audio2ApiResponse,
  Audio2Category,
  Audio2Detail,
  Audio2EpisodesData,
  Audio2TimelineData,
} from '~/types/audio2'

/** Thin wrappers over the Audio 2 endpoints on the v2 (Node) API. */
export const useAudio2Api = () => {
  const config = useRuntimeConfig()
  const base = `${config.public.apiV2BaseUrl}/audio2`

  const fetchCategories = async () =>
    (await $fetch<Audio2ApiResponse<Audio2Category[]>>(`${base}/categories`)).data

  const fetchEpisodes = async (categoryId: number, all: boolean) =>
    (await $fetch<Audio2ApiResponse<Audio2EpisodesData>>(`${base}/episodes`, {
      query: { category_id: categoryId, all: all ? 1 : 0 },
    })).data

  /** year: a number, `null` for the no-year group, or `undefined` for the API default (newest). */
  const fetchTimeline = async (year: number | null | undefined, all: boolean) =>
    (await $fetch<Audio2ApiResponse<Audio2TimelineData>>(`${base}/timeline`, {
      query: { all: all ? 1 : 0, ...(year === undefined ? {} : { year: year === null ? 'none' : year }) },
    })).data

  const fetchDetail = async (id: number | string) =>
    (await $fetch<Audio2ApiResponse<Audio2Detail>>(`${base}/${id}`)).data

  return { fetchCategories, fetchEpisodes, fetchTimeline, fetchDetail }
}
