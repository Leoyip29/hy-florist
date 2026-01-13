"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const series = [
  {
    tag: "CHURCH CEREMONY FLORAL",
    title: "教堂追思花藝",
    desc: "為教堂典禮而設的花藝佈置，以純淨而莊重的花材，陪伴摯愛走過最後的祝禱與告別時刻。",
    image: "/church_flower.jpg",
    cta: "了解教堂花藝",
  },
  {
    tag: "CASKET FLORAL ARRANGEMENT",
    title: "棺面花藝佈置",
    desc: "棺面花藝以細膩的設計與溫柔的色調，表達最深切的敬意，讓思念靜靜安放於告別之中。",
    image: "/series-casket1.jpg",
    cta: "查看棺面花藝",
  },
  {
    tag: "HOSPITAL FAREWELL FLOWERS",
    title: "醫院告別花藝",
    desc: "於醫院送別摯愛時，以簡約而真誠的花藝，代替言語，傳遞陪伴、關懷與不捨。",
    image: "/series-hospital.jpg",
    cta: "探索告別花藝",
  },
  {
    tag: "FUNERAL WREATHS",
    title: "殯儀館追思花籃",
    desc: "專為殯儀館儀式設計的追思花籃，結合傳統與現代花藝語言，表達永恆的懷念與敬重。",
    image: "/series-funeral.jpg",
    cta: "瀏覽追思花籃",
  },
]


export default function SeriesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [itemsInView, setItemsInView] = useState<boolean[]>(Array(series.length).fill(false))

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const offset = Math.max(0, (window.innerHeight - rect.top) * 0.5)
        setScrollOffset(Math.min(offset, 150))
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for series items
  useEffect(() => {
    const items = document.querySelectorAll(".series-item")
    const inViewStates: boolean[] = []

    items.forEach((item, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          inViewStates[index] = entry.isIntersecting
          setItemsInView([...inViewStates])
        },
        { threshold: 0.2 }
      )
      observer.observe(item)
    })
  }, [])

  return (
    <section className="relative" ref={sectionRef}>
      {/* Background section with soft color - acts as visual anchor */}
      <div 
        className="bg-gradient-to-l from-amber-100/30 via-orange-100/20 to-transparent pt-8 md:pt-12 pb-20 md:pb-32 transition-all duration-300"
        style={{
          transform: `translateY(${scrollOffset * 0.15}px)`,
        }}
      >
        <div className="mx-auto px-4 md:px-8 max-w-7xl">
          {/* Section Title - Right Aligned */}
          <div className="flex justify-end mb-6 md:mb-8">
            <div className="text-right max-w-md">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 leading-tight">
                <span className="font-serif">系列</span>
                <br />
                <span className="font-serif">花藝</span>
              </h2>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-neutral-600 font-light leading-relaxed">
                專為人生重要時刻精心設計的花藝系列。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Series Items Container */}
      <div className="mx-auto max-w-[1240px] px-6 md:px-8 space-y-28 md:space-y-36 -mt-16 md:-mt-20 relative z-10">

        {series.map((item, i) => {
          const isReversed = i % 2 === 1 // 2,4 reversed

          return (
            <div
              key={i}
              className="series-item grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20 items-center transition-all duration-700"
              style={{
                opacity: itemsInView[i] ? 1 : 0.5,
                transform: itemsInView[i]
                  ? isReversed
                    ? "translateX(0) scale(1)"
                    : "translateX(0) scale(1)"
                  : isReversed
                  ? "translateX(40px) scale(0.97)"
                  : "translateX(-40px) scale(0.97)",
              }}
            >
              {/* IMAGE */}
              <div
                className={`relative w-full h-[480px] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 group ${
                  isReversed ? "md:order-2" : "md:order-1"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  style={{
                    transform: itemsInView[i] ? "scale(1)" : "scale(0.95)",
                  }}
                />
              </div>

              {/* TEXT */}
              <div
                className={`flex flex-col justify-center h-[480px] ${
                  isReversed ? "md:order-1" : "md:order-2"
                }`}
              >
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase mb-3">
                      {item.tag}
                    </p>
                    <h3 className="text-3xl md:text-2xl lg:text-3xl font-light leading-tight text-neutral-900">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-base leading-relaxed text-neutral-600 font-light">
                    {item.desc}
                  </p>

                  <div className="pt-4">
                    <Link
                      href="#"
                      className="
                        inline-flex items-center justify-center
                        px-8 py-3.5
                        rounded-md
                        border border-neutral-400
                        text-sm font-medium tracking-wide
                        text-neutral-900
                        bg-white
                        hover:bg-neutral-900 hover:text-white hover:border-neutral-900
                        transition duration-300 ease-out
                      "
                    >
                      {item.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

      </div>
    </section>
  )
}
