"use client"

import { useTranslations, useLocale } from "next-intl"
import { useState, useEffect } from "react"

export default function NotificationBanner({ onDismiss }: { onDismiss?: () => void }) {
  const t = useTranslations("NotificationBanner")
  const locale = useLocale()
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if previously dismissed
    const dismissed = sessionStorage.getItem("notificationDismissed")
    if (dismissed) {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem("notificationDismissed", "true")
    if (onDismiss) {
      onDismiss()
    }
  }

  if (isDismissed) return null

  return (
    <div className="bg-neutral-900 text-white text-center py-2.5 px-4 relative">
      <p className="text-sm">
        {t("message1")} <span className="font-semibold">{t("highlight1")}</span> | {t("message2")} <span className="font-semibold">{t("highlight2")}</span>
      </p>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
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
    </div>
  )
}
