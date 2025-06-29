"use client";
import { useEffect, useState } from "react";
import BlogCard from '@/components/BlogCard';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const LIMIT = 6;

  // Fetch authors for filter dropdown
  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const uniqueAuthors = Array.from(new Set(data.data.map((p: BlogPost) => p.author)));
          setAuthors(uniqueAuthors as string[]);
        }
      });
  }, []);

  // Fetch posts
  const fetchPosts = async (opts?: { reset?: boolean }) => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      author,
      page: String(opts?.reset ? 1 : page),
      limit: String(LIMIT),
    });
    const res = await fetch(`/api/posts?${params.toString()}`);
    const data = await res.json();
    if (data.success) {
      if (opts?.reset) {
        setPosts(data.data);
        setPage(1);
      } else {
        setPosts(prev => [...prev, ...data.data]);
      }
      setHasMore((data.page * data.limit) < data.total);
    }
    setLoading(false);
    setInitialLoad(false);
  };

  // Initial and search/filter fetch
  useEffect(() => {
    fetchPosts({ reset: true });
    // eslint-disable-next-line
  }, [search, author]);

  // Load more
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Fetch next page when page changes (except on first load)
  useEffect(() => {
    if (page === 1) return;
    fetchPosts();
    // eslint-disable-next-line
  }, [page]);

  return (
    <main className="max-w-5xl mx-auto py-10 px-2">
      <h1 className="text-4xl font-extrabold mb-10 text-indigo-800 tracking-tight text-center drop-shadow-sm">All Blog Posts</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
        <input
          type="text"
          placeholder="Search posts..."
          className="border rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="border rounded-lg px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={author}
          onChange={e => { setAuthor(e.target.value); setPage(1); }}
        >
          <option value="">All Authors</option>
          {authors.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 min-h-[200px]">
        {posts.length === 0 && !loading && !initialLoad && (
          <div className="col-span-full text-center text-gray-500 py-10">No posts found.</div>
        )}
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
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 shadow-sm"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </main>
  );
}
