import type { Metadata } from "next"
import { Suspense } from "react"
import ProductsClient from "@/components/product/ProductsClient"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === "en"
  return {
    title: isEn ? "Shop Flowers" : "購買鮮花",
    description: isEn
      ? "Browse our full collection of fresh flowers and floral arrangements – bouquets, wreaths, flower boards, baskets and more. Order online for delivery in Hong Kong."
      : "瀏覽我們的鮮花系列——花束、花圈、花牌、花籃等。香港送花，網上落單。",
    alternates: {
      canonical: `https://hy-florist.hk/${locale}/products`,
      languages: {
        "en": "https://hy-florist.hk/en/products",
        "zh-HK": "https://hy-florist.hk/zh-HK/products",
      },
    },
    openGraph: {
      title: isEn ? "Shop Flowers | Hyacinth Florist" : "購買鮮花 | HY Florist",
      description: isEn
        ? "Fresh flowers and arrangements for every occasion in Hong Kong."
        : "香港各種場合的鮮花及花藝佈置。",
      images: [{ url: "https://hy-florist.hk/store.png" }],
    },
  }
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="pt-[125px] min-h-screen" />}>
      <ProductsClient />
    </Suspense>
  )
}