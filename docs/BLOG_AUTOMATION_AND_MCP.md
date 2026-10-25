# Panduan Otomasi Blog & Model Context Protocol (MCP) NewSystem

Dokumen ini menjelaskan integrasi otomatisasi publikasi artikel blog untuk NewSystem melalui **CMS Subdomain (`cms.newsystem.space`)**, **REST API Endpoint (`/api/v1/posts`)**, dan **Model Context Protocol (MCP) Server**.

---

## 1. Akses CMS NewSystem

CMS NewSystem dapat diakses melalui subdomain:
- **Alamat CMS**: `https://cms.newsystem.space`
- **Halaman Login**: `https://cms.newsystem.space/admin/login` (atau `https://cms.newsystem.space/login`)
- **Manajemen Artikel**: `https://cms.newsystem.space/admin/posts`
- **Dashboard Overview**: `https://cms.newsystem.space/admin`

*Catatan Routing:* Middleware secara otomatis mengarahkan akses dari `cms.newsystem.space` langsung ke portal administrasi CMS.

---

## 2. REST API Otomasi Blog (`/api/v1/posts`)

Endpoint ini dirancang khusus untuk mempublikasikan artikel secara otomatis dari script, webhook, AI pipeline, n8n, Make, atau CMS eksternal.

### Header Autentikasi
Sertakan salah satu header berikut:
```http
Authorization: Bearer <BLOG_AUTOMATION_API_KEY>
```
atau
```http
X-API-Key: <BLOG_AUTOMATION_API_KEY>
```

> **API Key Default (Development):** `newsystem_dev_automation_key`
>
> Di lingkungan produksi, atur variabel lingkungan `BLOG_AUTOMATION_API_KEY` di file `.env`.

---

### A. Membuat / Auto-Posting Artikel Baru
- **Endpoint**: `POST /api/v1/posts`
- **Content-Type**: `application/json`

#### Parameter Payload:
| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `title` | string | **Ya** | Judul artikel blog (min. 3 karakter). |
| `content` | string | **Ya** | Isi lengkap artikel dalam format **Markdown** atau HTML. |
| `category` | string | Tidak | Slug atau nama kategori (contoh: `"erp-core"` atau `"ERP Core"`). |
| `author` | string | Tidak | Nama, slug, atau email penulis (contoh: `"Stefen"`, `"stefen@newsystem.space"`). Default ke Stefen. |
| `tags` | string[] | Tidak | Array tag (contoh: `["ERP", "MES", "Manufaktur"]`). Tag baru akan otomatis dibuat jika belum ada. |
| `status` | string | Tidak | `"PUBLISHED"` (langsung terbit), `"SCHEDULED"`, `"DRAFT"`, atau `"IN_REVIEW"`. Default: `"PUBLISHED"`. |
| `slug` | string | Tidak | Slug URL kustom. Jika dikosongkan, dibuat otomatis dari judul. |
| `excerpt` | string | Tidak | Ringkasan artikel. Jika dikosongkan, diekstrak otomatis dari 180 karakter pertama teks. |
| `coverImage` | string | Tidak | URL gambar sampul. |
| `scheduledPublishAt` | string | Tidak | Format ISO date (contoh: `2026-10-30T09:00:00Z`). Otomatis mengubah status ke `SCHEDULED`. |
| `seoTitle` | string | Tidak | Judul SEO (default mengikuti `title`). |
| `seoDescription` | string | Tidak | Deskripsi meta SEO (default mengikuti `excerpt`). |
| `featured` | boolean | Tidak | Menandai artikel sebagai unggulan di beranda (default: `false`). |

#### Contoh Request cURL:
```bash
curl -X POST https://cms.newsystem.space/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer newsystem_dev_automation_key" \
  -d '{
    "title": "Cara Menghitung HPP Aktual Pabrik dengan Sistem Terpadu",
    "content": "## Urgensi HPP Aktual\n\nMenghitung Harga Pokok Penjualan (HPP) aktual memerlukan data sinkron antara bahan baku terpakai, jam kerja operator, dan overhead...\n\n### 3 Elemen Kunci\n1. Pemakaian Bahan Baku (BOM riil)\n2. Tenaga Kerja Langsung\n3. Alokasi Biaya Mesin",
    "category": "accounting-hpp",
    "author": "Stefen",
    "tags": ["HPP Aktual", "Akuntansi Biaya", "Manufaktur"],
    "status": "PUBLISHED"
  }'
```

#### Contoh Response:
```json
{
  "success": true,
  "message": "Artikel berhasil dibuat dan langsung dipublikasikan.",
  "post": {
    "id": "post-a1b2c3d4-...",
    "title": "Cara Menghitung HPP Aktual Pabrik dengan Sistem Terpadu",
    "slug": "cara-menghitung-hpp-aktual-pabrik-dengan-sistem-terpadu",
    "status": "PUBLISHED",
    "category": "Kalkulasi HPP Aktual",
    "author": "Stefen",
    "publishedAt": "2026-10-25T09:20:00.000Z",
    "readingTimeMinutes": 3,
    "publicUrl": "https://newsystem.space/blog/cara-menghitung-hpp-aktual-pabrik-dengan-sistem-terpadu"
  }
}
```

---

### B. Melihat Daftar Artikel
- **Endpoint**: `GET /api/v1/posts`
- **Query Parameter**:
  - `status`: `"PUBLISHED"` | `"DRAFT"` | `"SCHEDULED"` | `"IN_REVIEW"` | `"ALL"` (default: `"ALL"`)
  - `category`: slug kategori (contoh: `erp-core`)
  - `search`: kata kunci pencarian
  - `limit`: jumlah data per halaman (default: `20`, maks: `100`)
  - `page`: nomor halaman (default: `1`)

---

### C. Melihat Detail / Memperbarui / Menghapus Artikel
- **Ambil Artikel**: `GET /api/v1/posts/:idOrSlug`
- **Perbarui Artikel**: `PUT /api/v1/posts/:idOrSlug`
- **Hapus Artikel**: `DELETE /api/v1/posts/:idOrSlug`

---

### D. Referensi Kategori & Penulis
- **Daftar Kategori**: `GET /api/v1/categories`
- **Daftar Penulis**: `GET /api/v1/authors`

---

## 3. Model Context Protocol (MCP) Server

NewSystem menyediakan server MCP mandiri (`scripts/blog-mcp-server.mjs`) yang memungkinkan AI agent (Claude Desktop, Cursor, Antigravity, dll.) untuk berinteraksi langsung dengan blog NewSystem tanpa perlu menulis kode HTTP manual.

### Tools yang Disediakan MCP:
1. `create_blog_post`: Membuat dan langsung mempublikasikan atau menjadwalkan artikel.
2. `list_blog_posts`: Menampilkan daftar artikel yang telah ada beserta statusnya.
3. `get_blog_post`: Mengambil isi artikel lengkap dan metadata berdasarkan ID atau slug.
4. `update_blog_post`: Memperbarui judul, konten, atau status artikel.
5. `delete_blog_post`: Menghapus artikel.
6. `list_categories`: Menampilkan daftar kategori yang tersedia.
7. `list_authors`: Menampilkan daftar penulis.

### Menjalankan MCP Server
```bash
node scripts/blog-mcp-server.mjs
```
atau via npm script:
```bash
pnpm mcp:blog
```

### Konfigurasi MCP Client (Contoh: Claude Desktop / Cursor)
Tambahkan ke konfigurasi MCP Anda (`claude_desktop_config.json` atau `mcp.json`):
```json
{
  "mcpServers": {
    "newsystem-blog": {
      "command": "node",
      "args": ["/Users/academy/.gemini/antigravity/scratch/antigravitynewsyst/scripts/blog-mcp-server.mjs"],
      "env": {
        "BLOG_API_URL": "https://cms.newsystem.space",
        "BLOG_AUTOMATION_API_KEY": "newsystem_dev_automation_key"
      }
    }
  }
}
```

---

## 4. Contoh Skrip Otomasi Python

```python
import requests

API_URL = "https://cms.newsystem.space/api/v1/posts"
API_KEY = "newsystem_dev_automation_key"

article = {
    "title": "Penerapan AI Copilot di Lantai Produksi Manufaktur",
    "content": """## AI di Lantai Pabrik
    
Mengapa integrasi AI dalam sistem manufaktur perlu berfokus pada data operasional aktual?
Banyak pabrik mengeluhkan jeda laporan dari lantai kerja ke manajemen...""",
    "category": "copilot",
    "author": "Stefen",
    "tags": ["AI Copilot", "MES", "Smart Factory"],
    "status": "PUBLISHED"
}

response = requests.post(
    API_URL,
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    },
    json=article
)

data = response.json()
print("Hasil Publikasi:", data["post"]["publicUrl"])
```
