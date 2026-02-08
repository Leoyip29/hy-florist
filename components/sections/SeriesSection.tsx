"use client"

import Image from "next/image"
import Link from "next/link"

const series = [
  {
    tag: "BENCH FLOWERS",
    title: "櫈花",
    desc: "以精緻的櫈面花藝裝飾每一張椅子，為告別儀式增添溫暖與敬意，陪伴摯愛走過最後的時光。",
    image: "/series-chair.jpg",
    cta: "查看櫈花",
  },
  {
    tag: "CASKET FLOWERS",
    title: "棺面花",
    desc: "棺面花藝以細膩的設計與溫柔的色調，表達最深切的敬意，讓思念靜靜安放於告別之中。",
    image: "/series-casket1.jpg",
    cta: "查看棺面花",
  },
  {
    tag: "PULPIT FLOWERS",
    title: "講台花",
    desc: "講台花以典雅的花藝設計，為牧師或主持人的講台增添莊嚴肅穆的氣氛，傳遞深切的追思。",
    image: "/pulpit_flower.jpg",
    cta: "查看講台花",
  },
  {
    tag: "STAND FLOWERS",
    title: "台花",
    desc: "優雅的台花設計，為告別廳增添溫馨與敬意，以鮮花傳遞對逝者的懷念與祝福。",
    image: "/series_stand.jpg",
    cta: "查看台花",
  },
]

export default function SeriesSection() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20 relative z-10">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#292524] font-serif">
            告別花藝系列
          </h2>
          <p className="mt-4 text-[#78716C] font-light text-xs tracking-[0.25em] uppercase">
            Funeral Floral Collections
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
            <Link href="/products?category=櫈花" className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
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
            <Link href="/products?category=棺面花" className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
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
            <Link href="/products?category=講台花" className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
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
            <Link href="/products?category=台花" className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
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
