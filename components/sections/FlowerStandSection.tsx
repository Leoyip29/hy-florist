"use client"

import Image from "next/image"
import Link from "next/link"

interface FlowerStandProduct {
  name: string
  price: string
  image: string
}

const flowerStandProducts: FlowerStandProduct[] = [
  {
    name: "永恆告別花牌",
    price: "HK$2,800",
    image: "/6500-V12.jpg",
  },
  {
    name: "典雅追思花牌",
    price: "HK$3,200",
    image: "/6500-V12.jpg",
  },
  {
    name: "莊重慰問花牌",
    price: "HK$2,500",
    image: "/6500-V12.jpg",
  },
  {
    name: "純潔祝福花牌",
    price: "HK$2,800",
    image: "/6500-V12.jpg",
  },
]

export default function FlowerStandSection() {
  return (
    <section className="py-24 md:py-32 bg-[#5c4d3c]">
      <div className="mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Header - Elegant & Minimal */}
        <div className="text-center mb-16">
          <p className="text-xs md:text-sm tracking-[0.25em] text-stone-300 uppercase mb-4">
            SYMPATHY & TRIBUTE
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-stone-100 font-serif">
            永恆告別花牌
          </h2>
          <p className="mt-4 text-stone-400 font-light text-sm tracking-wide max-w-lg mx-auto leading-relaxed">
            以優雅花藝傳遞最深切的慰問與敬意，為每一段珍貴的記憶送上永恆的祝福。
          </p>
        </div>

        {/* Product Grid - Clean & Spacious */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {flowerStandProducts.map((product, index) => (
            <Link href="/products" key={index}>
              <div className="group cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#4a3f32]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
                </div>

                {/* Info */}
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-light text-stone-200 tracking-wide group-hover:text-white transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-stone-400 font-light text-base">
                    {product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-block text-sm tracking-widest text-stone-300 border border-stone-500 px-8 py-3 hover:bg-white hover:text-[#5c4d3c] hover:border-white transition-all duration-300"
          >
            探索更多花牌
          </Link>
        </div>
      </div>
    </section>
  )
}
