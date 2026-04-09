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

  const regularCategories = categories.slice(0, -3)
  const specialCategories = categories.slice(-3)

  // Split regular categories: first 12 in full rows, last 2 centered
  const mainCategories = regularCategories.slice(0, -2)
  const centeredCategories = regularCategories.slice(-2)

  // Fixed icon sizes for consistency
  const iconSize = 64
  const iconBorderRadius = 14

  return (
    <section className="mt-10 bg-white border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        {/* Main Category Icons - Grid layout on mobile, flex on desktop */}
        <div className="grid grid-cols-4 md:flex md:flex-wrap md:justify-center gap-4 md:gap-5">
          {mainCategories.map((cat) => (
            <button
              key={cat.id ?? cat.name}
              onClick={() => onSelect(cat.apiName)}
              className={`group flex flex-col items-center gap-2 transition-all duration-200 touch-manipulation ${
                selectedCategory === cat.apiName ? "" : "opacity-80 hover:opacity-100"
              }`}
              aria-label={cat.name}
            >
              <div
                className={`relative overflow-hidden transition-all duration-300 ${
                  selectedCategory === cat.apiName
                    ? "ring-2 ring-neutral-900 ring-offset-2"
                    : "grayscale-[30%] group-hover:grayscale-0"
                }`}
                style={{
                  width: iconSize,
                  height: iconSize,
                  borderRadius: iconBorderRadius,
                }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="80px"
                    unoptimized
                    className="object-contain p-2"
                  />
                )}
              </div>
              <span
                className={`text-sm md:text-sm font-semibold transition-colors duration-200 text-center leading-tight ${
                  selectedCategory === cat.name
                    ? "text-neutral-900"
                    : "text-neutral-600"
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Last 2 categories centered */}
        {centeredCategories.length > 0 && (
          <div className="flex justify-center gap-4 mt-4 md:hidden">
            {centeredCategories.map((cat) => (
              <button
                key={cat.id ?? cat.name}
                onClick={() => onSelect(cat.apiName)}
                className={`group flex flex-col items-center gap-2 transition-all duration-200 touch-manipulation ${
                  selectedCategory === cat.apiName ? "" : "opacity-80 hover:opacity-100"
                }`}
                aria-label={cat.name}
              >
                <div
                  className={`relative overflow-hidden transition-all duration-300 ${
                    selectedCategory === cat.apiName
                      ? "ring-2 ring-neutral-900 ring-offset-2"
                      : "grayscale-[30%] group-hover:grayscale-0"
                  }`}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    borderRadius: iconBorderRadius,
                  }}
                >
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="80px"
                      unoptimized
                      className="object-contain p-2"
                    />
                  )}
                </div>
                <span
                  className={`text-sm font-semibold transition-colors duration-200 text-center leading-tight ${
                    selectedCategory === cat.name
                      ? "text-neutral-900"
                      : "text-neutral-600"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Special Selection Categories - Horizontal Scrollable Row */}
        {specialCategories.length > 0 && (
          <div className="mt-5 pt-4 border-t border-neutral-100">
            <div className="flex justify-center md:justify-center md:flex-wrap gap-3 overflow-x-auto pb-3 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              {specialCategories.map((cat) => (
                <button
                  key={cat.id ?? cat.name}
                  onClick={() => onSelect(cat.apiName)}
                  className={` px-5 py-3 rounded-xl transition-all duration-200 shrink-0 touch-manipulation text-base md:text-sm font-semibold whitespace-nowrap ${
                    selectedCategory === cat.apiName
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                  aria-label={cat.name}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
