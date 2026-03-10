"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import ProductDetail from "@/components/product/ProductDetail"
import type { UiProduct } from "@/lib/product-utils"

interface ProductDetailContextType {
  openProduct: (product: UiProduct) => void
  closeProduct: () => void
}

const ProductDetailContext = createContext<ProductDetailContextType | undefined>(undefined)

export function ProductDetailProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<UiProduct | null>(null)

  return (
    <ProductDetailContext.Provider
      value={{
        openProduct: setSelectedProduct,
        closeProduct: () => setSelectedProduct(null),
      }}
    >
      {children}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </ProductDetailContext.Provider>
  )
}

export function useProductDetail() {
  const context = useContext(ProductDetailContext)
  if (!context) {
    throw new Error("useProductDetail must be used within ProductDetailProvider")
  }
  return context
}