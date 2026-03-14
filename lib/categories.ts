// Category mapping for consistent category handling across locales
// Maps URL-safe keys ↔ Chinese for API queries

export const CATEGORY_MAP: Record<string, string> = {
  // URL-safe key → Chinese (for API)
  "bench-flower": "櫈花",
  "casket-decoration": "棺面花",
  "podium-flower": "講台花",
  "stand-flower": "台花",
  "cross-board": "十字架花牌",
  "heart-shaped-board": "心型花牌",
  "round-board": "圓形花牌",
  "bouquet": "花束",
  "flower-basket": "花籃",
  "flower-board": "花牌",
  "board-set": "花牌套餐",
  "bouquet-bundle": "花束多買優惠",
  "venue-decoration": "場地裝飾",
  "venue-series": "場地系列",
  
  // Chinese → URL-safe key
  "櫈花": "bench-flower",
  "棺面花": "casket-decoration",
  "講台花": "podium-flower",
  "台花": "stand-flower",
  "十字架花牌": "cross-board",
  "心型花牌": "heart-shaped-board",
  "圓形花牌": "round-board",
  "花束": "bouquet",
  "花籃": "flower-basket",
  "花牌": "flower-board",
  "花牌套餐": "board-set",
  "花束多買優惠": "bouquet-bundle",
  "場地裝飾": "venue-decoration",
  "場地系列": "venue-series",
}

// Get the URL-safe category key
export function getCategoryKey(category: string): string {
  return CATEGORY_MAP[category] || category
}

// Get the Chinese category for API from URL key
export function getApiCategory(urlKey: string): string {
  return CATEGORY_MAP[urlKey] || urlKey
}
