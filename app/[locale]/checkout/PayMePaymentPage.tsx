"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, Clock, Copy, ExternalLink, RefreshCw } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useCart } from "@/contexts/CartContext"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"
const POLL_INTERVAL_MS = 30_000

interface PayMePageProps {
    orderNumber: string
    paymeLink: string
    qrUrl: string
    amountHkd: number
    memo: string
    customerEmail: string
}

export default function PayMePaymentPage({
                                             orderNumber,
                                             paymeLink,
                                             qrUrl,
                                             amountHkd,
                                             memo,
                                             customerEmail,
                                         }: PayMePageProps) {
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations("PayMe")
    const { clearCart } = useCart()

    const [copied, setCopied] = useState(false)
    const [pollCount, setPollCount] = useState(0)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isPolling, setIsPolling] = useState(true)

    // ─── Poll backend for payment confirmation ────────────────────────────────
    const checkPaymentStatus = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/orders/payme/status/${orderNumber}/`)
            if (!res.ok) return
            const data = await res.json()
            if (data.payment_status === "paid") {
                setIsConfirmed(true)
                setIsPolling(false)
                clearCart() // ✓ safe to clear here — PayMe page is already rendered,
                            //   so items.length=0 won't trigger the checkout redirect guard
                setTimeout(() => {
                    router.push(
                        `/${locale}/order-confirmation?order_number=${orderNumber}&email=${encodeURIComponent(customerEmail)}`
                    )
                }, 2000)
            }
        } catch (err) {
            console.warn("PayMe status poll error:", err)
        }
    }, [orderNumber, customerEmail, router, locale])

    useEffect(() => {
        if (!isPolling) return
        checkPaymentStatus()
        const interval = setInterval(() => {
            setPollCount((c) => c + 1)
            checkPaymentStatus()
        }, POLL_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [checkPaymentStatus, isPolling])

    // ─── Copy memo to clipboard ───────────────────────────────────────────────
    const handleCopyMemo = async () => {
        try {
            await navigator.clipboard.writeText(memo)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch { /* fallback */ }
    }

    // ─── Steps data from translations ────────────────────────────────────────
    const steps = t.raw("steps") as Array<{ zh: string; en: string }>

    // ─── Confirmed state ──────────────────────────────────────────────────────
    if (isConfirmed) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-green-600 mb-2">{t("confirmedTitle")}</h2>
                    <p className="text-neutral-600 mb-2">{t("confirmedSubtitle")}</p>
                    <p className="text-sm text-neutral-500">{t("confirmedRedirect")}</p>
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mt-4 text-neutral-400" />
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-neutral-50 py-10 px-4">
            <div className="max-w-md mx-auto space-y-6">

                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-3">
                        <span className="text-red-600 font-bold text-sm">{t("badge")}</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-neutral-900">{t("pageTitle")}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t("pageSubtitle")}</p>
                </div>

                {/* Amount & Reference card */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-neutral-500">{t("orderNo")}</span>
                        <span className="font-mono font-semibold text-neutral-900 text-sm">{orderNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-500">{t("amount")}</span>
                        <span className="text-2xl font-bold text-red-600">HK${amountHkd.toFixed(2)}</span>
                    </div>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 text-center">
                    <p className="text-sm font-medium text-neutral-700 mb-1">{t("qrTitle")}</p>
                    <p className="text-xs text-neutral-400 mb-4">{t("qrSubtitle")}</p>
                    <div className="flex justify-center mb-4">
                        <div className="border-4 border-red-100 rounded-xl p-2 inline-block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={qrUrl} alt={t("qrAlt")} width={200} height={200} className="rounded-lg" />
                        </div>
                    </div>
                    <p className="text-xs text-neutral-400">{t("qrCaption")}</p>
                </div>

                {/* Tap-to-pay button */}
                <a
                    href={paymeLink}
                    className="flex items-center justify-center gap-3 w-full bg-[#E60028] hover:bg-red-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors shadow-md"
                >
                    <span className="text-2xl">📱</span>
                    {t("payButton", { amount: amountHkd.toFixed(2) })}
                    <ExternalLink className="w-5 h-5 opacity-70" />
                </a>
                <p className="text-center text-xs text-neutral-400">
                    {t("payButtonHint")}
                    <br />
                    <span className="text-neutral-300">{t("payButtonHintEn")}</span>
                </p>

                {/* Memo — amber warning box */}
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
                    <p className="text-xs font-semibold text-amber-900 mb-1">{t("memoTitle")}</p>
                    <p className="text-xs text-amber-700 mb-2">{t("memoSubtitle")}</p>
                    <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-200">
                        <span className="font-mono text-sm font-bold text-neutral-900">{memo}</span>
                        <button
                            onClick={handleCopyMemo}
                            className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 transition-colors ml-2 flex-shrink-0"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            {copied ? t("memoCopied") : t("memoCopy")}
                        </button>
                    </div>
                    <p className="text-xs text-amber-600 mt-2">{t("memoCaption")}</p>
                </div>

                {/* Polling status */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">{t("waitingTitle")}</p>
                            <p className="text-xs text-blue-700 mt-1">
                                {t("waitingDesc")}
                                <span className="font-medium"> {customerEmail}</span>
                            </p>
                            <p className="text-xs text-blue-600 mt-2">
                                {t("waitingPoll")}
                                {pollCount > 0 && t("waitingPollCount", { count: pollCount })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Manual refresh */}
                <button
                    onClick={() => { checkPaymentStatus(); setPollCount(c => c + 1) }}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-neutral-300 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    {t("refreshButton")}
                </button>

                {/* Steps */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                    <p className="text-sm font-semibold text-neutral-800 mb-3">{t("stepsTitle")}</p>
                    <ol className="space-y-3 text-sm text-neutral-600">
                        {steps.map((step, i) => (
                            <li key={i} className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {i + 1}
                                </span>
                                <div>
                                    <span>{locale === "en" ? step.en : step.zh}</span>
                                    <br />
                                    <span className="text-neutral-400 text-xs">
                                        {locale === "en" ? step.zh : step.en}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

            </div>
        </main>
    )
}