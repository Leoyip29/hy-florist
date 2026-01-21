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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const media = window.matchMedia("(max-width: 767px)")
    const handle = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches)
    handle(media)
    media.addEventListener("change", handle)
    return () => media.removeEventListener("change", handle)
  }, [])

  const visibleCategories = categories

  return (
    <section className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {visibleCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className={`group flex flex-col items-center gap-2 w-[82px] sm:w-[100px] transition-all duration-300 transform ${
                selectedCategory === cat.name
                  ? "scale-105"
                  : "hover:scale-105 active:scale-95"
              }`}
            >
              <div
                className={`w-20 h-14 sm:w-24 sm:h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex items-center justify-center shadow-sm ${
                  selectedCategory === cat.name
                    ? "border-neutral-800 shadow-lg"
                    : "border-neutral-200 group-hover:border-neutral-400 group-hover:shadow-md"
                } bg-stone-50`}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={80}
                    height={56}
                    className={`object-contain p-2 transition-transform duration-300 ${
                      selectedCategory === cat.name ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                ) : null}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium text-center leading-tight transition-colors duration-300 ${
                  selectedCategory === cat.name
                    ? "text-neutral-900"
                    : "text-neutral-500 group-hover:text-neutral-700"
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>

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
                      <span className="relative w-9 h-9 rounded-full overflow-hidden bg-neutral-50 flex items-center justify-center">
                        <Image
                          src={logoSrc}
                          alt={loc}
                          width={36}
                          height={36}
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
