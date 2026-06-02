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
}
