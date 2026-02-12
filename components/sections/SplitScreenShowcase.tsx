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

interface SplitScreenShowcaseProps {
  onProductClick?: (product: UiProduct) => void
}

// Configure which product IDs to display
const SHOWCASE_PRODUCT_IDS = [439, 12, 15]

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function SplitScreenShowcase({ onProductClick }: SplitScreenShowcaseProps) {
  const t = useTranslations("SplitScreenShowcase")
  const locale = useLocale()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchShowcaseProducts = async () => {
      try {
        const idsParam = SHOWCASE_PRODUCT_IDS.join(",")
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
        console.error("Error fetching showcase products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchShowcaseProducts()
  }, [])

  // Auto-rotate main product every 5 seconds
  useEffect(() => {
    if (products.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [products.length])

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
      <section className="min-h-[50vh]">
        <div className="flex flex-col lg:flex-row min-h-[50vh]">
          {/* Left: Loading */}
          <div className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto bg-neutral-200 animate-pulse" />
          {/* Right: Loading */}
          <div className="w-full lg:w-1/2 bg-[#E2E4F0] flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="h-8 bg-neutral-300 rounded w-40 mx-auto animate-pulse" />
              <div className="h-48 bg-neutral-300 rounded w-56 mx-auto animate-pulse" />
              <div className="h-5 bg-neutral-300 rounded w-28 mx-auto animate-pulse" />
              <div className="h-10 bg-neutral-300 rounded w-36 mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    console.error("Error loading showcase:", error)
    return null
  }

  // Use current product for the main showcase (auto-rotates)
  const mainProduct = products[currentIndex]

  return (
    <section className="min-h-screen">
      {/* Top: Scrolling Marquee Banner */}
      <div className="relative w-full overflow-hidden py-12 md:py-16 bg-[#E2E4F0]">
        {/* Fade masks on both sides */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-24 bg-gradient-to-r from-[#E2E4F0] via-[#E2E4F0]/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-24 bg-gradient-to-l from-[#E2E4F0] via-[#E2E4F0]/60 to-transparent z-10 pointer-events-none" />

        {/* Scrolling text with subtle letter spacing animation */}
        <div className="flex w-max animate-marquee">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="text-3xl md:text-4xl font-light tracking-[0.2em] text-stone-600/50 mx-8 md:mx-10 font-serif italic"
            >
              HYACINTH FLORIST
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[80vh]">
        {/* Left: Lifestyle Image */}
        <div className="w-full lg:w-1/2 relative aspect-[4/5] lg:aspect-auto lg:min-h-[80vh] overflow-hidden">
          {mainProduct && getPrimaryImage(mainProduct.images) && (
            <div
              key={`image-${currentIndex}`}
              className="absolute inset-0 animate-soft-scale"
            >
              <Image
                src={getPrimaryImage(mainProduct.images)}
                alt="Hand holding elegant flower bouquet"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
        </div>

        {/* Right: Product Info Section */}
        <div className="w-full lg:w-1/2 bg-[#E2E4F0] flex items-center justify-center p-8 lg:p-16">
          <div key={`info-${currentIndex}`} className="max-w-md w-full animate-delicate-reveal">
            {/* Decorative Element */}
            <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.08s' }}>
              <div className="w-8 h-px bg-neutral-400/50" />
              <div className="mx-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-neutral-600/40"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="w-8 h-px bg-neutral-400/50" />
            </div>

            {/* Main Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-center tracking-[0.3em] text-[#78716C] mb-8 animate-fade-in uppercase" style={{ animationDelay: '0.16s' }}>
              {t("title")}
            </h2>

            {/* Product Image */}
            <div className="relative aspect-[4/5] bg-neutral-200 rounded-lg overflow-hidden mb-6 shadow-xl animate-fade-in" style={{ animationDelay: '0.24s' }}>
              {mainProduct && getPrimaryImage(mainProduct.images) && (
                <Image
                  src={getPrimaryImage(mainProduct.images)}
                  alt={mainProduct.images[0]?.alt_text || mainProduct.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Product Name & Price */}
            <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.32s' }}>
              <h3 className="text-2xl font-light text-neutral-900 tracking-wide mb-2">
                {mainProduct?.name}
              </h3>
              <p className="text-xl text-neutral-700 font-light">
                HK$ {mainProduct ? Number(mainProduct.price).toLocaleString() : "0"}
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => mainProduct && onProductClick?.(toUiProduct(mainProduct))}
                className="inline-block px-12 py-4 bg-[#E8B4B8] hover:bg-[#d49fa3] transition-all duration-300 text-neutral-800 font-serif text-sm tracking-widest"
              >
                {t("cta")}
              </button>
            </div>

            {/* Decorative bottom line */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="w-12 h-px bg-neutral-400/30" />
              <div className="w-1.5 h-1.5 rotate-45 bg-neutral-500/40" />
              <div className="w-12 h-px bg-neutral-400/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Products Grid - Shows remaining products excluding current main product */}
      {products.length > 1 && (
        <div className="bg-[#E2E4F0] py-12 lg:py-16">
          <div className="mx-auto px-4 md:px-8 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {products.filter((_, index) => index !== currentIndex).map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={toUiProduct(product)}
                  playfairClassName="font-serif"
                  inView={true}
                  index={i}
                  onClick={onProductClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
