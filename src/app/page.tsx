import BlogCard from '@/components/BlogCard';
import { db } from '@/lib/db';

export default async function HomePage() {
  const posts = await db.getAllPosts();

  return (
    <main className="max-w-5xl mx-auto py-10 px-2">
      <h1 className="text-4xl font-extrabold mb-10 text-indigo-800 tracking-tight text-center drop-shadow-sm">All Blog Posts</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <BlogCard
            key={post.id}
            id={post.id}
            slug={post.slug}
            title={post.title}
            author={post.author}
            coverImage={post.coverImage}
            publishedAt={post.publishedAt}
            snippet={post.content.slice(0, 200) + (post.content.length > 200 ? '...' : '')}
          />
        ))}
      </div>
    </main>
  );
}
