import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { Geist, Geist_Mono } from "next/font/google"
import Footer from "@/components/layout/Footer"
import { CartProvider } from "@/contexts/CartContext"
import { ProductDetailProvider } from "@/contexts/ProductDetailContext"
import CartDrawer from "@/components/cart/CartDrawer"
import Header from "@/components/layout/SiteHeader"
import SplashBanner from "@/components/layout/SplashBanner"
import Script from "next/script"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === "en"
  return {
    metadataBase: new URL("https://hy-florist.hk"),
    title: {
      default: isEn
        ? "Hyacinth Florist – Hong Kong Sympathy Flower Specialist"
        : "Hyacinth Florist 風信子花店 – 香港帛事花店",
      template: isEn ? "%s | Hyacinth Florist" : "%s | Hyacinth Florist",
    },  
    description: isEn
      ? "Premium sympathy flowers and floral arrangements for funerals and memorial services in Hong Kong. Wreaths, bouquets, flower boards, and baskets for churches, funeral homes, and temples."
      : "香港專業帛事花店，提供帛事花圈、花束、花牌、花籃等花藝佈置，適用於殯儀館、教堂及寺廟。",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: `https://hy-florist.hk/${locale}`,
      languages: {
        "en": "https://hy-florist.hk/en",
        "zh-HK": "https://hy-florist.hk/zh-HK",
      },
    },
    openGraph: {
      siteName: isEn ? "Hyacinth Florist" : "Hyacinth Florist",
      locale: isEn ? "en_US" : "zh_HK", 
      type: "website",
      images: [
        {
          url: "https://hy-florist.hk/hy_01.webp",
          width: 1200,
          height: 630,
          alt: isEn ? "Hyacinth Florist Hong Kong" : "Hyacinth Florist 風信子花店",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["https://hy-florist.hk/hy_01.webp"],
    },
  }
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FloristShop",
  name: "Hyacinth Florist 風信子花店",
  url: "https://hy-florist.hk",
  image: "https://hy-florist.hk/hy_01.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "必嘉街18號嘉麗閣 地下3號舖",
    addressLocality: "紅磡",
    addressRegion: "九龍",
    addressCountry: "HK",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "16:00",
    },
  ],
  currenciesAccepted: "HKD",
  priceRange: "$$",
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SplashBanner />
          <CartProvider>
            <ProductDetailProvider>
              <Header />
              {children}
              <Footer />
              <CartDrawer />
            </ProductDetailProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}