"use client";
import React, { type ReactNode, Suspense } from 'react';
import { useState } from "react";
import { usePostForm } from "@/hooks/usePostForm";
import CommentSection from "@/components/CommentSection";

interface PostDetailEditableProps {
  post: {
    id: string;
    title: string;
    author: string;
    content: string;
    coverImage?: string;
    publishedAt: string;
  };
  renderedContent: ReactNode;
  postId: string;
}

export default function PostDetailEditable({ post, renderedContent, postId }: PostDetailEditableProps) {
  const [editMode, setEditMode] = useState(false);
  const [optimistic, setOptimistic] = useState(post);
  const {
    fields,
    handleChange,
    loading,
    error,
    fieldErrors,
    submit,
    setFields,
  } = usePostForm(post);

  const handleEdit = () => {
    setEditMode(true);
    setFields(post);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFields(post);
  };

  const handleSave = async () => {
    setOptimistic({ ...fields, publishedAt: post.publishedAt, id: post.id });
    const ok = await submit({ method: "PUT", id: post.id });
    if (ok) {
      setEditMode(false);
    }
  };

  // View mode
  if (!editMode) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight drop-shadow-sm">{optimistic.title}</h1>
          <button
            className="btn-primary text-sm px-4 py-1 ml-4"
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
        <div className="text-gray-500 mb-4 text-base">
          By <span className="font-semibold text-gray-700">{optimistic.author}</span> • <span className="text-indigo-500">{(() => { const d = new Date(optimistic.publishedAt); return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; })()}</span>
        </div>
        {optimistic.coverImage && (
          <img
            src={optimistic.coverImage}
            alt={optimistic.title}
            className="w-full h-64 object-cover rounded-xl mb-6 shadow-md border border-gray-100"
          />
        )}
        <div className="prose prose-lg max-w-none">
          {renderedContent}
        </div>
        <hr className="my-8" />
        <Suspense fallback={null}>
          <CommentSection postId={postId} />
        </Suspense>
      </>
    );
  }

  // Edit mode
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <input
          name="title"
          value={fields.title}
          onChange={handleChange}
          className="text-4xl font-extrabold text-indigo-800 tracking-tight drop-shadow-sm bg-white border-b border-indigo-200 focus:outline-none focus:border-indigo-400 w-full mr-4"
          required
        />
        <button
          type="button"
          className="btn-secondary text-sm px-4 py-1 ml-2"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary text-sm px-4 py-1 ml-2"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="text-gray-500 mb-4 text-base">
        By {" "}
        <input
          name="author"
          value={fields.author}
          onChange={handleChange}
          className="font-semibold text-gray-700 bg-white border-b border-gray-200 focus:outline-none focus:border-indigo-400"
          required
        />
        {" "}•{" "}
        <span className="text-indigo-500">{(() => { const d = new Date(post.publishedAt); return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; })()}</span>
      </div>
      <input
        name="coverImage"
        value={fields.coverImage}
        onChange={handleChange}
        placeholder="Cover image URL"
        className="w-full mb-2 bg-white border-b border-gray-200 focus:outline-none focus:border-indigo-400"
      />
      {fields.coverImage && (
        <img
          src={fields.coverImage}
          alt={fields.title}
          className="w-full h-64 object-cover rounded-xl mb-6 shadow-md border border-gray-100"
        />
      )}
      <textarea
        name="content"
        value={fields.content}
        onChange={handleChange}
        className="w-full min-h-[200px] bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-indigo-400"
        required
      />
      {fieldErrors && (
        <div className="text-red-500 text-sm">
          {Object.values(fieldErrors).map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
  );
} 