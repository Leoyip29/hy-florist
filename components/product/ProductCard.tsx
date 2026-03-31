"use client"

import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useTranslations } from "next-intl"
import { useProductDetail } from "@/contexts/ProductDetailContext"
import type { UiProduct } from "@/lib/product-utils"

interface ProductCardProps {
  product: UiProduct
  playfairClassName: string
  inView: boolean
  index: number
  priority?: boolean
}

export default function ProductCard({
  product,
  playfairClassName,
  inView,
  index,
  priority = false,
}: ProductCardProps) {
  const t = useTranslations("ProductCard")
  const { addItem } = useCart()
  const { openProduct } = useProductDetail()

  const hasOptions = product.options && product.options.length > 0
  const firstOption = product.options?.[0]
  const displayPrice = product.price + (firstOption?.priceAdjustment ?? 0)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: displayPrice,
      image: product.image,
      categories: product.categories,
      selectedOptionId: firstOption?.id,
      selectedOptionName: firstOption?.name,
    })
  }

  return (
    <div
      className={`product-card group transition-all duration-700 cursor-pointer ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={() => openProduct(product)}
    >
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-3 cursor-pointer rounded-lg"
        onClick={(e) => {
          e.stopPropagation()
          openProduct(product)
        }}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <span className="text-base">No Image</span>
          </div>
        )}

        {/* Options badge - larger for visibility */}
        {hasOptions && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm text-neutral-700 font-medium shadow-md">
            {product.options!.length} {t("options")}
          </div>
        )}

        {/* Add to Cart Button - always visible on mobile, hover on desktop */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 to-transparent p-3 md:p-4 flex justify-center">
          <button
            onClick={handleAddToCart}
            className="w-full md:w-auto opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 bg-white text-neutral-900 px-3 py-2 md:px-5 md:py-2.5 rounded-full font-medium text-sm md:text-sm flex items-center justify-center gap-2 hover:bg-neutral-100 shadow-lg min-h-[40px]"
          >
            <ShoppingCart className="w-4 h-4 md:w-4 md:h-4" />
            {t("addToCart")}
          </button>
        </div>
      </div>

      {/* Product Info - larger text for accessibility */}
      <div className="text-center space-y-1.5 px-1">
        <h3
          className={`${playfairClassName} text-lg md:text-base font-light text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2 min-h-[3.5rem]`}
        >
          {product.name}
        </h3>
        <p className="text-lg md:text-base font-semibold text-neutral-900">
          HK${displayPrice.toLocaleString()}
        </p>
      </div>
    </div>
  )
}
