"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import ProductCard from "@/components/product/ProductCard"
import type { UiProduct } from "@/app/[locale]/products/page"
import { CATEGORY_MAP } from "@/lib/categories"

interface ProductImage {
  id: number
  image: string
  alt_text: string
  is_primary: boolean
}

interface Product {
  id: number
  name: string
  description: string
  price: string
  categories: { id: number; name: string }[]
  images: ProductImage[]
}

interface HeartFlowerSectionProps {
  products: Product[]
  locale: string
}

// Get primary image
const getPrimaryImage = (images: ProductImage[]): string => {
  const primary = images.find((img) => img.is_primary && img.image)
  if (primary?.image) return primary.image

  const anyWithImage = images.find((img) => img.image)
  return anyWithImage?.image ?? ""
}

// Translation functions (client-side versions)
const CATEGORY_NAME_TRANSLATIONS: Record<string, string> = {
  全部: "All",
  花束: "Bouquet",
  "花束多買優惠": "Bouquet Bundle",
  "多買優惠組合": "Bundle Offer",
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

function translateProductName(name: string): string {
  let translatedName = name

  const categoryPrefixes = Object.keys(CATEGORY_NAME_TRANSLATIONS).filter(
    (key) => key.length > 1 && name.startsWith(key)
  )

  if (categoryPrefixes.length > 0) {
    const longestPrefix = categoryPrefixes.sort((a, b) => b.length - a.length)[0]
    const translatedPrefix = CATEGORY_NAME_TRANSLATIONS[longestPrefix]
    const remainder = name.slice(longestPrefix.length)
    translatedName = `${translatedPrefix}${remainder}`
  }

  // After initial translation, check for any remaining untranslated category terms
  for (const [chinese, english] of Object.entries(CATEGORY_NAME_TRANSLATIONS)) {
    if (chinese.length > 1 && translatedName.includes(chinese)) {
      translatedName = translatedName.replace(chinese, english)
    }
  }

  return translatedName
}

function translateCategory(name: string): string {
  return CATEGORY_NAME_TRANSLATIONS[name] ?? name
}

export function HeartFlowerSectionClient({
  products,
  locale,
}: HeartFlowerSectionProps) {
  const t = useTranslations("HeartFlowerSection")
  const router = useRouter()

  // Get the API category based on locale
  const getCategoryForApi = (cat: string) => {
    if (locale === "zh-HK" || locale === "zh") {
      return CATEGORY_MAP[cat] || cat
    }
    return cat
  }

  // Transform API product to UiProduct format with locale-aware translation
  const toUiProduct = (p: Product): UiProduct => ({
    id: p.id,
    name: locale === 'en' ? translateProductName(p.name) : p.name,
    description: p.description,
    categories: p.categories?.map((c) => 
      locale === 'en' ? translateCategory(c.name) : c.name
    ) ?? [],
    locations: [],
    price: Number(p.price),
    image: getPrimaryImage(p.images),
  })

  const handleProductClick = (product: UiProduct) => {
    router.push(`/?product=${product.id}`, { scroll: false })
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-24 md:py-32 bg-[#8B6B6B]">
      <div className="mx-auto px-4 md:px-8">
        {/* Section Header - Heart Themed */}
        <div className="text-center mb-16">
          {/* Heart Decorative Element */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-6 h-6">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-rose-300">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
          <p className="text-xs md:text-sm tracking-[0.25em] text-rose-200 uppercase mb-4">
            {t("tagline")}
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-rose-100 font-serif">
            {t("title")} {t("subtitle")}
          </h2>
          {/* Heart Decorative Element */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-8 h-px bg-[#E8C8C8]" />
            <div className="w-5 h-5 relative">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#E8C8C8]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div className="w-8 h-px bg-[#E8C8C8]" />
          </div>
          <p className="mt-4 text-rose-300/80 font-light text-sm tracking-wide max-w-lg mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={toUiProduct(product)}
              playfairClassName="font-serif"
              inView={true}
              index={index}
              onClick={handleProductClick}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center">
          <Link
            href={`/${locale}/products?category=${getCategoryForApi("heart-shaped-board")}`}
            className="inline-block text-sm tracking-widest text-rose-200 border border-rose-400/50 px-8 py-3 hover:bg-white hover:text-[#8B6B6B] hover:border-white transition-all duration-300"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  )
}
