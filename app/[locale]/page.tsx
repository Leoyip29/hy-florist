import type { Metadata } from "next"
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === "en"
  return {
    title: isEn ? "Funeral Flower Shop | Funeral Wreaths & Sympathy Flowers Hong Kong | Hyacinth Florist" : "帛事花店 | 帛事花牌 花籃 | 風信子花店 香港",
    description: isEn
      ? "Hong Kong's trusted funeral flower shop. Premium funeral wreaths, sympathy flower wreaths, flower stands & tribute arrangements. Quality flowers for memorial services. Order now."
      : "帛事花店首選。提供優質帛事花牌、花籃、慰問花圈及各式祭奠花藝。用心意與專業，為每一個珍重時刻送上真摯的祝福。",
    keywords: isEn
      ? ["funeral flowers", "sympathy flowers", "funeral wreaths", "Hong Kong florist", "flower wreath", "memorial flowers", "funeral shop"]
      : ["帛事花店", "帛事花", "花牌", "花籃", "香港花店", "風信子花店", "紅磡花店", "慰問花", "喪禮花", "帛事花圈", "花圈", "祭奠花"],
    alternates: {
      canonical: `https://hy-florist.hk/${locale}`,
      languages: {
        "en": "https://hy-florist.hk/en",
        "zh-HK": "https://hy-florist.hk/zh-HK",
      },
    },
    openGraph: {
      title: isEn ? "Funeral Flower Shop | Hyacinth Florist Hong Kong" : "帛事花店 | 風信子花店 香港",
      description: isEn
        ? "Hong Kong's trusted funeral flower shop. Premium funeral wreaths, sympathy flowers & tribute arrangements."
        : "帛事花店首選。提供優質帛事花牌、花籃、慰問花圈及各式祭奠花藝。",
      url: `https://hy-florist.hk/${locale}`,
      siteName: "Hyacinth Florist 風信子花店",
      locale: locale === "zh-HK" ? "zh_HK" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isEn ? "Funeral Flower Shop | Hyacinth Florist" : "帛事花店 | 風信子花店",
      description: isEn
        ? "Hong Kong's trusted funeral flower shop."
        : "帛事花店首選。提供優質帛事花牌、花籃、慰問花圈。",
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

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