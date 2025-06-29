# Blogify

A modern, full-featured blogging platform built with Next.js (App Router), TypeScript, and TailwindCSS. Supports CRUD for blog posts, dynamic custom blocks (like product showcases), Markdown, SEO-friendly slugs, search/filter, pagination, and a comment system—all with a beautiful, responsive UI.

---

## 🚀 Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Rendering:** Server-Side Rendering (SSR) where appropriate
- **Database:** File-based JSON (no external DB required)

---

## ✨ Features
- **Home Page:** SSR list of blog posts with title, author, snippet, cover image, and published date
- **Post Detail Page:** SSR, full content with Markdown and dynamic `{{block}}` tags (renders custom UI like product showcases)
- **Create/Edit Blog:** Modern form with validation, Markdown support, and block tag hints
- **API:** RESTful endpoints for posts and comments
- **SEO-Friendly Slugs:** URLs like `/posts/your-post-title`
- **Search & Filter:** Search by keyword and filter by author
- **Pagination:** "Load More" button for infinite scroll-like UX
- **Comment System:** Add/view comments per post (name, body, date)
- **Robust Validation:** Both client and server-side
- **Responsive UI:** Clean, modern, and mobile-friendly

---

## 🛠️ Setup Instructions

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd Blogify
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open in your browser:**
   [http://localhost:3000](http://localhost:3000)

---

## 📚 API Endpoints

### Posts
- `GET    /api/posts` — List posts (supports `search`, `author`, `page`, `limit`)
- `GET    /api/posts/[id]` — Get post by ID
- `POST   /api/posts` — Create post
- `PUT    /api/posts/[id]` — Edit post
- `DELETE /api/posts/[id]` — Delete post

### Comments
- `GET    /api/comments?postId=...` — List comments for a post
- `POST   /api/comments` — Add a comment to a post

---

## 📁 File Structure (Key Parts)
- `src/app/` — App Router pages (home, posts, create, edit)
- `src/components/` — UI components (BlogCard, ContentRenderer, ProductShowcase, CommentSection, etc.)
- `src/data/` — JSON files for posts, products, and comments
- `src/lib/` — DB and block parsing logic
- `src/types/` — TypeScript types

---

## 📋 Requirements Checklist
- [x] CRUD for blog posts
- [x] Dynamic `{{block}}` tags with custom UI
- [x] File-based JSON DB
- [x] Modern, responsive UI
- [x] Markdown support
- [x] SEO-friendly slugs
- [x] Search, filter, and pagination
- [x] Comment system
- [x] Robust validation

---

## License
This project is for evaluation purposes only and not for commercial use.
