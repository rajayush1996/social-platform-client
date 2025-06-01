# API Gaps & Recommendations (Based on UI Needs)

This document compares your current API list with a modern video/blog/reel platform UI. It lists missing endpoints, missing keys, and suggestions for a complete, scalable backend.

---

## 1. Authentication
**Current APIs:** Register, Login, Refresh, Logout
- ✅ All basic endpoints present.
- 🔍 **No changes needed.**

---

## 2. Profile (User & Creator)
**Current APIs:**
- `GET /api/v1/users/me` (get own profile)
- `PUT /api/v1/users/me` (update own profile)
- `POST /api/v1/users/avatar` (upload avatar)
- `POST /api/v1/users/cover` (upload cover)

**Missing:**
- **Get Public Profile**
  - `GET /api/v1/users/{id}`
  - For viewing other users' public profiles (needed for social features, profile links, etc.)
  - **Response should include:** id, name, profilePicture, bio, isCreator, stats (followers, following, posts, etc.)

**Suggested Response for Public Profile:**
```json
{
  "status": "success",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "profilePicture": "url",
    "bio": "User bio",
    "isCreator": false,
    "stats": {
      "followers": 100,
      "following": 50,
      "posts": 10
    }
  }
}
```

---

## 3. Creator Request
**Current APIs:**
- Submit & get own creator request
- ✅ Sufficient for MVP

---

## 4. Media (Videos/Reels)
**Current APIs:**
- Get all media, get by ID, increment view, upload video (chunked), upload thumbnail, complete upload

**Missing:**
- **Like/Unlike Media**
  - `POST /api/v1/media/{id}/like` (like a video)
  - `POST /api/v1/media/{id}/unlike` (unlike a video)
  - **Needed for:** Like button, like count
- **Get Liked Media**
  - `GET /api/v1/media/liked` (list of media liked by user)
- **Comment on Media**
  - `POST /api/v1/media/{id}/comments` (add comment)
  - `GET /api/v1/media/{id}/comments` (get comments)
  - `DELETE /api/v1/media/{id}/comments/{commentId}` (delete comment)
- **Share Media**
  - `POST /api/v1/media/{id}/share` (track/share a video)
- **Edit/Delete Media**
  - `PUT /api/v1/media/{id}` (edit video details)
  - `DELETE /api/v1/media/{id}` (delete video)
- **Categories**
  - `GET /api/v1/media/categories` (list categories)
- **Missing Keys in Media Response:**
  - `duration` (for video length)
  - `tags` (for filtering/search)
  - `likes` (like count)
  - `comments` (comment count)
  - `shares` (share count)
  - `createdAt`, `updatedAt` (timestamps)

**Sample Media Response (Recommended):**
```json
{
  "id": "media_id",
  "title": "Video Title",
  "description": "...",
  "videoUrl": "...",
  "thumbnail": "...",
  "views": 1000,
  "likes": 100,
  "comments": 20,
  "shares": 5,
  "duration": 120,
  "tags": ["funny", "music"],
  "category": "Music",
  "creator": { "id": "...", "name": "..." },
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 5. Blog
**Current APIs:**
- Get all blogs, get by ID

**Missing:**
- **Like/Unlike Blog**
  - `POST /api/v1/blogs/{id}/like`
  - `POST /api/v1/blogs/{id}/unlike`
- **Get Liked Blogs**
  - `GET /api/v1/blogs/liked`
- **Comment on Blog**
  - `POST /api/v1/blogs/{id}/comments`
  - `GET /api/v1/blogs/{id}/comments`
  - `DELETE /api/v1/blogs/{id}/comments/{commentId}`
- **Share Blog**
  - `POST /api/v1/blogs/{id}/share`
- **Edit/Delete Blog**
  - `PUT /api/v1/blogs/{id}`
  - `DELETE /api/v1/blogs/{id}`
- **Upload Blog Image**
  - `POST /api/v1/blogs/upload-image`
- **Missing Keys in Blog Response:**
  - `tags`, `likes`, `comments`, `shares`, `readTime`, `status`, `createdAt`, `updatedAt`

**Sample Blog Response (Recommended):**
```json
{
  "id": "blog_id",
  "title": "Blog Title",
  "content": "...",
  "author": { "id": "...", "name": "..." },
  "tags": ["tech"],
  "likes": 10,
  "comments": 2,
  "shares": 1,
  "readTime": 5,
  "status": "published",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 6. Comments (Global)
- **Needed for both Media and Blog**
- Endpoints:
  - `POST /api/v1/{type}/{id}/comments` (add comment)
  - `GET /api/v1/{type}/{id}/comments` (get comments)
  - `DELETE /api/v1/{type}/{id}/comments/{commentId}` (delete comment)
- **Comment Response Should Include:**
  - `id`, `content`, `author` (id, name, profilePicture), `likes`, `replies`, `createdAt`, `updatedAt`

---

## 7. Likes (Global)
- **Needed for both Media and Blog**
- Endpoints:
  - `POST /api/v1/{type}/{id}/like`
  - `POST /api/v1/{type}/{id}/unlike`
  - `GET /api/v1/{type}/liked` (get liked items)

---

## 8. Views (Media)
- **Already present:** `PUT /api/v1/media/{id}/view`
- **Consider:** Add view count to all relevant responses.

---

## 9. Social (Follow/Unfollow)
- **Missing:**
  - `POST /api/v1/users/{id}/follow`
  - `POST /api/v1/users/{id}/unfollow`
  - `GET /api/v1/users/{id}/followers`
  - `GET /api/v1/users/{id}/following`
  - `GET /api/v1/users/feed` (optional, for social feed)
- **Needed for:** Social features, profile stats, feed

---

## 10. Notifications
- **Missing:**
  - `GET /api/v1/notifications` (list)
  - `GET /api/v1/notifications/unread-count`
  - `POST /api/v1/notifications/{id}/mark-read`
  - `POST /api/v1/notifications/mark-all-read`
  - `DELETE /api/v1/notifications/{id}`
- **Notification Response Should Include:**
  - `id`, `type`, `message`, `isRead`, `createdAt`

---

## 11. Search
- **Missing:**
  - `GET /api/v1/search?query=...` (global search for users, media, blogs, etc.)
  - `GET /api/v1/search/trending/media`
  - `GET /api/v1/search/trending/blogs`
  - `GET /api/v1/search/trending/creators`

---

## 12. Miscellaneous
- **Categories:**
  - `GET /api/v1/media/categories`
- **Feed:**
  - `GET /api/v1/users/feed` (optional, for personalized feed)

---

# Action Items for Backend
- Add all missing endpoints above for a complete, modern platform.
- Update response objects to include all keys needed by the UI (see sample responses).
- For each feature (comments, likes, social, notifications, search), ensure both endpoints and response keys are present.
- If you want, I can generate a sample API config object for your frontend based on this list. 