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
    title: "Hyacinth Florist  - 香港帛事花店",
    description: "專業帛事花藝設計，為殯儀及祭祀場合送上真摯的慰問與敬意",
    icons: {
        icon: "/logo.svg",
        shortcut: "/logo.svg",
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return children
}