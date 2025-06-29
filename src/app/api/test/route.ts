import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Blogify API is running!',
    endpoints: {
      'GET /api/posts': 'Fetch all blog posts',
      'POST /api/posts': 'Create a new blog post',
      'GET /api/posts/[id]': 'Fetch a specific blog post',
      'PUT /api/posts/[id]': 'Update a blog post',
      'DELETE /api/posts/[id]': 'Delete a blog post',
    },
    example: {
      createPost: {
        method: 'POST',
        url: '/api/posts',
        body: {
          title: 'My First Blog Post',
          author: 'John Doe',
          content: 'This is the content of my blog post with {{block name="Top Picks" image="/top-products.png" products="SKU123,SKU456"}}',
          coverImage: 'https://example.com/image.jpg'
        }
      }
    }
  });
} 