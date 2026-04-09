"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Playfair_Display } from "next/font/google"
import { useTranslations, useLocale } from "next-intl"
import ProductCategory from "@/components/product/ProductCategory"
import ProductCard from "@/components/product/ProductCard"
import ProductDetail from "@/components/product/ProductDetail"
import type { CategoryItem } from "@/components/product/ProductCategory"
import type { ApiProduct, UiProduct, PriceRange } from "@/lib/product-utils"
import {
  apiToUiProduct,
  buildFilterUrl,
  getPriceRangeByLocale,
  findPriceRangeKey,
  isEmptyRange,
} from "@/lib/product-utils"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"
// Strip scheme for X-Forwarded-Host (should be host:port only)
const _apiHost = API_BASE_URL.replace(/^https?:\/\//, "")

export interface ProductsClientProps {
  initialData: {
    categories: { id: number; name: string; name_en: string; logo?: string | null }[]
    products: UiProduct[]
    totalCount: number
    categoryImages: Record<string, string>
  } | null
}

function buildInitialCategories(
  apiCategories: { id: number; name: string; name_en: string; logo?: string | null }[],
  locale: string,
  allText: string,
  categoryImages: Record<string, string>
): CategoryItem[] {
  const displayCategories = locale === "en"
    ? apiCategories.map((cat) => cat.name_en || cat.name)
    : apiCategories.map((cat) => cat.name)

  return [
    { name: allText, apiName: "All", image: "/CategoriesLogo/All.png" },
    ...displayCategories.map((name, idx) => ({
      id: idx + 1,
      name,
      apiName: apiCategories[idx].name_en || apiCategories[idx].name,
      image: categoryImages[apiCategories[idx].name],
    })),
  ]
}

export default function ProductsClient({ initialData }: ProductsClientProps) {
  const searchParams = useSearchParams()
  const t = useTranslations("Products")
  const locale = useLocale()
  const productsSectionRef = useRef<HTMLElement>(null)

  const allText = locale === "en" ? "All" : "全部"

  const urlCategory = searchParams.get("category")
  const initialCategory = urlCategory ? decodeURIComponent(urlCategory) : "All"

  // Initialize price range from URL
  const urlPriceMin = searchParams.get("price_min")
  const urlPriceMax = searchParams.get("price_max")
  const initialPriceRange: PriceRange = {
    min: urlPriceMin ? Number(urlPriceMin) : undefined,
    max: urlPriceMax ? Number(urlPriceMax) : undefined,
  }

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get("search") || "")
  const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange)
  const [categories, setCategories] = useState<CategoryItem[]>(
    initialData
      ? buildInitialCategories(initialData.categories, locale, allText, initialData.categoryImages)
      : [{ name: allText, apiName: "All" }]
  )
  const [products, setProducts] = useState<UiProduct[]>(initialData?.products ?? [])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(initialData?.totalCount ?? 0)
  const pageSize = 12
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [itemsInView, setItemsInView] = useState<boolean[]>([])
  const [sortOption, setSortOption] = useState<"recommended" | "price_asc" | "price_desc">("recommended")
  const [selectedProduct, setSelectedProduct] = useState<UiProduct | null>(null)
  const [availablePriceRanges, setAvailablePriceRanges] = useState<string[]>([])

  // Scroll to products section when category changes
  const handleCategorySelect = useCallback((apiName: string) => {
    setSelectedCategory(apiName)
    if (productsSectionRef.current) {
      const headerOffset = 125 // Matches the pt-[125px] on the main element
      const elementPosition = productsSectionRef.current.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }, [])

  // Track the previous category value to avoid cleaning on initial mount
  const prevCategory = useRef<string>(initialCategory)

  // Fetch available price ranges for "All" on initial mount
  useEffect(() => {
    const headers = { "X-Forwarded-Host": _apiHost }
    fetch(`${API_BASE_URL}/api/products/price-ranges/`, { cache: "no-store", headers })
      .then((res) => res.ok ? res.json() : { available_ranges: [] })
      .then((data: { available_ranges: string[] }) => setAvailablePriceRanges(data.available_ranges ?? []))
      .catch(() => setAvailablePriceRanges([]))
  }, [])

  // Initialize sort and price range from URL searchParams after mount to avoid SSR hydration mismatch
  useEffect(() => {
    const urlSort = searchParams.get("sort")
    if (urlSort === "price_asc" || urlSort === "price_desc") {
      setSortOption(urlSort)
    }
    const urlMin = searchParams.get("price_min")
    const urlMax = searchParams.get("price_max")
    if (urlMin || urlMax) {
      setPriceRange({
        min: urlMin ? Number(urlMin) : undefined,
        max: urlMax ? Number(urlMax) : undefined,
      })
    }
  }, [searchParams])

  // Fetch categories (skip if we have initial data)
  useEffect(() => {
    if (initialData) return

    const fetchCategories = async () => {
      try {
        const headers = { "X-Forwarded-Host": _apiHost }
        const res = await fetch(`${API_BASE_URL}/api/categories/`, { cache: "no-store", headers })
        if (!res.ok) return

        const { categories: apiCategories } = await res.json() as {
          categories: { id: number; name: string; name_en: string; logo?: string | null }[]
        }

        const displayCategories = locale === "en"
          ? apiCategories.map((cat) => cat.name_en || cat.name)
          : apiCategories.map((cat) => cat.name)

        const categoryToImage = new Map<string, string>()
        for (const cat of apiCategories) {
          if (cat.logo) categoryToImage.set(cat.name, cat.logo)
        }

        setCategories([
          { name: allText, apiName: "All", image: "/CategoriesLogo/All.png" },
          ...displayCategories.map((name, idx) => ({
            id: idx + 1,
            name,
            apiName: apiCategories[idx].name_en || apiCategories[idx].name,
            image: categoryToImage.get(apiCategories[idx].name),
          })),
        ])
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      }
    }
    fetchCategories()
  }, [locale, allText, initialData])

  // Fetch products with server-side filtering and pagination
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const url = buildFilterUrl(
        `${API_BASE_URL}/api/products/`,
        selectedCategory,
        searchKeyword,
        sortOption,
        currentPage,
        locale,
        priceRange
      )
      const headers = { "X-Forwarded-Host": _apiHost }
      const res = await fetch(url, { cache: "no-store", headers })

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
  }, [selectedCategory, searchKeyword, sortOption, currentPage, locale, priceRange, t])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Clean filters + URL when category actually changes (not on initial mount)
  useEffect(() => {
    if (selectedCategory === prevCategory.current) return
    prevCategory.current = selectedCategory

    setSortOption("recommended")
    setPriceRange({})
    const params = new URLSearchParams(window.location.search)
    params.delete("sort")
    params.delete("price_min")
    params.delete("price_max")
    if (selectedCategory !== "All" && selectedCategory !== "全部") {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }
    window.history.replaceState(null, "", `?${params.toString()}`)

    const categoryForApi = selectedCategory === "All" ? null : selectedCategory
    const url = new URL(`${API_BASE_URL}/api/products/price-ranges/`)
    if (categoryForApi) url.searchParams.set("category", categoryForApi)
    const headers = { "X-Forwarded-Host": _apiHost }

    fetch(url.toString(), { cache: "no-store", headers })
      .then((res) => res.ok ? res.json() : { available_ranges: [] })
      .then((data: { available_ranges: string[] }) => setAvailablePriceRanges(data.available_ranges ?? []))
      .catch(() => setAvailablePriceRanges([]))
  }, [selectedCategory])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchKeyword, sortOption, priceRange])

  // Sync category from URL when searchParams change (but not when category was just changed programmatically)
  useEffect(() => {
    if (urlCategory && urlCategory !== encodeURIComponent(selectedCategory) && urlCategory !== encodeURIComponent("All")) {
      setSelectedCategory(decodeURIComponent(urlCategory))
    }
  }, [urlCategory]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync price range from URL on initial mount only
  useEffect(() => {
    setPriceRange(initialPriceRange)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync search from URL
  useEffect(() => {
    setSearchKeyword(searchParams.get("search") || "")
  }, [searchParams])

  // Reset selections on locale change
  useEffect(() => {
    if (!urlCategory) {
      setSelectedCategory("All")
    }
    setPriceRange({})
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
        onSelect={handleCategorySelect}
      />

      {/* ===== PRODUCTS GRID ===== */}
      <section ref={productsSectionRef} className="py-10 bg-white">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            {searchKeyword ? (
              <div className="flex items-center gap-2">
                <span className="text-base md:text-sm text-neutral-600 font-medium">
                  {t("searchResults", { searchKeyword, count: totalCount })}
                </span>
                <button
                  onClick={() => {
                    setSearchKeyword("")
                    const params = new URLSearchParams(searchParams.toString())
                    params.delete("search")
                    window.history.replaceState(null, "", `?${params.toString()}`)
                  }}
                  className="text-base md:text-sm text-neutral-500 hover:text-neutral-800 underline underline-offset-2"
                >
                  {t("clear")}
                </button>
              </div>
            ) : (
              <p className="text-base md:text-sm text-neutral-500 font-medium">
                {t("totalProducts", { count: totalCount })}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-base md:text-sm text-neutral-600 font-medium">{t("sort")}</span>
              <select
                value={
                  !isEmptyRange(priceRange) && availablePriceRanges.includes(findPriceRangeKey(priceRange, locale) ?? "")
                    ? findPriceRangeKey(priceRange, locale)!
                    : sortOption !== "recommended"
                    ? sortOption
                    : ""
                }
                onChange={(e) => {
                  const val = e.target.value
                  if (!val) return

                  const priceOpt = getPriceRangeByLocale(locale).find((opt) => opt.key === val)
                  const params = new URLSearchParams(searchParams.toString())

                  if (priceOpt) {
                    setSortOption("price_asc")
                    params.delete("sort")
                    if (priceOpt.value.min !== undefined) {
                      params.set("price_min", String(priceOpt.value.min))
                    } else {
                      params.delete("price_min")
                    }
                    if (priceOpt.value.max !== undefined) {
                      params.set("price_max", String(priceOpt.value.max))
                    } else {
                      params.delete("price_max")
                    }
                    setPriceRange(priceOpt.value)
                  } else {
                    setPriceRange({})
                    params.delete("price_min")
                    params.delete("price_max")
                    const sortVal = val as "price_asc" | "price_desc"
                    setSortOption(sortVal)
                    params.set("sort", sortVal)
                  }
                  window.history.replaceState(null, "", `?${params.toString()}`)
                }}
                className="text-base md:text-sm border-2 border-neutral-200 rounded-xl px-4 py-3 md:px-3 md:py-2 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 min-h-[48px]"
              >
                <option value="" disabled>
                  {locale === "en" ? "Price Options" : "價格選項"}
                </option>
                <optgroup label={locale === "en" ? "Sort" : "排序"}>
                  <option value="price_asc">{t("sortPriceAsc")}</option>
                  <option value="price_desc">{t("sortPriceDesc")}</option>
                </optgroup>
                <optgroup label={locale === "en" ? "Price" : "價錢"}>
                  {getPriceRangeByLocale(locale)
                    .filter((opt) => availablePriceRanges.includes(opt.key))
                    .map((opt) => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                </optgroup>
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
                  priority={index < 8}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PAGINATION ===== */}
      {!isLoading && !error && products.length > 0 && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-center gap-4 md:gap-3">
            <button
              className="px-5 py-3 md:px-4 md:py-2 text-base md:text-sm border-2 border-neutral-300 rounded-xl bg-white text-neutral-700 hover:bg-[#E8B4B8] hover:text-neutral-800 hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-300 min-h-[48px] min-w-[100px] md:min-w-[auto]"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              {t("previousPage")}
            </button>
            <span className="text-lg md:text-base text-neutral-600 px-3 font-medium">
              {t("pageOf", { current: currentPage, total: totalPages })}
            </span>
            <button
              className="px-5 py-3 md:px-4 md:py-2 text-base md:text-sm border-2 border-neutral-300 rounded-xl bg-white text-neutral-700 hover:bg-[#E8B4B8] hover:text-neutral-800 hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-300 min-h-[48px] min-w-[100px] md:min-w-[auto]"
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