"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const cartCount = 0
const hoverLink =
  "no-underline inline-block transition-transform duration-200 ease-out hover:-rotate-6"
  
export default function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const [open, setOpen] = useState(false)

  // Text color changes based on scroll position
  const linkColor = isScrolled ? "text-gray-800" : "text-white"

  return (
    <>
      {/* DESKTOP */}
      <nav className="hidden md:flex items-center gap-8 text-lg">
        <Link href="/" className={`${hoverLink} ${linkColor}`}>首頁</Link>
        <Link href="/about" className={`${hoverLink} ${linkColor}`}>關於我們</Link>
        <Link href="/process" className={`${hoverLink} ${linkColor}`}>訂購流程</Link>
        <Link href="/contact" className={`${hoverLink} ${linkColor}`}>聯絡我們</Link>

        <Link
          href="/cart"
          className="relative inline-flex h-[30px] w-[30px] items-center justify-center"
        >
          {/* Cart Icon */}
          <Image
            src="/cart1.png"
            alt="Cart"
            width={25}
            height={25}
            className={`relative z-10 cursor-pointer ${isScrolled ? "" : "brightness-0 invert"}`}
          />

          {/* Badge */}
          <span
            className="
            absolute
            -top-2 -right-2
            z-20
            flex h-5 w-5 items-center justify-center
            rounded-full bg-orange-500
            text-xs font-semibold text-white
            leading-none
            pointer-events-none
            "
          >
            {cartCount}
          </span>
        </Link>
      </nav>

        {/* MOBILE ACTIONS */}
        <div className="md:hidden flex items-center gap-4">

        {/* CART */}
        <Link
            href="/cart"
            className="relative inline-flex h-[30px] w-[30px] items-center justify-center"
        >
            <Image
            src="/cart1.png"
            alt="Cart"
            width={25}
            height={25}
            className={`relative z-10 ${isScrolled ? "" : "brightness-0 invert"}`}
            />
            <span
            className="
                absolute -top-2 -right-2 z-20
                flex h-5 w-5 items-center justify-center
                rounded-full bg-orange-500
                text-xs font-semibold text-white
                pointer-events-none
            "
            >
            {cartCount}
            </span>
        </Link>

        {/* HAMBURGER */}
        <button
            className={`text-2xl ${isScrolled ? "text-gray-800" : "text-white"}`}
            onClick={() => setOpen(!open)}
        >
            ☰
        </button>
        </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute left-0 top-full w-full bg-white border-t md:hidden">
          <nav className="flex flex-col items-center gap-6 py-6 text-lg">
            <Link href="/" onClick={() => setOpen(false)}>首頁</Link>
            <Link href="/about" onClick={() => setOpen(false)}>關於我們</Link>
            <Link href="/products" onClick={() => setOpen(false)}>訂購流程</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>聯絡我們</Link>
          </nav>
        </div>
      )}
    </>
  )
}
