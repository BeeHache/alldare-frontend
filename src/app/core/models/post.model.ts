export enum PostType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  IMAGE = "IMAGE",
}

export interface PostResponse {
  id: string;
  authorId: string;
  postType: PostType;
  content: Record<string, any>;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  authorDisplayName?: string;
  authorUsername?: string;
  authorAvatarUrl?: string;
}

export interface TextPostContent {
  text: string;
  hashtags?: string[];
  mentions?: string[];
}

export interface PostRequest {
  id?: string;
  authorId: string;
  postType: PostType;
  content: TextPostContent | any;
  publishedAt?: string;
}
