# Topics2 Video Feature Implementation

## Overview
Added a video button beside the copy button on topics2 content pages that opens a new page showing videos related to the current chapter.

## Changes Made

### 1. Created Video List Page
**File:** `app/pages/video/topic2-chapter/[chapterId].vue`

- New page to display videos for a specific topics2 chapter
- Fetches videos from API: `${config.public.apiBaseUrl}/videos/topic2-chapter/{chapterId}`
- Features:
  - Loading states with skeleton placeholders
  - Error handling with retry button
  - Empty state when no videos found
  - Clean video cards without left-side icons
  - Video cards with title, synopsis, sequence number, and date
  - Play button and external link button for each video (when available)
  - Handles videos with null video_id gracefully
  - "Video tidak tersedia" message for unavailable videos
  - Responsive design matching the app's style
  - Simple "Video" header without chapter title

### 2. Added Video Button to Topics2 Content Page
**File:** `app/pages/topics2/content/[chapterId].vue`

- Added video button beside the copy button in the bottom navigation
- Button uses the same yellow (#ffcb00) styling as other action buttons
- Uses `mdi:play` icon to indicate video functionality
- Navigates to `/video/topic2-chapter/{chapterId}` (clean URL without query parameters)

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
  topic_video_id: number
  video_id: number | null  // Can be null for unavailable videos
  title: string
  synopsis?: string
  url?: string
  url_audio?: string
  date?: string | null
  seq: number
  category_info: {
    id: number
    title: string
  }
}
```

## Usage
1. Navigate to any topics2 content page (e.g., `/topics2/content/36`)
2. Look for the video button (play icon) beside the copy button in the bottom navigation
3. Click the video button to open the video list page at `/video/topic2-chapter/{chapterId}`
4. View available videos for that chapter
5. Click "Putar Video" to navigate to `/video/play/sub/{video_id}?title={encodedTitle}` (only shown when video_id exists)
6. Click "Buka Link" to open external video URLs in new tab (only shown when URL exists)
7. See "Video tidak tersedia" message for videos without video_id or URL

## Navigation Flow
```
Topics2 Content Page → Video List Page → Video Player Page
/topics2/content/36  → /video/topic2-chapter/36 → /video/play/sub/733?title=...
```

## Example API Response
Based on `/videos/topic2-chapter/36`:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "chapter_id": 36,
    "chapter_title": "Child B1.2",
    "videos": [
      {
        "topic_video_id": 3,
        "video_id": 733,
        "title": "Ceramah Master Lu Junhong di New York, 26 Mei 2010",
        "synopsis": "",
        "url": "https://youtu.be/HuW-radRS2g",
        "url_audio": "",
        "date": null,
        "seq": 1,
        "category_info": {
          "id": 606,
          "title": "Ceramah New York, 26 Mei 2010"
        }
      },
      {
        "topic_video_id": 4,
        "video_id": null,
        "title": "No video available",
        "synopsis": "",
        "url": "",
        "url_audio": "",
        "date": null,
        "seq": 2,
        "category_info": {
          "id": 36,
          "title": "Sydney, 26 April 2009"
        }
      }
    ]
  }
}
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
- Graceful handling of null video_id values
- Proper API response structure handling
- Shows appropriate buttons based on data availability

## Key Features
- Clean URLs without unnecessary query parameters
- Simple "Video" header for better UX
- Proper API response parsing from nested structure
- Uses `topic_video_id` as unique key for video items
- Conditional rendering of action buttons based on data availability
- Displays synopsis, sequence number, and date metadata
- External link support for YouTube and other video platforms
- Handles unavailable videos gracefully with informative messages

## Differences from Book Chapter Implementation
- Uses `/video/topic2-chapter/` route instead of `/video/book-chapter/`
- API endpoint: `/videos/topic2-chapter/{chapterId}` instead of `/videos/book-chapter/{chapterId}`
- Uses `topic_video_id` instead of `book_video_id`
- Handles `video_id: null` cases with conditional button rendering
- Integrated into topics2 content page structure with collapsible bottom navigation
- Same video player destination: `/video/play/sub/{video_id}` (when video_id exists)