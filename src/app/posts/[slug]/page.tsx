import { db } from '@/lib/db';
import ContentRenderer from '@/components/ContentRenderer';
import { notFound } from 'next/navigation';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await db.getPostBySlug(slug);
  console.log(post);
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-10 px-2">
      <div className="card w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold mb-2 text-indigo-800 tracking-tight drop-shadow-sm">{post.title}</h1>
        <div className="text-gray-500 mb-4 text-base">
          By <span className="font-semibold text-gray-700">{post.author}</span> • <span className="text-indigo-500">{new Date(post.publishedAt).toLocaleDateString()}</span>
        </div>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-6 shadow-md border border-gray-100"
          />
        )}
        <div className="prose prose-lg max-w-none">
          <ContentRenderer content={post.content} />
        </div>
      </div>
    </main>
  );
}
