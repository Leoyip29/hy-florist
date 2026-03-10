import { fetchProducts } from "@/lib/api"
import {
  apiToUiProduct,
  CATEGORY_NAME_TRANSLATIONS,
  CATEGORY_LOGOS,
  publicLogo,
  translateCategory,
  translateLocation,
} from "@/lib/product-utils"
import ProductsClient from "@/components/product/ProductsClient"
import type { CategoryItem } from "@/components/product/ProductCategory"

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const allText = locale === "en" ? "All" : "全部"

  // Fetch products server-side with ISR caching (60s revalidation)
  const apiProducts = await fetchProducts()
  const uiProducts = apiProducts.map((p) => apiToUiProduct(p, locale))

  // Build unique category and location lists from raw API data
  const uniqueOriginalCategories = Array.from(
    new Set(
      apiProducts
        .flatMap((p) => p.categories?.map((c) => c.name) ?? [])
        .filter(Boolean)
    )
  )
  const uniqueOriginalLocations = Array.from(
    new Set(
      apiProducts
        .flatMap((p) => p.suitable_locations?.map((l) => l.name) ?? [])
        .filter((name) => Boolean(name) && name !== "不適用")
    )
  )

  const displayCategories =
    locale === "en"
      ? uniqueOriginalCategories.map((name) => translateCategory(name))
      : uniqueOriginalCategories
  const displayLocations =
    locale === "en"
      ? uniqueOriginalLocations.map((name) => translateLocation(name))
      : uniqueOriginalLocations

  // Map category names to logo images
  const categoryToImage = new Map<string, string>()
  for (const originalName of uniqueOriginalCategories) {
    const logoFile = CATEGORY_LOGOS[originalName]
    if (logoFile) categoryToImage.set(originalName, publicLogo(logoFile))
  }
  for (const p of uiProducts) {
    const originalProduct = apiProducts.find((ap) => ap.id === p.id)
    if (originalProduct) {
      for (const cat of originalProduct.categories ?? []) {
        if (!categoryToImage.has(cat.name) && p.image)
          categoryToImage.set(cat.name, p.image)
      }
    }
  }

  const categories: CategoryItem[] = [
    {
      name: allText,
      image: publicLogo(CATEGORY_LOGOS["全部"] ?? "All.png"),
    },
    ...displayCategories.map((name) => ({
      name,
      image: categoryToImage.get(
        locale === "en"
          ? (Object.entries(CATEGORY_NAME_TRANSLATIONS).find(
              ([, trans]) => trans === name
            )?.[0] ?? name)
          : name
      ),
    })),
  ]

  const locations = [allText, ...displayLocations]

  return (
    <ProductsClient
      initialProducts={uiProducts}
      initialCategories={categories}
      initialLocations={locations}
      locale={locale}
    />
  )
}