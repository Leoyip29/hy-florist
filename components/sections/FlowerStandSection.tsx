import { getTranslations } from "next-intl/server"
import { FlowerStandSectionClient } from "./FlowerStandSectionClient"

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

// Configure which product IDs to display as flower stand products
const FLOWER_STAND_PRODUCT_IDS = [97, 98, 101, 109]

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

async function getFlowerStandProducts(): Promise<Product[]> {
  try {
    const idsParam = FLOWER_STAND_PRODUCT_IDS.join(",")
    const response = await fetch(
      `${API_URL}/products/by-ids/?ids=${idsParam}`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      console.error("Failed to fetch flower stand products")
      return []
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error("Error fetching flower stand products:", err)
    return []
  }
}

export default async function FlowerStandSection({
  locale,
}: {
  locale: string
}) {
  const products = await getFlowerStandProducts()
  const t = await getTranslations({ locale, namespace: "FlowerStandSection" })

  return (
    <FlowerStandSectionClient
      products={products}
      locale={locale}
    />
  )
}
