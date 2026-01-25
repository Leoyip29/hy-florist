"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    image: string
    categories: string[]
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: Omit<CartItem, "quantity">) => void
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
    isOpen: boolean
    openCart: () => void
    closeCart: () => void
    toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("hy-florist-cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error)
            }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("hy-florist-cart", JSON.stringify(items))
    }, [items])

    const addItem = (product: Omit<CartItem, "quantity">) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === product.id)

            if (existingItem) {
                // Increase quantity if item already exists
                return currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            // Add new item with quantity 1
            return [...currentItems, { ...product, quantity: 1 }]
        })

        // Open cart drawer when item is added
        setIsOpen(true)
    }

    const removeItem = (productId: number) => {
        setItems((currentItems) =>
            currentItems.filter((item) => item.id !== productId)
        )
    }

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId)
            return
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
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
            isOpen,
            openCart,
            closeCart,
            toggleCart,
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