import { useEffect, useState } from "react"
import Image from "next/image"

export type CategoryItem = {
  name: string
  image?: string
}

function publicLogo(fileName: string) {
  return encodeURI(`/CategoriesLogo/${fileName}`)
}

// Map location names to logo files in /public/CategoriesLogo
const LOCATION_LOGOS: Record<string, string> = {
  全部: "All location.png",

  // Chinese examples – adjust keys to match your backend location names
  教堂: "Church.png",
  殯儀館: "Funeral Home.png",
  醫院: "Hospital.png",


}

type Props = {
  categories: CategoryItem[]
  selectedCategory: string
  onSelect: (cat: string) => void
  locations: string[]
  selectedLocation: string
  onSelectLocation: (loc: string) => void
}

export default function ProductCategory({
  categories,
  selectedCategory,
  onSelect,
  locations,
  selectedLocation,
  onSelectLocation,
}: Props) {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const media = window.matchMedia("(max-width: 767px)")
    const handle = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches)
    handle(media)
    media.addEventListener("change", handle)
    return () => media.removeEventListener("change", handle)
  }, [])

  const visibleCategories =
    !isMobile || showAllCategories ? categories : categories.slice(0, 6)

  return (
    <section className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
        <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-flow-col md:grid-rows-2 md:auto-cols-max gap-3 sm:gap-5 overflow-x-auto md:overflow-visible pb-2 justify-center justify-items-center snap-x snap-mandatory">
          {visibleCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className={`group flex flex-col items-center gap-2 sm:gap-3 min-w-[82px] sm:min-w-[100px] transition-all duration-300 snap-start ${
                selectedCategory === cat.name ? "opacity-100" : "opacity-90"
              }`}
            >
              <div
                className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-2xl overflow-hidden border bg-neutral-50 transition-all duration-300 ${
                  selectedCategory === cat.name
                    ? "border-neutral-900 shadow-md"
                    : "border-neutral-200 group-hover:border-neutral-400"
                }`}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain p-2"
                  />
                ) : null}
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold tracking-wide ${
                  selectedCategory === cat.name
                    ? "text-neutral-900"
                    : "text-neutral-500 group-hover:text-neutral-800"
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
        {isMobile && categories.length > 6 && (
          <div className="flex justify-center pt-3">
            <button
              onClick={() => setShowAllCategories((v) => !v)}
              className="px-3 py-1.5 text-sm font-medium text-neutral-900 border border-neutral-200 rounded-full hover:border-neutral-400 transition-colors flex items-center gap-2"
              aria-label={showAllCategories ? "收合分類" : "顯示全部分類"}
            >
              <span className="text-lg leading-none">
                {showAllCategories ? "▲" : "▼"}
              </span>
              <span className="text-xs">分類</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pt-4 pb-1 snap-x snap-mandatory">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => onSelectLocation(loc)}
              className={`
                px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide
                transition-all duration-300 whitespace-nowrap border snap-start
                ${
                  selectedLocation === loc
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                    : "bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50"
                }
              `}
            >
              {(() => {
                const logoFile = LOCATION_LOGOS[loc]
                const logoSrc = logoFile ? publicLogo(logoFile) : undefined
                return (
                  <span className="flex items-center gap-3">
                    {logoSrc && (
                      <span className="relative w-9 h-9 rounded-full overflow-hidden bg-neutral-50">
                        <Image
                          src={logoSrc}
                          alt={loc}
                          fill
                          className="object-contain p-1"
                        />
                      </span>
                    )}
                    <span>{loc === "全部" ? "全部地點" : loc}</span>
                  </span>
                )
              })()}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
