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



// Backend API URL - change this to match your backend address
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products/?sort=hot`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching featured products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const getPrimaryImage = (images: ProductImage[]): string => {
    const primary = images.find((img) => img.is_primary)
    return primary?.url || (images.length > 0 ? images[0].url : "")
  }

  if (loading) {
    return (
      <section className="py-24 md:py-36">
        <div className="mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 items-start">
            <div className="lg:col-span-1">
              <h2 className="text-5xl md:text-6xl font-light tracking-wide text-neutral-900 font-serif">
                熱賣
              </h2>
              <h2 className="text-5xl md:text-6xl font-light tracking-wide text-neutral-900 font-serif">
                花藝
              </h2>
              <p className="mt-4 text-neutral-500 font-light text-sm tracking-widest">
                SEASON&apos;S BESTSELLERS
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] bg-neutral-200" />
                    <div className="mt-4 h-4 bg-neutral-200 rounded w-3/4 mx-auto" />
                    <div className="mt-2 h-4 bg-neutral-200 rounded w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    console.error("Error loading featured products:", error)
    return null
  }

  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 items-start">
          {/* Section Title - Left */}
          <div className="lg:col-span-1">
            <h2 className="text-5xl md:text-6xl font-light tracking-wide text-neutral-900 font-serif">
              熱賣
            </h2>
            <h2 className="text-5xl md:text-6xl font-light tracking-wide text-neutral-900 font-serif">
              花藝
            </h2>
            <p className="mt-4 text-neutral-500 font-light text-sm tracking-widest">
              SEASON&apos;S BESTSELLERS
            </p>
          </div>

          {/* Product Grid - Right */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-2">
              {products.map((product) => (
                <Link href={`/products?id=${product.id}`} key={product.id}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[2/3] overflow-hidden bg-neutral-100">
                      {getPrimaryImage(product.images) && (
                        <Image
                          src={getPrimaryImage(product.images)}
                          alt={product.images[0]?.alt_text || product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      )}
                    </div>
                    <div className="mt-3">
                      <h3 className="text-lg font-light text-neutral-900 font-serif tracking-wide group-hover:text-neutral-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-neutral-500 font-light text-base">
                        HK$ {Number(product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Link */}
            <div className="mt-16 text-center">
              <Link
                href="/products"
                className="inline-block text-lg tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 hover:border-neutral-900 hover:text-neutral-600 transition-all duration-300"
              >
                查看全部
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
