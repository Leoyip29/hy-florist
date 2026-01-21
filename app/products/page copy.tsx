"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

type ApiCategory = { id: number; name: string }
type ApiLocation = { id: number; name: string }
type ApiProductImage = {
  id: number
  url: string | null
  alt_text: string
  is_primary: boolean
}
type ApiProduct = {
  id: number
  name: string
  description: string
  price: string // DRF DecimalField serializes as string by default
  categories: ApiCategory[]
  suitable_locations: ApiLocation[]
  images: ApiProductImage[]
}

type UiProduct = {
  id: number
  name: string
  categories: string[]
  price: number
  image: string
  rating?: number
  reviews?: number
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"

function pickPrimaryImage(images: ApiProductImage[]) {
  const primary = images.find((img) => img.is_primary && img.url)
  return primary?.url ?? images.find((img) => img.url)?.url ?? ""
}

function toUiProduct(p: ApiProduct): UiProduct {
  return {
    id: p.id,
    name: p.name,
    categories: p.categories?.map((c) => c.name) ?? ["未分類"],
    price: Number(p.price),
    image: pickPrimaryImage(p.images),
  }
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [categories, setCategories] = useState<string[]>(["全部"])
  const [products, setProducts] = useState<UiProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<UiProduct[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [itemsInView, setItemsInView] = useState<boolean[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE_URL}/api/products/`, {
          cache: "no-store",
        })
        if (!res.ok) {
          throw new Error(`Failed to load products (${res.status})`)
        }

        const data = (await res.json()) as ApiProduct[]
        const uiProducts = data.map(toUiProduct)

        const uniqueCategories = Array.from(
          new Set(
            data
              .flatMap((p) => p.categories?.map((c) => c.name) ?? [])
              .filter(Boolean)
          )
        )

        setProducts(uiProducts)
        setFilteredProducts(uiProducts)
        setCategories(["全部", ...uniqueCategories])
        setCurrentPage(1)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [])

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === "全部") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(
        products.filter((p) => p.categories.includes(selectedCategory))
      )
    }
    setCurrentPage(1)
  }, [selectedCategory, products])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const offset = Math.max(0, (window.innerHeight - rect.top) * 0.3)
        setScrollOffset(Math.min(offset, 100))
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for product animations
  useEffect(() => {
    const items = document.querySelectorAll(".product-card")
    const inViewStates: boolean[] = Array.from({ length: items.length }, () => true)

    items.forEach((item, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          inViewStates[index] = entry.isIntersecting
          setItemsInView([...inViewStates])
        },
        { threshold: 0.1 }
      )
      observer.observe(item)
    })
  }, [paginatedProducts])

  return (
    <main className="bg-white">
      {/* ===== HERO SECTION ===== */}
      <section
        className="relative py-24 md:py-32 bg-gradient-to-r from-rose-50 via-purple-50 to-transparent overflow-hidden"
        ref={sectionRef}
        style={{
          transform: `translateY(-${scrollOffset * 0.2}px)`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <h1 className={`${playfair.className} text-5xl md:text-7xl font-light mb-6 text-neutral-900 leading-tight`}>
              花藝商城
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 font-light leading-8">
              探索我們精心挑選的花藝作品，為生活的每一刻增添美麗與溫度。
            </p>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY FILTER ===== */}
      <section className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium tracking-wide
                  transition-all duration-300 whitespace-nowrap
                  ${
                    selectedCategory === cat
                      ? "bg-neutral-900 text-white shadow-lg"
                      : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS GRID ===== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">載入中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 text-lg mb-4">無法載入商品</p>
              <p className="text-neutral-500 text-sm">{error}</p>
              <p className="text-neutral-500 text-sm mt-2">
                確認後端已啟動：{API_BASE_URL}/api/products/
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">暫無該分類的商品</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card group"
                  style={{
                    opacity: (itemsInView[index] ?? true) ? 1 : 0.6,
                    transform: (itemsInView[index] ?? true)
                      ? "translateY(0) scale(1)"
                      : "translateY(20px) scale(0.98)",
                    transition: `all 0.6s ease-out ${index * 80}ms`,
                  }}
                >
                  {/* Product Card */}
                  <div className="bg-white rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-400 transition-all duration-500 hover:shadow-xl">
                    {/* Image Container */}
                    <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
                      <Image
                        src={product.image || "/hy_01.webp"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

                      {/* Favorite Button */}
                      <button className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110">
                        <svg
                          className="w-5 h-5 text-neutral-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {product.categories[0] ?? "未分類"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating ?? 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-neutral-300 text-neutral-300"
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-neutral-600">
                          ({product.reviews ?? 0})
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className={`${playfair.className} text-base font-light leading-snug text-neutral-900 mb-3 line-clamp-2`}>
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-4">
                        <p className="text-lg font-semibold text-neutral-900">
                          ${product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Add to Cart Button */}
                      <button className="w-full bg-neutral-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-neutral-800 transition-colors duration-300 group-hover:shadow-lg">
                        加入購物車
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PAGINATION ===== */}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-center gap-2">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              上一頁
            </button>
            <span className="text-sm text-neutral-600">
              第 {currentPage} / {totalPages} 頁
            </span>
            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
            >
              下一頁
            </button>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION =====
      <section className="py-20 bg-neutral-900 text-white">
        <div className="mx-auto max-w-4xl px-4 md:px-8 text-center">
          <h2 className={`${playfair.className} text-4xl md:text-5xl font-light mb-6 leading-tight`}>
            需要客製化服務？
          </h2>
          <p className="text-lg text-neutral-300 mb-8 font-light">
            我們提供專業的花藝設計與諮詢服務，為您的特殊時刻打造獨特的作品。
          </p>
          <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-neutral-900 font-medium">
            聯絡我們
          </button>
        </div>
      </section> */}
    </main>
  )
}
