import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"
import ProductCard from "@/components/product/ProductCard"
import { fetchFeaturedProducts } from "@/lib/api"
import { apiToUiProduct } from "@/lib/product-utils"

export default async function FeaturedProducts() {
  const [t, locale, apiProducts] = await Promise.all([
    getTranslations("FeaturedProducts"),
    getLocale(),
    fetchFeaturedProducts(),
  ])

  const products = apiProducts.map((p) => apiToUiProduct(p, locale))

  if (products.length === 0) return null

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
                  product={product}
                  playfairClassName="font-serif"
                  inView={true}
                  index={index}
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