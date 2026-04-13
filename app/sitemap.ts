import type { MetadataRoute } from "next"

const BASE_URL = "https://hy-florist.hk"
const locales = ["en", "zh-HK"]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", changefreq: "weekly" as const, priority: 1.0 },
    { path: "/about", changefreq: "monthly" as const, priority: 0.7 },
    { path: "/contact", changefreq: "monthly" as const, priority: 0.8 },
    { path: "/products", changefreq: "daily" as const, priority: 0.9 },
  ]

  return staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changefreq,
      priority: page.priority,
    }))
  )
}