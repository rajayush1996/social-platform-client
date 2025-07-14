// Common Types
export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: MediaMeta;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Media Types
export interface Media {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  quality: {
    resolution: string;
    format: string;
  };
  creator: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  category: string;
  tags: string[];
  monetization?: {
    isMonetized: boolean;
    earnings: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MediaMeta {
  _id: string;
  url: string;
  type: 'image' | 'video' | 'html';
  mimeType: string;
  size?: number;
  metadata?: {
    duration?: number;
    width?: number;
    height?: number;
    format?: string;
    pages?: number;
    wordCount?: number;
  };
}

export interface Category {
  [x: string]: string;
  _id: string;
  name: string;
  slug: string;
}

export interface Stats {
  views: number;
  likes: number;
  comments: number;
}

export interface BaseContent {
  _id?: string;
  title: string;
  description: string;
  categoryId?: Category;
  stats?: Stats;
  createdAt: string;
  updatedAt: string;
  id?: string;
  mediaFileUrl?: string;
}

export interface Blog extends BaseContent {
  blogSpecific: {
    excerpt: string;
    readTime: string;
    thumbnailMetadata: MediaMeta;
    contentMetadata: MediaMeta;
  };
}

export interface Video {
  _id: string;
  type: 'video';
  title: string;
  author: string;
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  views: number;
  deletedAt: string | null;
  videoSpecific: {
    mediaMetaId: string;
    duration: string;
  };
  createdAt: string;
  updatedAt: string;
  mediaFile: {
    url: string;
  };
  thumbnail: {
    url: string;
  };
  duration: string;
  user?: {
    username: string;
  };
  mediaDetails?: {
    url: string;
  }
  thumbnailDetails?: {
    url: string;
  };
  categoryId?: {
    _id: string;
    name: string;
  };
  stats?: {
    views: number;
  };
  id?: string;
  description?: string;
}

export interface Reel extends BaseContent {
  reelSpecific?: {
    duration: string;
    thumbnailMetadata: MediaMeta;
    contentMetadata: MediaMeta;
  };
}

// Creator Request Types
export interface CreatorRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  category: string;
  portfolio: {
    description: string;
    links: string[];
    samples: string[];
  };
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  content: {
    contentId: string;
    contentType: 'blog' | 'video' | 'reel';
    title: string;
  };
  user: {
    _id: string;
    name: string;
    profilePicture?: MediaMeta;
  };
  read: boolean;
  createdAt: string;
}

// Comment Types
export interface Comment {
  _id: string;
  contentId: string;
  contentType: 'blog' | 'video' | 'reel';
  text: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: MediaMeta;
  };
  createdAt: string;
}

export interface HomeContent {
  featured: {
    blogs: Blog[];
    videos: Video[];
    reels: Reel[];
  };
  trending: {
    blogs: Blog[];
    videos: Video[];
    reels: Reel[];
  };
  latest: {
    blogs: Blog[];
    videos: Video[];
    reels: Reel[];
  };
} 