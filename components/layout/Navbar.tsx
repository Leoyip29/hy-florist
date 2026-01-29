"use client"

import { useState } from "react"
import Link from "next/link"

export default function Navbar({ isScrolled }: { isScrolled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)

  const productCategories = [
    { name: "所有商品", href: "/products" },
    { name: "花籃", href: "/products?category=花籃" },
    { name: "花束", href: "/products?category=花束" },
    { name: "花牌", href: "/products?category=花牌" },
    { name: "心型花牌", href: "/products?category=心型花牌" },
    { name: "圓型花牌", href: "/products?category=圓形花牌" },
    { name: "十字架花牌", href: "/products?category=十字架花牌" },
    { name: "棺面花", href: "/products?category=棺面花" },
    { name: "場地裝飾", href: "/products?category=場地裝飾" },
    { name: "台花", href: "/products?category=台花" },
    { name: "場地系列", href: "/products?category=場地系列" },
    { name: "櫈花", href: "/products?category=櫈花" },
    { name: "講台花", href: "/products?category=講台花" },
    { name: "花牌套餐", href: "/products?category=花牌套餐" },
    { name: "花束多買優惠", href: "/products?category=花束多買優惠" },
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
                所有商品
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
              href="/about"
              onClick={() => setOpen(false)}
              className="block w-full text-center px-4 py-3.5 text-neutral-700 hover:bg-neutral-100 border-b border-neutral-100 transition-colors"
            >
              關於我們
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block w-full text-center px-4 py-3.5 text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              聯絡我們
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
