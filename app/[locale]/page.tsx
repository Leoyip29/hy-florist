import { Suspense } from "react"
import { getLocale } from "next-intl/server"
import HeroSection from "@/components/sections/HeroSection"
import FeaturedProducts from "@/components/sections/FeaturedProducts"
import FlowerStandSection from "@/components/sections/FlowerStandSection"
import SplitScreenShowcase from "@/components/sections/SplitScreenShowcase"
import HeartFlowerSection from "@/components/sections/HeartFlowerSection"
import SeriesSection from "@/components/sections/SeriesSection"
import SectionDivider from "@/components/sections/SectionDivider"
import ServicesAndAbout from "@/components/sections/ServicesAndAbout"
import { fetchProductsByIds } from "@/lib/api"
import { apiToUiProduct } from "@/lib/product-utils"

const SHOWCASE_PRODUCT_IDS = [439, 12, 15]

export default async function Home() {
  const [locale, apiProducts] = await Promise.all([
    getLocale(),
    fetchProductsByIds(SHOWCASE_PRODUCT_IDS),
  ])

  const showcaseProducts = apiProducts.map((p) => apiToUiProduct(p, locale))

  return (
    <main className="min-h-screen">
      <HeroSection />
      <Suspense fallback={<div className="py-24 md:py-36" />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<div className="py-24" />}>
        <FlowerStandSection />
      </Suspense>
      <SplitScreenShowcase initialProducts={showcaseProducts} />
      <Suspense fallback={<div className="py-24" />}>
        <HeartFlowerSection />
      </Suspense>
      <Suspense fallback={<div className="py-16" />}>
        <SeriesSection />
      </Suspense>
      <SectionDivider />
      <ServicesAndAbout />
    </main>
  )
}