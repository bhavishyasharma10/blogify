import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BlogPostFormData } from '@/types/blog';

// GET /api/posts - Fetch all posts
export async function GET() {
  try {
    const posts = db.getAllPosts();
    
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
    let body: BlogPostFormData;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validation
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }
    
    if (!body.author?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Author is required' },
        { status: 400 }
      );
    }
    
    if (!body.content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }
    
    // Create the post
    const newPost = db.createPost({
      title: body.title.trim(),
      author: body.author.trim(),
      content: body.content.trim(),
      coverImage: body.coverImage?.trim() || undefined,
    });
    
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