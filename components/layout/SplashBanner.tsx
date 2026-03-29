"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import Image from "next/image"

export default function SplashBanner() {
  const t = useTranslations("SplashBanner")
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem("splashDismissed")
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setIsAnimating(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
      sessionStorage.setItem("splashDismissed", "true")
    }, 400)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${
        isAnimating ? "bg-black/40 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
      } ${isClosing ? "pointer-events-none" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white border border-neutral-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-500 ${
          isAnimating ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        } ${isClosing ? "scale-95 opacity-0 translate-y-4" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-all duration-200 active:scale-95"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* Image Container */}
        <div className="relative mx-8 mt-8">
          <div className="relative aspect-[4/3]">
            <Image
              src="/logo.svg"
              alt="Hyacinth Florist"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-6 pb-8 text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2 tracking-tight">
            {t("title")}
          </h2>

          <p className="text-neutral-500 text-sm mb-4">
            {t("subtitle")}
          </p>

          {/* Divider */}
          <div className="w-12 h-px bg-neutral-300 mx-auto mb-4" />

          <p className="text-neutral-800 font-medium text-sm mb-6 leading-relaxed">
            {t("highlight")}
          </p>

          {/* CTA Button */}
          <Link
            href={t("ctaLink")}
            onClick={handleClose}
            className="group inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg active:scale-100"
          >
            <span>{t("cta")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>

          {/* Discount note */}
          <div className="mt-4">
            <span className="text-xs text-neutral-400">{t("noWorry")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
