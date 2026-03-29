"use client"

import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/layout/Navbar"
import { useState, useEffect, useRef } from "react"
import CartButton from "@/components/cart/CartButton"
import { useRouter, usePathname } from "next/navigation"
import { useTranslations, useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { CATEGORY_MAP } from "@/lib/categories"

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

  // Get the API category (always use name_en for filtering)
  const getCategoryForApi = (cat: string) => {
    return CATEGORY_MAP[cat] || cat
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check if current page is homepage
  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`

  // Determine if header should have transparent background (only on homepage when not scrolled)
  const isTransparent = isHomepage && !isScrolled

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
        isTransparent
          ? "bg-transparent"
          : "bg-white shadow-md"
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
            className={isTransparent ? "brightness-0 invert" : ""}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link
            href={`/${locale}`}
            className={`group relative px-4 py-2 hover:opacity-100 transition-all duration-300 ${
              isTransparent ? "text-white" : "text-neutral-700"
            }`}
          >
            {t('home')}
            <span className={`absolute left-4 right-4 bottom-1 h-0.5 w-auto transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
              isTransparent ? "bg-white" : "bg-neutral-700"
            }`} />
          </Link>

          {/* Products Dropdown */}
          <div className="relative group px-4 py-2 z-30">
            <div className={`flex items-center gap-1 cursor-pointer hover:opacity-100 transition-all duration-300 ${
              isTransparent ? "text-white" : "text-neutral-700"
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
                  isTransparent ? "text-white" : "text-neutral-700"
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
              <div className="bg-white rounded-lg shadow-xl py-2 min-w-[180px]">
                {[
                  { name: t('allProducts'), category: "all" },
                  { name: t('flowerBasket'), category: "flower-basket" },
                  { name: t('bouquet'), category: "bouquet" },
                  // { name: t('flowerBoard'), category: "flower-board" },
                  { name: t('heartShapedBoard'), category: "heart-shaped-board" },
                  { name: t('roundBoard'), category: "round-board" },
                  { name: t('crossBoard'), category: "cross-board" },
                  { name: t('casketDecoration'), category: "casket-decoration" },
                  { name: t('venueDecoration'), category: "venue-decoration" },
                  { name: t('standFlower'), category: "stand-flower" },
                  { name: t('venueSeries'), category: "venue-series" },
                  { name: t('benchFlower'), category: "bench-flower" },
                  { name: t('podiumFlower'), category: "podium-flower" },
                  { name: t('boardSet'), category: "board-set" },
                  { name: t('bouquetDeal'), category: "bouquet-bundle" },

                ].map((item, i) => (
                  <Link
                    key={i}
                    href={`/${locale}/products${item.category !== "all" ? `?category=${encodeURIComponent(getCategoryForApi(item.category))}` : ""}`}
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
              isTransparent ? "text-white" : "text-neutral-700"
            }`}
          >
            {t('about')}
            <span className={`absolute left-4 right-4 bottom-1 h-0.5 w-auto transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
              isTransparent ? "bg-white" : "bg-neutral-700"
            }`} />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className={`group relative px-4 py-2 hover:opacity-100 transition-all duration-300 ${
              isTransparent ? "text-white" : "text-neutral-700"
            }`}
          >
            {t('contact')}
            <span className={`absolute left-4 right-4 bottom-1 h-0.5 w-auto transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
              isTransparent ? "bg-white" : "bg-neutral-700"
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
                isTransparent ? "text-white" : "text-neutral-700"
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
                className={`p-2 rounded-full transition-colors ${
                  isTransparent ? "hover:bg-white/20" : "hover:bg-black/10"
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
                  className={isTransparent ? "text-white" : "text-neutral-700"}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            )}
          </div>
          <CartButton isScrolled={!isTransparent}/>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Navbar isScrolled={!isTransparent} />
          </div>
        </div>
      </div>
    </header>
  )
}