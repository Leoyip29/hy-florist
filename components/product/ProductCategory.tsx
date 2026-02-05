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
    <section className="bg-white border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        {/* Category Icons - Elegant Minimal */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {visibleCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className={`group flex flex-col items-center gap-3 transition-all duration-200 ${
                selectedCategory === cat.name ? "" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`relative overflow-hidden transition-all duration-300 ${
                  selectedCategory === cat.name ? "" : "grayscale-[30%] group-hover:grayscale-0"
                }`}
                style={{
                  width: selectedCategory === cat.name ? 56 : 50,
                  height: selectedCategory === cat.name ? 56 : 50,
                  borderRadius: selectedCategory === cat.name ? 16 : 12,
                }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="60px"
                    className="object-contain p-2"
                  />
                )}
                {/* Subtle active indicator bar */}
                {selectedCategory === cat.name && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-neutral-900 rounded-full" />
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 tracking-wide ${
                  selectedCategory === cat.name
                    ? "text-neutral-900"
                    : "text-neutral-500"
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Location Tabs - With Elegant Icons */}
        <div className="flex items-center gap-3 overflow-x-auto pt-8 pb-2">
          {locations.map((loc) => {
            const logoFile = LOCATION_LOGOS[loc]
            const logoSrc = logoFile ? publicLogo(logoFile) : undefined

            return (
              <button
                key={loc}
                onClick={() => onSelectLocation(loc)}
                className={`
                  group flex items-center gap-2.5 px-5 py-3
                  text-sm font-medium tracking-wide transition-all duration-200
                  whitespace-nowrap snap-start rounded-lg
                  ${
                    selectedLocation === loc
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }
                `}
              >
                {logoSrc && (
                  <span
                    className={`relative overflow-hidden transition-all duration-200 ${
                      selectedLocation === loc ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                    }`}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 5,
                    }}
                  >
                    <Image
                      src={logoSrc}
                      alt={loc}
                      fill
                      sizes="28px"
                      className="object-contain"
                    />
                  </span>
                )}
                <span>{loc === "全部" ? "全部地點" : loc}</span>
              </button>
            )
          })}
          {/* Active indicator line */}
          <div className="flex-1 border-b border-neutral-100 ml-2" />
        </div>
      </div>
    </section>
  )
}
