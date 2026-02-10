"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function SeriesSection() {
  const t = useTranslations("SeriesSection")
  const locale = useLocale()

  const series = [
    {
      tag: "BENCH FLOWERS",
      title: t("items.bench.title"),
      desc: t("items.bench.desc"),
      image: "/series-chair.jpg",
      cta: t("items.bench.cta"),
    },
    {
      tag: "CASKET FLOWERS",
      title: t("items.casket.title"),
      desc: t("items.casket.desc"),
      image: "/series-casket1.jpg",
      cta: t("items.casket.cta"),
    },
    {
      tag: "PULPIT FLOWERS",
      title: t("items.pulpit.title"),
      desc: t("items.pulpit.desc"),
      image: "/pulpit_flower.jpg",
      cta: t("items.pulpit.cta"),
    },
    {
      tag: "STAND FLOWERS",
      title: t("items.stand.title"),
      desc: t("items.stand.desc"),
      image: "/series_stand.jpg",
      cta: t("items.stand.cta"),
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20 relative z-10">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#292524] font-serif">
            {t("title")}
          </h2>
          <p className="mt-4 text-[#78716C] font-light text-xs tracking-[0.25em] uppercase">
            {t("subtitle")}
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
            <Link href={`/${locale}/products?category=櫈花`} className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
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
            <Link href={`/${locale}/products?category=棺面花`} className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
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
            <Link href={`/${locale}/products?category=講台花`} className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
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
            <Link href={`/${locale}/products?category=台花`} className="text-xs tracking-widest text-[#57534E] hover:text-[#9CAFA3] transition-colors duration-300">
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
