"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

export default function SectionDivider() {
  const t = useTranslations("SectionDivider")
  
  const playfair = {
    className: "font-serif",
  }

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="mx-auto px-4 max-w-6xl">
        {/* Decorative Line with Center Element */}
        <div className="relative flex items-center justify-center">
          {/* Left Line */}
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-200 to-neutral-300" />
          
          {/* Center Botanical Element */}
          <div className="relative mx-6 md:mx-10">
            {/* Decorative leaves/branch - Left */}
            <div className="absolute -left-16 md:-left-20 top-1/2 -translate-y-1/2 opacity-40">
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="text-neutral-300">
                <path d="M0 12C8 10 12 4 20 8C28 12 32 20 40 16" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M8 8C6 6 10 2 14 4" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M12 16C10 18 14 22 18 20" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M20 12C18 10 22 6 26 8" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </div>
            
            {/* Center Circle with Initial */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border border-neutral-200 bg-white flex items-center justify-center">
              <span className={`text-lg md:text-xl font-light text-neutral-400 tracking-widest ${playfair.className}`}>
                H
              </span>
            </div>
            
            {/* Decorative leaves/branch - Right */}
            <div className="absolute -right-16 md:-right-20 top-1/2 -translate-y-1/2 opacity-40">
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="text-neutral-300">
                <path d="M48 12C40 10 36 4 28 8C20 12 16 20 8 16" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M40 8C42 6 38 2 34 4" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M36 16C38 18 34 22 30 20" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M28 12C30 10 26 6 22 8" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </div>
          </div>
          
          {/* Right Line */}
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-neutral-200 to-neutral-300" />
        </div>

        {/* Optional Subtle Tagline */}
        <div className="mt-6 text-center">
          <p className="text-xs md:text-sm text-neutral-400 font-light tracking-[0.2em] uppercase">
            {t("tagline")}
          </p>
        </div>
      </div>
    </section>
  )
}
