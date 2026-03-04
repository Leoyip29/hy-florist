"use client"

/**
 * PayMe Checkout Integration — checkout wrapper changes only.
 *
 * Changes from the original checkout.tsx:
 *  1. Added 'payme' as a selectable payment method card
 *  2. When PayMe is selected, handleProceedToPayment calls
 *     /api/orders/payme/create/ instead of the Stripe endpoint
 *  3. On success, renders <PayMePaymentPage> instead of Stripe <Elements>
 *
 * Everything else (Stripe card, AliPay, WeChat Pay) is unchanged.
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js"
import { useCart } from "@/contexts/CartContext"
import Image from "next/image"
import { Playfair_Display } from "next/font/google"
import { Loader2, CheckCircle, X, AlertCircle, CreditCard, ExternalLink } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import PayMePaymentPage from "./PayMePaymentPage"   // ← new import

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] })
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "")
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

// ─── Helpers (unchanged from original) ───────────────────────────────────────

function DatePicker({ value, onChange }: { value: string; onChange: (date: string) => void }) {
    const t = useTranslations("Checkout")
    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                {t("deliveryDate")} <span className="text-red-600">*</span>
            </label>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
            />
            <p className="text-xs text-neutral-500 mt-1">{t("datePicker.minDaysNotice", { days: 3 })}</p>
        </div>
    )
}

function ErrorAlert({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1"><p className="text-sm text-red-800">{message}</p></div>
            <button onClick={onClose} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
    )
}

// ─── Payment Method Selector ──────────────────────────────────────────────────

type PaymentMethodId = "stripe" | "payme"

interface MethodCard {
    id: PaymentMethodId
    icon: string
    labelZh: string
    labelEn: string
    descZh: string
    descEn: string
    accent: string
}

const PAYMENT_METHODS: MethodCard[] = [
    {
        id: "stripe",
        icon: "💳",
        labelZh: "信用卡 / AliPay / WeChat Pay",
        labelEn: "Card / AliPay / WeChat Pay",
        descZh: "Visa、Mastercard、Apple Pay、Google Pay、AliPay、WeChat Pay",
        descEn: "Visa, Mastercard, Apple Pay, Google Pay, AliPay, WeChat Pay",
        accent: "border-neutral-300",
    },
    {
        id: "payme",
        icon: "📱",
        labelZh: "PayMe by HSBC",
        labelEn: "PayMe by HSBC",
        descZh: "掃描 QR Code 或點擊連結，金額自動填入",
        descEn: "Scan QR code or tap link — amount pre-filled",
        accent: "border-[#E60028]",
    },
]

function PaymentMethodSelector({
                                   selected,
                                   onChange,
                               }: {
    selected: PaymentMethodId
    onChange: (id: PaymentMethodId) => void
}) {
    const locale = useLocale()
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                {locale === "en" ? "Payment Method" : "選擇付款方式"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => (
                    <button
                        key={m.id}
                        type="button"
                        onClick={() => onChange(m.id)}
                        className={`text-left border-2 rounded-xl p-4 transition-all ${
                            selected === m.id
                                ? `${m.accent} bg-red-50/30 ring-2 ring-offset-1 ${
                                    m.id === "payme" ? "ring-[#E60028]" : "ring-neutral-900"
                                }`
                                : "border-neutral-200 hover:border-neutral-300"
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{m.icon}</span>
                            <span className="font-semibold text-sm">
                                {locale === "en" ? m.labelEn : m.labelZh}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                            {locale === "en" ? m.descEn : m.descZh}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    )
}

// ─── Stripe CheckoutForm (unchanged from original) ────────────────────────────

function CheckoutForm({
                          clientSecret,
                          initialFormData,
                          expectedAmount,
                          conversionDetails,
                      }: {
    clientSecret: string
    initialFormData: any
    expectedAmount: number
    conversionDetails: { amountHKD: number; amountUSD: number; exchangeRate: number }
}) {
    const t = useTranslations("Checkout")
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const { items } = useCart()
    const locale = useLocale()
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [selectedRedirectMethod, setSelectedRedirectMethod] = useState<"alipay" | "wechat_pay" | null>(null)

    useEffect(() => {
        if (!elements) return
        const paymentElement = elements.getElement("payment")
        if (!paymentElement) return
        const handleChange = (event: any) => {
            const value = event?.value?.type as string | undefined
            if (value === "alipay") setSelectedRedirectMethod("alipay")
            else if (value === "wechat_pay") setSelectedRedirectMethod("wechat_pay")
            else setSelectedRedirectMethod(null)
        }
        paymentElement.on("change", handleChange)
        return () => { paymentElement.off("change", handleChange) }
    }, [elements])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return
        setIsProcessing(true)
        setErrorMessage("")
        try {
            sessionStorage.setItem("pending_order_data", JSON.stringify({
                ...initialFormData,
                items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
            }))
            const returnUrl = `${window.location.origin}/${locale}/checkout/return`
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: { return_url: returnUrl },
                redirect: "if_required",
            })
            if (error) {
                sessionStorage.removeItem("pending_order_data")
                setErrorMessage(error.message || t("errors.paymentFailed"))
                setIsProcessing(false)
                return
            }
            if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
                router.push(`${returnUrl}?payment_intent_client_secret=${clientSecret}`)
            }
        } catch (error) {
            sessionStorage.removeItem("pending_order_data")
            setErrorMessage(t("errors.paymentProcessFailed"))
            setIsProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && <ErrorAlert message={errorMessage} onClose={() => setErrorMessage("")} />}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>{t("customerInfo")}</h2>
                <div className="space-y-2 text-sm">
                    <div className="flex"><span className="text-neutral-600 w-20">{t("name")}:</span><span className="font-medium">{initialFormData.customer_name}</span></div>
                    <div className="flex"><span className="text-neutral-600 w-20">{t("email")}:</span><span className="font-medium">{initialFormData.customer_email}</span></div>
                    <div className="flex"><span className="text-neutral-600 w-20">{t("phone")}:</span><span className="font-medium">{initialFormData.customer_phone}</span></div>
                </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2"><span className="text-xl">💱</span>{locale === "en" ? "Payment Information" : "付款資訊"}</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between bg-white bg-opacity-50 p-2 rounded">
                        <span className="text-blue-800">{locale === "en" ? "Amount in HKD:" : "港幣金額:"}</span>
                        <span className="font-bold text-blue-900">HK${conversionDetails.amountHKD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between bg-white bg-opacity-50 p-2 rounded">
                        <span className="text-blue-800">{locale === "en" ? "Payment Amount (USD):" : "實際付款 (美元):"}</span>
                        <span className="font-bold text-blue-900">US${conversionDetails.amountUSD.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>{locale === "en" ? "Card / Wallet Details" : "卡片 / 電子錢包資料"}</h2>
                <PaymentElement options={{ layout: "tabs" }} />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800">{t("securityNotice")}</p>
                </div>
            </div>
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-neutral-900 text-white py-4 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />{t("processing")}</>
                ) : selectedRedirectMethod ? (
                    <><ExternalLink className="w-5 h-5" />{t("confirmPayment", { amount: conversionDetails.amountUSD.toFixed(2) }).replace("HK$", "US$")}</>
                ) : (
                    <><CreditCard className="w-5 h-5" />{t("confirmPayment", { amount: conversionDetails.amountUSD.toFixed(2) }).replace("HK$", "US$")}</>
                )}
            </button>
        </form>
    )
}

// ─── Main Checkout Component ──────────────────────────────────────────────────

export default function CheckoutWrapper() {
    const t = useTranslations("Checkout")
    const { items, totalPrice, isLoading } = useCart()
    const router = useRouter()
    const locale = useLocale()

    // Which top-level payment method is selected
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("stripe")

    // Stripe flow state
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const [clientSecret, setClientSecret] = useState("")
    const [conversionDetails, setConversionDetails] = useState<any>(null)

    // PayMe flow state
    const [paymeData, setPaymeData] = useState<{
        orderNumber: string
        paymeLink: string
        qrUrl: string
        amountHkd: number
        memo: string
    } | null>(null)

    const [errorMessage, setErrorMessage] = useState("")
    const [isPreparingPayment, setIsPreparingPayment] = useState(false)

    const [formData, setFormData] = useState({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        delivery_address: "",
        delivery_date: "",
        delivery_notes: "",
    })

    useEffect(() => {
        // Only redirect to products if cart is empty AND we're not already showing
        // the PayMe payment page or the Stripe payment form.
        // Without this guard, clearing the cart (or having an empty cart) would
        // incorrectly redirect away from an active payment screen.
        if (!isLoading && items.length === 0 && !paymeData && !showPaymentForm) {
            router.push(`/${locale}/products`)
        }
    }, [items.length, router, isLoading, locale, paymeData, showPaymentForm])

    if (isLoading) {
        return (
            <main className="min-h-screen bg-neutral-50 py-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
            </main>
        )
    }
    if (items.length === 0) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // ── Shared validation ──────────────────────────────────────────────────────
    const validateForm = () => {
        if (formData.customer_name.length < 2) throw new Error(t("validation.nameRequired"))
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) throw new Error(t("validation.emailRequired"))
        if (formData.customer_phone.length < 8) throw new Error(t("validation.phoneRequired"))
        if (formData.delivery_address.length < 10) throw new Error(t("validation.addressRequired"))
        if (!formData.delivery_date) throw new Error(t("validation.dateRequired"))
    }

    // ── Proceed handler ────────────────────────────────────────────────────────
    const handleProceedToPayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPreparingPayment(true)
        setErrorMessage("")

        try {
            validateForm()

            const orderData = {
                ...formData,
                payment_method: paymentMethod === "payme" ? "payme" : "card_pay",
                language: locale,
                items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
            }

            if (paymentMethod === "payme") {
                // ── PayMe flow: create pending order, get smart link ─────────
                const res = await fetch(`${API_BASE_URL}/api/orders/payme/create/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                })
                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || t("errors.createPaymentFailed"))
                }
                const data = await res.json()
                setPaymeData({
                    orderNumber: data.order_number,
                    paymeLink: data.payme_link,
                    qrUrl: data.qr_url,
                    amountHkd: data.amount_hkd,
                    memo: data.memo,
                })
                // NOTE: cart is cleared in PayMePaymentPage AFTER admin confirms payment,
                // NOT here — clearing here causes items.length=0 which triggers the
                // redirect-to-products useEffect before the PayMe page can render.
                window.scrollTo({ top: 0, behavior: "smooth" })

            } else {
                // ── Stripe flow: create payment intent (original behaviour) ──
                const res = await fetch(`${API_BASE_URL}/api/orders/create-payment-intent/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                })
                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || t("errors.createPaymentFailed"))
                }
                const data = await res.json()
                setClientSecret(data.clientSecret)
                setConversionDetails(data.conversionDetails)
                setShowPaymentForm(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
            }

        } catch (error: any) {
            setErrorMessage(error.message || t("errors.networkError"))
        } finally {
            setIsPreparingPayment(false)
        }
    }

    // ── PayMe page ─────────────────────────────────────────────────────────────
    if (paymeData) {
        return (
            <PayMePaymentPage
                orderNumber={paymeData.orderNumber}
                paymeLink={paymeData.paymeLink}
                qrUrl={paymeData.qrUrl}
                amountHkd={paymeData.amountHkd}
                memo={paymeData.memo}
                customerEmail={formData.customer_email}
            />
        )
    }

    return (
        <main className="min-h-screen bg-neutral-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h1 className={`${playfair.className} text-4xl font-light mb-8`}>{t("title")}</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {!showPaymentForm ? (
                            <form onSubmit={handleProceedToPayment} className="space-y-6">
                                {errorMessage && <ErrorAlert message={errorMessage} onClose={() => setErrorMessage("")} />}

                                {/* Customer Info */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>{t("customerInfo")}</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("name")} <span className="text-red-600">*</span></label>
                                            <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required minLength={2}
                                                   className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
                                                   placeholder={t("placeholders.name")} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("email")} <span className="text-red-600">*</span></label>
                                            <input type="email" name="customer_email" value={formData.customer_email} onChange={handleChange} required
                                                   className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
                                                   placeholder={t("placeholders.email")} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("phone")} <span className="text-red-600">*</span></label>
                                            <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleChange} required minLength={8}
                                                   className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
                                                   placeholder={t("placeholders.phone")} />
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>{t("deliveryInfo")}</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("deliveryAddress")} <span className="text-red-600">*</span></label>
                                            <textarea name="delivery_address" value={formData.delivery_address} onChange={handleChange} required minLength={10} rows={3}
                                                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 resize-none"
                                                      placeholder={t("placeholders.address")} />
                                        </div>
                                        <DatePicker value={formData.delivery_date} onChange={(date) => setFormData({ ...formData, delivery_date: date })} />
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("notes")} ({t("optional")})</label>
                                            <textarea name="delivery_notes" value={formData.delivery_notes} onChange={handleChange} maxLength={500} rows={2}
                                                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 resize-none"
                                                      placeholder={t("placeholders.notes")} />
                                        </div>
                                    </div>
                                </div>

                                {/* ── NEW: Payment Method Selector ── */}
                                <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />

                                {/* PayMe notice */}
                                {paymentMethod === "payme" && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                        <span className="text-2xl">📱</span>
                                        <div>
                                            <p className="text-sm font-semibold text-red-900">PayMe — 確認後顯示 QR Code</p>
                                            <p className="text-xs text-red-700 mt-1">
                                                點擊「前往付款」後，系統將顯示專屬 PayMe 連結及 QR Code。
                                                金額及訂單編號將自動填入，您只需在 PayMe 按「Send」即可。
                                            </p>
                                            <p className="text-xs text-red-600 mt-1">
                                                After clicking "Proceed", you'll see a personalised QR code with the exact amount pre-filled.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <button type="submit" disabled={isPreparingPayment}
                                        className="w-full bg-neutral-900 text-white py-4 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2">
                                    {isPreparingPayment ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" />{t("preparing")}</>
                                    ) : (
                                        t("proceedToPayment")
                                    )}
                                </button>
                            </form>
                        ) : (
                            clientSecret && conversionDetails && (
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        clientSecret,
                                        appearance: { theme: "stripe", variables: { colorPrimary: "#1a1a1a" } },
                                    }}
                                >
                                    <CheckoutForm
                                        clientSecret={clientSecret}
                                        initialFormData={formData}
                                        expectedAmount={totalPrice}
                                        conversionDetails={conversionDetails}
                                    />
                                </Elements>
                            )
                        )}
                    </div>

                    {/* Order Summary (unchanged) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 sticky top-8">
                            <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>{t("orderSummary")}</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-sm text-neutral-600">{t("quantity")}: {item.quantity}</p>
                                            <p className="text-sm font-medium">HK${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-600">{t("subtotal")}</span>
                                    <span>HK${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-600">{t("deliveryFee")}</span>
                                    <span className="text-green-600">{t("free")}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                    <span>{t("total")}</span>
                                    <span>HK${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}