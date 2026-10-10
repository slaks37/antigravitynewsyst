import { sql } from "drizzle-orm";
import { getDatabase } from "./index";

export async function initializeDatabase(): Promise<void> {
  const db = getDatabase();

  const ddlStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name VARCHAR(150) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'AUTHOR',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS authors (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      slug VARCHAR(150) NOT NULL UNIQUE,
      email VARCHAR(255),
      role VARCHAR(150),
      bio TEXT,
      avatar_url TEXT,
      social_links JSONB,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      slug VARCHAR(150) NOT NULL UNIQUE,
      description TEXT,
      seo_title VARCHAR(255),
      seo_description TEXT,
      featured_image TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS tags (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(300) NOT NULL,
      slug VARCHAR(300) NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT,
      cover_image_alt VARCHAR(300),
      primary_category_id VARCHAR(36) REFERENCES categories(id) ON DELETE SET NULL,
      author_id VARCHAR(36) REFERENCES authors(id) ON DELETE SET NULL,
      sources JSONB,
      seo_title VARCHAR(300),
      seo_description TEXT,
      canonical_url TEXT,
      og_image TEXT,
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
      scheduled_publish_at TIMESTAMP,
      published_at TIMESTAMP,
      reading_time_minutes INTEGER NOT NULL DEFAULT 5,
      revision_count INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS post_tags (
      post_id VARCHAR(36) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      tag_id VARCHAR(36) NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, tag_id)
    );`,

    `CREATE TABLE IF NOT EXISTS post_revisions (
      id VARCHAR(36) PRIMARY KEY,
      post_id VARCHAR(36) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      editor_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
      revision_number INTEGER NOT NULL,
      title VARCHAR(300) NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      change_notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS media (
      id VARCHAR(36) PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      file_url TEXT NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_size INTEGER NOT NULL,
      dimensions VARCHAR(50),
      alt_text VARCHAR(300),
      caption TEXT,
      attribution TEXT,
      uploader_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(36) PRIMARY KEY,
      form_type VARCHAR(50) NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      business_email VARCHAR(255) NOT NULL,
      phone_number VARCHAR(50),
      company VARCHAR(200) NOT NULL,
      industry VARCHAR(100),
      plant_count INTEGER,
      employee_range VARCHAR(50),
      production_type VARCHAR(100),
      business_problem TEXT,
      source_page VARCHAR(255),
      utm_source VARCHAR(100),
      utm_medium VARCHAR(100),
      utm_campaign VARCHAR(100),
      consent BOOLEAN NOT NULL DEFAULT TRUE,
      status VARCHAR(50) NOT NULL DEFAULT 'NEW',
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      consent BOOLEAN NOT NULL DEFAULT TRUE,
      status VARCHAR(50) NOT NULL DEFAULT 'SUBSCRIBED',
      source_page VARCHAR(255),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      user_email VARCHAR(255),
      action VARCHAR(100) NOT NULL,
      target_type VARCHAR(100) NOT NULL,
      target_id VARCHAR(100),
      notes TEXT,
      metadata JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS redirects (
      id VARCHAR(36) PRIMARY KEY,
      source_path VARCHAR(500) NOT NULL UNIQUE,
      target_path VARCHAR(500) NOT NULL,
      status_code INTEGER NOT NULL DEFAULT 301,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(100) PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS content_ingest_records (
      id VARCHAR(36) PRIMARY KEY,
      source_system VARCHAR(100) NOT NULL,
      external_id VARCHAR(200),
      normalized_title VARCHAR(300) NOT NULL,
      raw_payload JSONB NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
      post_id VARCHAR(36) REFERENCES posts(id) ON DELETE SET NULL,
      error_log TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,
  ];

  for (const statement of ddlStatements) {
    try {
      await db.execute(sql.raw(statement));
    } catch (error) {
      console.error("DDL execution failed for:", statement, error);
      throw error;
    }
  }
}
