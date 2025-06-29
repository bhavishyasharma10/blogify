"use client";
import { useEffect, useState } from "react";

interface Comment {
  name: string;
  body: string;
  createdAt: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments
  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setComments(data.data);
      });
  }, [postId]);

  // Submit comment
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !body.trim()) {
      setError("Name and comment are required.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, name, body }),
    });
    const data = await res.json();
    if (data.success) {
      setComments(prev => [...prev, data.data]);
      setName("");
      setBody("");
    } else {
      setError(data.error || "Failed to add comment.");
    }
    setLoading(false);
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">Comments</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Add a Comment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={loading}
                maxLength={32}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                placeholder="Add a comment..."
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 min-h-[44px]"
                value={body}
                onChange={e => setBody(e.target.value)}
                disabled={loading}
                rows={2}
                maxLength={500}
              />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60 shadow-sm w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Posting..." : "Add Comment"}
          </button>
        </form>
      </div>
      <div className="space-y-6">
        {comments.length === 0 && <div className="text-gray-500">No comments yet. Be the first!</div>}
        {comments.map((c, i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg shrink-0">
              {getInitials(c.name)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-indigo-700 mb-1">{c.name}</div>
              <div className="text-gray-800 mb-1 whitespace-pre-line">{c.body}</div>
              <div className="text-xs text-gray-500">{new Date(c.createdAt).toISOString().replace('T', ' ').slice(0, 16)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 