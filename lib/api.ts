import type { ApiProduct } from "./product-utils"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"

export async function fetchProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
    return res.json()
  } catch {
    return []
  }
}

export async function fetchFeaturedProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/?sort=hot`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Failed to fetch featured products: ${res.status}`)
    return res.json()
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
    return res.json()
  } catch {
    return []
  }
}