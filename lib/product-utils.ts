export type PriceRange = {
  min?: number
  max?: number
}

export type PriceRangeOption = {
  key: string
  label: string
  value: PriceRange
}

export const PRICE_RANGES: PriceRangeOption[] = [
  { key: "400to600", label: "HK$400–600", value: { min: 400, max: 600 } },
  { key: "600to800", label: "HK$600–800", value: { min: 600, max: 800 } },
  { key: "800to1000", label: "HK$800–1000", value: { min: 800, max: 1000 } },
  { key: "1000to1500", label: "HK$1000–1500", value: { min: 1000, max: 1500 } },
  { key: "1500to2000", label: "HK$1500–2000", value: { min: 1500, max: 2000 } },
  { key: "2000to3000", label: "HK$2000–3000", value: { min: 2000, max: 3000 } },
  { key: "over3000", label: "Over HK$3000", value: { min: 3000 } },
]

export const PRICE_RANGES_ZH: PriceRangeOption[] = [
  { key: "400to600", label: "HK$400-600", value: { min: 400, max: 600 } },
  { key: "600to800", label: "HK$600-800", value: { min: 600, max: 800 } },
  { key: "800to1000", label: "HK$800-1000", value: { min: 800, max: 1000 } },
  { key: "1000to1500", label: "HK$1000-1500", value: { min: 1000, max: 1500 } },
  { key: "1500to2000", label: "HK$1500-2000", value: { min: 1500, max: 2000 } },
  { key: "2000to3000", label: "HK$2000-3000", value: { min: 2000, max: 3000 } },
  { key: "over3000", label: "HK$3000以上", value: { min: 3000 } },
]

export function getPriceRangeByLocale(locale: string): PriceRangeOption[] {
  if (locale === "en") {
    return PRICE_RANGES
  }
  return PRICE_RANGES_ZH
}

export function findPriceRangeByKey(key: string, locale: string): PriceRangeOption | undefined {
  return getPriceRangeByLocale(locale).find((opt) => opt.key === key)
}

export function isEmptyRange(range: PriceRange): boolean {
  return range.min === undefined && range.max === undefined
}

export function findPriceRangeKey(range: PriceRange, locale: string): string {
  const options = getPriceRangeByLocale(locale)
  if (isEmptyRange(range)) return "clear"
  return options.find((opt) =>
    !isEmptyRange(opt.value) && opt.value.min === range.min && opt.value.max === range.max
  )?.key ?? "clear"
}

export type ApiCategory = { id: number; name: string; name_en: string }
export type ApiProductImage = {
  id: number
  image: string | null
  alt_text: string
  is_primary: boolean
}
export type ApiProductOption = {
  id: number
  name: string
  name_en: string
  price_adjustment: string
  image: string | null
  image_url: string | null
}
export type ApiProduct = {
  id: number
  name: string
  description: string
  price: string
  categories: ApiCategory[]
  images: ApiProductImage[]
  options: ApiProductOption[]
}

export type ProductOption = {
  id: number
  name: string
  nameEn: string
  priceAdjustment: number
  image: string | null
}

export type UiProduct = {
  id: number
  name: string
  description: string
  categories: string[]
  price: number
  image: string
  rating?: number
  reviews?: number
  options?: ProductOption[]
}

export const CATEGORY_NAME_TRANSLATIONS: Record<string, string> = {
  全部: "All",
  花束: "Bouquet",
  "花束多買優惠": "Bouquet Bundle",
  "多買優惠組合": "Bundle Offer",
  花籃: "Flower Basket",
  花牌: "Flower Board",
  花牌套餐: "Board Set",
  十字架花牌: "Cross Board",
  圓型花牌: "Round Board",
  心型花牌: "Heart-shaped Board",
  棺面花: "Casket Decoration",
  場地裝飾: "Venue Decoration",
  台花: "Stand Flower",
  講台花: "Podium Flower",
  櫈花: "Bench Flower",
  場地系列: "Venue Series",
}

export const REVERSE_CATEGORY_TRANSLATIONS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_NAME_TRANSLATIONS).map(([chinese, english]) => [english, chinese])
)

export function translateProductName(name: string): string {
  let translatedName = name

  const categoryPrefixes = Object.keys(CATEGORY_NAME_TRANSLATIONS).filter(
    (key) => key.length > 1 && name.startsWith(key)
  )

  if (categoryPrefixes.length > 0) {
    const longestPrefix = categoryPrefixes.sort((a, b) => b.length - a.length)[0]
    const translatedPrefix = CATEGORY_NAME_TRANSLATIONS[longestPrefix]
    const remainder = name.slice(longestPrefix.length)
    translatedName = `${translatedPrefix}${remainder}`
  } else {
    for (const [chinese, english] of Object.entries(CATEGORY_NAME_TRANSLATIONS)) {
      if (chinese.length > 1 && name.includes(chinese)) {
        translatedName = name.replace(chinese, english)
        break
      }
    }
  }

  for (const [chinese, english] of Object.entries(CATEGORY_NAME_TRANSLATIONS)) {
    if (chinese.length > 1 && translatedName.includes(chinese)) {
      translatedName = translatedName.replace(chinese, english)
    }
  }

  return translatedName
}

export function translateCategory(name: string): string {
  return CATEGORY_NAME_TRANSLATIONS[name] ?? name
}

export function toApiCategory(name: string, locale: string): string {
  if (locale === "en" && REVERSE_CATEGORY_TRANSLATIONS[name]) {
    return REVERSE_CATEGORY_TRANSLATIONS[name]
  }
  return name
}

export function buildFilterUrl(
  baseUrl: string,
  category: string,
  search: string,
  sort: string,
  page: number,
  _locale: string,
  priceRange: PriceRange = {}
): string {
  const params = new URLSearchParams()

  if (category && category !== "All" && category !== "全部") {
    params.set("category", category)
  }
  if (search) {
    params.set("search", search)
  }
  if (sort && sort !== "recommended") {
    params.set("sort", sort)
  }
  if (priceRange.min !== undefined) {
    params.set("price_min", String(priceRange.min))
  }
  if (priceRange.max !== undefined) {
    params.set("price_max", String(priceRange.max))
  }
  if (page > 1) {
    params.set("page", page.toString())
  }

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

export function pickPrimaryImage(images: ApiProductImage[]): string {
  const primary = images.find((img) => img.is_primary && img.image)
  if (primary) return primary.image ?? ""
  const any = images.find((img) => img.image)
  return any?.image ?? ""
}

export function apiToUiProduct(p: ApiProduct, locale: string): UiProduct {
  const options: ProductOption[] | undefined = p.options?.map((opt) => ({
    id: opt.id,
    name: locale === "en" ? opt.name_en : opt.name,
    nameEn: opt.name_en,
    priceAdjustment: Number(opt.price_adjustment),
    image: opt.image || null,
  }))

  return {
    id: p.id,
    name: locale === "en" ? translateProductName(p.name) : p.name,
    description: p.description,
    categories: p.categories?.map((c) =>
      locale === "en" ? c.name_en || c.name : c.name
    ) ?? ["未分類"],
    price: Number(p.price),
    image: pickPrimaryImage(p.images),
    options: options?.length ? options : undefined,
  }
}
