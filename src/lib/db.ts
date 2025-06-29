import { BlogPost } from '@/types/blog';
import path from 'path';
import { promises as fs } from 'fs';

const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');
const COMMENTS_FILE = path.join(process.cwd(), 'src', 'data', 'comments.json');

// Helper to read posts from file
async function readPosts(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    return JSON.parse(data) as BlogPost[];
  } catch (err) {
    console.error('Error reading posts:', err);
    return [];
  }
}

// Helper to write posts to file
async function writePosts(posts: BlogPost[]): Promise<void> {
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

// Helper to read comments from file
async function readComments(): Promise<Record<string, import('@/types/blog').Comment[]>> {
  try {
    const data = await fs.readFile(COMMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading comments:', err);
    return {};
  }
}

// Helper to write comments to file
async function writeComments(comments: Record<string, import('@/types/blog').Comment[]>): Promise<void> {
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');
}

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate a slug from title and ensure uniqueness
const generateSlug = (title: string, existingSlugs: string[] = []): string => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  let slug = baseSlug;
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};

export const db = {
  // Get all posts
  async getAllPosts(): Promise<BlogPost[]> {
    return await readPosts();
  },

  // Get post by ID
  async getPostById(id: string): Promise<BlogPost | undefined> {
    const posts = await readPosts();
    return posts.find(post => post.id === id);
  },

  // Get post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const posts = await readPosts();
    return posts.find(post => post.slug === slug);
  },

  // Create new post
  async createPost(data: Omit<BlogPost, 'id' | 'slug' | 'publishedAt' | 'updatedAt'>): Promise<BlogPost> {
    const posts = await readPosts();
    const now = new Date().toISOString();
    const existingSlugs = posts.map(post => post.slug);
    const newPost: BlogPost = {
      ...data,
      id: generateId(),
      slug: generateSlug(data.title, existingSlugs),
      publishedAt: now,
      updatedAt: now,
    };
    posts.push(newPost);
    await writePosts(posts);
    return newPost;
  },

  // Update post
  async updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
    const posts = await readPosts();
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return null;

    const updatedPost: BlogPost = {
      ...posts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Regenerate slug if title changed
    if (data.title && data.title !== posts[index].title) {
      const existingSlugs = posts.filter((p, i) => i !== index).map(p => p.slug);
      updatedPost.slug = generateSlug(data.title, existingSlugs);
    }

    posts[index] = updatedPost;
    await writePosts(posts);
    return updatedPost;
  },

  // Delete post
  async deletePost(id: string): Promise<boolean> {
    const posts = await readPosts();
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    await writePosts(posts);
    return true;
  },

  // Get filtered, searched, and paginated posts
  async getFilteredPosts({ search = '', author = '', page = 1, limit = 6 }: { search?: string; author?: string; page?: number; limit?: number }) {
    const allPosts = await readPosts();
    let filtered = allPosts;

    // Filter by author
    if (author) {
      filtered = filtered.filter(post => post.author.toLowerCase() === author.toLowerCase());
    }

    // Search in title, author, or content
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      );
    }

    // Sort by publishedAt (newest first)
    filtered = filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const posts = filtered.slice(start, end);

    return { posts, total };
  },

  // Get comments for a post (by postId or slug)
  async getComments(postId: string): Promise<import('@/types/blog').Comment[]> {
    const comments = await readComments();
    return comments[postId] || [];
  },

  // Add a comment to a post
  async addComment(postId: string, comment: import('@/types/blog').Comment): Promise<void> {
    const comments = await readComments();
    if (!comments[postId]) comments[postId] = [];
    comments[postId].push(comment);
    await writeComments(comments);
  },
}; 