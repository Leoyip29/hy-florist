import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"
import ProductCard from "@/components/product/ProductCard"
import { fetchProductsByIds } from "@/lib/api"
import { apiToUiProduct } from "@/lib/product-utils"

const FLOWER_STAND_PRODUCT_IDS = [97, 98, 101, 109]

export default async function FlowerStandSection() {
  const [t, locale, apiProducts] = await Promise.all([
    getTranslations("FlowerStandSection"),
    getLocale(),
    fetchProductsByIds(FLOWER_STAND_PRODUCT_IDS),
  ])

  const products = apiProducts.map((p) => apiToUiProduct(p, locale))

  if (products.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-[#5c4d3c]">
      <div className="mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-xs md:text-sm tracking-[0.25em] text-stone-300 uppercase mb-4">
            {t("tagline")}
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-stone-100 font-serif">
            {t("title")} {t("subtitle")}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-8 h-px bg-[#D4C8B8]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#9CAFA3]" />
            <div className="w-8 h-px bg-[#D4C8B8]" />
          </div>
          <p className="mt-4 text-stone-400 font-light text-sm tracking-wide max-w-lg mx-auto leading-relaxed">
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
            href={`/${locale}/products?category=十字架花牌`}
            className="inline-block text-sm tracking-widest text-stone-300 border border-stone-500 px-8 py-3 hover:bg-white hover:text-[#5c4d3c] hover:border-white transition-all duration-300"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  )
}