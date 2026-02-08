"use client"

import { Playfair_Display } from "next/font/google"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/40 to-transparent" />

        <div className="relative mx-auto max-w-[1140px] px-8">
          <div className="max-w-xl">
            <h1 className={`${playfair.className} text-5xl md:text-6xl font-light mb-8 text-white leading-tight`}>
              聯絡我們
            </h1>
            <p className="text-base md:text-lg leading-8 text-white/80 font-light">
              如有任何查詢或需要協助，歡迎與我們聯絡。我們的團隊將竭誠為您服務。
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
                電話
              </h3>
              <p className="text-neutral-600">
                <a href="tel:+85212345678" className="hover:text-neutral-900 transition-colors">
                  (852) 1234 5678
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
                電郵
              </h3>
              <p className="text-neutral-600">
                <a href="mailto:info@hyflorist.com" className="hover:text-neutral-900 transition-colors">
                  info@hyflorist.com
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
                地址
              </h3>
              <p className="text-neutral-600">
                香港九龍荔枝角<br />
                長義街9號<br />
                永遠大廈地下
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
                營業時間
              </h3>
              <div className="text-neutral-600 space-y-1">
                <p>星期一至五: 9:00 - 18:00</p>
                <p>星期六: 10:00 - 16:00</p>
                <p>星期日及公眾假期: 休息</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-neutral-50">
        <div className="mx-auto max-w-[1140px] px-8">
          <h2 className={`${playfair.className} text-3xl md:text-4xl font-light mb-8 text-neutral-900 text-center`}>
            我們的位置
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-[400px] bg-neutral-200 flex items-center justify-center">
              <p className="text-neutral-500">地圖載入中...</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
