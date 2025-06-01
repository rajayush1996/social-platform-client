export interface SocialLinks {
  twitter: string;
  instagram: string;
  youtube: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
}

export interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

export interface UserProfile {
  website: string;
  username: string;
  displayName: string;
  bio: string;
  location: string;
  avatar: string;
  coverImage: string;
  socialLinks: SocialLinks;
  preferences: UserPreferences;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  user: User;
  profile: UserProfile;
  stats: UserStats;
} 