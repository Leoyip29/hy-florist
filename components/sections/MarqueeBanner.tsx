"use client"

import Image from "next/image"
import Link from "next/link"

export default function MarqueeBanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/series.png"
          alt="Hyacinth Florist - White Hyacinth Flowers"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Decorative top line with glow effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Top: Scrolling Marquee Banner */}
      <div className="relative w-full overflow-hidden py-16 md:py-20">
        {/* Fade masks on both sides */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-black/40 via-black/20 to-transparent z-10 pointer-events-none" />

        {/* Scrolling text with subtle letter spacing animation */}
        <div className="flex w-max animate-marquee">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white/70 mx-8 md:mx-10 font-serif italic"
            >
              HYACINTH FLORIST
            </span>
          ))}
        </div>
      </div>

      {/* Elegant divider with center accent */}
      <div className="relative flex items-center justify-center gap-4 mx-auto max-w-48">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="w-1.5 h-1.5 rotate-45 bg-white/60" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Bottom: Content Section */}
      <div className="py-20 md:py-24">
        <div className="mx-auto px-4 text-center max-w-4xl">
          {/* Decorative Chinese character with subtle styling */}
          <div className="flex justify-center mb-6">
            <span className="text-5xl md:text-6xl font-light tracking-widest text-white/90 font-serif">
              以花傳意
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white/90 font-serif mb-4">
            致敬生命
          </h2>

          {/* Elegant subtitle with refined typography */}
          <p className="text-white/70 font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12 font-light tracking-wide">
            用心意與專業，為每一個珍重時刻送上真摯的祝福
          </p>

          {/* CTA Buttons with refined styling */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/products"
              className="group relative px-10 py-3.5 text-xs tracking-[0.25em] text-[#F5F0E8] bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-500 ease-out"
            >
              <span className="relative z-10">探索花藝</span>
              <div className="absolute inset-0 border border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <button className="group relative px-10 py-3.5 text-xs tracking-[0.25em] text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300">
              <span className="relative z-10">聯絡我們</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
