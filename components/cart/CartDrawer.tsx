"use client"

import {useCart} from "@/contexts/CartContext"
import {X, ShoppingBag} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {Playfair_Display} from "next/font/google"

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
})

export default function CartDrawer() {
    const {items, removeItem, updateQuantity, totalPrice, isOpen, closeCart} =
        useCart()

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className={`${playfair.className} text-2xl font-semibold`}>
                        購物車
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                        aria-label="關閉購物車"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="w-16 h-16 text-neutral-300 mb-4"/>
                            <p className="text-neutral-500 mb-2">購物車是空的</p>
                            <button
                                onClick={closeCart}
                                className="text-sm text-neutral-900 underline hover:no-underline"
                            >
                                繼續購物
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-4 border border-neutral-200 rounded-lg"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm mb-1 truncate">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-neutral-600 mb-2">
                                            HK${item.price.toFixed(2)}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity - 1)
                                                }
                                                className="w-7 h-7 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100 transition-colors"
                                                aria-label="減少數量"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-medium w-8 text-center">
        {item.quantity}
        </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                                className="w-7 h-7 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100 transition-colors"
                                                aria-label="增加數量"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="self-start p-1 hover:bg-neutral-100 rounded transition-colors"
                                        aria-label="移除商品"
                                    >
                                        <X className="w-4 h-4 text-neutral-500"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-6 space-y-4">
                        {/* Total */}
                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span>總計</span>
                            <span>HK${totalPrice.toFixed(2)}</span>
                        </div>

                        {/* Checkout Button */}
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="block w-full py-3 px-6 bg-neutral-900 text-white text-center rounded-lg hover:bg-neutral-800 transition-colors font-medium"
                        >
                            前往結帳
                        </Link>

                        {/* Continue Shopping */}
                        <button
                            onClick={closeCart}
                            className="w-full py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                            繼續購物
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}