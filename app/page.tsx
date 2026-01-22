"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Playfair_Display } from "next/font/google"
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import ServicesAndAbout from '@/components/sections/ServicesAndAbout'
import SeriesSection from "@/components/sections/SeriesSection"
import SectionDivider from '@/components/sections/SectionDivider'
import FlowerStandSection from '@/components/sections/FlowerStandSection'
import MarqueeBanner from '@/components/sections/MarqueeBanner'
import Link from "next/link"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const slides = [
  {
    id: 0,
    image: "/hy_home_banner_02.webp",
    title: "以花傳意\n致敬生命",
    desc: "用心意與專業，為每一個珍重時刻送上真摯的祝福。",
  },
  {
    id: 1,
    image: "/hy_home_banner_02.webp",
    title: "真摯的慰問\n永恆的紀念",
    desc: "以優雅花藝，表達最深切的敬意與關懷。",
  },
]

export default function Home() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

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
                      探索花藝
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <FeaturedProducts />
      <FlowerStandSection />
      <MarqueeBanner />

      <SeriesSection />
      <SectionDivider />
      <ServicesAndAbout />
    </main>
  )
}
