"use client"

import {ShoppingBag} from "lucide-react"
import {useCart} from "@/contexts/CartContext"

interface CartButtonProps {
  isScrolled?: boolean
}

export default function CartButton({ isScrolled = false }: CartButtonProps) {
    const {totalItems, openCart} = useCart()

    return (
        <button
            onClick={openCart}
            className={`relative p-2 rounded-full transition-colors ${
              isScrolled ? "hover:bg-neutral-100" : "hover:bg-white/10"
            }`}
            aria-label="打開購物車"
        >
            <ShoppingBag className={`w-5 h-5 ${
              isScrolled ? "text-neutral-700" : "text-white"
            }`}/>
            {totalItems > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
                </span>
            )}
        </button>
    )
}