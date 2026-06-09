export interface ProfileResponse {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  followerCount?: number;
  followingCount?: number;
}
