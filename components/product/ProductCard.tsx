"use client"

import Image from "next/image"
import Link from "next/link"
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
}

export default function ProductCard({
  product,
  playfairClassName,
  inView,
  index,
}: ProductCardProps) {
  const t = useTranslations("ProductCard")
  const { addItem } = useCart()
  const { openProduct } = useProductDetail()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      categories: product.categories,
    })
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    openProduct(product)
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
        onClick={handleImageClick}
      >
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
            <span className="text-sm">{t("noImage")}</span>
          </div>
        )}

        {/* Add to Cart Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center p-4">
          <button
            onClick={handleAddToCart}
            className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-neutral-900 px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-neutral-100 shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            {t("addToCart")}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="text-center space-y-1">
          <h3
            className={`${playfairClassName} text-base font-light text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2 min-h-[3rem]`}
          >
            {product.name}
          </h3>
          <p className="text-sm font-medium text-neutral-900">
            HK${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  )
}