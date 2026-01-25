"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface ProductImage {
  id: number
  url: string
  alt_text: string
  is_primary: boolean
}

interface Product {
  id: number
  name: string
  description: string
  price: string
  images: ProductImage[]
}

// Configure which product IDs to display
const SHOWCASE_PRODUCT_IDS = [439, 12, 15, 439]

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function SplitScreenShowcase() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const getPrimaryImage = (images: ProductImage[]): string => {
    const primary = images.find((img) => img.is_primary)
    return primary?.url || (images.length > 0 ? images[0].url : "")
  }

  // Loading skeleton
  if (loading) {
    return (
      <section className="min-h-screen">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left: Loading */}
          <div className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto bg-neutral-200 animate-pulse" />
          {/* Right: Loading */}
          <div className="w-full lg:w-1/2 bg-[#E2E4F0] flex items-center justify-center p-12">
            <div className="text-center space-y-6">
              <div className="h-10 bg-neutral-300 rounded w-48 mx-auto animate-pulse" />
              <div className="h-64 bg-neutral-300 rounded w-64 mx-auto animate-pulse" />
              <div className="h-6 bg-neutral-300 rounded w-32 mx-auto animate-pulse" />
              <div className="h-12 bg-neutral-300 rounded w-40 mx-auto animate-pulse" />
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

  // Use first product for the main showcase
  const mainProduct = products[0]

  return (
    <section className="min-h-screen">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left: Lifestyle Image */}
        <div className="w-full lg:w-1/2 relative aspect-[4/5] lg:aspect-auto lg:min-h-screen">
          {mainProduct && getPrimaryImage(mainProduct.images) && (
            <Image
              src={getPrimaryImage(mainProduct.images)}
              alt="Hand holding elegant flower bouquet"
              fill
              className="object-cover"
              priority
            />
          )}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
        </div>

        {/* Right: Product Info Section */}
        <div className="w-full lg:w-1/2 bg-[#E2E4F0] flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-md w-full">
            {/* Decorative Element */}
            <div className="flex justify-center mb-8">
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-center tracking-[0.15em] text-white mb-8">
              PEARLESCENT WHISPER
            </h2>

            {/* Product Image */}
            <div className="relative aspect-[4/5] bg-neutral-800/80 rounded-lg overflow-hidden mb-6 shadow-xl">
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
            <div className="text-center mb-8">
              <h3 className="text-xl font-light text-white tracking-wide mb-2">
                {mainProduct?.name}
              </h3>
              <p className="text-lg text-white/80 font-light">
                from HK$ {mainProduct ? Number(mainProduct.price).toLocaleString() : "0"}
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link
                href={mainProduct ? `/products?id=${mainProduct.id}` : "/products"}
                className="inline-block px-12 py-4 bg-[#E8B4B8] hover:bg-[#d49fa3] transition-all duration-300 text-neutral-800 font-serif text-sm tracking-widest"
              >
                BUY NOW
              </Link>
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

      {/* Additional Products Grid Below */}
      {products.length > 1 && (
        <div className="bg-[#E2E4F0] py-16 lg:py-24">
          <div className="mx-auto px-4 md:px-8 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.slice(1).map((product) => (
                <Link
                  href={`/products?id=${product.id}`}
                  key={product.id}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] bg-neutral-800/80 rounded-lg overflow-hidden mb-3">
                    {getPrimaryImage(product.images) && (
                      <Image
                        src={getPrimaryImage(product.images)}
                        alt={product.images[0]?.alt_text || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <h4 className="text-white text-sm font-light tracking-wide text-center group-hover:text-white/80 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-white/60 text-xs text-center mt-1">
                    HK$ {Number(product.price).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
