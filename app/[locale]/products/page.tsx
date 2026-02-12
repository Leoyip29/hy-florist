"use client"

import Image from "next/image"
import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Playfair_Display } from "next/font/google"
import { useTranslations, useLocale } from "next-intl"
import ProductCategory from "@/components/product/ProductCategory"
import ProductCard from "@/components/product/ProductCard"
import ProductDetail from "@/components/product/ProductDetail"
import type { CategoryItem } from "@/components/product/ProductCategory"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

type ApiCategory = { id: number; name: string }
type ApiLocation = { id: number; name: string }
type ApiProductImage = {
  id: number
  image: string | null  // Local file path (e.g., /media/products/xxx.jpg)
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

export type UiProduct = {
  id: number
  name: string
  description: string
  categories: string[]
  locations: string[]
  price: number
  image: string
  rating?: number
  reviews?: number
}

// Category name translations - maps Chinese names to translated names
// These are used for internationalization of category/location names
const CATEGORY_NAME_TRANSLATIONS: Record<string, string> = {
  全部: "All",
  花束: "Bouquet",
  "花束多買優惠": "Bouquet Bundle",
  花籃: "Flower Basket",
  花牌: "Flower Board",
  花牌套餐: "Board Set",
  十字架花牌: "Cross Board",
  圓型花牌: "Round Board",
  心型花牌: "Heart-shaped Board",
  棺面花: "Casket Decoration",
  場地裝飾: "Venue Decoration",
  台花: "Stand Flower",
  講台花: "Podium Flower",
  櫈花: "Bench Flower",
  場地系列: "Venue Series",
}

const LOCATION_NAME_TRANSLATIONS: Record<string, string> = {
  全部: "All",
  教堂: "Church",
  殯儀館: "FuneralHome",
  醫院: "Hospital",
  不適用: "NotApplicable",
}

// Translate a location name using the translation map
export function translateLocation(name: string): string {
  return LOCATION_NAME_TRANSLATIONS[name] ?? name
}

// Translate product name - for products following the pattern "CategoryCode Number",
// we translate just the category prefix
export function translateProductName(name: string): string {
  // Check if the product name starts with a known category
  const categoryPrefixes = Object.keys(CATEGORY_NAME_TRANSLATIONS).filter(
    (key) => key.length > 1 && name.startsWith(key)
  )

  if (categoryPrefixes.length > 0) {
    // Use the longest matching prefix
    const longestPrefix = categoryPrefixes.sort((a, b) => b.length - a.length)[0]
    const translatedPrefix = CATEGORY_NAME_TRANSLATIONS[longestPrefix]
    const remainder = name.slice(longestPrefix.length)
    return `${translatedPrefix}${remainder}`
  }

  // If no match, return the original name
  return name
}

// Translate category name
export function translateCategory(name: string): string {
  return CATEGORY_NAME_TRANSLATIONS[name] ?? name
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"

function publicLogo(fileName: string) {
  // Handles spaces in filenames like "Funeral Home.png"
  return encodeURI(`/CategoriesLogo/${fileName}`)
}

// Map your category names to files in `public/CategoriesLogo/`
// Add/remove keys here to match the names coming from your backend.
const CATEGORY_LOGOS: Record<string, string> = {
  全部: "All.png",

  // Chinese -> English filenames (examples)
  花束: "Bouquets.png",
  花籃: "Flower Baskets.png",
  花束多買優惠: "Bouquet Bundle Offers.png",
  花牌: "Funeral Flower Boards.png",
  心型花牌: "Heart-Shaped Funeral Wreaths.png",
  棺面花: "Coffin Flower Arrangements.png",
  圓型花牌: "Round Funeral Wreaths.png",
  十字架花牌: "Cross Funeral Wreaths.png",
  場地裝飾: "Venue Decorations.png",
  台花: "Table Flower Arrangements.png",
  場地系列: "Venue Flower Series.png",
  櫈花: "Chair Flower Arrangements.png",
  講台花: "Podium Flower Arrangements.png",
  花牌套餐: "Funeral Flower Set.png",


}

// Only use local image, no URL fallback
function pickPrimaryImage(images: ApiProductImage[]) {
  const primary = images.find((img) => img.is_primary && img.image)
  if (primary?.image) return primary.image

  const anyWithImage = images.find((img) => img.image)
  return anyWithImage?.image ?? ""
}

// Function to convert API product to UI product with locale-aware translation
function apiToUiProduct(p: ApiProduct, locale: string): UiProduct {
  return {
    id: p.id,
    name: locale === 'en' ? translateProductName(p.name) : p.name,
    description: p.description,
    categories: p.categories?.map((c) => 
      locale === 'en' ? translateCategory(c.name) : c.name
    ) ?? ["未分類"],
    locations: p.suitable_locations?.map((l) => 
      locale === 'en' ? translateLocation(l.name) : l.name
    ) ?? [],
    price: Number(p.price),
    image: pickPrimaryImage(p.images),
  }
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{useTranslations("Products")("loading")}</div>}>
      <ShopPageContent />
    </Suspense>
  )
}

function ShopPageContent() {
  const searchParams = useSearchParams()
  const t = useTranslations("Products")
  const tCategory = useTranslations("ProductCategory")
  const locale = useLocale()

  // Use locale-aware "All" for initial state
  const allText = locale === 'en' ? "All" : "全部"
  const initialCategory = searchParams.get("category") || allText
  const searchQuery = searchParams.get("search") || ""
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchKeyword, setSearchKeyword] = useState(searchQuery)
  const [categories, setCategories] = useState<CategoryItem[]>([
    { name: allText },
  ])
  const [selectedLocation, setSelectedLocation] = useState(allText)
  const [locations, setLocations] = useState<string[]>([allText])
  const [products, setProducts] = useState<UiProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<UiProduct[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [itemsInView, setItemsInView] = useState<boolean[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sortOption, setSortOption] = useState<"recommended" | "price_asc" | "price_desc">(
    "recommended"
  )
  const [selectedProduct, setSelectedProduct] = useState<UiProduct | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE_URL}/api/products/`, {
          cache: "no-store",
        })
        if (!res.ok) {
          throw new Error(`${t("errorLoadProducts")} (${res.status})`)
        }

        const data = (await res.json()) as ApiProduct[]

        // Process products with locale-aware translation
        const uiProducts = data.map(p => apiToUiProduct(p, locale))

        // Get unique category names (keep Chinese for filtering, translate for English display)
        const uniqueOriginalCategories = Array.from(
          new Set(
            data
              .flatMap((p) => p.categories?.map((c) => c.name) ?? [])
              .filter(Boolean)
          )
        )
        // Get unique location names (keep Chinese for filtering, translate for English display)
        const uniqueOriginalLocations = Array.from(
          new Set(
            data
              .flatMap((p) => p.suitable_locations?.map((l) => l.name) ?? [])
              .filter((name) => Boolean(name) && name !== "不適用")
          )
        )

        // Display names based on locale (English only shows translated names)
        const displayCategories = locale === 'en'
          ? uniqueOriginalCategories.map(name => translateCategory(name))
          : uniqueOriginalCategories
        const displayLocations = locale === 'en'
          ? uniqueOriginalLocations.map(name => translateLocation(name))
          : uniqueOriginalLocations

        // Prefer static logos from /public/CategoriesLogo, fallback to the first product image found.
        const categoryToImage = new Map<string, string>()
        // Map using original Chinese category names for logo lookup
        for (const originalName of uniqueOriginalCategories) {
          const logoFile = CATEGORY_LOGOS[originalName]
          if (logoFile) categoryToImage.set(originalName, publicLogo(logoFile))
        }
        for (const p of uiProducts) {
          // Find the original Chinese category name for this product
          const originalProduct = data.find(ap => ap.id === p.id)
          if (originalProduct) {
            for (const cat of originalProduct.categories ?? []) {
              if (!categoryToImage.has(cat.name) && p.image)
                categoryToImage.set(cat.name, p.image)
            }
          }
        }

        setProducts(uiProducts)
        setFilteredProducts(uiProducts)
        setCategories([
          { name: locale === 'en' ? "All" : "全部", image: publicLogo(CATEGORY_LOGOS["全部"] ?? "All.png") },
          ...displayCategories.map((name) => ({
            name,
            image: categoryToImage.get(
              locale === 'en'
                ? Object.entries(CATEGORY_NAME_TRANSLATIONS).find(
                    ([, trans]) => trans === name
                  )?.[0] ?? name
                : name
            ),
          })),
        ])
        setLocations([locale === 'en' ? "All" : "全部", ...displayLocations])
        setCurrentPage(1)
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorLoadProducts"))
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [])

  // Sync searchKeyword with URL when navigating
  useEffect(() => {
    setSearchKeyword(searchParams.get("search") || "")
  }, [searchParams])

  // Reset category/location selection when locale changes
  useEffect(() => {
    setSelectedCategory(allText)
    setSelectedLocation(allText)
  }, [locale, allText])

  // Filter products by category, location, and search keyword
  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchCategory =
        selectedCategory === allText || p.categories.includes(selectedCategory)
      const matchLocation =
        selectedLocation === allText || p.locations.includes(selectedLocation)
      const matchSearch = !searchKeyword ||
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
  }, [selectedCategory, selectedLocation, products, sortOption, searchKeyword])

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
        className="relative py-24 md:py-50 overflow-hidden"
        ref={sectionRef}
        style={{
          transform: `translateY(-${scrollOffset * 0.2}px)`,
        }}
      >
        <Image
          src="/store.png"
          alt="Store background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <h1 className={`${playfair.className} text-5xl md:text-7xl font-light mb-6 text-neutral-900 leading-tight`}>
              {t("pageTitle")}
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 font-light leading-8">
              {t("pageSubtitle")}
            </p>
          </div>
        </div>
      </section>

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
          {/* Search bar and results info */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {searchKeyword ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">
                  {t("searchResults", { searchKeyword, count: filteredProducts.length })}
                </span>
                <button
                  onClick={() => {
                    setSearchKeyword("")
                    // Remove search param from URL
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
                {t("totalProducts", { count: filteredProducts.length })}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-neutral-500">{t("sort")}</span>
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as "recommended" | "price_asc" | "price_desc")
                }
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
          ) : filteredProducts.length === 0 ? (
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
                  onClick={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PAGINATION ===== */}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-center gap-3">
            <button
              className="px-4 py-2 text-sm border border-neutral-200 rounded-full bg-white text-neutral-700 hover:bg-[#E8B4B8] hover:text-neutral-800 hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              {t("previousPage")}
            </button>
            <div className="flex items-center gap-1">
              <span className="text-sm text-neutral-600 px-2">
                {t("pageOf", { current: currentPage, total: totalPages })}
              </span>
            </div>
            <button
              className="px-4 py-2 text-sm border border-neutral-200 rounded-full bg-white text-neutral-700 hover:bg-[#E8B4B8] hover:text-neutral-800 hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
            >
              {t("nextPage")}
            </button>
          </div>
        </section>
      )}


      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  )
}
