"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import type { UiProduct } from "@/app/products/page"

interface ProductDetailProps {
  product: UiProduct
  onClose: () => void
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categories: product.categories,
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-neutral-600" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="w-full md:w-1/2 bg-neutral-100 relative">
            <div className="relative aspect-[3/4]">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <span className="text-lg">No Image</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {/* <div className="absolute top-4 left-4 flex gap-2">
              <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-neutral-600" />
              </button>
              <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                <Share2 className="w-5 h-5 text-neutral-600" />
              </button>
            </div> */}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
            {/* Category Tags */}
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.categories.map((category: string) => (
                  <span
                    key={category}
                    className="text-xs px-3 py-1 bg-[#E8B4B8]/20 text-[#8B6B6B] rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl font-serif font-light text-neutral-900 mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl font-medium text-neutral-900 mb-6">
              HK${product.price.toLocaleString()}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-neutral-600 font-light leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-neutral-200 mb-6" />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-neutral-600">數量</span>
              <div className="flex items-center border border-neutral-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-neutral-100 transition-colors"
                >
                  <Minus className="w-4 h-4 text-neutral-600" />
                </button>
                <span className="w-12 text-center text-neutral-900 font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-neutral-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-[#E8B4B8] hover:bg-[#d49fa3] transition-all duration-300 text-neutral-800 font-serif text-sm tracking-widest rounded-lg flex items-center justify-center gap-2 mb-4"
            >
              <ShoppingCart className="w-5 h-5" />
              加入購物車
            </button>

            {/* Additional Info */}
            <div className="space-y-3 mt-auto pt-6">
              {/* <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span className="w-2 h-2 bg-[#9CAFA3] rounded-full" />
                免費送貨 (滿 HK$800)
              </div> */}
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span className="w-2 h-2 bg-[#9CAFA3] rounded-full" />
                香港本地送花服務
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span className="w-2 h-2 bg-[#9CAFA3] rounded-full" />
                當日新鮮製作
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
