import Link from 'next/link';

interface BlogCardProps {
  id: string;
  slug: string;
  title: string;
  author: string;
  coverImage?: string;
  publishedAt: string;
  snippet: string;
}

export default function BlogCard({
  slug,
  title,
  author,
  coverImage,
  publishedAt,
  snippet,
}: BlogCardProps) {
  return (
    <Link href={`/posts/${slug}`} className="block">
      <div className="card group cursor-pointer h-full flex flex-col gap-3">
        {coverImage && (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-48 object-cover rounded-xl mb-2 group-hover:scale-105 transition-transform duration-200 shadow-sm"
          />
        )}
        <h2 className="text-2xl font-bold text-indigo-700 group-hover:text-teal-600 transition-colors line-clamp-2">{title}</h2>
        <p className="text-gray-500 text-sm mb-1">By <span className="font-semibold text-gray-700">{author}</span> • <span className="text-indigo-500">{new Date(publishedAt).toLocaleDateString()}</span></p>
        <p className="text-gray-800 text-base line-clamp-3">{snippet}</p>
      </div>
    </Link>
  );
}
