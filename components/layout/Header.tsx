"use client"

import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/layout/Navbar"
import { useState, useEffect, useRef } from "react"
import CartButton from "@/components/cart/CartButton"
import { useRouter } from "next/navigation"
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 transition-all duration-300 ${
        isScrolled ? "py-4" : "py-6"
      }`}>
        {/* Logo */}
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

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <Link
            href="/"
            className={`group relative px-4 py-2 hover:opacity-100 transition-all duration-300 ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}
          >
            首頁
            <span className={`absolute left-4 right-4 bottom-1 h-0.5 w-auto transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
              isScrolled ? "bg-neutral-700" : "bg-white"
            }`} />
          </Link>

          {/* Products Dropdown */}
          <div className="relative group px-4 py-2 z-30">
            <div className={`flex items-center gap-1 cursor-pointer hover:opacity-100 transition-all duration-300 ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}>
              所有商品
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 group-hover:rotate-180 ${
                  isScrolled ? "text-neutral-700" : "text-white"
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
              <div className="bg-white rounded-lg shadow-xl py-2 min-w-[180px]">
                {[
                  { name: "所有商品", category: "全部" },
                  { name: "花籃", category: "花籃" },
                  { name: "花束", category: "花束" },
                  { name: "花牌", category: "花牌" },
                  { name: "心型花牌", category: "心型花牌" },
                  { name: "圓型花牌", category: "圓形花牌" },
                  { name: "十字架花牌", category: "十字架花牌" },
                  { name: "棺面花", category: "棺面花" },
                  { name: "場地裝飾", category: "場地裝飾" },
                  { name: "台花", category: "台花" },
                  { name: "場地系列", category: "場地系列" },
                  { name: "櫈花", category: "櫈花" },
                  { name: "講台花", category: "講台花" },
                  { name: "花牌套餐", category: "花牌套餐" },
                  { name: "花束多買優惠", category: "花束多買優惠" },

                ].map((item, i) => (
                  <Link
                    key={i}
                    href={`/products${item.category !== "全部" ? `?category=${encodeURIComponent(item.category)}` : ""}`}
                    className="block px-4 py-2.5 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-150 text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/about"
            className={`group relative px-4 py-2 hover:opacity-100 transition-all duration-300 ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}
          >
            關於我們
            <span className={`absolute left-4 right-4 bottom-1 h-0.5 w-auto transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
              isScrolled ? "bg-neutral-700" : "bg-white"
            }`} />
          </Link>
          <Link
            href="/contact"
            className={`group relative px-4 py-2 hover:opacity-100 transition-all duration-300 ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}
          >
            聯絡我們
            <span className={`absolute left-4 right-4 bottom-1 h-0.5 w-auto transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
              isScrolled ? "bg-neutral-700" : "bg-white"
            }`} />
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button
            className={`text-sm hover:opacity-70 transition-opacity ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}
          >
            繁體中文
          </button>
          {/* <Link
            href="/account"
            className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
              isScrolled ? "" : "hover:bg-black/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isScrolled ? "text-neutral-700" : "text-white"}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link> */}
          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋商品..."
                  className="w-40 sm:w-60 px-3 py-1.5 text-sm bg-white/90 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  onBlur={(e) => {
                    // Delay closing to allow form submission
                    if (!e.currentTarget.contains(document.activeElement)) {
                      setSearchOpen(false)
                    }
                  }}
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
                  isScrolled ? "" : "hover:bg-black/10"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isScrolled ? "text-neutral-700" : "text-white"}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            )}
          </div>
          <CartButton isScrolled={isScrolled}/>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Navbar isScrolled={isScrolled} />
          </div>
        </div>
      </div>
    </header>
  )
}
