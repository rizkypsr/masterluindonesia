export const useCopySubtitle = () => {
  const toast = useToast()

  // Strip HTML and preserve line breaks for copying
  const stripHtmlForCopy = (html: string) => {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  const formatScriptForCopy = (script: string) => {
    // Convert literal \n to actual newlines, remove leading spaces from each line, 
    // add line break after speaker labels, and add spacing between dialogues
    return script
      .replace(/\\n/g, '\n')
      .split('\n')
      .map(line => line.trimStart())
      .join('\n')
      .replace(/(\*[^*]+:\*)\s*/g, '$1\n')
      .replace(/\n(\*[^*]+:\*)/g, '\n\n$1')
  }

  const copyToClipboard = async (content: {
    title?: string
    description?: string
    description_wa?: string
    script?: string
    script_wa?: string
    full_detail?: string
  }) => {
    const title = content.title || ''
    const description = content.description_wa || (content.description ? stripHtmlForCopy(content.description) : '')
    const script = content.script_wa || content.full_detail || (content.script ? stripHtmlForCopy(content.script) : '')
    
    // Build text with proper spacing
    const parts = [title]
    if (description) {
      // Convert \n to actual newlines
      parts.push(description.replace(/\\n/g, '\n'))
    }
    if (script) {
      const formattedScript = formatScriptForCopy(script)
      parts.push(formattedScript)
    }
    
    const text = parts.join('\n\n')
    
    try {
      await navigator.clipboard.writeText(text)
      toast.add({
        title: 'Berhasil disalin',
        color: 'success'
      })
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.add({
        title: 'Gagal menyalin',
        color: 'error'
      })
    }
  }

  return {
    copyToClipboard,
    stripHtmlForCopy,
    formatScriptForCopy
  }
}
