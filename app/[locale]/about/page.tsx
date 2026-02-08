import Image from "next/image"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export default function AboutPage() {
  return (
    <main>

      {/* ===== TOP INTRO ===== */}
    <section
    className="
        relative
        py-32
        bg-[url('/hy_about_04.png')]
        bg-no-repeat
        bg-cover
        bg-[right_center]
    "
    >
    {/* Gradient overlay to soften the background image */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/40 to-transparent" />

    <div className="relative mx-auto max-w-[1140px] px-8">
        <div className="max-w-xl">

        <h1 className={`${playfair.className} text-5xl md:text-6xl font-light mb-8 text-neutral-900 leading-tight`}>關於我們</h1>

        <p className="text-base md:text-lg leading-8 text-neutral-700 font-light">
            我們深信，花藝不僅是一種裝飾，更是一種語言。
            無論是對摯愛的最後致敬，還是表達慰問與關懷，
            我們的團隊都以細膩的心思和專業的設計，
            為您製作最合適的花藝作品。
        </p>

        </div>
    </div>
    </section>

      {/* ===== MAIN ABOUT BLOCK ===== */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-[1140px] px-8 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">

          {/* TEXT */}
          <div>
            <h2 className={`${playfair.className} text-4xl md:text-5xl font-light mb-8 text-neutral-900 leading-tight`}>
              風信子花店<br /><span className="text-3xl md:text-4xl">帛事花牌專門店</span>
            </h2>

            <p className="text-base md:text-lg leading-8 text-neutral-700 font-light mb-6">
              Hyacinth Florist 是一家專業的網上花店，專注於提供帛事花牌、花籃及花束，為每一份心意傳遞最真摯的情感。
            </p>

            <p className="text-base md:text-lg leading-8 text-neutral-700 font-light mb-6">
            我們深信，花藝不僅是一種裝飾，更是一種語言。無論是對摯愛的最後致敬，還是表達慰問與關懷，我們的團隊都以細膩的心思和專業的設計，為您製作最合適的花藝作品。
            </p>

            <p className="text-base md:text-lg leading-8 text-neutral-700 font-light mb-6">
            我們的服務涵蓋全港送遞，確保花品準時送達，讓您的祝福與思念無間斷地傳遞。我們堅持選用最新鮮的花材，配合精湛的花藝設計，務求讓每一件作品都體現您的心意。
            </p>

            <p className="text-base md:text-lg leading-8 text-neutral-700 font-light">
              無論您需要莊重典雅的帛事花牌，傳遞慰問的花籃，或是簡約優雅的花束，我們都能為您提供最貼心的選擇。
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative w-full h-[420px]">
            <Image
              src="/hy_01.webp"
              alt="Hyacinth Florist at work"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* ===== SERVICES BAND ===== */}
        <section className="py-24 bg-[#bfcbb0]">
        <div className="mx-auto max-w-[1140px] px-8 text-center">

            <h2 className={`${playfair.className} text-4xl md:text-5xl font-light mb-16 text-neutral-900 leading-tight`}>
            我們的服務
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {[
                {
                title: "喪禮場地佈置",
                desc: "以莊重而溫柔的花藝設計，陪伴摯愛走過最後一程。",
                image: "/hy_about_01-scaled.webp",
                },
                {
                title: "帛事花牌",
                desc: "為表達敬意與思念，設計合適而有心意的花牌。",
                image: "/hy_about_02-scaled.webp",
                },
                {
                title: "帛事花束",
                desc: "以簡約而真摯的花藝，傳遞深切的關懷。",
                image: "/hy_about_03-scaled.webp",
                },
            ].map((item, i) => (
            <div
            key={i}
            className="
                relative
                h-[260px]
                bg-cover
                bg-center
                rounded-sm
                overflow-hidden
                flex
                items-center
                justify-center
            "
            style={{ backgroundImage: `url(${item.image})` }}
            >
            {/* overlay */}
                <div className="absolute inset-0 bg-white/75" />

                {/* content */}
                <div className="relative max-w-[220px] text-center px-4">
                    <h3 className={`${playfair.className} text-2xl md:text-3xl font-light text-[#556b3d] mb-4 leading-tight`}>
                    {item.title}
                    </h3>
                    <p className="text-base leading-7 text-neutral-700 font-light">
                    {item.desc}
                    </p>
                </div>
            </div>
            ))}

            </div>
        </div>
        </section>


    </main>
  )
}
