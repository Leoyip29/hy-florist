import Image from "next/image"
import type { UiProduct } from "@/app/products/page"

type Props = {
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
}: Props) {
  const locations = (product.locations ?? []).filter((l) => l && l !== "不適用")

  return (
    <div
      className="product-card group h-full"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
        transition: `all 0.6s ease-out ${index * 100}ms`,
      }}
    >
      <div className="bg-white h-full flex flex-col">
        {/* Big Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <Image
            src={product.image || "/hy_01.webp"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-neutral-800 shadow-md">
            {product.categories[0] ?? "未分類"}
          </div>

          {/* Wishlist Button */}
          <button className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110">
            <svg
              className="w-5 h-5 text-neutral-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Rating */}
          {(product.rating ?? 0) > 0 && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-neutral-900 px-3 py-1.5 rounded-full text-xs font-medium shadow-md flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-500 fill-yellow-400" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{(product.rating ?? 0).toFixed(1)}</span>
              <span className="text-neutral-400">·</span>
              <span>{product.reviews ?? 0}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3
            className={`${playfairClassName} text-lg font-light leading-snug text-neutral-900 mb-3 line-clamp-2`}
          >
            {product.name}
          </h3>

          {/* Locations */}
          {locations.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {locations.slice(0, 3).map((loc) => (
                <span
                  key={loc}
                  className="px-2.5 py-1 rounded-full bg-[#F5F0E8] text-xs text-[#57534E] border border-[#E8E2D9]"
                >
                  {loc}
                </span>
              ))}
              {locations.length > 3 && (
                <span className="px-2.5 py-1 rounded-full bg-[#F5F0E8] text-xs text-[#78716C] border border-dashed border-[#D4C8B8]">
                  +{locations.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price & Button */}
          <div className="flex items-center justify-between gap-4 mt-auto">
            <div className="flex flex-col">
              
              <p className="text-xl font-light text-[#292524]">
                ${product.price.toLocaleString()}
              </p>
            </div>
            <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#292524] text-white text-xs tracking-widest hover:bg-[#44403C] transition-all duration-300 hover:shadow-lg">
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
