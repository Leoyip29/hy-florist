"use client"

import Image from "next/image"
import Link from "next/link"

const series = [
  {
    tag: "CHURCH CEREMONY",
    title: "教堂追思花藝",
    desc: "為教堂典禮而設的花藝佈置，以純淨而莊重的花材，陪伴摯愛走過最後的祝禱與告別時刻。",
    image: "/church_flower.jpg",
    cta: "了解教堂花藝",
  },
  {
    tag: "CASKET FLORAL",
    title: "棺面花藝佈置",
    desc: "棺面花藝以細膩的設計與溫柔的色調，表達最深切的敬意，讓思念靜靜安放於告別之中。",
    image: "/series-casket1.jpg",
    cta: "查看棺面花藝",
  },
  {
    tag: "HOSPITAL FAREWELL",
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
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20 relative z-10">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#292524] font-serif">
            系列花藝
          </h2>
          <p className="mt-4 text-[#78716C] font-light text-xs tracking-[0.25em] uppercase">
            Floral Collections
          </p>
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-8 h-px bg-[#D4C8B8]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#9CAFA3]" />
            <div className="w-8 h-px bg-[#D4C8B8]" />
          </div>
        </div>

        {/* 2x2 Grid with alternating background colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg overflow-hidden">
          {/* Top-Left: Light Cream - Item 1 */}
          <div className="bg-[#F5F5F4] p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#D4C8B8]">
            <div className="relative aspect-[4/3] overflow-hidden bg-white shadow-md mb-6">
              <Image
                src={series[0].image}
                alt={series[0].title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <p className="text-xs tracking-[0.25em] text-[#9CAFA3] uppercase mb-2 font-medium">
              {series[0].tag}
            </p>
            <h3 className="text-2xl font-light text-[#292524] mb-3 font-serif">
              {series[0].title}
            </h3>
            <p className="text-[#78716C] font-light text-sm mb-4 leading-relaxed">
              {series[0].desc}
            </p>
            <Link href="#" className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
              {series[0].cta} →
            </Link>
          </div>

          {/* Top-Right: Warm Beige - Item 2 */}
          <div className="bg-[#E8E2D9] p-8 md:p-12 border-b border-[#D4C8B8]">
            <div className="relative aspect-[4/3] overflow-hidden bg-white shadow-md mb-6">
              <Image
                src={series[1].image}
                alt={series[1].title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <p className="text-xs tracking-[0.25em] text-[#9CAFA3] uppercase mb-2 font-medium">
              {series[1].tag}
            </p>
            <h3 className="text-2xl font-light text-[#292524] mb-3 font-serif">
              {series[1].title}
            </h3>
            <p className="text-[#78716C] font-light text-sm mb-4 leading-relaxed">
              {series[1].desc}
            </p>
            <Link href="#" className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
              {series[1].cta} →
            </Link>
          </div>

          {/* Bottom-Left: Warm Beige - Item 3 */}
          <div className="bg-[#E8E2D9] p-8 md:p-12 md:border-r border-[#D4C8B8]">
            <div className="relative aspect-[4/3] overflow-hidden bg-white shadow-md mb-6">
              <Image
                src={series[2].image}
                alt={series[2].title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <p className="text-xs tracking-[0.25em] text-[#9CAFA3] uppercase mb-2 font-medium">
              {series[2].tag}
            </p>
            <h3 className="text-2xl font-light text-[#292524] mb-3 font-serif">
              {series[2].title}
            </h3>
            <p className="text-[#78716C] font-light text-sm mb-4 leading-relaxed">
              {series[2].desc}
            </p>
            <Link href="#" className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
              {series[2].cta} →
            </Link>
          </div>

          {/* Bottom-Right: Light Cream - Item 4 */}
          <div className="bg-[#F5F5F4] p-8 md:p-12">
            <div className="relative aspect-[4/3] overflow-hidden bg-white shadow-md mb-6">
              <Image
                src={series[3].image}
                alt={series[3].title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <p className="text-xs tracking-[0.25em] text-[#9CAFA3] uppercase mb-2 font-medium">
              {series[3].tag}
            </p>
            <h3 className="text-2xl font-light text-[#292524] mb-3 font-serif">
              {series[3].title}
            </h3>
            <p className="text-[#78716C] font-light text-sm mb-4 leading-relaxed">
              {series[3].desc}
            </p>
            <Link href="#" className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
              {series[3].cta} →
            </Link>
          </div>
        </div>

        {/* Bottom decorative element */}
        {/* <div className="flex items-center justify-center gap-2 mt-24">
          <div className="w-8 h-px bg-[#D4C8B8]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#9CAFA3]" />
          <div className="w-8 h-px bg-[#D4C8B8]" />
        </div> */}
      </div>
    </section>
  )
}
