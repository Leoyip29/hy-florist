"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Playfair_Display } from "next/font/google"
import { useTranslations } from "next-intl"
import FeaturedProducts from "@/components/sections/FeaturedProducts"
import ServicesAndAbout from "@/components/sections/ServicesAndAbout"
import SeriesSection from "@/components/sections/SeriesSection"
import SectionDivider from "@/components/sections/SectionDivider"
import FlowerStandSection from "@/components/sections/FlowerStandSection"
import HeartFlowerSection from "@/components/sections/HeartFlowerSection"
import SplitScreenShowcase from "@/components/sections/SplitScreenShowcase"
import Link from "next/link"
import ProductCard from "@/components/product/ProductCard"
import ProductDetail from "@/components/product/ProductDetail"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export type UiProduct = {
  id: number
  name: string
  description: string
  categories: string[]
  locations: string[]
  price: number
  image: string
  rating?: number
  reviews?: number
}

export default function Home() {
  const t = useTranslations("Home")
  const [index, setIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<UiProduct | null>(null)

  const slides = [
    {
      id: 0,
      image: "/hy_home_banner_02.webp",
      title: t("hero.slides.0.title"),
      desc: t("hero.slides.0.description"),
    },
    {
      id: 1,
      image: "/hy_home_banner_02.webp",
      title: t("hero.slides.1.title"),
      desc: t("hero.slides.1.description"),
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt="Hero banner"
              fill
              priority={i === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6 max-w-3xl">
                <h1
                  className={`${playfair.className} text-4xl md:text-6xl lg:text-7xl text-white font-light tracking-wide leading-tight whitespace-pre-line`}
                >
                  {slide.title}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-xl mx-auto">
                  {slide.desc}
                </p>
                <div className="mt-10">
                  <Link href="/products">
                    <button className="px-12 py-4 text-sm tracking-widest text-white border border-white/60 hover:bg-white hover:text-neutral-900 transition-all duration-500 uppercase">
                      {t("hero.ctaButton")}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <FeaturedProducts onProductClick={setSelectedProduct} />
      <FlowerStandSection onProductClick={setSelectedProduct} />
      <SplitScreenShowcase onProductClick={setSelectedProduct} />
      <HeartFlowerSection onProductClick={setSelectedProduct} />

      <SeriesSection />
      <SectionDivider />
      <ServicesAndAbout />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  )
}
