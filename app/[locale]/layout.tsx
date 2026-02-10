import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import {notFound} from 'next/navigation'
import {routing} from '@/i18n/routing'
import {Geist, Geist_Mono} from "next/font/google"
import Footer from "@/components/layout/Footer"
import {CartProvider} from "@/contexts/CartContext"
import CartDrawer from "@/components/cart/CartDrawer"
import Header from "@/components/layout/Header"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export default async function LocaleLayout({
                                               children,
                                               params
                                           }: {
    children: React.ReactNode
    params: Promise<{locale: string}>
}) {
    const {locale} = await params

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound()
    }

    // Providing all messages to the client side
    const messages = await getMessages()

    return (
        <html lang={locale} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
            <CartProvider>
                <Header/>
                {children}
                <Footer/>
                <CartDrawer/>
            </CartProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    )
}