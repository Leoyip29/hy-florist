import type { ApiProduct } from "./product-utils"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"

async function parseProductsResponse(res: Response): Promise<ApiProduct[]> {
  const data = await res.json()
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return []
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
    return parseProductsResponse(res)
  } catch {
    return []
  }
}

export async function fetchFeaturedProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/?sort=hot`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error(`Failed to fetch featured products: ${res.status}`)
    const products = await parseProductsResponse(res)
    // Fallback: if hot-seller filter returns nothing, return first page of all products
    if (products.length === 0) {
      const fallback = await fetch(`${API_BASE_URL}/api/products/`, { cache: "no-store" })
      if (fallback.ok) return parseProductsResponse(fallback)
    }
    return products
  } catch {
    return []
  }
}

export async function fetchProductsByIds(ids: number[]): Promise<ApiProduct[]> {
  if (ids.length === 0) return []
  try {
    const idsParam = ids.join(",")
    const res = await fetch(
      `${API_BASE_URL}/api/products/by-ids/?ids=${idsParam}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error(`Failed to fetch products by ids: ${res.status}`)
    return parseProductsResponse(res)
  } catch {
    return []
  }
}