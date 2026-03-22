"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Playfair_Display } from "next/font/google"
import { useTranslations, useLocale } from "next-intl"
import ProductCategory from "@/components/product/ProductCategory"
import ProductCard from "@/components/product/ProductCard"
import ProductDetail from "@/components/product/ProductDetail"
import type { CategoryItem } from "@/components/product/ProductCategory"
import type { ApiProduct, UiProduct } from "@/lib/product-utils"
import {
  translateCategory,
  translateLocation,
  apiToUiProduct,
  publicLogo,
  CATEGORY_LOGOS,
  CATEGORY_NAME_TRANSLATIONS,
  buildFilterUrl,
} from "@/lib/product-utils"
import { CATEGORY_MAP } from "@/lib/categories"

const getApiCategory = (urlKey: string): string => CATEGORY_MAP[urlKey] ?? urlKey

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"

export default function ProductsClient() {
  const searchParams = useSearchParams()
  const t = useTranslations("Products")
  const locale = useLocale()

  const allText = locale === "en" ? "All" : "全部"

  const urlCategory = searchParams.get("category")
  const isChineseCategory = urlCategory && /[\u4e00-\u9fa5]/.test(urlCategory)
  const initialCategory = urlCategory
    ? locale === "zh-HK" || locale === "zh"
      ? isChineseCategory ? urlCategory : getApiCategory(urlCategory)
      : isChineseCategory
        ? translateCategory(urlCategory)
        : translateCategory(getApiCategory(urlCategory))
    : allText

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get("search") || "")
  const [categories, setCategories] = useState<CategoryItem[]>([{ name: allText }])
  const [selectedLocation, setSelectedLocation] = useState(allText)
  const [locations, setLocations] = useState<string[]>([allText])
  const [products, setProducts] = useState<UiProduct[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 12
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [itemsInView, setItemsInView] = useState<boolean[]>([])
  const [sortOption, setSortOption] = useState<"recommended" | "price_asc" | "price_desc">("recommended")
  const [selectedProduct, setSelectedProduct] = useState<UiProduct | null>(null)

  // Fetch categories and locations once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories/`, { cache: "no-store" })
        if (!res.ok) return

        const { categories: apiCategories, locations: apiLocations } = await res.json() as {
          categories: string[]
          locations: string[]
        }

        const displayCategories = locale === "en"
          ? apiCategories.map((name) => translateCategory(name))
          : apiCategories

        const displayLocations = locale === "en"
          ? apiLocations.map((name) => translateLocation(name))
          : apiLocations

        const filteredLocations = displayLocations.filter((name) => {
          const englishName = locale === "en" ? name : translateLocation(name)
          return englishName !== "NotApplicable"
        })

        const categoryToImage = new Map<string, string>()
        for (const originalName of apiCategories) {
          const logoFile = CATEGORY_LOGOS[originalName]
          if (logoFile) categoryToImage.set(originalName, publicLogo(logoFile))
        }

        setCategories([
          { name: allText, image: publicLogo(CATEGORY_LOGOS["全部"] ?? "All.png") },
          ...displayCategories.map((name) => ({
            name,
            image: categoryToImage.get(
              locale === "en"
                ? Object.entries(CATEGORY_NAME_TRANSLATIONS).find(([, trans]) => trans === name)?.[0] ?? name
                : name
            ),
          })),
        ])
        setLocations([allText, ...filteredLocations])
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      }
    }
    fetchCategories()
  }, [locale, allText])

  // Fetch products with server-side filtering and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const url = buildFilterUrl(
          `${API_BASE_URL}/api/products/`,
          selectedCategory,
          selectedLocation,
          searchKeyword,
          sortOption,
          currentPage,
          locale
        )
        const res = await fetch(url, { cache: "no-store" })

        if (!res.ok) {
          if (res.status === 404 && currentPage > 1) {
            setCurrentPage(1)
            return
          }
          throw new Error(`${t("errorLoadProducts")} (${res.status})`)
        }

        const response = await res.json() as { count: number; results: ApiProduct[] }
        setProducts(response.results.map((p) => apiToUiProduct(p, locale)))
        setTotalCount(response.count)

        if (response.results.length === 0 && currentPage > 1) {
          setCurrentPage(1)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorLoadProducts"))
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategory, selectedLocation, searchKeyword, sortOption, currentPage, locale])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedLocation, searchKeyword, sortOption])

  // Sync category from URL when searchParams change
  useEffect(() => {
    if (urlCategory) setSelectedCategory(initialCategory)
  }, [urlCategory, initialCategory])

  // Sync search from URL
  useEffect(() => {
    setSearchKeyword(searchParams.get("search") || "")
  }, [searchParams])

  // Reset selections on locale change
  useEffect(() => {
    if (!urlCategory) {
      setSelectedCategory(allText)
      setSelectedLocation(allText)
    }
  }, [locale, allText, urlCategory])

  // Intersection Observer for product card animations
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
  }, [products])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <main className="bg-white pt-[125px]">
      <ProductCategory
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      {/* ===== PRODUCTS GRID ===== */}
      <section className="py-10 bg-white">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            {searchKeyword ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">
                  {t("searchResults", { searchKeyword, count: totalCount })}
                </span>
                <button
                  onClick={() => {
                    setSearchKeyword("")
                    const params = new URLSearchParams(searchParams.toString())
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
                {t("totalProducts", { count: totalCount })}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-neutral-500">{t("sort")}</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as "recommended" | "price_asc" | "price_desc")}
                className="text-xs sm:text-sm border border-neutral-200 rounded-full px-3 py-1.5 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="recommended">{t("sortDefault")}</option>
                <option value="price_asc">{t("sortPriceAsc")}</option>
                <option value="price_desc">{t("sortPriceDesc")}</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">{t("loading")}</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 text-lg mb-4">{t("errorLoadProducts")}</p>
              <p className="text-neutral-500 text-sm">{error}</p>
              <p className="text-neutral-500 text-sm mt-2">
                {t("errorBackendCheck")} {API_BASE_URL}/api/products/
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">{t("noProductsInCategory")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  playfairClassName={playfair.className}
                  inView={itemsInView[index] ?? true}
                  index={index}
                  onClick={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PAGINATION ===== */}
      {!isLoading && !error && products.length > 0 && (
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

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  )
}