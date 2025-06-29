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
    <Link href={`/posts/${slug}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col gap-2">
        {coverImage && (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-48 object-cover rounded mb-2"
          />
        )}
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-600 text-sm">By {author} • {new Date(publishedAt).toLocaleDateString()}</p>
        <p className="text-gray-800">{snippet}</p>
      </div>
    </Link>
  );
}
