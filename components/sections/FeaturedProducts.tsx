"use client"

import Image from "next/image"
import Link from "next/link"

interface Product {
  name: string
  price: string
  image: string
}

const featuredProducts: Product[] = [
  {
    name: "花束BB12 多買優惠組合",
    price: "$1,560.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-12-scaled.jpg",
  },
  {
    name: "花束BB11 多買優惠組合",
    price: "$1,030.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-11-scaled.jpg",
  },
  {
    name: "花束BB10 多買優惠組合",
    price: "$1,030.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-10-scaled.jpg",
  },
  {
    name: "花束BB09 多買優惠組合",
    price: "$1,030.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-09-scaled.jpg",
  },
  {
    name: "花束BB08 多買優惠組合",
    price: "$1,030.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-09-scaled.jpg",
  },
  {
    name: "花束BB07 多買優惠組合",
    price: "$1,030.00",
    image: "https://hy-florist.hk/wp-content/uploads/2025/09/BB-09-scaled.jpg",
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Section Title - Left */}
          <div className="lg:col-span-1">
            <h2 className="text-5xl md:text-6xl font-light tracking-wide text-neutral-900 font-serif">
              熱賣花藝
            </h2>
            <p className="mt-4 text-neutral-500 font-light text-sm tracking-widest">
              SEASON&apos;S BESTSELLERS
            </p>
          </div>

          {/* Product Grid - Right */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProducts.map((product, index) => (
                <Link href="/products" key={index}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[2/3] overflow-hidden bg-neutral-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="mt-6 text-center">
                      <h3 className="text-lg font-light text-neutral-900 tracking-wide group-hover:text-neutral-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-neutral-500 font-light text-lg">
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
                className="inline-block text-lg tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 hover:border-neutral-900 hover:text-neutral-600 transition-all duration-300"
              >
                查看全部
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
