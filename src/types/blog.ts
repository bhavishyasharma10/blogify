export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
}

export interface BlogPostFormData {
  title: string;
  author: string;
  content: string;
  coverImage?: string;
}

export interface BlockAttributes {
  name: string;
  image?: string;
  products?: string;
  [key: string]: string | undefined;
}

export interface ParsedBlock {
  type: 'block';
  attributes: BlockAttributes;
  originalText: string;
} 