"use client"

import NotificationBanner from "./NotificationBanner"
import Header from "./Header"

export default function SiteHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <NotificationBanner />
      <Header />
    </div>
  )
}
