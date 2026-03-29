"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations, useLocale } from 'next-intl'
import { CATEGORY_MAP } from "@/lib/categories"

export default function Navbar({ isScrolled }: { isScrolled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'zh-HK'
  const t = useTranslations('Navigation')

  // Get the API category based on locale
  const getCategoryForApi = (cat: string) => {
    if (locale === "zh-HK" || locale === "zh") {
      return CATEGORY_MAP[cat] || cat
    }
    return cat
  }

  const productCategories = [
    { name: t('allProducts'), href: `/${locale}/products` },
    { name: t('flowerBasket'), href: `/${locale}/products?category=${getCategoryForApi("flower-basket")}` },
    { name: t('bouquet'), href: `/${locale}/products?category=${getCategoryForApi("bouquet")}` },
    // { name: t('flowerBoard'), href: `/${locale}/products?category=${getCategoryForApi("flower-board")}` },
    { name: t('heartShapedBoard'), href: `/${locale}/products?category=${getCategoryForApi("heart-shaped-board")}` },
    { name: t('roundBoard'), href: `/${locale}/products?category=${getCategoryForApi("round-board")}` },
    { name: t('crossBoard'), href: `/${locale}/products?category=${getCategoryForApi("cross-board")}` },
    { name: t('casketDecoration'), href: `/${locale}/products?category=${getCategoryForApi("casket-decoration")}` },
    { name: t('venueDecoration'), href: `/${locale}/products?category=${getCategoryForApi("venue-decoration")}` },
    { name: t('standFlower'), href: `/${locale}/products?category=${getCategoryForApi("stand-flower")}` },
    { name: t('venueSeries'), href: `/${locale}/products?category=${getCategoryForApi("venue-series")}` },
    { name: t('benchFlower'), href: `/${locale}/products?category=${getCategoryForApi("bench-flower")}` },
    { name: t('podiumFlower'), href: `/${locale}/products?category=${getCategoryForApi("podium-flower")}` },
    { name: t('boardSet'), href: `/${locale}/products?category=${getCategoryForApi("board-set")}` },
    { name: t('bouquetDeal'), href: `/${locale}/products?category=${getCategoryForApi("bouquet-bundle")}` },
  ]

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className={`text-2xl p-2 hover:bg-white/10 rounded-full transition-colors ${
          isScrolled ? "" : "hover:bg-black/10"
        } ${isScrolled ? "text-neutral-700" : "text-white"}`}
        onClick={() => setOpen(!open)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {open ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <>
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute left-0 top-full w-full bg-white border-t md:hidden shadow-lg z-40">
          <nav className="flex flex-col items-center gap-0 py-2">
            {/* 所有商品 - expandable */}
            <div className="w-full flex flex-col">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className="w-full text-center px-4 py-3.5 text-neutral-700 hover:bg-neutral-100 border-b border-neutral-100 transition-colors flex items-center justify-center gap-2"
              >
                {t('products')}
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
                  className={`transition-transform duration-200 ${
                    productsOpen ? "rotate-180" : ""
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {/* Submenu */}
              {productsOpen && (
                <div className="bg-neutral-50">
                  {productCategories.slice(1).map((cat, j) => (
                    <Link
                      key={j}
                      href={cat.href}
                      onClick={() => {
                        setProductsOpen(false)
                        setOpen(false)
                      }}
                      className="block text-center px-4 py-3 text-neutral-600 hover:bg-neutral-100 text-sm transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 其他頁面連結 */}
            <Link
              href={`/${locale}/about`}
              onClick={() => setOpen(false)}
              className="block w-full text-center px-4 py-3.5 text-neutral-700 hover:bg-neutral-100 border-b border-neutral-100 transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              onClick={() => setOpen(false)}
              className="block w-full text-center px-4 py-3.5 text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              {t('contact')}
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}