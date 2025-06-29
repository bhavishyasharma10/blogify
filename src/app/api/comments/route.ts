import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/comments?postId=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  if (!postId) {
    return NextResponse.json({ success: false, error: 'postId is required' }, { status: 400 });
  }
  const comments = await db.getComments(postId);
  return NextResponse.json({ success: true, data: comments });
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const { postId, name, body } = await request.json();
    if (!postId || !name || !body) {
      return NextResponse.json({ success: false, error: 'postId, name, and body are required' }, { status: 400 });
    }
    const comment = {
      name: name.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };
    await db.addComment(postId, comment);
    return NextResponse.json({ success: true, data: comment });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to add comment' }, { status: 500 });
  }
} 