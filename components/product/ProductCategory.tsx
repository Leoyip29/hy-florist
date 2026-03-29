"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export type CategoryItem = {
  id?: number
  name: string
  apiName: string
  image?: string
}

type Props = {
  categories: CategoryItem[]
  selectedCategory: string
  onSelect: (apiName: string) => void
}

export default function ProductCategory({
  categories,
  selectedCategory,
  onSelect,
}: Props) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const media = window.matchMedia("(max-width: 767px)")
    const handle = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches)
    handle(media)
    media.addEventListener("change", handle)
    return () => media.removeEventListener("change", handle)
  }, [])

  return (
    <section className="bg-white border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        {/* Category Icons - Elegant Minimal */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {categories.map((cat) => (
            <button
              key={cat.id ?? cat.name}
              onClick={() => onSelect(cat.apiName)}
              className={`group flex flex-col items-center gap-3 transition-all duration-200 ${
                selectedCategory === cat.apiName ? "" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`relative overflow-hidden transition-all duration-300 ${
                  selectedCategory === cat.apiName ? "" : "grayscale-[30%] group-hover:grayscale-0"
                }`}
                style={{
                  width: selectedCategory === cat.apiName ? 56 : 50,
                  height: selectedCategory === cat.apiName ? 56 : 50,
                  borderRadius: selectedCategory === cat.apiName ? 16 : 12,
                }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="60px"
                    unoptimized
                    className="object-contain p-2"
                  />
                )}
                {/* Subtle active indicator bar */}
                {selectedCategory === cat.apiName && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-neutral-900 rounded-full" />
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 tracking-wide ${
                  selectedCategory === cat.name
                    ? "text-neutral-900"
                    : "text-neutral-500"
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
