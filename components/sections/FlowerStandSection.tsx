"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import ProductCard from "@/components/product/ProductCard"
import type { UiProduct } from "@/app/[locale]/products/page"

interface ProductImage {
  id: number
  image: string  // Local file path (e.g., /media/products/xxx.jpg)
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

interface FlowerStandSectionProps {
  onProductClick?: (product: UiProduct) => void
}

// Configure which product IDs to display as flower stand products
// Update these IDs to match your flower stand products in the database
const FLOWER_STAND_PRODUCT_IDS = [97, 98, 101, 	109]

// Backend API URL - change this to match your backend address
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function FlowerStandSection({ onProductClick }: FlowerStandSectionProps) {
  const t = useTranslations("FlowerStandSection")
  const locale = useLocale()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFlowerStandProducts = async () => {
      try {
        const idsParam = FLOWER_STAND_PRODUCT_IDS.join(",")
        const response = await fetch(
          `${API_URL}/products/by-ids/?ids=${idsParam}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching flower stand products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFlowerStandProducts()
  }, [])

  // Get primary image - ONLY use local image, no URL fallback
  const getPrimaryImage = (images: ProductImage[]): string => {
    const primary = images.find((img) => img.is_primary && img.image)
    if (primary?.image) return primary.image

    const anyWithImage = images.find((img) => img.image)
    return anyWithImage?.image ?? ""
  }

  // Transform API product to UiProduct format
  const toUiProduct = (p: Product): UiProduct => ({
    id: p.id,
    name: p.name,
    description: p.description,
    categories: p.categories?.map((c) => c.name) ?? [],
    locations: [],
    price: Number(p.price),
    image: getPrimaryImage(p.images),
  })

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-24 md:py-32 bg-[#5c4d3c]">
        <div className="mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-xs md:text-sm tracking-[0.25em] text-stone-300 uppercase mb-4">
              {t("tagline")}
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-stone-100 font-serif">
              {t("title")} {t("subtitle")}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-8 h-px bg-[#D4C8B8]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#9CAFA3]" />
              <div className="w-8 h-px bg-[#D4C8B8]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-[#4a3f32]" />
                <div className="mt-6 h-5 bg-stone-700 rounded w-3/4 mx-auto" />
                <div className="mt-2 h-4 bg-stone-700 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    console.error("Error loading flower stand products:", error)
    return null
  }

  return (
    <section className="py-24 md:py-32 bg-[#5c4d3c]">
      <div className="mx-auto px-4 md:px-8">
        {/* Section Header - Elegant & Minimal */}
        <div className="text-center mb-16">
          <p className="text-xs md:text-sm tracking-[0.25em] text-stone-300 uppercase mb-4">
            {t("tagline")}
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-stone-100 font-serif">
            {t("title")} {t("subtitle")}
          </h2>
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-8 h-px bg-[#D4C8B8]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#9CAFA3]" />
            <div className="w-8 h-px bg-[#D4C8B8]" />
          </div>
          <p className="mt-4 text-stone-400 font-light text-sm tracking-wide max-w-lg mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Product Grid - Clean & Spacious */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={toUiProduct(product)}
              playfairClassName="font-serif"
              inView={true}
              index={index}
              onClick={onProductClick}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center">
          <Link
            href={`/${locale}/products?category=十字架花牌`}
            className="inline-block text-sm tracking-widest text-stone-300 border border-stone-500 px-8 py-3 hover:bg-white hover:text-[#5c4d3c] hover:border-white transition-all duration-300"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  )
}
