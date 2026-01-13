"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function ServicesAndAbout() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const offset = Math.max(0, (window.innerHeight - rect.top) * 0.4)
        setScrollOffset(Math.min(offset, 80))
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for content fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-white" ref={sectionRef}>

      {/* ================= ABOUT BLOCK ================= */}
        <section className="py-24 bg-white">
        <div
            className="
            relative
            mx-auto
            max-w-[1140px]
            min-h-[420px]
            bg-[url('/hy_home_05.jpg')]
            bg-cover
            bg-[right_center]
            bg-no-repeat
            rounded-sm
            overflow-hidden
            shadow-lg
            transition-all
            duration-700
            "
            style={{
              opacity: isInView ? 1 : 0.7,
              transform: `translateY(${-scrollOffset * 0.25}px) scale(${isInView ? 1 : 0.98})`,
            }}
        >
            {/* soft overlay only on left */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent" />

            <div className="relative h-full flex items-center px-16 transition-all duration-500">
            <div 
              className="max-w-md"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateX(0)" : "translateX(-30px)",
                transitionDelay: "200ms",
              }}
            >

                <div className="text-5xl text-neutral-300 mb-6 leading-none">“</div>

                <p className="text-sm leading-relaxed text-neutral-700 mb-6">
                風信子花店以向客人提供優質的花藝服務為使命。我們的花藝師
                認真對待每一朵花材，細緻地製作每一件作品，珍惜每一次
                花藝創作的機會。只因每一個花藝品不只是儀式的配角，
                更是生活時刻中的主角。
                </p>

                <p className="text-sm leading-relaxed text-neutral-700 mb-8">
                我們相信，花藝是一種超越語言的藝術。花藝不僅是裝飾，
                更是傳遞心意的橋樑。我們用花的姿態，為您留下最後的告白，
                為摯愛送行。風信子傳遞的不只是哀悼，更是愛的延續，
                讓思念在時間中，也能被溫柔地接住。
                </p>

                <p className="text-sm font-medium text-neutral-800">
                Hyacinth Florist ｜ 風信子花店
                </p>
                <Link href="/about"
                className="
                    mt-8
                    inline-flex
                    items-center
                    justify-center
                    px-10
                    py-3
                    rounded-full
                    border
                    border-neutral-300
                    bg-white/80
                    text-sm
                    tracking-wide
                    text-neutral-800
                    hover:bg-neutral-900
                    hover:text-white
                    hover:border-neutral-900
                    transition
                    duration-300
                "
                >
                關於我們
                </Link>

            </div>
            </div>
        </div>
        </section>

    </section>
  )
}
