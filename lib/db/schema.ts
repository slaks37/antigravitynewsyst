import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

/**
 * 1. Users & RBAC
 * Roles: SUPERADMIN | CONTENT_MANAGER | EDITOR | REVIEWER | AUTHOR | MARKETING_LEAD_MANAGER
 */
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("AUTHOR"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 2. Authors
 */
export const authors = pgTable("authors", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 150 }),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  socialLinks: jsonb("social_links").$type<Record<string, string>>(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 3. Categories (11 initial categories)
 */
export const categories = pgTable("categories", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description"),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  featuredImage: text("featured_image"),
  displayOrder: integer("display_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 4. Tags
 */
export const tags = pgTable("tags", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * 5. Posts (Articles)
 * Workflow: DRAFT | IN_REVIEW | CHANGES_REQUESTED | APPROVED | SCHEDULED | PUBLISHED | ARCHIVED
 */
export const posts = pgTable("posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(), // HTML / Markdown / Rich-Text blocks JSON
  coverImage: text("cover_image"),
  coverImageAlt: varchar("cover_image_alt", { length: 300 }),
  primaryCategoryId: varchar("primary_category_id", { length: 36 }).references(
    () => categories.id
  ),
  authorId: varchar("author_id", { length: 36 }).references(() => authors.id),
  sources: jsonb("sources").$type<Array<{ title: string; url?: string; notes?: string }>>(),
  seoTitle: varchar("seo_title", { length: 300 }),
  seoDescription: text("seo_description"),
  canonicalUrl: text("canonical_url"),
  ogImage: text("og_image"),
  featured: boolean("featured").notNull().default(false),
  status: varchar("status", { length: 50 }).notNull().default("DRAFT"),
  scheduledPublishAt: timestamp("scheduled_publish_at"),
  publishedAt: timestamp("published_at"),
  readingTimeMinutes: integer("reading_time_minutes").notNull().default(5),
  revisionCount: integer("revision_count").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 6. Post Tags Mapping
 */
export const postTags = pgTable(
  "post_tags",
  {
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 36 })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })]
);

/**
 * 7. Post Revisions (Version History & Rollback)
 */
export const postRevisions = pgTable("post_revisions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  postId: varchar("post_id", { length: 36 })
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  editorId: varchar("editor_id", { length: 36 }).references(() => users.id),
  revisionNumber: integer("revision_number").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  changeNotes: text("change_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * 8. Media Library
 */
export const media = pgTable("media", {
  id: varchar("id", { length: 36 }).primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  dimensions: varchar("dimensions", { length: 50 }),
  altText: varchar("alt_text", { length: 300 }),
  caption: text("caption"),
  attribution: text("attribution"),
  uploaderId: varchar("uploader_id", { length: 36 }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * 9. Leads (Contact, Demo Requests, Design Partner Registrations)
 */
export const leads = pgTable("leads", {
  id: varchar("id", { length: 36 }).primaryKey(),
  formType: varchar("form_type", { length: 50 }).notNull(), // 'CONTACT' | 'DEMO_REQUEST' | 'DESIGN_PARTNER'
  fullName: varchar("full_name", { length: 150 }).notNull(),
  businessEmail: varchar("business_email", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 50 }),
  company: varchar("company", { length: 200 }).notNull(),
  industry: varchar("industry", { length: 100 }),
  plantCount: integer("plant_count"),
  employeeRange: varchar("employee_range", { length: 50 }),
  productionType: varchar("production_type", { length: 100 }), // MTO, MTS, Batch, Discrete, etc.
  businessProblem: text("business_problem"),
  sourcePage: varchar("source_page", { length: 255 }),
  utmSource: varchar("utm_source", { length: 100 }),
  utmMedium: varchar("utm_medium", { length: 100 }),
  utmCampaign: varchar("utm_campaign", { length: 100 }),
  consent: boolean("consent").notNull().default(true),
  status: varchar("status", { length: 50 }).notNull().default("NEW"), // NEW | CONTACTED | QUALIFIED | IN_DISCUSSION | CLOSED
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 10. Newsletter Subscriptions
 */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  consent: boolean("consent").notNull().default(true),
  status: varchar("status", { length: 50 }).notNull().default("SUBSCRIBED"), // SUBSCRIBED | UNSUBSCRIBED
  sourcePage: varchar("source_page", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 11. Editorial Activity / Audit Logs
 */
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }),
  userEmail: varchar("user_email", { length: 255 }),
  action: varchar("action", { length: 100 }).notNull(),
  targetType: varchar("target_type", { length: 100 }).notNull(),
  targetId: varchar("target_id", { length: 100 }),
  notes: text("notes"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * 12. SEO Redirects
 */
export const redirects = pgTable("redirects", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sourcePath: varchar("source_path", { length: 500 }).notNull().unique(),
  targetPath: varchar("target_path", { length: 500 }).notNull(),
  statusCode: integer("status_code").notNull().default(301),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * 13. Site Settings (Key-Value)
 */
export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * 14. Ingestion Records (n8n / Make / External APIs)
 */
export const contentIngestRecords = pgTable("content_ingest_records", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sourceSystem: varchar("source_system", { length: 100 }).notNull(),
  externalId: varchar("external_id", { length: 200 }),
  normalizedTitle: varchar("normalized_title", { length: 300 }).notNull(),
  rawPayload: jsonb("raw_payload").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("QUEUED"), // QUEUED | PROCESSED | REJECTED | DUPLICATE
  postId: varchar("post_id", { length: 36 }).references(() => posts.id),
  errorLog: text("error_log"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
