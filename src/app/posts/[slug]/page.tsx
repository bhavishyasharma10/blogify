import { db } from '@/lib/db';
import ContentRenderer from '@/components/ContentRenderer';
import { notFound } from 'next/navigation';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = db.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-gray-600 mb-4">
        By {post.author} • {new Date(post.publishedAt).toLocaleDateString()}
      </div>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}
      <ContentRenderer content={post.content} />
    </main>
  );
}
