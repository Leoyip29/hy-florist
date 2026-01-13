"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface Product {
  name: string
  price: string
  image: string
}

const featuredProducts: Product[] = [
  {
    name: "花束BB12 多買優惠組合",
    price: "$1,560.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-12-scaled.jpg",
  },
  {
    name: "花束BB11 多買優惠組合",
    price: "$1,030.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-11-scaled.jpg",
  },
  {
    name: "花束BB10 多買優惠組合",
    price: "$1,030.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-10-scaled.jpg",
  },
  {
    name: "花束BB09 多買優惠組合",
    price: "$1,030.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-09-scaled.jpg",
  },
]

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [itemsInView, setItemsInView] = useState<boolean[]>([])

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

  // Intersection Observer for staggered item animations
  useEffect(() => {
    const observers = document.querySelectorAll(".product-item")
    const inViewStates: boolean[] = []

    observers.forEach((item, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          inViewStates[index] = entry.isIntersecting
          setItemsInView([...inViewStates])
        },
        { threshold: 0.1 }
      )
      observer.observe(item)
    })
  }, [])

  return (
    <section className="relative pb-8 md:pb-16" ref={sectionRef}>
      {/* Background section with soft color - acts as visual anchor */}
      <div 
        className="bg-gradient-to-r from-rose-100/40 via-purple-100/30 to-transparent pt-16 pb-24 md:pb-40 transition-all duration-300"
        style={{
          transform: `translateY(-${scrollOffset * 0.2}px)`,
        }}
      >
        <div className="mx-auto px-4 md:px-8 max-w-7xl">
          {/* Section Title */}
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900">
              <span className="font-serif">熱賣</span>
              <br />
              <span className="font-serif">花藝</span>
            </h2>
            <p className="mt-6 text-base text-neutral-600 max-w-md font-light leading-relaxed">
              探索最受歡迎的花束，為重要時刻增添溫度。
            </p>
          </div>
        </div>
      </div>

      {/* Product Cards Container - Floats above background */}
      <div className="mx-auto px-4 md:px-8 max-w-7xl -mt-20 md:-mt-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={index}
              className="product-item group relative overflow-hidden rounded-xl aspect-square md:aspect-auto md:h-[420px] bg-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500"
              style={{
                opacity: itemsInView[index] ? 1 : 0.6,
                transform: itemsInView[index] 
                  ? `translateY(0) scale(1)` 
                  : `translateY(20px) scale(0.98)`,
                transitionDelay: `${index * 80}ms`,
              }}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
              </div>

              {/* Heart Icon - Always Visible */}
              <button className="absolute top-4 left-4 z-20 bg-white/85 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-white transition-all duration-200 hover:scale-110">
                ♡
              </button>

              {/* Content Overlay - Visible on Hover (Desktop) / Always (Mobile) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 md:p-5">
                <div></div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-light text-base leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-white/90 font-light text-sm mt-2">
                      {product.price}
                    </p>
                  </div>
                  <button className="w-full bg-white text-neutral-900 py-3 rounded-lg font-medium text-sm hover:bg-neutral-100 transition-colors duration-200 tracking-wide">
                    加入購物車
                  </button>
                </div>
              </div>

              {/* Static Info for Mobile */}
              <div className="absolute bottom-0 left-0 right-0 md:hidden bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                <h3 className="text-white font-light text-sm leading-snug">
                  {product.name}
                </h3>
                <p className="text-white/80 font-light text-xs mt-2">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
