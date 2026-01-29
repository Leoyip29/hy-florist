"use client"

import Link from "next/link"
import {useState} from "react"
import {Menu, X} from "lucide-react"
import CartButton from "@/components/cart/CartButton"

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-light tracking-wider">
                        HY Florist
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/about"
                            className="text-neutral-700 hover:text-neutral-900 transition-colors"
                        >
                            關於我們
                        </Link>
                        <Link
                            href="/shop"
                            className="text-neutral-700 hover:text-neutral-900 transition-colors"
                        >
                            商城
                        </Link>
                        <Link
                            href="/process"
                            className="text-neutral-700 hover:text-neutral-900 transition-colors"
                        >
                            訂購流程
                        </Link>
                        <Link
                            href="/contact"
                            className="text-neutral-700 hover:text-neutral-900 transition-colors"
                        >
                            聯絡我們
                        </Link>

                        {/* Cart Button */}
                        <CartButton/>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <CartButton/>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6"/>
                            ) : (
                                <Menu className="w-6 h-6"/>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-neutral-200">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/about"
                                className="text-neutral-700 hover:text-neutral-900 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                關於我們
                            </Link>
                            <Link
                                href="/shop"
                                className="text-neutral-700 hover:text-neutral-900 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                商城
                            </Link>
                            <Link
                                href="/process"
                                className="text-neutral-700 hover:text-neutral-900 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                訂購流程
                            </Link>
                            <Link
                                href="/contact"
                                className="text-neutral-700 hover:text-neutral-900 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                聯絡我們
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}