import './globals.css'
import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer"

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

const lato = Lato({ 
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-lato',
})

export const metadata: Metadata = {
  title: 'Hyacinth Florist | 風信子花店',
  description: '風信子花店',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans`}>
        <Header />
        {children}
        <Footer />
        </body>
        
    </html>
  )
}
