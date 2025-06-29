import { BlogPost } from '@/types/blog';

// In-memory storage for blog posts
let posts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    slug: 'getting-started-with-nextjs',
    author: 'John Doe',
    content: 'Next.js is a powerful React framework that makes building full-stack web applications simple and efficient. {{block name="Top Picks" image="https://picsum.photos/id/1/200/300" products="SKU123,SKU456"}} In this post, we\'ll explore the basics of Next.js and how to get started with your first project.',
    coverImage: 'https://picsum.photos/id/1/200/300',
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Building Dynamic Components with React',
    slug: 'building-dynamic-components-with-react',
    author: 'Jane Smith',
    content: 'React components are the building blocks of modern web applications. {{block name="Featured Products" image="https://picsum.photos/id/1/200/300" products="SKU789"}} Learn how to create reusable and dynamic components that can adapt to different data and user interactions.',
    coverImage: 'https://picsum.photos/id/2/200/300',
    publishedAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
];

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate a slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const db = {
  // Get all posts
  getAllPosts: (): BlogPost[] => {
    return [...posts].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  },

  // Get post by ID
  getPostById: (id: string): BlogPost | undefined => {
    return posts.find(post => post.id === id);
  },

  // Get post by slug
  getPostBySlug: (slug: string): BlogPost | undefined => {
    return posts.find(post => post.slug === slug);
  },

  // Create new post
  createPost: (data: Omit<BlogPost, 'id' | 'slug' | 'publishedAt' | 'updatedAt'>): BlogPost => {
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...data,
      id: generateId(),
      slug: generateSlug(data.title),
      publishedAt: now,
      updatedAt: now,
    };
    
    posts.push(newPost);
    return newPost;
  },

  // Update post
  updatePost: (id: string, data: Partial<BlogPost>): BlogPost | null => {
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return null;

    const updatedPost: BlogPost = {
      ...posts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Regenerate slug if title changed
    if (data.title && data.title !== posts[index].title) {
      updatedPost.slug = generateSlug(data.title);
    }

    posts[index] = updatedPost;
    return updatedPost;
  },

  // Delete post
  deletePost: (id: string): boolean => {
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return false;
    
    posts.splice(index, 1);
    return true;
  },
}; 