"use client"

import Image from "next/image"
import Link from "next/link"
import {ShoppingCart} from "lucide-react"
import {useCart} from "@/contexts/CartContext"
import type {UiProduct} from "@/app/shop/page"

interface ProductCardProps {
    product: UiProduct
    playfairClassName: string
    inView: boolean
    index: number
}

export default function ProductCard({
                                        product,
                                        playfairClassName,
                                        inView,
                                        index,
                                    }: ProductCardProps) {
    const {addItem} = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent link navigation
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            categories: product.categories,
        })
    }

    return (
        <div
            className={`product-card group transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
                transitionDelay: `${index * 100}ms`,
            }}
        >
            <Link href={`/products/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-3">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <span className="text-sm">No Image</span>
                        </div>
                    )}

                    {/* Add to Cart Button Overlay */}
                    <div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center p-4">
                        <button
                            onClick={handleAddToCart}
                            className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-neutral-900 px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-neutral-100 shadow-lg"
                        >
                            <ShoppingCart className="w-4 h-4"/>
                            加入購物車
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="text-center space-y-1">
                    <h3
                        className={`${playfairClassName} text-base font-light text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2 min-h-[3rem]`}
                    >
                        {product.name}
                    </h3>

                    <p className="text-sm font-medium text-neutral-900">
                        HK${product.price.toFixed(2)}
                    </p>

                    {/* Category Tags */}
                    {product.categories && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                            {product.categories.slice(0, 2).map((category) => (
                                <span
                                    key={category}
                                    className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full"
                                >
                    {category}
                    </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    )
}