"use client"

import { useState, useEffect } from "react"
import { Playfair_Display } from "next/font/google"
import { useTranslations } from "next-intl"
import ProductCategory from "@/components/product/ProductCategory"
import ProductCard from "@/components/product/ProductCard"
import type { CategoryItem } from "@/components/product/ProductCategory"
import type { UiProduct } from "@/lib/product-utils"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

interface ProductsClientProps {
  initialProducts: UiProduct[]
  initialCategories: CategoryItem[]
  initialLocations: string[]
  locale: string
  initialCategory?: string
  initialSearch?: string
}

export default function ProductsClient({
  initialProducts,
  initialCategories,
  initialLocations,
  locale,
  initialCategory,
  initialSearch,
}: ProductsClientProps) {
  const t = useTranslations("Products")

  const allText = locale === "en" ? "All" : "全部"

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || allText)
  const [searchKeyword, setSearchKeyword] = useState(initialSearch || "")
  const [selectedLocation, setSelectedLocation] = useState(allText)
  const [filteredProducts, setFilteredProducts] = useState<UiProduct[]>(initialProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12
  const [itemsInView, setItemsInView] = useState<boolean[]>([])
  const [sortOption, setSortOption] = useState<"recommended" | "price_asc" | "price_desc">(
    "recommended"
  )

  // Sync state when server re-renders with new URL searchParams (e.g. header search)
  useEffect(() => {
    setSearchKeyword(initialSearch || "")
  }, [initialSearch])

  useEffect(() => {
    setSelectedCategory(initialCategory || allText)
  }, [initialCategory, allText])

  // Reset category/location selection when locale changes
  useEffect(() => {
    setSelectedCategory(allText)
    setSelectedLocation(allText)
  }, [locale, allText])

  // Filter products by category, location, and search keyword
  useEffect(() => {
    const filtered = initialProducts.filter((p) => {
      const matchCategory =
        selectedCategory === allText || p.categories.includes(selectedCategory)
      const matchLocation =
        selectedLocation === allText || p.locations.includes(selectedLocation)
      const matchSearch =
        !searchKeyword ||
        p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        p.description.toLowerCase().includes(searchKeyword.toLowerCase())
      return matchCategory && matchLocation && matchSearch
    })

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "price_asc") return a.price - b.price
      if (sortOption === "price_desc") return b.price - a.price
      return 0
    })

    setFilteredProducts(sorted)
    setCurrentPage(1)
  }, [selectedCategory, selectedLocation, initialProducts, sortOption, searchKeyword, allText])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

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
    <main className="bg-white pt-[125px]">
      <ProductCategory
        categories={initialCategories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        locations={initialLocations}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      {/* ===== PRODUCTS GRID ===== */}
      <section className="py-10 bg-white">
        <div className="mx-auto px-4">
          {/* Search bar and results info */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {searchKeyword ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">
                  {t("searchResults", {
                    searchKeyword,
                    count: filteredProducts.length,
                  })}
                </span>
                <button
                  onClick={() => {
                    setSearchKeyword("")
                    const params = new URLSearchParams(window.location.search)
                    params.delete("search")
                    window.history.replaceState(null, "", `?${params.toString()}`)
                  }}
                  className="text-sm text-neutral-500 hover:text-neutral-800 underline"
                >
                  {t("clear")}
                </button>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-neutral-500">
                {t("totalProducts", { count: filteredProducts.length })}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-neutral-500">{t("sort")}</span>
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(
                    e.target.value as "recommended" | "price_asc" | "price_desc"
                  )
                }
                className="text-xs sm:text-sm border border-neutral-200 rounded-full px-3 py-1.5 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="recommended">{t("sortDefault")}</option>
                <option value="price_asc">{t("sortPriceAsc")}</option>
                <option value="price_desc">{t("sortPriceDesc")}</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">{t("noProductsInCategory")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  playfairClassName={playfair.className}
                  inView={itemsInView[index] ?? true}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PAGINATION ===== */}
      {filteredProducts.length > 0 && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-center gap-3">
            <button
              className="px-4 py-2 text-sm border border-neutral-200 rounded-full bg-white text-neutral-700 hover:bg-[#E8B4B8] hover:text-neutral-800 hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              {t("previousPage")}
            </button>
            <span className="text-sm text-neutral-600 px-2">
              {t("pageOf", { current: currentPage, total: totalPages })}
            </span>
            <button
              className="px-4 py-2 text-sm border border-neutral-200 rounded-full bg-white text-neutral-700 hover:bg-[#E8B4B8] hover:text-neutral-800 hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              {t("nextPage")}
            </button>
          </div>
        </section>
      )}
    </main>
  )
}