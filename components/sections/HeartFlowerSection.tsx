"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import ProductCard from "@/components/product/ProductCard"
import type { UiProduct } from "@/app/[locale]/products/page"
import { translateProductName, translateCategory } from "@/app/[locale]/products/page"

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

interface HeartFlowerSectionProps {
  onProductClick?: (product: UiProduct) => void
}

// Configure which product IDs to display as heart flower wreath products
// Update these IDs to match your heart flower wreath products in the database
const HEART_FLOWER_PRODUCT_IDS = [244, 265, 267, 283]

// Backend API URL - change this to match your backend address
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function HeartFlowerSection({ onProductClick }: HeartFlowerSectionProps) {
  const t = useTranslations("HeartFlowerSection")
  const locale = useLocale()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeartFlowerProducts = async () => {
      try {
        const idsParam = HEART_FLOWER_PRODUCT_IDS.join(",")
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
        console.error("Error fetching heart flower products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHeartFlowerProducts()
  }, [])

  // Get primary image - ONLY use local image, no URL fallback
  const getPrimaryImage = (images: ProductImage[]): string => {
    const primary = images.find((img) => img.is_primary && img.image)
    if (primary?.image) return primary.image

    const anyWithImage = images.find((img) => img.image)
    return anyWithImage?.image ?? ""
  }

  // Transform API product to UiProduct format with locale-aware translation
  const toUiProduct = (p: Product): UiProduct => ({
    id: p.id,
    name: locale === 'en' ? translateProductName(p.name) : p.name,
    description: p.description,
    categories: p.categories?.map((c) => 
      locale === 'en' ? translateCategory(c.name) : c.name
    ) ?? [],
    locations: [],
    price: Number(p.price),
    image: getPrimaryImage(p.images),
  })

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-24 md:py-32 bg-[#8B6B6B]">
        <div className="mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-xs md:text-sm tracking-[0.25em] text-rose-200 uppercase mb-4">
              {t("tagline")}
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-rose-100 font-serif">
              {t("title")} {t("subtitle")}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-8 h-px bg-[#E8C8C8]" />
              <div className="w-4 h-4 relative">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#E8C8C8]">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div className="w-8 h-px bg-[#E8C8C8]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-[#7a5a5a]" />
                <div className="mt-6 h-5 bg-rose-800/50 rounded w-3/4 mx-auto" />
                <div className="mt-2 h-4 bg-rose-800/50 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    console.error("Error loading heart flower products:", error)
    return null
  }

  return (
    <section className="py-24 md:py-32 bg-[#8B6B6B]">
      <div className="mx-auto px-4 md:px-8">
        {/* Section Header - Heart Themed */}
        <div className="text-center mb-16">
          {/* Heart Decorative Element */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-6 h-6">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-rose-300">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
          <p className="text-xs md:text-sm tracking-[0.25em] text-rose-200 uppercase mb-4">
            {t("tagline")}
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-rose-100 font-serif">
            {t("title")} {t("subtitle")}
          </h2>
          {/* Heart Decorative Element */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-8 h-px bg-[#E8C8C8]" />
            <div className="w-5 h-5 relative">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#E8C8C8]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div className="w-8 h-px bg-[#E8C8C8]" />
          </div>
          <p className="mt-4 text-rose-300/80 font-light text-sm tracking-wide max-w-lg mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Product Grid */}
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
            href={`/${locale}/products?category=心型花牌`}
            className="inline-block text-sm tracking-widest text-rose-200 border border-rose-400/50 px-8 py-3 hover:bg-white hover:text-[#8B6B6B] hover:border-white transition-all duration-300"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  )
}
