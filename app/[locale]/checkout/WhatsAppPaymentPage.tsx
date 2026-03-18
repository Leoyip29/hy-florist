"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle, ExternalLink, ArrowLeft, ShoppingBag, CheckCircle } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useCart } from "@/contexts/CartContext"

interface WhatsAppPageProps {
    orderNumber: string
    whatsappLink: string
    amountHkd: number
}

export default function WhatsAppPaymentPage({
    orderNumber,
    whatsappLink,
    amountHkd,
}: WhatsAppPageProps) {
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations("WhatsApp")
    const { clearCart } = useCart()
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [countdown, setCountdown] = useState(3)

    // Auto-redirect to WhatsApp after countdown
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setIsRedirecting(true)
            window.location.href = whatsappLink
        }
    }, [countdown, whatsappLink])

    // Clear cart when user leaves (they've committed to order via WhatsApp)
    const handleGoBack = () => {
        clearCart()
        router.push(`/${locale}/products`)
    }

    return (
        <main className="min-h-screen bg-neutral-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                    {/* Header with WhatsApp green */}
                    <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-8 text-white text-center">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                        <h1 className={`text-2xl font-semibold mb-2`}>
                            {locale === "en" ? "Order via WhatsApp" : "WhatsApp 訂購"}
                        </h1>
                        <p className="text-white/80 text-sm">
                            {locale === "en" 
                                ? "Redirecting to WhatsApp to confirm your order..." 
                                : "正在引導您到 WhatsApp 確認訂單..."}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Countdown / Redirect */}
                        <div className="text-center py-4">
                            {isRedirecting ? (
                                <div className="flex flex-col items-center gap-2">
                                    <ExternalLink className="w-8 h-8 text-[#25D366] animate-pulse" />
                                    <p className="text-sm text-neutral-600">
                                        {locale === "en" 
                                            ? "Opening WhatsApp..." 
                                            : "正在開啟 WhatsApp..."}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-4xl font-bold text-[#25D366]">{countdown}</div>
                                    <p className="text-sm text-neutral-500">
                                        {locale === "en" 
                                            ? "Redirecting in a moment..." 
                                            : "即將重新導向..."}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">
                                    {locale === "en" ? "Order Number:" : "訂單編號:"}
                                </span>
                                <span className="font-medium">{orderNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">
                                    {locale === "en" ? "Order Amount:" : "訂單金額:"}
                                </span>
                                <span className="font-bold text-[#25D366]">HK${amountHkd.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Manual redirect button */}
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-4 rounded-xl font-medium hover:bg-[#128C7E] transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            {locale === "en" ? "Open WhatsApp Now" : "立即開啟 WhatsApp"}
                            <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Help text */}
                        <div className="text-center text-sm text-neutral-500 space-y-1">
                            <p>
                                {locale === "en"
                                    ? "Our staff will confirm your order and provide payment instructions."
                                    : "我們的工作人員將確認您的訂單並提供付款指示。"}
                            </p>
                            <p>
                                {locale === "en"
                                    ? "Please have your order number ready."
                                    : "請準備好您的訂單編號。"}
                            </p>
                        </div>

                        {/* Go back button */}
                        <button
                            onClick={handleGoBack}
                            className="flex items-center justify-center gap-2 w-full py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {locale === "en" ? "Go Back to Shop" : "返回商店"}
                        </button>
                    </div>
                </div>

                {/* Note */}
                <p className="text-center text-xs text-neutral-400 mt-6">
                    {locale === "en"
                        ? "After sending the message via WhatsApp, your order will be processed once payment is confirmed."
                        : "透過 WhatsApp 發送訊息後，您的訂單將在確認付款後處理。"}
                </p>
            </div>
        </main>
    )
}
