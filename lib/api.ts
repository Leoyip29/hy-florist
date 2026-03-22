import type { ApiProduct } from "./product-utils"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"

async function parseProductsResponse(res: Response): Promise<{ results: ApiProduct[]; next: string | null }> {
  const data = await res.json()
  if (Array.isArray(data)) return { results: data, next: null }
  if (Array.isArray(data?.results)) return { results: data.results, next: data.next ?? null }
  return { results: [], next: null }
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  try {
    const all: ApiProduct[] = []
    let url: string | null = `${API_BASE_URL}/api/products/`

    while (url) {
      const res = await fetch(url, { next: { revalidate: 60 } })
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
      const { results, next } = await parseProductsResponse(res)
      all.push(...results)
      url = next
    }

    return all
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
    const { results } = await parseProductsResponse(res)
    // Fallback: if hot-seller filter returns nothing, return first page of all products
    if (results.length === 0) {
      const fallback = await fetch(`${API_BASE_URL}/api/products/`, { cache: "no-store" })
      if (fallback.ok) return (await parseProductsResponse(fallback)).results
    }
    return results
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
    return (await parseProductsResponse(res)).results
  } catch {
    return []
  }
}