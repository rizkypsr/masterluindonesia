# Video Feature Implementation

## Overview
Added a video button beside the copy button on book chapter pages that opens a new page showing videos related to the current chapter.

## Changes Made

### 1. Created Video List Page
**File:** `app/pages/video/book-chapter/[chapterId].vue`

- New page to display videos for a specific book chapter
- Fetches videos from API: `${config.public.apiBaseUrl}/videos/book-chapter/{chapterId}`
- Features:
  - Loading states with skeleton placeholders
  - Error handling with retry button
  - Empty state when no videos found
  - Clean video cards without left-side icons
  - Video cards with title, synopsis, sequence number, and date
  - Play button and external link button for each video
  - Responsive design matching the app's style
  - Simple "Video" header without chapter title

### 2. Added Video Button to Book Chapter Page
**File:** `app/pages/book/[bookId]/[chapterId].vue`

- Added video button beside the copy button in the bottom navigation
- Button uses the same yellow (#ffcb00) styling as other action buttons
- Uses `mdi:play` icon to indicate video functionality
- Navigates to `/video/book-chapter/{chapterId}` (clean URL without query parameters)

### 3. Added Required Functions
- `openVideoPage()`: Function to navigate to the video list page with clean URL

## API Integration
The video page expects the API to return a nested response structure:

```typescript
interface ApiResponse {
  success: boolean
  message: string
  data: {
    chapter_id: number
    chapter_title: string
    videos: Video[]
  }
}

interface Video {
  book_video_id: number
  video_id: number
  title: string
  synopsis?: string
  url?: string
  url_audio?: string
  date?: string
  seq: number
  category_info: {
    id: number
    title: string
  }
}
```

## Usage
1. Navigate to any book chapter page (e.g., `/book/117/4826?chapter=Surat+Tanya+Jawab+1,+4+Agustus+2011`)
2. Look for the video button (play icon) beside the copy button in the bottom navigation
3. Click the video button to open the video list page at `/video/book-chapter/{chapterId}`
4. View available videos for that chapter
5. Click "Putar Video" to navigate to `/video/play/sub/{video_id}?title={encodedTitle}`
6. Click "Buka Link" to open external video URLs in new tab

## Navigation Flow
```
Book Chapter Page → Video List Page → Video Player Page
/book/117/4826    → /video/book-chapter/1965 → /video/play/sub/5021?title=...
```

## Styling
- Consistent with existing app design
- Uses Tailwind CSS classes
- Yellow accent color (#ffcb00) for action buttons
- Dark mode support
- Responsive layout
- Clean card design without thumbnail icons

## Error Handling
- Loading states while fetching data
- Error state with retry functionality
- Empty state when no videos are available
- Graceful fallback for missing video metadata
- Proper API response structure handling

## Key Features
- Clean URLs without unnecessary query parameters
- Simple "Video" header for better UX
- Proper API response parsing from nested structure
- Uses `video_id` field for navigation to video player
- Displays synopsis, sequence number, and date metadata
- External link support for YouTube and other video platforms