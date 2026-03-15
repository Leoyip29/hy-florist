"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Minus, Plus, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useTranslations } from "next-intl"
import type { UiProduct } from "@/app/[locale]/products/page"

interface ProductDetailProps {
  product: UiProduct
  onClose: () => void
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const t = useTranslations("ProductDetail")
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedOption, setSelectedOption] = useState<number | null>(
    product.options && product.options.length > 0 ? product.options[0].id : null
  )
  
  // Check if product has options
  const hasOptions = product.options && product.options.length > 0
  
  // Get the selected option object
  const selectedOptionData = product.options?.find(opt => opt.id === selectedOption)
  
  // Calculate total price (base price + option price adjustment)
  const totalPrice = product.price + (selectedOptionData?.priceAdjustment || 0)

  const handleAddToCart = () => {
    // If product has options, require selection
    if (hasOptions && !selectedOption) {
      return
    }

    const optionName = selectedOptionData ? ` (${selectedOptionData.name})` : ""
    const productName = `${product.name}${optionName}`

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: productName,
        price: totalPrice,
        image: product.image,
        categories: product.categories,
        selectedOptionId: selectedOption || undefined,
      })
    }
    onClose()
  }

  // Get the display image - use option image if available, otherwise product image
  const displayImage = selectedOptionData?.image || product.image

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
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
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
              HK${totalPrice.toLocaleString()}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-neutral-600 font-light leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Options Selector (like Uber Eats - select meal options) */}
            {hasOptions && (
              <div className="mb-6">
                <span className="text-sm text-neutral-600 mb-3 block">
                  Select Option / 選擇類型
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {product.options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`py-3 px-2 rounded-lg border transition-all text-sm font-medium flex flex-col items-center ${
                        selectedOption === option.id
                          ? "border-[#E8B4B8] bg-[#E8B4B8]/10 text-[#8B6B6B]"
                          : "border-neutral-300 hover:border-[#E8B4B8] text-neutral-600"
                      }`}
                    >
                      <span className="block">{option.nameEn || option.name}</span>
                      {option.nameEn && (
                        <span className="block text-xs text-neutral-400">{option.name}</span>
                      )}
                      {option.priceAdjustment > 0 && (
                        <span className="text-xs text-[#E8B4B8] mt-1">
                          +HK${option.priceAdjustment}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-neutral-200 mb-6" />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
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
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={hasOptions && !selectedOption}
              className={`w-full py-4 transition-all duration-300 text-neutral-800 font-serif text-sm tracking-widest rounded-lg flex items-center justify-center gap-2 mb-4 ${
                hasOptions && !selectedOption
                  ? "bg-neutral-300 cursor-not-allowed"
                  : "bg-[#E8B4B8] hover:bg-[#d49fa3]"
              }`}
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
