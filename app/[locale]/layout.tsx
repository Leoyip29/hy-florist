import {NextIntlClientProvider} from 'next-intl'
import {getMessages, getTranslations} from 'next-intl/server'
import {notFound} from 'next/navigation'
import {routing} from '@/i18n/routing'
import {Geist, Geist_Mono} from "next/font/google"
import Footer from "@/components/layout/Footer"
import {CartProvider} from "@/contexts/CartContext"
import CartDrawer from "@/components/cart/CartDrawer"
import Header from "@/components/layout/Header"
import type { Metadata } from "next"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Home' })
  
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

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
        <NextIntlClientProvider messages={messages}>
            <CartProvider>
                <Header/>
                {children}
                <Footer/>
                <CartDrawer/>
            </CartProvider>
        </NextIntlClientProvider>
    )
}