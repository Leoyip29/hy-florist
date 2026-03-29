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
        className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-3 cursor-pointer"
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
            <span className="text-sm">{t("noImage")}</span>
          </div>
        )}

        {/* Options badge */}
        {hasOptions && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs text-neutral-700 font-medium shadow-sm">
            {product.options!.length} {t("options")}
          </div>
        )}

        {/* Add to Cart Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center p-3 md:p-4">
          <button
            onClick={handleAddToCart}
            className="opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 bg-white text-neutral-900 px-4 py-2 md:px-6 md:py-2.5 rounded-full font-medium text-xs md:text-sm flex items-center gap-1.5 md:gap-2 hover:bg-neutral-100 shadow-lg"
          >
            <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {t("addToCart")}
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
          HK${displayPrice.toLocaleString()}
        </p>
      </div>
    </div>
  )
}
