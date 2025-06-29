"use client";
import { usePostForm } from "@/hooks/usePostForm";

export default function CreatePostPage() {
  const {
    fields,
    handleChange,
    loading,
    error,
    fieldErrors,
    submit,
  } = usePostForm();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit();
  }

  return (
    <main className="min-h-[90vh] flex items-center justify-center bg-gray-50 py-10 px-2">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Create New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow text-gray-900">
          <div>
            <label className="block font-medium mb-1 text-gray-900">Title *</label>
            <input
              name="title"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${fieldErrors.title ? "border-red-500" : "border-gray-300"}`}
              value={fields.title}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
            />
            {fieldErrors.title && <p className="text-red-600 text-sm mt-1">{fieldErrors.title}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-900">Cover Image URL</label>
            <input
              name="coverImage"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${fieldErrors.coverImage ? "border-red-500" : "border-gray-300"}`}
              value={fields.coverImage}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://..."
              autoComplete="off"
            />
            {fieldErrors.coverImage && <p className="text-red-600 text-sm mt-1">{fieldErrors.coverImage}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-900">Author *</label>
            <input
              name="author"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${fieldErrors.author ? "border-red-500" : "border-gray-300"}`}
              value={fields.author}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
            />
            {fieldErrors.author && <p className="text-red-600 text-sm mt-1">{fieldErrors.author}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-900">Blog Body *</label>
            <textarea
              name="content"
              className={`w-full border rounded-lg px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${fieldErrors.content ? "border-red-500" : "border-gray-300"}`}
              value={fields.content}
              onChange={handleChange}
              disabled={loading}
              placeholder="Write your post here. You can use {{block ...}} tags and Markdown!"
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-1">Supports <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="underline">Markdown</a> and <code>{'{{block ...}}'}</code> tags.</p>
            {fieldErrors.content && <p className="text-red-600 text-sm mt-1">{fieldErrors.content}</p>}
          </div>
          {fieldErrors.server && <p className="text-red-600 text-sm mt-1">{fieldErrors.server}</p>}
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 w-full mt-2 shadow-sm"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </main>
  );
}

