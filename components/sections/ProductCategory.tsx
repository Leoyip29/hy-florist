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

  // English examples (if your suitable_locations are English)
  Church: "Church.png",
  "Funeral Home": "Funeral Home.png",
  Hospital: "Hospital.png",
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
  return (
    <section className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
        <div className="flex items-start gap-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className={`group flex flex-col items-center gap-3 min-w-[110px] transition-all duration-300 ${
                selectedCategory === cat.name ? "opacity-100" : "opacity-90"
              }`}
            >
              <div
                className={`relative w-28 h-20 rounded-2xl overflow-hidden border bg-neutral-50 transition-all duration-300 ${
                  selectedCategory === cat.name
                    ? "border-neutral-900 shadow-md"
                    : "border-neutral-200 group-hover:border-neutral-400"
                }`}
              >
                <Image
                  src={cat.image || "/hy_01.webp"}
                  alt={cat.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span
                className={`text-sm font-semibold tracking-wide ${
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

        <div className="flex items-center gap-3 overflow-x-auto pt-4">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => onSelectLocation(loc)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-medium tracking-wide
                transition-all duration-300 whitespace-nowrap border
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
