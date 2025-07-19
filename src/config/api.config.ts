export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_PUBLIC_API_BASE_URL ? `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/api/v1` : 'http://localhost:3000/api/v1',
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/user/auth/signin',
      REGISTER: '/user/auth/signup',
      REFRESH_TOKEN: '/user/auth/refresh-token',
      LOGOUT: '/user/auth/logout',
      FORGOT_PASSWORD: '/user/auth/forgot-password',
      RESET_PASSWORD: '/user/auth/reset-password',
      VERIFY_EMAIL: '/user/auth/verify-email',
      RESEND_VERIFICATION: '/user/auth/resend-verification',
    },
    // User
    USER: {
      PROFILE: '/user/profile/me',
      UPDATE_PROFILE: '/users/me',
      UPLOAD_AVATAR: '/users/avatar',
      UPLOAD_COVER: '/users/cover',
      DELETE_ACCOUNT: '/users/profile',
      CHANGE_PASSWORD: '/users/profile/password',
      UPDATE_EMAIL: '/users/profile/email',
      PUBLIC_PROFILE: (id: string) => `/users/${id}`,
      // Content
      HOME: '/user/home',
      CATEGORIES: '/user/categories',
      TRENDING_VIDEOS: '/user/home/trending',
      BLOGS: '/user/blogs',
      BLOGS_DETAIL: (id: string) => `/user/blogs/${id}`,
      BLOGS_COMMENTS: (id: string) => `/user/blogs/${id}/comments`,
      VIDEOS: '/user/videos',
      VIDEOS_DETAIL: (id: string) => `/user/videos/${id}`,
      VIDEOS_COMMENTS: (id: string) => `/user/videos/${id}/comments`,
      REELS: '/user/reels',
      REELS_DETAIL: (id: string) => `/user/reels/${id}`,
      REELS_COMMENTS: (id: string) => `/user/reels/${id}/comments`,
      // Interactions
      INTERACTIONS: {
        LIKE: '/user/interactions/like',
        COMMENT: '/user/interactions/comment',
        SAVE: '/user/interactions/save',
      },
      // Notifications
      NOTIFICATIONS: {
        LIST: '/user/notifications',
        MARK_READ: (id: string) => `/user/notifications/${id}/read`,
      },
    },
    // Creator
    CREATOR: {
      REQUEST: '/creator-requests',
      MY_REQUEST: '/creator-requests/user/me',
      STATS: '/creator/stats',
      ANALYTICS: '/creator/analytics',
      UPDATE_PROFILE: '/creator/profile',
      MEDIA_LIST: '/creator/media',
      BLOG_LIST: '/creator/blogs',
    },
    // Media
    MEDIA: {
      LIST: '/media',
      DETAIL: (id: string) => `/media/${id}`,
      INCREMENT_VIEW: (id: string) => `/media/${id}/view`,
      LIKE: (id: string) => `/media/${id}/like`,
      UNLIKE: (id: string) => `/media/${id}/unlike`,
      COMMENT: (id: string) => `/media/${id}/comments`,
      COMMENTS: (id: string) => `/media/${id}/comments`,
      DELETE_COMMENT: (id: string, commentId: string) => `/media/${id}/comments/${commentId}`,
      SHARE: (id: string) => `/media/${id}/share`,
      USER_MEDIA: '/media/user',
      LIKED_MEDIA: '/media/liked',
      CATEGORIES: '/media/categories',
    },
    // Blog
    BLOG: {
      LIST: '/user/blogs',
      DETAIL: (id: string) => `/user/blogs/${id}`,
      CREATE: '/blogs',
      UPDATE: (id: string) => `/user/blogs/${id}`,
      DELETE: (id: string) => `/user/blogs/${id}`,
      LIKE: (id: string) => `/user/blogs/${id}/like`,
      UNLIKE: (id: string) => `/user/blogs/${id}/unlike`,
      COMMENT: (id: string) => `/user/blogs/${id}/comments`,
      COMMENTS: (id: string) => `/user/blogs/${id}/comments`,
      DELETE_COMMENT: (id: string, commentId: string) => `/user/blogs/${id}/comments/${commentId}`,
      USER_BLOGS: '/user/blogs/user',
      LIKED_BLOGS: '/user/blogs/liked',
    },
    // Social
    SOCIAL: {
      FOLLOW: (id: string) => `/social/follow/${id}`,
      UNFOLLOW: (id: string) => `/social/unfollow/${id}`,
      FOLLOWERS: (id: string) => `/social/followers/${id}`,
      FOLLOWING: (id: string) => `/social/following/${id}`,
      FEED: '/social/feed',
    },
    // Search
    SEARCH: {
      GLOBAL: '/search',
      TRENDING_MEDIA: '/search/trending/media',
      TRENDING_BLOGS: '/search/trending/blogs',
      TRENDING_CREATORS: '/search/trending/creators',
    },
    // Notifications
    NOTIFICATION: {
      LIST: '/notifications',
      UNREAD_COUNT: '/notifications/unread-count',
      MARK_READ: (id: string) => `/notifications/${id}/mark-read`,
      DELETE: (id: string) => `/notifications/${id}`,
    },
  },
} as const;

export type ApiEndpoints = typeof API_CONFIG.ENDPOINTS; 