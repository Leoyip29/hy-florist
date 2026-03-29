"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    image: string
    categories: string[]
    selectedOptionId?: number
    selectedOptionName?: string
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: Omit<CartItem, "quantity">) => void
    removeItem: (productId: number, optionId?: number) => void
    updateQuantity: (productId: number, quantity: number, optionId?: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
    deliveryFee: number
    grandTotal: number
    isLoading: boolean
    isOpen: boolean
    openCart: () => void
    closeCart: () => void
    toggleCart: () => void
    hasBoardSet: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function makeItemKey(item: Omit<CartItem, "quantity">): string {
    return `${item.id}::${item.selectedOptionId ?? 0}`
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const savedCart = localStorage.getItem("hy-florist-cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error)
            }
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        localStorage.setItem("hy-florist-cart", JSON.stringify(items))
    }, [items])

    const addItem = (product: Omit<CartItem, "quantity">) => {
        setItems((currentItems) => {
            const key = makeItemKey(product)
            const existingIdx = currentItems.findIndex(
                (item) => makeItemKey(item) === key
            )

            if (existingIdx >= 0) {
                return currentItems.map((item, idx) =>
                    idx === existingIdx
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            return [...currentItems, { ...product, quantity: 1 }]
        })

        setIsOpen(true)
    }

    const removeItem = (productId: number, optionId?: number) => {
        setItems((currentItems) =>
            currentItems.filter(
                (item) =>
                    !(
                        item.id === productId &&
                        (optionId === undefined || item.selectedOptionId === optionId)
                    )
            )
        )
    }

    const updateQuantity = (productId: number, quantity: number, optionId?: number) => {
        if (quantity <= 0) {
            removeItem(productId, optionId)
            return
        }

        setItems((currentItems) =>
            currentItems.map((item) => {
                if (
                    item.id === productId &&
                    (optionId === undefined || item.selectedOptionId === optionId)
                ) {
                    return { ...item, quantity }
                }
                return item
            })
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    // Check if cart contains any board set item (supports both English and Chinese)
    const hasBoardSet = items.some((item) =>
        item.categories?.some((cat) =>
            cat.toLowerCase().includes("board set") ||
            cat.toLowerCase() === "board sets" ||
            cat.includes("花牌套餐")
        )
    )

    // Free delivery if: 8+ items, OR contains board set
    const deliveryFee = hasBoardSet
        ? 0
        : totalItems >= 8
            ? 0
            : totalItems <= 1
                ? 200
                : 200 + 30 * (totalItems - 1)

    const grandTotal = totalPrice + deliveryFee

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)
    const toggleCart = () => setIsOpen(!isOpen)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                deliveryFee,
                grandTotal,
                isLoading,
                isOpen,
                openCart,
                closeCart,
                toggleCart,
                hasBoardSet,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
