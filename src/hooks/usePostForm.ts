import { useState } from "react";
import { useRouter } from "next/navigation";

function normalizeFields(fields: any = {}) {
  return {
    title: fields.title || "",
    coverImage: fields.coverImage || "",
    author: fields.author || "",
    content: fields.content || "",
    ...fields,
  };
}

export function usePostForm(initialValues = {}) {
  const router = useRouter();
  const [fields, setFields] = useState(normalizeFields(initialValues));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function validate() {
    const errors: { [key: string]: string } = {};
    if (!fields.title.trim()) errors.title = "Title is required";
    if (!fields.author.trim()) errors.author = "Author is required";
    if (!fields.content.trim()) errors.content = "Content is required";
    if (fields.coverImage && !/^https?:\/\//.test(fields.coverImage)) errors.coverImage = "Cover image must be a valid URL";
    return errors;
  }

  async function submit({ method = "POST", id }: { method?: "POST" | "PUT"; id?: string } = {}) {
    setError(null);
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }
    setLoading(true);
    try {
      const res = await fetch(id ? `/api/posts/${id}` : "/api/posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();

      if (!res.ok) {
        setFieldErrors({ server: data.details?.join(", ") || data.error || "Failed" });
        setLoading(false);
        return false;
      }
      if (!id) router.push(`/posts/${data.data.slug}`);
      return true;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      return false;
    }
  }

  // Helper for edit page to update fields when initialValues change
  function setFieldsNormalized(newFields: any) {
    setFields(normalizeFields(newFields));
  }

  return {
    fields,
    setFields: setFieldsNormalized,
    handleChange,
    loading,
    error,
    fieldErrors,
    submit,
  };
} 