"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

// Sample Products Data
const products = [
  {
    id: 1,
    name: "花束BB12 多買優惠組合",
    category: "花束",
    price: 1560,
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-12-scaled.jpg",
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    name: "花束BB11 多買優惠組合",
    category: "花束",
    price: 1030,
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-11-scaled.jpg",
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 3,
    name: "花束BB10 多買優惠組合",
    category: "花束",
    price: 1030,
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-10-scaled.jpg",
    rating: 4.7,
    reviews: 32,
  },
  {
    id: 4,
    name: "花束BB09 多買優惠組合",
    category: "花束",
    price: 1030,
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-09-scaled.jpg",
    rating: 4.8,
    reviews: 15,
  },
  {
    id: 5,
    name: "教堂追思花藝",
    category: "花籃",
    price: 1500,
    image: "/church_flower.jpg",
    rating: 5.0,
    reviews: 8,
  },
  {
    id: 6,
    name: "棺面花藝佈置",
    category: "特別服務",
    price: 2000,
    image: "/series-casket1.jpg",
    rating: 4.9,
    reviews: 12,
  },
  {
    id: 7,
    name: "醫院告別花藝",
    category: "特別服務",
    price: 1200,
    image: "/series-hospital.jpg",
    rating: 4.8,
    reviews: 9,
  },
  {
    id: 8,
    name: "殯儀館追思花籃",
    category: "花籃",
    price: 1800,
    image: "/series-funeral.jpg",
    rating: 4.9,
    reviews: 14,
  },
]

const categories = ["全部", "花束", "花籃", "特別服務"]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [itemsInView, setItemsInView] = useState<boolean[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === "全部") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory))
    }
  }, [selectedCategory])

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
    const inViewStates: boolean[] = []

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
  }, [filteredProducts])

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
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">暫無該分類的商品</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card group"
                  style={{
                    opacity: itemsInView[index] ? 1 : 0.6,
                    transform: itemsInView[index]
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
                        src={product.image}
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
                        {product.category}
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
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-neutral-300 text-neutral-300"
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-neutral-600">({product.reviews})</span>
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

      {/* ===== CTA SECTION ===== */}
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
      </section>
    </main>
  )
}
