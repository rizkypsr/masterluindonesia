# HTML Content Processing Feature

## Overview
Fitur ini menangani pemrosesan konten HTML untuk menampilkan teks dengan format yang konsisten di seluruh aplikasi, khususnya untuk konten dialog dengan speaker (Penelepon, Master, Catatan Editor).

## Problem Statement
- Konten HTML dari API memiliki spacing yang tidak konsisten
- Ada jarak berlebihan antara paragraf dan speaker
- Highlight styling (background color) perlu dipertahankan
- Perlu format yang konsisten di semua halaman (book, topics2, topics3)

## Solution
Dibuat fungsi reusable `processHtmlForDisplay` yang:
1. Membersihkan HTML tags yang tidak perlu
2. Mempertahankan styling penting (highlight colors)
3. Mengatur spacing yang tepat antara section speaker
4. Tidak ada spacing antara speaker label dan kontennya
5. **Menangani konsistensi spacing**: `<br><br>` dan `<p></p>` (paragraph kosong) menghasilkan jarak yang sama
6. **Mempertahankan formatting**: Double line breaks dikonversi dengan benar

## Files Involved

### Core Utility
- `app/utils/html.ts` - Fungsi utama untuk pemrosesan HTML

### Implementation Pages
- `app/pages/book/[chapterId].vue` - Halaman buku
- `app/pages/topics2/content/[chapterId].vue` - Halaman topik 2
- `app/pages/topics3/content/[chapterId].vue` - Halaman topik 3
- `app/pages/audio/detail.vue` - Halaman detail audio
- `app/pages/audio/[id].vue` - Halaman daftar audio
- `app/pages/audio/index.vue` - Halaman utama audio

## Functions

### `stripHtml(html: string): string`
Membersihkan HTML tags dan mengembalikan plain text dengan spacing yang diperbaiki.

**Usage:**
```typescript
const plainText = stripHtml(htmlContent)
```

### `processHtmlForDisplay(html: string): string`
Memproses HTML untuk display dengan mempertahankan styling penting dan mengatur spacing yang tepat.

**Features:**
- Mempertahankan highlight styling untuk speaker
- Mengatur spacing antara section speaker
- Tidak ada spacing antara speaker dan kontennya
- Membersihkan HTML tags yang tidak perlu

**Usage:**
```typescript
const processedHtml = processHtmlForDisplay(htmlContent)
```

## Styling Preservation

### Speaker Highlights
- **Penelepon**: Green background (`bg-green-200`)
- **Master**: Yellow background (`bg-yellow-200`) 
- **Catatan Editor**: Red background (`bg-red-200`)

### CSS Classes Applied
```html
<mark class="bg-green-200 font-bold text-black px-1 rounded">Penelepon:</mark>
<mark class="bg-yellow-200 font-bold text-black px-1 rounded">Master:</mark>
<mark class="bg-red-200 font-bold text-black px-1 rounded">Catatan Editor:</mark>
```

## Spacing Logic

### Desired Format
```
Penelepon:
Content here

Master:
Content here

Penelepon:
Content here
```

### Consistent Spacing Handling
Fungsi ini menangani berbagai cara spacing dalam HTML dengan hasil yang konsisten:

**Input dengan paragraph kosong:**
```html
<p>asdasd</p><p>asdasd</p><p></p><p>asdasds</p><p>asdasdas</p>
```

**Input dengan double br:**
```html
<p><strong>Title</strong><br><br>Content paragraph 1<br><br>Content paragraph 2<br><br></p>
```

**Output yang konsisten:**
Kedua input di atas akan menghasilkan spacing yang sama - jarak 1 line antara paragraf.

### Implementation Logic
1. **Empty paragraphs** (`<p></p>` atau `<p style="..."></p>`) → Dikonversi ke newline untuk spacing
2. **Double line breaks** (`<br><br>`) → Dikonversi ke double newline (`\n\n`) 
3. **Single line breaks** (`<br>`) → Dikonversi ke single newline (`\n`)
4. **Regular paragraphs** → Content dipertahankan, tags dihapus
5. **Speaker detection** → Menambah spacing sebelum speaker baru
6. **Highlight preservation** → Background colors dipertahankan sebagai mark tags

## Template Usage

### Vue Template Implementation
```vue
<template>
  <div class="text-black dark:text-white leading-relaxed whitespace-pre-line" 
       v-html="processHtmlForDisplay(content)">
  </div>
</template>

<script setup>
import { processHtmlForDisplay } from '~/utils/html'
</script>
```

### Important CSS Classes
- `whitespace-pre-line` - Preserves line breaks
- `leading-relaxed` - Better line spacing
- `v-html` - Renders processed HTML

## Testing

### Test Cases
1. **Content with multiple speakers** - Verify spacing between sections
2. **Content with highlights** - Verify styling preservation  
3. **Content without speakers** - Verify normal text processing
4. **Empty content** - Verify graceful handling

### Manual Testing URLs
- Book: `http://localhost:3000/book/1337?chapter=1`
- Topics2: `http://localhost:3000/topics2/content/[id]`
- Topics3: `http://localhost:3000/topics3/content/[id]`
- Audio Detail: `http://localhost:3000/audio/detail?audio_id=1721&subtitle_id=18803`
- Audio List: `http://localhost:3000/audio/167?title=Totem+2020`

## Migration Notes

### Before
- Each page used different HTML processing
- Inconsistent spacing across pages
- Some pages used `stripHtml`, others used raw HTML
- Audio pages displayed raw HTML without proper formatting

### After  
- All pages use `processHtmlForDisplay`
- Consistent spacing and styling across book, topics, and audio pages
- Reusable utility function
- Proper highlight preservation in audio subtitles

## Troubleshooting

### Common Issues
1. **No spacing between speakers** - Check regex pattern for speaker detection
2. **Lost highlighting** - Verify mark tag preservation in regex
3. **Extra spacing** - Check line processing logic in for loop

### Debug Tips
```typescript
// Add console.log to debug processing
console.log('Original HTML:', html)
console.log('Processed lines:', processedLines)
console.log('Final result:', result)
```

## Future Enhancements
- Support for additional speaker types
- Configurable spacing options
- Better handling of nested HTML structures
- Performance optimization for large content