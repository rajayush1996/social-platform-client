# Missing APIs and Fields

## Authentication
- [ ] Forgot Password API
- [ ] Reset Password API
- [ ] Email Verification API
- [ ] Resend Verification Email API

## User Profile
- [ ] Upload Profile Picture API (separate from update profile)
- [ ] Upload Cover Image API (separate from update profile)
- [ ] Delete Account API
- [ ] Change Password API
- [ ] Update Email API (with verification)

## Media
- [ ] Like/Unlike Media API
- [ ] Comment on Media API
- [ ] Get Comments API
- [ ] Delete Comment API
- [ ] Share Media API
- [ ] Get User's Media List API
- [ ] Get Liked Media List API
- [ ] Get Media Categories API

## Blog
- [ ] Create Blog API
- [ ] Update Blog API
- [ ] Delete Blog API
- [ ] Like/Unlike Blog API
- [ ] Comment on Blog API
- [ ] Get Comments API
- [ ] Delete Comment API
- [ ] Get User's Blogs API
- [ ] Get Liked Blogs API

## Creator
- [ ] Get Creator Stats API (views, likes, followers, etc.)
- [ ] Get Creator Analytics API
- [ ] Update Creator Profile API
- [ ] Get Creator's Media List API
- [ ] Get Creator's Blog List API

## Social
- [ ] Follow/Unfollow Creator API
- [ ] Get Followers List API
- [ ] Get Following List API
- [ ] Get Feed API (combined media and blogs)

## Search
- [ ] Search API (combined search for media, blogs, creators)
- [ ] Get Trending Media API
- [ ] Get Trending Blogs API
- [ ] Get Trending Creators API

## Additional Fields Needed in Existing APIs

### User Profile
```typescript
{
  // ... existing fields ...
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    darkMode: boolean;
    language: string;
  };
  stats: {
    totalViews: number;
    totalLikes: number;
    totalFollowers: number;
    totalFollowing: number;
  };
}
```

### Media
```typescript
{
  // ... existing fields ...
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  quality: {
    resolution: string;
    format: string;
  };
  monetization: {
    isMonetized: boolean;
    earnings: number;
  };
}
```

### Blog
```typescript
{
  // ... existing fields ...
  likes: number;
  comments: number;
  shares: number;
  readTime: number;
  featuredImage: string;
  status: 'draft' | 'published' | 'archived';
  monetization: {
    isMonetized: boolean;
    earnings: number;
  };
}
```

### Creator Request
```typescript
{
  // ... existing fields ...
  category: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  portfolio: {
    description: string;
    links: string[];
    samples: string[];
  };
}
``` 