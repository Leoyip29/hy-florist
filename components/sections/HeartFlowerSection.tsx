import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"
import ProductCard from "@/components/product/ProductCard"
import { fetchProductsByIds } from "@/lib/api"
import { apiToUiProduct } from "@/lib/product-utils"
import { CATEGORY_MAP } from "@/lib/categories"

const HEART_FLOWER_PRODUCT_IDS = [244, 265, 267, 283]

export default async function HeartFlowerSection() {
  const [t, locale, apiProducts] = await Promise.all([
    getTranslations("HeartFlowerSection"),
    getLocale(),
    fetchProductsByIds(HEART_FLOWER_PRODUCT_IDS),
  ])

  const products = apiProducts.map((p) => apiToUiProduct(p, locale))
  const categoryParam = CATEGORY_MAP["heart-shaped-board"] ?? "Heart-shaped Boards"

  if (products.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-[#8B6B6B]">
      <div className="mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-6 h-6">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-rose-300">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
          <p className="text-xs md:text-sm tracking-[0.25em] text-rose-200 uppercase mb-4">
            {t("tagline")}
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-rose-100 font-serif">
            {t("title")} {t("subtitle")}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-8 h-px bg-[#E8C8C8]" />
            <div className="w-5 h-5 relative">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#E8C8C8]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="w-8 h-px bg-[#E8C8C8]" />
          </div>
          <p className="mt-4 text-rose-300/80 font-light text-sm tracking-wide max-w-lg mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              playfairClassName="font-serif"
              inView={true}
              index={index}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href={`/${locale}/products?category=${encodeURIComponent(categoryParam)}`}
            className="inline-block text-sm tracking-widest text-rose-200 border border-rose-400/50 px-8 py-3 hover:bg-white hover:text-[#8B6B6B] hover:border-white transition-all duration-300"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  )
}