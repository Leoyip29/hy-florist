"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import ProductCard from "@/components/product/ProductCard"
import type { UiProduct } from "@/app/[locale]/products/page"

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

interface FeaturedProductsProps {
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
  const categoryPrefixes = Object.keys(CATEGORY_NAME_TRANSLATIONS).filter(
    (key) => key.length > 1 && name.startsWith(key)
  )

  if (categoryPrefixes.length > 0) {
    const longestPrefix = categoryPrefixes.sort((a, b) => b.length - a.length)[0]
    const translatedPrefix = CATEGORY_NAME_TRANSLATIONS[longestPrefix]
    const remainder = name.slice(longestPrefix.length)
    return `${translatedPrefix}${remainder}`
  }
  return name
}

function translateCategory(name: string): string {
  return CATEGORY_NAME_TRANSLATIONS[name] ?? name
}

export function FeaturedProductsClient({
  products,
  locale,
}: FeaturedProductsProps) {
  const t = useTranslations("FeaturedProducts")
  const router = useRouter()

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
    <section className="py-24 md:py-36">
      <div className="mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 items-start">
          {/* Section Title - Left */}
          <div className="lg:col-span-1">
            <h2 className="text-5xl md:text-6xl font-light tracking-wide text-neutral-900 font-serif">
              {t("title")}
            </h2>
            <h2 className="text-5xl md:text-6xl font-light tracking-wide text-neutral-900 font-serif">
              {t("subtitle")}
            </h2>
            <p className="mt-4 text-neutral-500 font-light text-sm tracking-widest">
              BESTSELLERS
            </p>
          </div>

          {/* Product Grid - Right */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-2">
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
                href={`/${locale}/products`}
                className="inline-block px-8 py-3 text-sm tracking-widest text-neutral-600 border border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
              >
                {t("viewAll")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
