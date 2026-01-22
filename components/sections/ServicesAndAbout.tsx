"use client"

import Image from "next/image"
import Link from "next/link"

export default function ServicesAndAbout() {
  return (
    <section className="pb-20 md:pb-28">
      {/* About Section */}
      <div className="mx-auto px-4 md:px-8 max-w-7xl mb-24 md:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
            <Image
              src="/hy_home_05.jpg"
              alt="Hyacinth Florist"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase mb-4">
              ABOUT US
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mb-6 font-serif">
              風信子花店
            </h2>
            <p className="text-neutral-600 font-light leading-relaxed mb-6">
              風信子花店以向客人提供優質的花藝服務為使命。我們的花藝師認真對待每一朵花材，細緻地製作每一件作品，珍惜每一次花藝創作的機會。
            </p>
            <p className="text-neutral-600 font-light leading-relaxed mb-8">
              花藝不僅是裝飾，更是傳遞心意的橋樑。我們用花的姿態，為您留下最後的告白，為摯愛送行。風信子傳遞的不只是哀悼，更是愛的延續，讓思念在時間中，也能被溫柔地接住。
            </p>
            <Link
              href="/about"
              className="inline-block text-sm tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 hover:border-neutral-900 hover:text-neutral-600 transition-all duration-300"
            >
              關於我們
            </Link>
          </div>
        </div>
      </div>


    </section>
  )
}
