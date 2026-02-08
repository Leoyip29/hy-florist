"use client"

import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/layout/Navbar"
import { useState, useEffect, useRef } from "react"
import CartButton from "@/components/cart/CartButton"
import { useRouter, usePathname } from "next/navigation"
import { useTranslations, useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('Navigation')

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
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  const switchLanguage = (newLocale: string) => {
    // Replace the locale in the current pathname
    const currentPath = pathname.replace(`/${locale}`, '')
    const newPath = `/${newLocale}${currentPath}`
    router.push(newPath)
    setLanguageMenuOpen(false)
  }

  const otherLocale = locale === 'zh-HK' ? 'en' : 'zh-HK'
  const otherLocaleName = locale === 'zh-HK' ? 'English' : '繁體中文'

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
        <Link href={`/${locale}`} className="flex items-center">
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
            href={`/${locale}`}
            className={`group relative px-4 py-2 hover:opacity-100 transition-all duration-300 ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}
          >
            {t('home')}
            <span className={`absolute left-4 right-4 bottom-1 h-0.5 w-auto transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
              isScrolled ? "bg-neutral-700" : "bg-white"
            }`} />
          </Link>

          {/* Products Dropdown */}
          <div className="relative group px-4 py-2 z-30">
            <div className={`flex items-center gap-1 cursor-pointer hover:opacity-100 transition-all duration-300 ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}>
              {t('products')}
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
                  { name: t('allProducts'), category: "全部" },
                  { name: t('flowerBasket'), category: "花籃" },
                  { name: t('bouquet'), category: "花束" },
                  { name: t('flowerBoard'), category: "花牌" },
                  { name: t('heartShapedBoard'), category: "心型花牌" },
                  { name: t('roundBoard'), category: "圓形花牌" },
                  { name: t('crossBoard'), category: "十字架花牌" },
                  { name: t('casketDecoration'), category: "棺面花" },
                  { name: t('venueDecoration'), category: "場地裝飾" },
                  { name: t('standFlower'), category: "台花" },
                  { name: t('venueSeries'), category: "場地系列" },
                  { name: t('benchFlower'), category: "櫈花" },
                  { name: t('podiumFlower'), category: "講台花" },
                  { name: t('boardSet'), category: "花牌套餐" },
                  { name: t('bouquetDeal'), category: "花束多買優惠" },

                ].map((item, i) => (
                  <Link
                    key={i}
                    href={`/${locale}/products${item.category !== "全部" ? `?category=${encodeURIComponent(item.category)}` : ""}`}
                    className="block px-4 py-2.5 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-150 text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href={`/${locale}/about`}
            className={`group relative px-4 py-2 hover:opacity-100 transition-all duration-300 ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}
          >
            {t('about')}
            <span className={`absolute left-4 right-4 bottom-1 h-0.5 w-auto transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
              isScrolled ? "bg-neutral-700" : "bg-white"
            }`} />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className={`group relative px-4 py-2 hover:opacity-100 transition-all duration-300 ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}
          >
            {t('contact')}
            <span className={`absolute left-4 right-4 bottom-1 h-0.5 w-auto transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
              isScrolled ? "bg-neutral-700" : "bg-white"
            }`} />
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className={`text-sm hover:opacity-70 transition-opacity flex items-center gap-1 ${
                isScrolled ? "text-neutral-700" : "text-white"
              }`}
            >
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
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {locale === 'zh-HK' ? '繁體中文' : 'English'}
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
                className={`transition-transform duration-300 ${languageMenuOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Language Dropdown */}
            {languageMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLanguageMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[120px] z-50">
                  <button
                    onClick={() => switchLanguage(otherLocale)}
                    className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-150"
                  >
                    {otherLocaleName}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
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
