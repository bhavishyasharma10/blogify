import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateBlogPost } from '@/lib/validation';

// GET /api/posts - Fetch all posts
export async function GET() {
  try {
    const posts = await db.getAllPosts();
    
    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate the blog post data
    const validation = validateBlogPost(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validation.errors 
        },
        { status: 400 }
      );
    }
    
    // Create the post (await the async function!)
    const newPost = await db.createPost({
      title: body.title.trim(),
      author: body.author.trim(),
      content: body.content.trim(),
      coverImage: body.coverImage?.trim() || undefined,
    });
    
    // Return the full post object (including slug)
    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Post created successfully',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 