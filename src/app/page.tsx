import BlogCard from '@/components/BlogCard';
import { db } from '@/lib/db';

export default async function HomePage() {
  const posts = db.getAllPosts();

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Blogify — All Posts</h1>
      <div className="grid gap-6">
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
