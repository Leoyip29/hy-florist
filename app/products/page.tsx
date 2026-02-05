"use client"

import Image from "next/image"
import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Playfair_Display } from "next/font/google"
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
  圓形花牌: "Round Funeral Wreaths.png",
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

function toUiProduct(p: ApiProduct): UiProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    categories: p.categories?.map((c) => c.name) ?? ["未分類"],
    locations: p.suitable_locations?.map((l) => l.name) ?? [],
    price: Number(p.price),
    image: pickPrimaryImage(p.images),
  }
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">載入中...</div>}>
      <ShopPageContent />
    </Suspense>
  )
}

function ShopPageContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "全部"
  const searchQuery = searchParams.get("search") || ""
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchKeyword, setSearchKeyword] = useState(searchQuery)
  const [categories, setCategories] = useState<CategoryItem[]>([
    { name: "全部" },
  ])
  const [selectedLocation, setSelectedLocation] = useState("全部")
  const [locations, setLocations] = useState<string[]>(["全部"])
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
        const uniqueLocations = Array.from(
          new Set(
            data
              .flatMap((p) => p.suitable_locations?.map((l) => l.name) ?? [])
              .filter((name) => Boolean(name) && name !== "不適用")
          )
        )

        // Prefer static logos from /public/CategoriesLogo, fallback to the first product image found.
        const categoryToImage = new Map<string, string>()
        for (const name of uniqueCategories) {
          const logoFile = CATEGORY_LOGOS[name]
          if (logoFile) categoryToImage.set(name, publicLogo(logoFile))
        }
        for (const p of uiProducts) {
          for (const cat of p.categories) {
            if (!categoryToImage.has(cat) && p.image)
              categoryToImage.set(cat, p.image)
          }
        }

        setProducts(uiProducts)
        setFilteredProducts(uiProducts)
        setCategories([
          { name: "全部", image: publicLogo(CATEGORY_LOGOS["全部"] ?? "All.png") },
          ...uniqueCategories.map((name) => ({
            name,
            image: categoryToImage.get(name),
          })),
        ])
        setLocations(["全部", ...uniqueLocations])
        setCurrentPage(1)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load products")
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

  // Filter products by category, location, and search keyword
  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchCategory =
        selectedCategory === "全部" || p.categories.includes(selectedCategory)
      const matchLocation =
        selectedLocation === "全部" || p.locations.includes(selectedLocation)
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
              花藝商城
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 font-light leading-8">
              探索我們精心挑選的花藝作品，為生活的每一刻增添美麗與溫度。
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
                  搜尋 "<span className="font-medium text-neutral-800">{searchKeyword}</span>"
                  ，共 {filteredProducts.length} 件商品
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
                  清除
                </button>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-neutral-500">
                共 {filteredProducts.length} 件商品
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-neutral-500">排序</span>
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as "recommended" | "price_asc" | "price_desc")
                }
                className="text-xs sm:text-sm border border-neutral-200 rounded-full px-3 py-1.5 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="recommended">預設排序</option>
                <option value="price_asc">價格：由低至高</option>
                <option value="price_desc">價格：由高至低</option>
              </select>
            </div>
          </div>

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
              上一頁
            </button>
            <div className="flex items-center gap-1">
              <span className="text-sm text-neutral-600 px-2">
                第 {currentPage} / {totalPages} 頁
              </span>
            </div>
            <button
              className="px-4 py-2 text-sm border border-neutral-200 rounded-full bg-white text-neutral-700 hover:bg-[#E8B4B8] hover:text-neutral-800 hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200"
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
