/**
 * Strip HTML tags and format text for display
 * Handles paragraph spacing intelligently to avoid unwanted gaps
 */
export function stripHtml(html: string): string {
  return html
    // Remove empty paragraphs first
    .replace(/<p\s*><\/p>/gi, '')
    .replace(/<p\s*>\s*<\/p>/gi, '')
    
    // Handle line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    
    // Remove paragraph tags but preserve content structure
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    
    // Handle div endings
    .replace(/<\/div>/gi, '\n')
    
    // Remove all other HTML tags
    .replace(/<[^>]*>/g, '')
    
    // Replace HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    
    // Clean up excessive newlines - this is the key fix
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace 3+ newlines with just 2
    .replace(/\n\s*\n/g, '\n\n') // Ensure consistent double newlines
    
    // Trim whitespace
    .trim()
}

/**
 * Process HTML for display while preserving important styling
 * Keeps background colors and bold text for highlights
 */
export function processHtmlForDisplay(html: string): string {
  let result = html
    // Remove empty paragraphs first
    .replace(/<p\s*><\/p>/gi, '')
    .replace(/<p\s*>\s*<\/p>/gi, '')
    
    // Handle line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    
    // Convert paragraphs to newlines but preserve styling
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    
    // Preserve important styling - convert to simpler format
    .replace(/<span[^>]*background-color:\s*rgb\(0,\s*255,\s*0\)[^>]*>(.*?)<\/span>/gi, '<mark class="bg-green-200 font-bold text-black px-1 rounded">$1</mark>')
    .replace(/<span[^>]*background-color:\s*rgb\(255,\s*255,\s*0\)[^>]*>(.*?)<\/span>/gi, '<mark class="bg-yellow-200 font-bold text-black px-1 rounded">$1</mark>')
    .replace(/<span[^>]*background-color:\s*rgb\(255,\s*0,\s*0\)[^>]*>(.*?)<\/span>/gi, '<mark class="bg-red-200 font-bold text-black px-1 rounded">$1</mark>')
    
    // Handle div endings
    .replace(/<\/div>/gi, '\n')
    
    // Remove other HTML tags except our preserved marks
    .replace(/<(?!\/?(mark|strong|b)\b)[^>]*>/g, '')
    
    // Replace HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    
    // Clean up excessive newlines - remove 3+ consecutive newlines
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    
    // Trim whitespace
    .trim()

  // Split into lines to process speaker sections
  const lines = result.split('\n')
  const processedLines: string[] = []
  let previousWasSpeaker = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() || ''
    
    // Check if current line is a speaker (contains mark with speaker names)
    const isSpeaker = /<mark[^>]*>(?:Penelepon|Master|Catatan Editor)[^<]*<\/mark>/.test(line)
    
    if (isSpeaker) {
      // Add spacing before speaker ONLY if previous line was not empty and we had content before
      if (processedLines.length > 0 && (processedLines[processedLines.length - 1]?.trim() || '') !== '') {
        processedLines.push('') // Add empty line for spacing
      }
      processedLines.push(line)
      previousWasSpeaker = true
    } else if (line !== '') {
      // Regular content line
      processedLines.push(line)
      previousWasSpeaker = false
    } else if (!previousWasSpeaker) {
      // Only keep empty lines if they're not right after a speaker
      processedLines.push(line)
    }
  }

  return processedLines.join('\n')
}