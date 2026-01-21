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
      className="product-card group"
      style={{
        opacity: inView ? 1 : 0.6,
        transform: inView ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
        transition: `all 0.6s ease-out ${index * 80}ms`,
      }}
    >
      <div className="bg-white rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-400 transition-all duration-500 hover:shadow-xl">
        <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={product.image || "/hy_01.webp"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

          <button className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110">
            <svg
              className="w-5 h-5 text-neutral-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <div className="absolute top-4 left-4 bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-medium">
            {product.categories[0] ?? "未分類"}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating ?? 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-neutral-300 text-neutral-300"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-neutral-600">({product.reviews ?? 0})</span>
          </div>

          <h3
            className={`${playfairClassName} text-base font-light leading-snug text-neutral-900 mb-3 line-clamp-2`}
          >
            {product.name}
          </h3>

          {locations.length > 0 && (
            <p className="text-xs text-neutral-600 mb-3 line-clamp-1">
              地點: {locations.join(" / ")}
            </p>
          )}

          <div className="mb-4">
            <p className="text-lg font-semibold text-neutral-900">
              ${product.price.toLocaleString()}
            </p>
          </div>

          <button className="w-full bg-neutral-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-neutral-800 transition-colors duration-300 group-hover:shadow-lg">
            加入購物車
          </button>
        </div>
      </div>
    </div>
  )
}
