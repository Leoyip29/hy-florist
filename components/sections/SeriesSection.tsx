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
    <section className="py-20 md:py-28">
      <div className="mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-neutral-900 font-serif">
            系列花藝
          </h2>
          <p className="mt-4 text-neutral-500 font-light text-sm tracking-wide">
            FLORAL COLLECTIONS
          </p>
        </div>

        {/* Series Items */}
        <div className="space-y-24 md:space-y-32">
          {series.map((item, i) => {
            const isReversed = i % 2 === 1

            return (
              <div
                key={i}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  isReversed ? "md:grid-flow-dense" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`relative aspect-[4/3] overflow-hidden bg-neutral-100 ${
                    isReversed ? "md:col-start-2" : ""
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Text */}
                <div className={`${isReversed ? "md:col-start-1" : ""}`}>
                  <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase mb-4">
                    {item.tag}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light text-neutral-900 mb-6">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 font-light leading-relaxed mb-8 max-w-md">
                    {item.desc}
                  </p>
                  <Link
                    href="#"
                    className="inline-block text-sm tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 hover:border-neutral-900 hover:text-neutral-600 transition-all duration-300"
                  >
                    {item.cta}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
