import { getTranslations } from "next-intl/server"
import { FeaturedProductsClient } from "./FeaturedProductsClient"

interface ProductImage {
  id: number
  image: string
  alt_text: string
  is_primary: boolean
}

interface Product {
  id: number
  name: string
  description: string
  price: string
  categories: { id: number; name: string }[]
  images: ProductImage[]
}

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products/?sort=hot`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error("Failed to fetch featured products")
      return []
    }

    const data = await response.json()
    // API returns paginated response: { count, results, ... }
    return data.results ?? data ?? []
  } catch (err) {
    console.error("Error fetching featured products:", err)
    return []
  }
}

export default async function FeaturedProducts({
  locale,
}: {
  locale: string
}) {
  const products = await getFeaturedProducts()

  return (
    <FeaturedProductsClient 
      products={products} 
      locale={locale}
    />
  )
}
