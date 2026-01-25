import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import "./globals.css"
import Navigation from "@/components/layout/Navigation"  // Add this import
import Footer from "@/components/layout/Footer"          // Add this import if not already there
import {CartProvider} from "@/contexts/CartContext"
import CartDrawer from "@/components/cart/CartDrawer"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "HY Florist - 香港花藝專門店",
    description: "專業花藝設計，為生活的每一刻增添美麗與溫度",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="zh-HK">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <CartProvider>
            <Navigation/>
            {children}
            <Footer/>
            <CartDrawer/>
        </CartProvider>
        </body>
        </html>
    )
}