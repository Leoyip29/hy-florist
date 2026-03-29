"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Minus, Plus, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useTranslations } from "next-intl"
import type { UiProduct } from "@/lib/product-utils"

interface ProductDetailProps {
  product: UiProduct
  onClose: () => void
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const t = useTranslations("ProductDetail")
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(
    product.options?.[0]?.id ?? null
  )

  const hasOptions = product.options && product.options.length > 0
  const selectedOption = product.options?.find((o) => o.id === selectedOptionId)
  const unitPrice = product.price + (selectedOption?.priceAdjustment ?? 0)
  const totalPrice = unitPrice * quantity

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: unitPrice,
        image: product.image,
        categories: product.categories,
        selectedOptionId: selectedOptionId ?? undefined,
        selectedOptionName: selectedOption?.name,
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
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <span className="text-lg">{t("noImage")}</span>
                </div>
              )}
            </div>
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
              HK${unitPrice.toLocaleString()}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-neutral-600 font-light leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Option Selector */}
            {hasOptions && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-neutral-800">
                    {t("selectOption")}
                  </span>
                  {selectedOption && (
                    <span className="text-xs px-2 py-0.5 bg-[#E8B4B8]/30 text-[#8B6B6B] rounded-full">
                      {selectedOption.name}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {product.options!.map((option) => {
                    const isSelected = option.id === selectedOptionId
                    const adj = option.priceAdjustment
                    const totalPrice = product.price + adj
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOptionId(option.id)}
                        className={`group w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-[#E8B4B8] bg-[#E8B4B8]/10 shadow-sm"
                            : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
                        }`}
                      >
                        {/* Option Image or Placeholder */}
                        <div className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                          isSelected ? "ring-2 ring-[#E8B4B8]" : "ring-1 ring-neutral-200"
                        }`}>
                          {option.image ? (
                            <Image
                              src={option.image}
                              alt={option.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                              <span className="text-xs text-neutral-400 font-light">Option</span>
                            </div>
                          )}
                        </div>

                        {/* Option Details */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isSelected ? "text-neutral-900" : "text-neutral-700"}`}>
                            {option.name}
                          </p>
                          {option.nameEn && option.nameEn !== option.name && (
                            <p className="text-xs text-neutral-400 mt-0.5">{option.nameEn}</p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          {adj !== 0 ? (
                            <div className="flex flex-col items-end">
                              <span className={`text-sm font-medium ${isSelected ? "text-[#8B6B6B]" : "text-neutral-500"}`}>
                                HK${totalPrice.toLocaleString()}
                              </span>
                              <span className={`text-xs ${adj > 0 ? "text-[#9CAFA3]" : "text-[#d49fa3]"}`}>
                                {adj > 0 ? "+" : ""}HK${adj.toFixed(0)}
                              </span>
                            </div>
                          ) : (
                            <span className={`text-sm font-medium ${isSelected ? "text-neutral-900" : "text-neutral-600"}`}>
                              HK${product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          isSelected
                            ? "border-[#E8B4B8] bg-[#E8B4B8]"
                            : "border-neutral-300 group-hover:border-neutral-400"
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-neutral-200 mb-6" />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-neutral-600">{t("quantity")}</span>
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
              {quantity > 1 && (
                <span className="text-sm text-neutral-500">
                  HK${unitPrice.toLocaleString()} × {quantity} = HK${totalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-[#E8B4B8] hover:bg-[#d49fa3] transition-all duration-300 text-neutral-800 font-serif text-sm tracking-widest rounded-lg flex items-center justify-center gap-2 mb-4"
            >
              <ShoppingCart className="w-5 h-5" />
              {t("addToCart")}
            </button>

            {/* Additional Info */}
            <div className="space-y-3 mt-auto pt-6">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span className="w-2 h-2 bg-[#9CAFA3] rounded-full" />
                {t("localDelivery")}
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span className="w-2 h-2 bg-[#9CAFA3] rounded-full" />
                {t("freshDaily")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
