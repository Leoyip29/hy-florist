import type { MetadataRoute } from "next"

const BASE_URL = "https://hy-florist.hk"
const locales = ["en", "zh-HK"]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/contact", "/products"]

  return staticPages.flatMap((path) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "/products" ? ("daily" as const) : ("monthly" as const),
      priority: path === "" ? 1.0 : path === "/products" ? 0.9 : 0.7,
    }))
  )
}