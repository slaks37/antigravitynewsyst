#!/usr/bin/env node
/**
 * NewSystem Blog Automation Model Context Protocol (MCP) Server
 * Compatible with Claude Desktop, Cursor, Antigravity, and any MCP client.
 *
 * Implements JSON-RPC 2.0 over standard I/O (stdio).
 */

import readline from "node:readline";

const API_BASE =
  process.env.BLOG_API_URL ||
  process.env.NEXT_PUBLIC_CMS_URL ||
  "http://localhost:3000";

const API_KEY =
  process.env.BLOG_AUTOMATION_API_KEY ||
  process.env.EDITORIAL_INGEST_API_KEY ||
  "newsystem_dev_automation_key";

const SERVER_NAME = "newsystem-blog-mcp";
const SERVER_VERSION = "1.0.0";

const TOOLS = [
  {
    name: "create_blog_post",
    description:
      "Membuat dan mempublikasikan (atau menjadwalkan/draf) artikel blog baru di NewSystem.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Judul artikel (wajib)",
        },
        content: {
          type: "string",
          description: "Isi artikel lengkap dalam format Markdown atau HTML (wajib)",
        },
        category: {
          type: "string",
          description:
            "Kategori artikel (opsional, contoh: 'erp-core', 'mes-shop-floor', 'accounting-hpp')",
        },
        author: {
          type: "string",
          description:
            "Nama atau slug penulis (opsional, default: 'Stefen' / 'stefen')",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Daftar tag (opsional, contoh: ['ERP', 'Manufaktur', 'HPP'])",
        },
        status: {
          type: "string",
          enum: ["PUBLISHED", "DRAFT", "SCHEDULED", "IN_REVIEW"],
          description:
            "Status artikel (default: 'PUBLISHED' agar langsung tayang)",
        },
        excerpt: {
          type: "string",
          description: "Ringkasan artikel (opsional, otomatis diekstrak jika kosong)",
        },
        coverImage: {
          type: "string",
          description: "URL gambar sampul artikel (opsional)",
        },
        scheduledPublishAt: {
          type: "string",
          description:
            "Waktu publikasi ISO jika status 'SCHEDULED' (contoh: '2026-10-30T09:00:00Z')",
        },
        seoTitle: {
          type: "string",
          description: "Judul SEO kustom (opsional)",
        },
        seoDescription: {
          type: "string",
          description: "Deskripsi meta SEO (opsional)",
        },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "list_blog_posts",
    description: "Melihat daftar artikel blog yang sudah ada di NewSystem.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["ALL", "PUBLISHED", "DRAFT", "SCHEDULED", "IN_REVIEW"],
          description: "Filter status artikel (default: 'ALL')",
        },
        limit: {
          type: "number",
          description: "Jumlah artikel yang ditampilkan (default: 10, max: 50)",
        },
        search: {
          type: "string",
          description: "Kata kunci pencarian judul artikel",
        },
      },
    },
  },
  {
    name: "get_blog_post",
    description: "Melihat isi lengkap dan metadata dari suatu artikel berdasarkan ID atau slug.",
    inputSchema: {
      type: "object",
      properties: {
        idOrSlug: {
          type: "string",
          description: "ID artikel (contoh: 'post-123') atau slug artikel (contoh: 'erp-vs-mes')",
        },
      },
      required: ["idOrSlug"],
    },
  },
  {
    name: "update_blog_post",
    description: "Memperbarui artikel yang sudah ada di NewSystem.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "ID artikel atau slug yang ingin diperbarui",
        },
        title: { type: "string" },
        content: { type: "string" },
        excerpt: { type: "string" },
        status: {
          type: "string",
          enum: ["PUBLISHED", "DRAFT", "SCHEDULED", "IN_REVIEW"],
        },
        coverImage: { type: "string" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_blog_post",
    description: "Menghapus artikel blog dari sistem.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "ID atau slug artikel yang ingin dihapus",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_categories",
    description: "Melihat daftar kategori artikel yang tersedia di NewSystem.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "list_authors",
    description: "Melihat daftar penulis artikel yang terdaftar di NewSystem.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Helper to make authenticated requests to NewSystem Blog API
async function callBlogApi(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return data;
}

// Tool handlers
async function handleToolCall(name, args) {
  switch (name) {
    case "create_blog_post": {
      const result = await callBlogApi("/api/v1/posts", {
        method: "POST",
        body: JSON.stringify({
          title: args.title,
          content: args.content,
          category: args.category,
          author: args.author || "Stefen",
          tags: args.tags || [],
          status: args.status || "PUBLISHED",
          excerpt: args.excerpt,
          coverImage: args.coverImage,
          scheduledPublishAt: args.scheduledPublishAt,
          seoTitle: args.seoTitle,
          seoDescription: args.seoDescription,
        }),
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Artikel berhasil dipublikasikan!\n\nJudul: ${result.post.title}\nSlug: ${result.post.slug}\nStatus: ${result.post.status}\nPenulis: ${result.post.author}\nKategori: ${result.post.category}\nURL Publik: ${result.post.publicUrl}`,
          },
        ],
      };
    }

    case "list_blog_posts": {
      const params = new URLSearchParams();
      if (args.status) params.set("status", args.status);
      if (args.limit) params.set("limit", String(args.limit));
      if (args.search) params.set("search", args.search);

      const result = await callBlogApi(`/api/v1/posts?${params.toString()}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case "get_blog_post": {
      const result = await callBlogApi(`/api/v1/posts/${encodeURIComponent(args.idOrSlug)}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case "update_blog_post": {
      const { id, ...updateFields } = args;
      const result = await callBlogApi(`/api/v1/posts/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(updateFields),
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Artikel (${id}) berhasil diperbarui!`,
          },
        ],
      };
    }

    case "delete_blog_post": {
      const result = await callBlogApi(`/api/v1/posts/${encodeURIComponent(args.id)}`, {
        method: "DELETE",
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Artikel (${args.id}) berhasil dihapus!`,
          },
        ],
      };
    }

    case "list_categories": {
      const result = await callBlogApi("/api/v1/categories");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.categories, null, 2),
          },
        ],
      };
    }

    case "list_authors": {
      const result = await callBlogApi("/api/v1/authors");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.authors, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Tool tidak dikenal: ${name}`);
  }
}

// JSON-RPC processing loop over stdin/stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function sendResponse(id, result) {
  process.stdout.write(
    JSON.stringify({
      jsonrpc: "2.0",
      id,
      result,
    }) + "\n"
  );
}

function sendError(id, code, message) {
  process.stdout.write(
    JSON.stringify({
      jsonrpc: "2.0",
      id,
      error: { code, message },
    }) + "\n"
  );
}

rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const request = JSON.parse(trimmed);
    const { id, method, params } = request;

    switch (method) {
      case "initialize":
        sendResponse(id, {
          protocolVersion: "2024-11-05",
          serverInfo: {
            name: SERVER_NAME,
            version: SERVER_VERSION,
          },
          capabilities: {
            tools: {},
          },
        });
        break;

      case "notifications/initialized":
        // Notification, no reply expected
        break;

      case "tools/list":
        sendResponse(id, { tools: TOOLS });
        break;

      case "tools/call": {
        try {
          const { name, arguments: toolArgs } = params;
          const result = await handleToolCall(name, toolArgs || {});
          sendResponse(id, result);
        } catch (toolErr) {
          sendResponse(id, {
            content: [
              {
                type: "text",
                text: `❌ Error: ${toolErr.message}`,
              },
            ],
            isError: true,
          });
        }
        break;
      }

      default:
        sendError(id, -32601, `Method '${method}' not found`);
        break;
    }
  } catch (err) {
    sendError(null, -32700, "Parse error: " + err.message);
  }
});
