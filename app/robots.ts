import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newsystem.space";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/admin",
          "/api/admin/",
          "/api/cron",
          "/api/cron/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/static/", "/brand/"],
        disallow: ["/admin", "/admin/", "/api/admin/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
