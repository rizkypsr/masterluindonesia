/**
 * Convert relative image URLs from API to full URLs
 * @param url - The image URL from API (can be relative or absolute)
 * @returns Full URL for the image
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  
  // If already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If relative path, prepend the API base URL
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl.replace('/api', '')
  
  // Remove leading slash if present to avoid double slashes
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url
  
  return `${baseUrl}/${cleanUrl}`
}
