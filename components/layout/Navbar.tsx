"use client"

import { useState } from "react"
import Link from "next/link"

export default function Navbar({ isScrolled }: { isScrolled?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="text-2xl text-gray-800"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute left-0 top-full w-full bg-white border-t md:hidden shadow-lg">
          <nav className="flex flex-col items-center gap-6 py-6 text-lg">
            <Link href="/" onClick={() => setOpen(false)}>首頁</Link>
            <Link href="/products" onClick={() => setOpen(false)}>所有商品</Link>
            <Link href="/products" onClick={() => setOpen(false)}>永恆告別</Link>
            <Link href="/products" onClick={() => setOpen(false)}>典雅追思</Link>
            <Link href="/products" onClick={() => setOpen(false)}>場地裝飾</Link>
            <Link href="/about" onClick={() => setOpen(false)}>關於我們</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>聯絡我們</Link>
          </nav>
        </div>
      )}
    </>
  )
}
