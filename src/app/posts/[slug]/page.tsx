import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PostDetailEditable from '@/components/PostDetailEditable';
import ContentRenderer from '@/components/ContentRenderer';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await db.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const renderedContent = await ContentRenderer({ content: post.content });

  return (
    <main className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-10 px-2">
      <div className="card w-full max-w-2xl">
        <PostDetailEditable post={post} renderedContent={renderedContent} />
      </div>
    </main>
  );
}
