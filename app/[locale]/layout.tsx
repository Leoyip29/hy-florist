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
import Header from "@/components/layout/Header"

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
        ? "Hyacinth Florist – Hong Kong Premium Floral Arrangements"
        : "HY Florist 韓雅花店 – 香港優質鮮花服務",
      template: isEn ? "%s | Hyacinth Florist" : "%s | HY Florist",
    },
    description: isEn
      ? "Premium floral arrangements for funerals, weddings, and all occasions in Hong Kong. Bouquets, flower boards, baskets, wreaths and more."
      : "香港優質花藝服務，提供花束、花籃、花牌、花圈等各種鮮花佈置，適合各種場合。",
    openGraph: {
      siteName: isEn ? "Hyacinth Florist" : "HY Florist",
      locale: isEn ? "en_US" : "zh_HK",
      type: "website",
    },
  }
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
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