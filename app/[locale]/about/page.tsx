import type { Metadata } from "next"
import Image from "next/image"
import { Playfair_Display } from "next/font/google"
import { getTranslations } from "next-intl/server"

export const revalidate = 86400

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === "en"
  return {
    title: isEn ? "About Us" : "關於我們",
    description: isEn
      ? "Learn about Hyacinth Florist – Hong Kong's trusted sympathy flower specialist. We craft premium wreaths, bouquets, and floral arrangements for funerals, memorial services, and religious venues."
      : "了解風信子花店——香港專業帛事花店。我們為殯儀館、教堂及祭祀場合提供優質花圈、花束及花藝佈置。",
    alternates: {
      canonical: `https://hy-florist.hk/${locale}/about`,
      languages: {
        "en": "https://hy-florist.hk/en/about",
        "zh-HK": "https://hy-florist.hk/zh-HK/about",
      },
    },
    openGraph: {
      title: isEn ? "About Us | Hyacinth Florist" : "關於我們 | Hyacinth Florist 風信子花店",
      description: isEn
        ? "Hong Kong's trusted sympathy flower specialist for funerals and memorial services."
        : "香港專業帛事花店，為殯儀及祭祀場合提供優質花藝。",
      images: [{ url: "https://hy-florist.hk/hy_about_04.png" }],
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params
  const t = await getTranslations("About")

  return (
    <main>

      {/* ===== TOP INTRO ===== */}
      <section
        className="
        relative
        h-[600px]
        flex items-center
        bg-[url('/hy_about_04.png')]
        bg-no-repeat
        bg-cover
        bg-[right_center]
    "
      >
        {/* Gradient overlay to soften the background image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/40 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1140px] px-8">
          <div className="max-w-xl">

            <h1 className={`${playfair.className} text-5xl md:text-6xl font-light mb-8 text-white leading-tight`}>
              {t("title")}
            </h1>

            <p className="text-base md:text-lg leading-8 text-white/80 font-light">
              {t("hero.paragraph1")}
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
              {t("mainTitle")}
              <br />
              <span className="text-3xl md:text-4xl">{t("subtitle")}</span>
            </h2>

            <p className="text-base md:text-lg leading-8 text-neutral-700 font-light mb-6">
              {t("main.paragraph1")}
            </p>

            <p className="text-base md:text-lg leading-8 text-neutral-700 font-light mb-6">
              {t("main.paragraph2")}
            </p>

            <p className="text-base md:text-lg leading-8 text-neutral-700 font-light mb-6">
              {t("main.paragraph3")}
            </p>

            <p className="text-base md:text-lg leading-8 text-neutral-700 font-light">
              {t("main.paragraph4")}
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
            {t("services.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {[
              {
                title: t("services.items.0.title"),
                desc: t("services.items.0.description"),
                image: "/hy_about_01-scaled.webp",
              },
              {
                title: t("services.items.1.title"),
                desc: t("services.items.1.description"),
                image: "/hy_about_02-scaled.webp",
              },
              {
                title: t("services.items.2.title"),
                desc: t("services.items.2.description"),
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
