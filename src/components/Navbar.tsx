import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-700 via-indigo-600 to-teal-500 text-white px-4 py-4 mb-10 shadow-lg rounded-b-2xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight hover:text-teal-200 transition">
          Blogify
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/" className="hover:text-teal-200 transition text-lg font-medium">Home</Link>
          <Link href="/create" className="btn-primary text-base font-semibold shadow-md">
            + Create Post
          </Link>
        </div>
      </div>
    </nav>
  );
} 