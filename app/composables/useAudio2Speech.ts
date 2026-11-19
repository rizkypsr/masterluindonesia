import type { SearchItem } from '~/types/search'

/** Read a search result aloud (Voice button), one at a time; tapping again stops it. */
export function useAudio2Speech() {
  const speakingKey = ref<string | null>(null)

  const toText = (html: string) => {
    const spaced = (html || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h[1-6])>/gi, '$&\n')
    return new DOMParser().parseFromString(spaced, 'text/html').body.textContent?.trim() || ''
  }

  function speak(key: string, item: SearchItem) {
    if (!import.meta.client || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    if (speakingKey.value === key) {
      speakingKey.value = null
      return
    }
    const utterance = new SpeechSynthesisUtterance(toText(item.full_detail || item.title || ''))
    utterance.lang = 'id-ID'
    utterance.onstart = () => { speakingKey.value = key }
    utterance.onend = utterance.onerror = () => { if (speakingKey.value === key) speakingKey.value = null }
    window.speechSynthesis.speak(utterance)
  }

  function stop() {
    if (import.meta.client) window.speechSynthesis?.cancel()
    speakingKey.value = null
  }

  onDeactivated(stop)
  onBeforeUnmount(stop)

  return { speakingKey, speak, stop }
}
