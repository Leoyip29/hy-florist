import { getTranslations } from "next-intl/server"
import { HeartFlowerSectionClient } from "./HeartFlowerSectionClient"

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

// Configure which product IDs to display as heart flower wreath products
const HEART_FLOWER_PRODUCT_IDS = [244, 265, 267, 283]

// Backend API URL
const API_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000") + "/api"

async function getHeartFlowerProducts(): Promise<Product[]> {
  try {
    const idsParam = HEART_FLOWER_PRODUCT_IDS.join(",")
    const response = await fetch(
      `${API_URL}/products/by-ids/?ids=${idsParam}`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      console.error("Failed to fetch heart flower products")
      return []
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error("Error fetching heart flower products:", err)
    return []
  }
}

export default async function HeartFlowerSection({
  locale,
}: {
  locale: string
}) {
  const products = await getHeartFlowerProducts()
  const t = await getTranslations({ locale, namespace: "HeartFlowerSection" })

  return (
    <HeartFlowerSectionClient
      products={products}
      locale={locale}
    />
  )
}
