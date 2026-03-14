"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import ProductDetail from "@/components/product/ProductDetail"
import type { UiProduct } from "@/app/[locale]/products/page"

interface ProductModalProps {
  locale: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function ProductModalContent({ locale }: ProductModalProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get("product")
  
  const [product, setProduct] = useState<UiProduct | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setProduct(null)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/products/by-ids/?ids=${productId}`)
        
        if (!response.ok) {
          console.error("Failed to fetch product")
          setProduct(null)
          return
        }

        const data = await response.json()
        
        if (data && data.length > 0) {
          const p = data[0]
          const primaryImage = p.images?.find((img: any) => img.is_primary && img.image) || p.images?.[0]
          
          setProduct({
            id: p.id,
            name: p.name,
            description: p.description,
            categories: p.categories?.map((c: any) => c.name) || [],
            locations: [],
            price: Number(p.price),
            image: primaryImage?.image || "",
          })
        } else {
          setProduct(null)
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleClose = () => {
    router.push("/", { scroll: false })
  }

  if (!productId) {
    return null
  }

  if (loading) {
    return null
  }

  if (!product) {
    return null
  }

  return (
    <ProductDetail
      product={product}
      onClose={handleClose}
    />
  )
}

export default function ProductModal(props: ProductModalProps) {
  return (
    <Suspense fallback={null}>
      <ProductModalContent {...props} />
    </Suspense>
  )
}
