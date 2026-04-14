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
    metadataBase: new URL("https://hy-florist.hk"),
    title: "風信子花店 - 香港帛事花店",
    description: "專業帛事花藝設計。提供帛事花牌、花籃、花圈、慰問花束及各式祭奠花藝。用心意與專業，為每一個珍重時刻送上真摯的祝福。",
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
    openGraph: {
        title: "風信子花店 - 香港帛事花店",
        description: "專業帛事花藝設計。提供帛事花牌、花籃、花圈、慰問花束及各式祭奠花藝。",
        images: [
            {
                url: "https://hy-florist.hk/og-image.png",
                width: 1200,
                height: 630,
                alt: "風信子花店 Hyacinth Florist",
            },
        ],
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return children
}