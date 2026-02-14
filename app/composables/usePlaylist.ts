import { useAuth } from '~/lib/auth'

interface UserPlaylist {
  id: number
  title: string
  items_count: number
}

export const usePlaylist = () => {
  const { isAuthenticated, getAuthHeader } = useAuth()
  const toast = useToast()
  const config = useRuntimeConfig()

  const showPlaylistModal = useState('showPlaylistModal', () => false)
  const userPlaylists = useState<UserPlaylist[]>('userPlaylists', () => [])
  const isLoadingPlaylists = useState('isLoadingPlaylists', () => false)
  const isCreatingPlaylist = useState('isCreatingPlaylist', () => false)
  const isAddingToPlaylist = useState('isAddingToPlaylist', () => false)

  const newPlaylistTitle = useState('newPlaylistTitle', () => '')
  const newPlaylistDescription = useState('newPlaylistDescription', () => '')
  const currentItem = useState<{ type: number; data: any } | null>('currentItem', () => null)

  // Fetch user's playlists
  async function fetchUserPlaylists() {
    if (!isAuthenticated.value) return

    isLoadingPlaylists.value = true
    try {
      const response = await $fetch<{ success: boolean; data: UserPlaylist[] }>(
        `${config.public.apiBaseUrl}/community-playlists/user/playlists`,
        {
          headers: getAuthHeader() as Record<string, string>
        }
      )
      userPlaylists.value = response.data || []
    } catch (error) {
      console.error('Failed to fetch playlists:', error)
    } finally {
      isLoadingPlaylists.value = false
    }
  }

  // Create new playlist
  async function createPlaylist() {
    if (!newPlaylistTitle.value.trim()) return

    isCreatingPlaylist.value = true
    try {
      const response = await $fetch<{ success: boolean; data: { id: number } }>(
        `${config.public.apiBaseUrl}/community-playlists`,
        {
          method: 'POST',
          headers: getAuthHeader() as Record<string, string>,
          body: {
            title: newPlaylistTitle.value.trim(),
            description: newPlaylistDescription.value.trim() || null
          }
        }
      )

      toast.add({
        title: 'Berhasil',
        description: 'Playlist berhasil dibuat',
        color: 'green'
      })

      // If there's a current item, add it to the new playlist
      if (currentItem.value && response.data?.id) {
        await addToPlaylist(response.data.id)
      }

      newPlaylistTitle.value = ''
      newPlaylistDescription.value = ''
      await fetchUserPlaylists()
      
      return response.data?.id
    } catch (error) {
      toast.add({
        title: 'Gagal',
        description: 'Gagal membuat playlist',
        color: 'red'
      })
      throw error
    } finally {
      isCreatingPlaylist.value = false
    }
  }

  // Add item to playlist
  async function addToPlaylist(playlistId: number) {
    if (!currentItem.value) return

    isAddingToPlaylist.value = true
    try {
      await $fetch(`${config.public.apiBaseUrl}/community-playlists/${playlistId}/items`, {
        method: 'POST',
        headers: getAuthHeader() as Record<string, string>,
        body: {
          type: currentItem.value.type,
          data: currentItem.value.data
        }
      })

      toast.add({
        title: 'Berhasil',
        description: 'Item berhasil ditambahkan ke playlist',
        color: 'green'
      })

      showPlaylistModal.value = false
      currentItem.value = null
    } catch (error) {
      toast.add({
        title: 'Gagal',
        description: 'Gagal menambahkan item ke playlist',
        color: 'red'
      })
      throw error
    } finally {
      isAddingToPlaylist.value = false
    }
  }

  // Open playlist modal with item
  function openPlaylistModal(type: number, data: any) {
    if (!isAuthenticated.value) {
      toast.add({
        title: 'Login Required',
        description: 'Silakan login terlebih dahulu',
        color: 'yellow'
      })
      return
    }

    currentItem.value = { type, data }
    showPlaylistModal.value = true
    fetchUserPlaylists()
  }

  return {
    showPlaylistModal,
    userPlaylists,
    isLoadingPlaylists,
    isCreatingPlaylist,
    isAddingToPlaylist,
    newPlaylistTitle,
    newPlaylistDescription,
    fetchUserPlaylists,
    createPlaylist,
    addToPlaylist,
    openPlaylistModal
  }
}
