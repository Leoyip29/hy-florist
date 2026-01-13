"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Playfair_Display } from "next/font/google"
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import ServicesAndAbout from '@/components/sections/ServicesAndAbout'
import SeriesSection from "@/components/sections/SeriesSection"
import Link from "next/link"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const slides = [
  {
    id: 0,
    image: "/hy_home_banner_02.webp",
    title: "將心意\n化成一束花",
    desc: "每一束花都承載獨特的情感，為重要時刻增添溫度與記憶。",
  },
  {
    id: 1,
    image: "/hy_home_banner_02.webp",
    title: "讓重要時刻\n更有溫度",
    desc: "從日常到人生重要時刻，我們以花傳遞情感。",
  },
]

export default function Home() {
  const [index, setIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  // ✅ AUTOPLAY
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // ✅ PARALLAX SCROLLING EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main>
      <section className="relative  w-full h-[90vh] overflow-hidden">

        {/* SLIDES */}
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`
              absolute inset-0 transition-opacity duration-1000
              ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}
            `}
          >
            <Image
              src={slide.image}
              alt="Hero banner"
              fill
              priority={i === 0}
              className="object-cover"
              style={{
                transform: i === index ? `translateY(${scrollY * 0.5}px)` : "translateY(0)",
                transition: "transform 0.1s ease-out",
              }}
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

            {/* content */}
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto max-w-[1140px] w-full px-8">
                <div className="max-w-xl text-left text-white">
                  <h1
                    className={`${playfair.className} text-4xl md:text-6xl leading-tight whitespace-pre-line`}
                  >
                    {slide.title}
                  </h1>

                  <p className="mt-6 max-w-md text-white/90">
                    {slide.desc}
                  </p>

                  <Link href="/products">
                    <button
                      type="button"
                      className="
                        px-10 md:px-14
                        py-4 md:py-5
                        mt-8
                        text-base md:text-lg
                        rounded-full
                        bg-white text-black
                        border border-white
                        shadow-lg hover:shadow-xl
                        hover:bg-white/90
                        transition
                      "
                    >
                      探索我們的花藝
                    </button>
                  </Link>

                </div>
              </div>
            </div>
          </div>
        ))}
        
      </section>
      <FeaturedProducts />
      <SeriesSection />
      <ServicesAndAbout />
    </main>
  )
}



