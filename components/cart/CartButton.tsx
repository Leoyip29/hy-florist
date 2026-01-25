"use client"

import {ShoppingBag} from "lucide-react"
import {useCart} from "@/contexts/CartContext"

export default function CartButton() {
    const {totalItems, openCart} = useCart()

    return (
        <button
            onClick={openCart}
            className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="打開購物車"
        >
            <ShoppingBag className="w-6 h-6"/>
            {totalItems > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
                </span>
            )}
        </button>
    )
}