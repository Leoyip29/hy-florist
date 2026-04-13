import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
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
    title: isEn ? "Contact Us" : "聯絡我們",
    description: isEn
      ? "Contact Hyacinth Florist in Hong Kong. Call or email for enquiries and orders."
      : "聯絡風信子花店。歡迎蒞臨門市，或致電及電郵查詢及落單。",
    alternates: {
      canonical: `https://hy-florist.hk/${locale}/contact`,
      languages: {
        "en": "https://hy-florist.hk/en/contact",
        "zh-HK": "https://hy-florist.hk/zh-HK/contact",
      },
    },
    openGraph: {
      title: isEn ? "Contact Us | Hyacinth Florist" : "聯絡我們 | Hyacinth Florist",
      description: isEn
        ? "Get in touch with Hyacinth Florist Hong Kong."
        : "聯絡風信子花店香港。",
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params
  const t = await getTranslations("Contact")
  const tFooter = await getTranslations("Footer")

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/40 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1140px] px-8">
          <div className="max-w-xl">
            <h1 className={`${playfair.className} text-5xl md:text-6xl font-light mb-8 text-white leading-tight`}>
              {t("title")}
            </h1>
            <p className="text-base md:text-lg leading-8 text-white/80 font-light">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-[1140px] px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Phone */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#bfcbb0] rounded-full flex items-center justify-center">
                  <Phone className="w-8 h-8 text-[#556b3d]" />
                </div>
              </div>
              <h3 className={`${playfair.className} text-xl font-semibold mb-2 text-neutral-900`}>
                {t("phone")}
              </h3>
              <p className="text-neutral-600">
                <a href="tel:+85294568292" className="hover:text-neutral-900 transition-colors">
                  +852 9456 8292
                </a>
              </p>
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#bfcbb0] rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-[#556b3d]" />
                </div>
              </div>
              <h3 className={`${playfair.className} text-xl font-semibold mb-2 text-neutral-900`}>
                {t("email")}
              </h3>
              <p className="text-neutral-600">
                <a href="mailto:info@hy-florist.hk" className="hover:text-neutral-900 transition-colors">
                  info@hy-florist.hk
                </a>
              </p>
            </div>

            {/* Address */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#bfcbb0] rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-[#556b3d]" />
                </div>
              </div>
              <h3 className={`${playfair.className} text-xl font-semibold mb-2 text-neutral-900`}>
                {t("address")}
              </h3>
              <p className="text-neutral-600">
                {tFooter("addressLine1")}<br />
                {tFooter("addressLine2")}
              </p>
            </div>

            {/* Opening Hours */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#bfcbb0] rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-[#556b3d]" />
                </div>
              </div>
              <h3 className={`${playfair.className} text-xl font-semibold mb-2 text-neutral-900`}>
                {t("openingHours")}
              </h3>
              <div className="text-neutral-600 space-y-1">
                <p>{t("weekdays")}: 10:00 - 19:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-neutral-50">
        <div className="mx-auto max-w-[1140px] px-8">
          <h2 className={`${playfair.className} text-3xl md:text-4xl font-light mb-8 text-neutral-900 text-center`}>
            {t("ourLocation")}
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-[400px] w-full">
              <iframe
                title="恩福殯儀 PARADISE SE"
                src="https://www.google.com/maps?q=PARADISE+SE+%E6%81%A9%E7%A6%8F%E6%AE%AF%E5%84%80,+%E7%B4%97%E7%A3%A1%E5%BF%85%E5%98%89%E8%A1%9718%E8%99%9F%E5%98%89%E9%BA%97%E9%96%A3&z=17&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}