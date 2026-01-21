"use client"

import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/layout/Navbar"
import { useState, useEffect } from "react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-[1140px] items-center justify-between px-6 py-4 transition-all duration-300 ${
        isScrolled ? "py-4" : "py-6"
      }`}>
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Company Logo"
            width={120}
            height={120}
            priority
            className={isScrolled ? "" : "brightness-0 invert"}
          />
        </Link>

        <Navbar isScrolled={isScrolled} />
      </div>
    </header>
  )
}

