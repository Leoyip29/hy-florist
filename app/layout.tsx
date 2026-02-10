import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import "./globals.css"

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
    description: "專業花藝設計,為生活的每一刻增添美麗與溫度",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return children
}