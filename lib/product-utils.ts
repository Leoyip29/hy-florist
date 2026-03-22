export type ApiCategory = { id: number; name: string }
export type ApiLocation = { id: number; name: string }
export type ApiProductImage = {
  id: number
  image: string | null
  url: string | null
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
  suitable_locations: ApiLocation[]
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
  locations: string[]
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
  圓形花牌: "Round Board",
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

export const REVERSE_CATEGORY_TRANSLATIONS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_NAME_TRANSLATIONS).map(([chinese, english]) => [english, chinese])
)

export const REVERSE_LOCATION_TRANSLATIONS: Record<string, string> = Object.fromEntries(
  Object.entries(LOCATION_NAME_TRANSLATIONS).map(([chinese, english]) => [english, chinese])
)

export function translateLocation(name: string): string {
  return LOCATION_NAME_TRANSLATIONS[name] ?? name
}

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

  // Second pass: translate any remaining Chinese category terms
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

export function toApiLocation(name: string, locale: string): string {
  if (locale === "en" && REVERSE_LOCATION_TRANSLATIONS[name]) {
    return REVERSE_LOCATION_TRANSLATIONS[name]
  }
  return name
}

export function buildFilterUrl(
  baseUrl: string,
  category: string,
  location: string,
  search: string,
  sort: string,
  page: number,
  locale: string
): string {
  const params = new URLSearchParams()

  const apiCategory = toApiCategory(category, locale)
  const apiLocation = toApiLocation(location, locale)

  if (apiCategory && apiCategory !== "All" && apiCategory !== "全部") {
    params.set("category", apiCategory)
  }
  if (apiLocation && apiLocation !== "All" && apiLocation !== "全部") {
    params.set("location", apiLocation)
  }
  if (search) {
    params.set("search", search)
  }
  if (sort && sort !== "recommended") {
    params.set("sort", sort)
  }
  if (page > 1) {
    params.set("page", page.toString())
  }

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

export function pickPrimaryImage(images: ApiProductImage[]): string {
  const pick = (img: ApiProductImage) => img.url || img.image || ""
  const primary = images.find((img) => img.is_primary && (img.url || img.image))
  if (primary) return pick(primary)
  const any = images.find((img) => img.url || img.image)
  return any ? pick(any) : ""
}

export function apiToUiProduct(p: ApiProduct, locale: string): UiProduct {
  const options: ProductOption[] | undefined = p.options?.map((opt) => ({
    id: opt.id,
    name: locale === "en" ? opt.name_en : opt.name,
    nameEn: opt.name_en,
    priceAdjustment: Number(opt.price_adjustment),
    image: opt.image_url || opt.image || null,
  }))

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
    options: options?.length ? options : undefined,
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
  圓形花牌: "Round Funeral Wreaths.png",
  十字架花牌: "Cross Funeral Wreaths.png",
  場地裝飾: "Venue Decorations.png",
  台花: "Table Flower Arrangements.png",
  場地系列: "Venue Flower Series.png",
  櫈花: "Chair Flower Arrangements.png",
  講台花: "Podium Flower Arrangements.png",
  花牌套餐: "Funeral Flower Set.png",
}