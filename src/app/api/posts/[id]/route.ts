import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BlogPostFormData } from '@/types/blog';

// GET /api/posts/[id] - Fetch post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const post = db.getPostById(id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Edit a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Parse request body with error handling
    let body: Partial<BlogPostFormData>;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Check if post exists
    const existingPost = db.getPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Validation for provided fields
    if (body.title !== undefined && !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title cannot be empty' },
        { status: 400 }
      );
    }
    
    if (body.author !== undefined && !body.author.trim()) {
      return NextResponse.json(
        { success: false, error: 'Author cannot be empty' },
        { status: 400 }
      );
    }
    
    if (body.content !== undefined && !body.content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content cannot be empty' },
        { status: 400 }
      );
    }
    
    // Update the post
    const updatedPost = db.updatePost(id, {
      ...(body.title && { title: body.title.trim() }),
      ...(body.author && { author: body.author.trim() }),
      ...(body.content && { content: body.content.trim() }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage?.trim() || undefined }),
    });
    
    if (!updatedPost) {
      return NextResponse.json(
        { success: false, error: 'Failed to update post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: 'Post updated successfully',
    });
    
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Check if post exists
    const existingPost = db.getPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Delete the post
    const deleted = db.deletePost(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
    
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 