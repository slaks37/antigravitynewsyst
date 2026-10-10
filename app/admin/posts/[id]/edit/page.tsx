import React from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { posts, categories, authors, postRevisions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { PostEditor } from "@/components/admin/PostEditor";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const db = getDatabase();

  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) {
    notFound();
  }

  const allCategories = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(eq(categories.active, true));

  const allAuthors = await db
    .select({ id: authors.id, name: authors.name })
    .from(authors)
    .where(eq(authors.active, true));

  const revisions = await db
    .select({
      id: postRevisions.id,
      revisionNumber: postRevisions.revisionNumber,
      title: postRevisions.title,
      changeNotes: postRevisions.changeNotes,
      createdAt: postRevisions.createdAt,
    })
    .from(postRevisions)
    .where(eq(postRevisions.postId, id))
    .orderBy(desc(postRevisions.revisionNumber));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Edit Artikel: {post.title}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perbarui konten artikel, ajukan peninjauan editorial, atau terbitkan perubahan.
        </p>
      </div>

      <PostEditor
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          coverImageAlt: post.coverImageAlt,
          primaryCategoryId: post.primaryCategoryId,
          authorId: post.authorId,
          featured: post.featured,
          status: post.status,
          scheduledPublishAt: post.scheduledPublishAt
            ? post.scheduledPublishAt.toISOString()
            : null,
        }}
        categories={allCategories}
        authors={allAuthors}
        revisions={revisions.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
        userRole={user.role}
      />
    </div>
  );
}
