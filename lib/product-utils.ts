export type ApiCategory = { id: number; name: string }
export type ApiLocation = { id: number; name: string }
export type ApiProductImage = {
  id: number
  image: string | null
  url: string | null
  alt_text: string
  is_primary: boolean
}
export type ApiProduct = {
  id: number
  name: string
  description: string
  price: string
  categories: ApiCategory[]
  suitable_locations: ApiLocation[]
  images: ApiProductImage[]
}

export type UiProduct = {
  id: number
  name: string
  description: string
  categories: string[]
  locations: string[]
  price: number
  image: string
  rating?: number
  reviews?: number
}

export const CATEGORY_NAME_TRANSLATIONS: Record<string, string> = {
  全部: "All",
  花束: "Bouquet",
  "花束多買優惠": "Bouquet Bundle",
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

export const LOCATION_NAME_TRANSLATIONS: Record<string, string> = {
  全部: "All",
  教堂: "Church",
  殯儀館: "FuneralHome",
  醫院: "Hospital",
  不適用: "NotApplicable",
}

export function translateLocation(name: string): string {
  return LOCATION_NAME_TRANSLATIONS[name] ?? name
}

export function translateProductName(name: string): string {
  const categoryPrefixes = Object.keys(CATEGORY_NAME_TRANSLATIONS).filter(
    (key) => key.length > 1 && name.startsWith(key)
  )
  if (categoryPrefixes.length > 0) {
    const longestPrefix = categoryPrefixes.sort((a, b) => b.length - a.length)[0]
    const translatedPrefix = CATEGORY_NAME_TRANSLATIONS[longestPrefix]
    const remainder = name.slice(longestPrefix.length)
    return `${translatedPrefix}${remainder}`
  }
  return name
}

export function translateCategory(name: string): string {
  return CATEGORY_NAME_TRANSLATIONS[name] ?? name
}

export function pickPrimaryImage(images: ApiProductImage[]): string {
  const pick = (img: ApiProductImage) => img.url || img.image || ""
  const primary = images.find((img) => img.is_primary && (img.url || img.image))
  if (primary) return pick(primary)
  const any = images.find((img) => img.url || img.image)
  return any ? pick(any) : ""
}

export function apiToUiProduct(p: ApiProduct, locale: string): UiProduct {
  return {
    id: p.id,
    name: locale === "en" ? translateProductName(p.name) : p.name,
    description: p.description,
    categories: p.categories?.map((c) =>
      locale === "en" ? translateCategory(c.name) : c.name
    ) ?? ["未分類"],
    locations: p.suitable_locations?.map((l) =>
      locale === "en" ? translateLocation(l.name) : l.name
    ) ?? [],
    price: Number(p.price),
    image: pickPrimaryImage(p.images),
  }
}

export function publicLogo(fileName: string) {
  return encodeURI(`/CategoriesLogo/${fileName}`)
}

export const CATEGORY_LOGOS: Record<string, string> = {
  全部: "All.png",
  花束: "Bouquets.png",
  花籃: "Flower Baskets.png",
  花束多買優惠: "Bouquet Bundle Offers.png",
  花牌: "Funeral Flower Boards.png",
  心型花牌: "Heart-Shaped Funeral Wreaths.png",
  棺面花: "Coffin Flower Arrangements.png",
  圓型花牌: "Round Funeral Wreaths.png",
  十字架花牌: "Cross Funeral Wreaths.png",
  場地裝飾: "Venue Decorations.png",
  台花: "Table Flower Arrangements.png",
  場地系列: "Venue Flower Series.png",
  櫈花: "Chair Flower Arrangements.png",
  講台花: "Podium Flower Arrangements.png",
  花牌套餐: "Funeral Flower Set.png",
}