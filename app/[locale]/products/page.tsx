import type { Metadata } from "next"
import { Suspense } from "react"
import ProductsClient from "@/components/product/ProductsClient"
import { buildFilterUrl, apiToUiProduct } from "@/lib/product-utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"
// Strip scheme for X-Forwarded-Host (should be host:port only)
const _apiHost = API_BASE_URL.replace(/^https?:\/\//, "")

// ISR: revalidate every 60 seconds
export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === "en"
  return {
    title: isEn ? "Sympathy Flowers & Floral Arrangements" : "帛事花及花藝佈置",
    description: isEn
      ? "Premium sympathy flowers, wreaths, bouquets, and floral arrangements for funerals and memorial services in Hong Kong. Order online for reliable delivery."
      : "專業帛事鮮花、花圈、花束及花藝佈置，適用於殯儀及祭祀場合。香港送花，網上落單。",
    alternates: {
      canonical: `https://hy-florist.hk/${locale}/products`,
      languages: {
        "en": "https://hy-florist.hk/en/products",
        "zh-HK": "https://hy-florist.hk/zh-HK/products",
      },
    },
    openGraph: {
      title: isEn ? "Sympathy Flowers | Hyacinth Florist" : "帛事鮮花 | Hyacinth Florist",
      description: isEn
        ? "Premium sympathy flowers and floral arrangements for funerals and memorial services in Hong Kong."
        : "專業帛事鮮花及花藝佈置，適用於殯儀及祭祀場合。",
      images: [{ url: "https://hy-florist.hk/store.png" }],
    },
  }
}

async function getProductsData(locale: string) {
  try {
    const headers = { "X-Forwarded-Host": _apiHost }
    // Fetch categories and products in parallel
    const [categoriesRes, productsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/categories/`, { next: { revalidate: 60 }, headers }),
      fetch(
        buildFilterUrl(`${API_BASE_URL}/api/products/`, "", "", "recommended", 1, locale),
        { next: { revalidate: 60 }, headers }
      ),
    ])

    if (!categoriesRes.ok || !productsRes.ok) {
      return null
    }

    const categoriesData = await categoriesRes.json() as {
      categories: { id: number; name: string; name_en: string; logo?: string | null }[]
    }
    const productsData = await productsRes.json() as {
      count: number
      results: unknown[]
    }

    // Build category images map from backend logo field (backend returns full URL)
    const categoryImages: Record<string, string> = {}
    for (const cat of categoriesData.categories) {
      if (cat.logo) categoryImages[cat.name] = cat.logo
    }

    return {
      categories: categoriesData.categories,
      products: productsData.results.map((p) => apiToUiProduct(p as Parameters<typeof apiToUiProduct>[0], locale)),
      totalCount: productsData.count,
      categoryImages,
    }
  } catch {
    return null
  }
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const initialData = await getProductsData(locale)

  return (
    <Suspense fallback={<div className="pt-[125px] min-h-screen" />}>
      <ProductsClient initialData={initialData} />
    </Suspense>
  )
}
