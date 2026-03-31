"use client"

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
import { Loader2, CheckCircle, X, AlertCircle, CreditCard, ExternalLink, MessageCircle } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import PayMePaymentPage from "./PayMePaymentPage"
import WhatsAppPaymentPage from "./WhatsAppPaymentPage"

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] })
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "")
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

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

function MultipleErrorAlert({ messages, onClose }: { messages: string[]; onClose: () => void }) {
    const locale = useLocale()
    if (messages.length === 0) return null
    const title = messages.length === 1
        ? (locale === "en" ? "Please fix the following error:" : "請修正以下錯誤：")
        : (locale === "en" ? `Please fix the following ${messages.length} errors:` : `請修正以下 ${messages.length} 個錯誤：`)
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{title}</p>
                </div>
                <button onClick={onClose} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
            <ul className="ml-8 space-y-1">
                {messages.map((msg, idx) => (
                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{msg}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// ─── Payment Method Selector ──────────────────────────────────────────────────

type PaymentMethodId = "stripe" | "payme" | "whatsapp"

interface MethodCard {
    id: PaymentMethodId
    icon: React.ReactNode
    labelZh: string
    labelEn: string
    descZh: string
    descEn: string
    accent: string
}

const PAYMENT_METHODS: MethodCard[] = [
    // {
    //     id: "stripe",
    //     icon: "💳",
    //     labelZh: "信用卡 / AliPay / WeChat Pay",
    //     labelEn: "Card / AliPay / WeChat Pay",
    //     descZh: "Visa、Mastercard、Apple Pay、Google Pay、AliPay、WeChat Pay",
    //     descEn: "Visa, Mastercard, Apple Pay, Google Pay, AliPay, WeChat Pay",
    //     accent: "border-neutral-300",
    // },
    // {
    //     id: "payme",
    //     icon: "📱",
    //     labelZh: "PayMe by HSBC",
    //     labelEn: "PayMe by HSBC",
    //     descZh: "掃描 QR Code 或點擊連結，金額自動填入",
    //     descEn: "Scan QR code or tap link — amount pre-filled",
    //     accent: "border-[#E60028]",
    // },
    {
        id: "whatsapp",
        icon: <MessageCircle className="w-5 h-5" />,
        labelZh: "WhatsApp 訂購",
        labelEn: "Order via WhatsApp",
        descZh: "透過 WhatsApp 發送訂單資料給我們",
        descEn: "Send order details via WhatsApp",
        accent: "border-[#25D366]",
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
                                ? `${m.accent} ${m.id === "whatsapp" ? "bg-green-50/30" : "bg-red-50/30"} ring-2 ring-offset-1 ${
                                    m.id === "payme" ? "ring-[#E60028]" : m.id === "whatsapp" ? "ring-[#25D366]" : "ring-neutral-900"
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

// ─── Stripe CheckoutForm ──────────────────────────────────────────────────────

function CheckoutForm({
    clientSecret,
    initialFormData,
    expectedAmount,
    conversionDetails,
    totalPrice,
}: {
    clientSecret: string
    initialFormData: any
    expectedAmount: number
    conversionDetails: { amountHKD: number; amountUSD: number; exchangeRate: number } | null
    totalPrice: number
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
                items: items.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    selected_option_id: item.selectedOptionId || null,
                })),
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
            {conversionDetails && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">💱</span>
                        {locale === "en" ? "Payment Information" : "付款資訊"}
                    </h3>
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
            )}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                    {locale === "en" ? "Card / Wallet Details" : "卡片 / 電子錢包資料"}
                </h2>
                <PaymentElement options={{ layout: "tabs", paymentMethodOrder: ["card", "alipay", "wechat_pay"] }} />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800">{t("securityNotice")}</p>
                </div>
            </div>
            {(!stripe || totalPrice < 1000) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-amber-800">{t("minimumOrderNotice")}</p>
                </div>
            )}
            <button
                type="submit"
                disabled={!stripe || isProcessing || totalPrice < 1000}
                className="w-full bg-neutral-900 text-white py-4 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />{t("processing")}</>
                ) : selectedRedirectMethod ? (
                    <><ExternalLink className="w-5 h-5" />{conversionDetails ? t("confirmPayment", { amount: conversionDetails.amountUSD.toFixed(2) }).replace("HK$", "US$") : t("proceedToPayment")}</>
                ) : (
                    <><CreditCard className="w-5 h-5" />{conversionDetails ? t("confirmPayment", { amount: conversionDetails.amountUSD.toFixed(2) }).replace("HK$", "US$") : t("proceedToPayment")}</>
                )}
            </button>
        </form>
    )
}

// ─── Main Checkout Component ──────────────────────────────────────────────────

// ─── Location dropdowns ─────────────────────────────────────────────────────────

type LocationCategory = "funeral_parlour" | "church"

interface LocationOption {
    id: string
    nameZh: string
    nameEn: string
    category: LocationCategory
}

const LOCATION_OPTIONS: LocationOption[] = [
    // 港島區 — 殯儀館
    { id: "hk-island-hkf", nameZh: "香港殯儀館（北角）", nameEn: "Hong Kong Funeral Parlour (North Point)", category: "funeral_parlour" },

    // 九龍區 — 殯儀館
    { id: "kowloon-world", nameZh: "世界殯儀館", nameEn: "World Funeral Parlour", category: "funeral_parlour" },
    { id: "kowloon-international", nameZh: "萬國殯儀館", nameEn: "International Funeral Parlour", category: "funeral_parlour" },
    { id: "kowloon-cosmos", nameZh: "寰宇殯儀館", nameEn: "Cosmos Funeral Parlour", category: "funeral_parlour" },
    { id: "kowloon-kowloon", nameZh: "九龍殯儀館", nameEn: "Kowloon Funeral Parlour", category: "funeral_parlour" },
    { id: "kowloon-diamond-hill", nameZh: "鑽石山殯儀館", nameEn: "Diamond Hill Funeral Parlour", category: "funeral_parlour" },

    // 新界區 — 殯儀館
    { id: "nt-po-fook", nameZh: "寶福紀念館（大圍）", nameEn: "Po Fook Memorial Hall (Sha Tin)", category: "funeral_parlour" },

    // 九龍區 — 教堂
    { id: "kowloon-st-andrew", nameZh: "聖安德烈堂", nameEn: "St. Andrew's Church", category: "church" },
    { id: "kowloon-st-john", nameZh: "聖公會聖匠堂", nameEn: "St. John's Church", category: "church" },
    { id: "kowloon-shum-ao", nameZh: "中華基督教會深愛堂", nameEn: "Shum Ao Church", category: "church" },

    // 港島區 — 教堂
    { id: "hk-island-wan-chai", nameZh: "灣仔聯合教會國際禮拜堂", nameEn: "Wan Chai United Church International Chapel", category: "church" },
    { id: "hk-island-north-point", nameZh: "北角衛斯理堂", nameEn: "North Point Wesley Church", category: "church" },
    { id: "hk-island-pokfulam", nameZh: "薄扶林上路教堂", nameEn: "Pokfulam Road Church", category: "church" },
    { id: "hk-island-hk-union", nameZh: "香港佑寧堂", nameEn: "Hong Kong Union Church", category: "church" },

    // 將軍澳區 — 教堂
    { id: "tko-haven", nameZh: "靈實禮拜堂", nameEn: "Haven of Hope Chapel", category: "church" },
    { id: "tko-st-john-baptist", nameZh: "施洗聖約翰堂", nameEn: "St. John the Baptist Church", category: "church" },

    // 新界區 — 教堂
    { id: "nt-tuen-mun", nameZh: "屯門神召會神學院", nameEn: "Tuen Mun Christian Academy", category: "church" },
    { id: "nt-jockey-club", nameZh: "賽馬會善寧之家", nameEn: "Jockey Club Tseng's Home", category: "church" },
]

export const LOCATION_GROUPS_ZH: Record<LocationCategory, Record<string, LocationOption[]>> = {
    funeral_parlour: {
        "港島區": LOCATION_OPTIONS.filter(o => o.category === "funeral_parlour" && o.id.startsWith("hk-island")),
        "九龍區": LOCATION_OPTIONS.filter(o => o.category === "funeral_parlour" && o.id.startsWith("kowloon")),
        "新界區": LOCATION_OPTIONS.filter(o => o.category === "funeral_parlour" && o.id.startsWith("nt")),
    },
    church: {
        "九龍區": LOCATION_OPTIONS.filter(o => o.category === "church" && o.id.startsWith("kowloon")),
        "港島區": LOCATION_OPTIONS.filter(o => o.category === "church" && o.id.startsWith("hk-island")),
        "將軍澳區": LOCATION_OPTIONS.filter(o => o.category === "church" && o.id.startsWith("tko")),
        "新界區": LOCATION_OPTIONS.filter(o => o.category === "church" && o.id.startsWith("nt")),
    },
}

export const LOCATION_GROUPS_EN: Record<LocationCategory, Record<string, LocationOption[]>> = {
    funeral_parlour: {
        "Hong Kong Island": LOCATION_OPTIONS.filter(o => o.category === "funeral_parlour" && o.id.startsWith("hk-island")),
        "Kowloon": LOCATION_OPTIONS.filter(o => o.category === "funeral_parlour" && o.id.startsWith("kowloon")),
        "New Territories": LOCATION_OPTIONS.filter(o => o.category === "funeral_parlour" && o.id.startsWith("nt")),
    },
    church: {
        "Kowloon": LOCATION_OPTIONS.filter(o => o.category === "church" && o.id.startsWith("kowloon")),
        "Hong Kong Island": LOCATION_OPTIONS.filter(o => o.category === "church" && o.id.startsWith("hk-island")),
        "Tseung Kwan O": LOCATION_OPTIONS.filter(o => o.category === "church" && o.id.startsWith("tko")),
        "New Territories": LOCATION_OPTIONS.filter(o => o.category === "church" && o.id.startsWith("nt")),
    },
}

export { LOCATION_OPTIONS }
export type { LocationCategory }

export default function CheckoutWrapper() {
    const t = useTranslations("Checkout")
    const { items, totalPrice, deliveryFee, grandTotal, isLoading, hasBoardSet } = useCart()
    const router = useRouter()
    const locale = useLocale()

    // Which top-level payment method is selected
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("whatsapp")

    // Stripe flow state
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const [clientSecret, setClientSecret] = useState("")
    const [conversionDetails, setConversionDetails] = useState<{
        amountHKD: number
        amountUSD: number
        exchangeRate: number
    } | null>(null)

    // PayMe flow state
    const [paymeData, setPaymeData] = useState<{
        orderNumber: string
        paymeLink: string
        qrUrl: string
        amountHkd: number
        memo: string
    } | null>(null)

    // WhatsApp flow state
    const [whatsappData, setWhatsappData] = useState<{
        orderNumber: string
        whatsappLink: string
        amountHkd: number
        customerEmail?: string
        customerPhone?: string
    } | null>(null)

    const [errorMessages, setErrorMessages] = useState<string[]>([])
    const [isPreparingPayment, setIsPreparingPayment] = useState(false)

    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        deceased_name: "",
        delivery_region: "" as LocationCategory | "",
        delivery_district: "",
        delivery_date: "",
        delivery_notes: "",
    })

    useEffect(() => {
        // Only redirect to products if cart is empty AND no active payment page is shown
        if (!isLoading && items.length === 0 && !paymeData && !whatsappData && !showPaymentForm) {
            router.push(`/${locale}/products`)
        }
    }, [items.length, router, isLoading, locale, paymeData, whatsappData, showPaymentForm])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setErrors(prev => ({ ...prev, [name]: "" }))
        setErrorMessages([])
        if (name === "delivery_region") {
            setFormData(prev => ({ ...prev, delivery_region: value as LocationCategory, delivery_district: "" }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        // Basic frontend validation - backend will do full validation
        if (!formData.customer_name.trim()) newErrors.customer_name = t("validation.nameRequired")
        if (!formData.customer_email.trim()) newErrors.customer_email = t("validation.emailRequired")
        if (!formData.customer_phone.trim()) newErrors.customer_phone = t("validation.phoneRequired")
        if (!formData.deceased_name.trim()) newErrors.deceased_name = t("validation.deceasedNameRequired")
        if (!formData.delivery_region) newErrors.delivery_region = t("validation.locationTypeRequired")
        if (!formData.delivery_district) newErrors.delivery_district = t("validation.locationRequired")
        if (!formData.delivery_date) newErrors.delivery_date = t("validation.dateRequired")
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleProceedToPayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPreparingPayment(true)
        setErrorMessages([])

        if (!validateForm()) {
            setIsPreparingPayment(false)
            return
        }

        try {
            const orderData = {
                ...formData,
                payment_method: paymentMethod === "payme" ? "payme" : paymentMethod === "whatsapp" ? "whatsapp" : "card_pay",
                language: locale,
                items: items.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    selected_option_id: item.selectedOptionId || null,
                })),
            }

            // Map backend field names to frontend field names
            const fieldMapping: Record<string, string> = {
                'customer_name': 'customer_name',
                'customer_email': 'customer_email',
                'customer_phone': 'customer_phone',
                'deceased_name': 'deceased_name',
                'delivery_region': 'delivery_region',
                'delivery_district': 'delivery_district',
                'delivery_date': 'delivery_date',
                'delivery_address': 'delivery_address',
            }

            const handleApiError = (err: any): string[] => {
                const allErrors: string[] = []
                // Handle DRF ValidationError with detail: [...] format
                if (err.detail) {
                    const detailMsg = typeof err.detail === 'string'
                        ? err.detail
                        : Array.isArray(err.detail)
                            ? err.detail.map((d: any) => typeof d === 'string' ? d : (d as any)?.message || String(d)).join('; ')
                            : (err.detail as any)?.message || JSON.stringify(err.detail)
                    allErrors.push(detailMsg)
                    return allErrors
                }
                // Handle backend { "error": { "field": ["msg"] } } wrapper
                if (err.error && typeof err.error === 'object') {
                    for (const [field, messages] of Object.entries(err.error)) {
                        const msgs = Array.isArray(messages) ? messages : [messages]
                        for (const msg of msgs) {
                            const str = typeof msg === 'string' ? msg : (msg as any)?.message || JSON.stringify(msg)
                            allErrors.push(str)
                        }
                    }
                    return allErrors.length > 0 ? allErrors : [t("errors.createPaymentFailed")]
                }
                // Handle field-level errors
                if (typeof err === 'object' && !Array.isArray(err)) {
                    const mappedErrors: Record<string, string> = {}

                    for (const [field, messages] of Object.entries(err)) {
                        const msgs = Array.isArray(messages) ? messages : [messages]
                        const strs: string[] = []
                        for (const msg of msgs) {
                            const str = typeof msg === 'string' ? msg : (msg as any)?.message || JSON.stringify(msg)
                            if (str && str.trim()) strs.push(str)
                        }
                        if (strs.length > 0) {
                            const mappedField = fieldMapping[field] || field
                            mappedErrors[mappedField] = strs.join('; ')
                            allErrors.push(...strs)
                        }
                    }

                    if (Object.keys(mappedErrors).length > 0) {
                        setErrors(prev => ({ ...prev, ...mappedErrors }))
                    }
                }
                return allErrors.length > 0 ? allErrors : [t("errors.createPaymentFailed")]
            }

            if (paymentMethod === "payme") {
                const res = await fetch(`${API_BASE_URL}/api/orders/payme/create/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                })
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}))
                    const errors = handleApiError(err)
                    setErrorMessages(errors.length > 0 ? errors : [t("errors.createPaymentFailed")])
                    setIsPreparingPayment(false)
                    return
                }
                const data = await res.json()
                setPaymeData({
                    orderNumber: data.order_number,
                    paymeLink: data.payme_link,
                    qrUrl: data.qr_url,
                    amountHkd: data.amount_hkd,
                    memo: data.memo,
                })
                window.scrollTo({ top: 0, behavior: "smooth" })

            } else if (paymentMethod === "whatsapp") {
                const res = await fetch(`${API_BASE_URL}/api/orders/whatsapp/create/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                })
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}))
                    const errors = handleApiError(err)
                    setErrorMessages(errors.length > 0 ? errors : [t("errors.createPaymentFailed")])
                    setIsPreparingPayment(false)
                    return
                }
                const data = await res.json()
                setWhatsappData({
                    orderNumber: data.order_number,
                    whatsappLink: data.whatsapp_link,
                    amountHkd: data.amount_hkd,
                    customerEmail: formData.customer_email,
                    customerPhone: formData.customer_phone,
                })
                window.scrollTo({ top: 0, behavior: "smooth" })

            } else {
                // Stripe flow
                const res = await fetch(`${API_BASE_URL}/api/orders/create-payment-intent/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                })
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}))
                    const errors = handleApiError(err)
                    setErrorMessages(errors.length > 0 ? errors : [t("errors.createPaymentFailed")])
                    setIsPreparingPayment(false)
                    return
                }
                const data = await res.json()
                setClientSecret(data.clientSecret)
                setConversionDetails(data.conversionDetails)
                setShowPaymentForm(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
            }

        } catch (error: any) {
            setErrorMessages([error.message || t("errors.networkError")])
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

    // ── WhatsApp page ─────────────────────────────────────────────────────────
    if (whatsappData) {
        return (
            <WhatsAppPaymentPage
                orderNumber={whatsappData.orderNumber}
                whatsappLink={whatsappData.whatsappLink}
                amountHkd={whatsappData.amountHkd}
                customerEmail={whatsappData.customerEmail}
                customerPhone={whatsappData.customerPhone}
            />
        )
    }

    return (
        <main className="mt-[150px] min-h-screen bg-neutral-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h1 className={`${playfair.className} text-4xl font-light mb-8`}>{t("title")}</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {!showPaymentForm ? (
                            <form onSubmit={handleProceedToPayment} className="space-y-6">
                                {(errorMessages.length > 0) && <MultipleErrorAlert messages={errorMessages} onClose={() => setErrorMessages([])} />}

                                {/* Customer Info */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>{t("customerInfo")}</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("name")} <span className="text-red-600">*</span></label>
                                            <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} minLength={2}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 ${errors.customer_name ? "border-red-500 focus:ring-red-500" : "border-neutral-300"}`}
                                                placeholder={t("placeholders.name")} />
                                            {errors.customer_name && <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("email")} <span className="text-red-600">*</span></label>
                                            <input type="text" name="customer_email" value={formData.customer_email} onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 ${errors.customer_email ? "border-red-500 focus:ring-red-500" : "border-neutral-300"}`}
                                                placeholder={t("placeholders.email")} />
                                            {errors.customer_email && <p className="mt-1 text-sm text-red-600">{errors.customer_email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("phone")} <span className="text-red-600">*</span></label>
                                            <input type="text" name="customer_phone" value={formData.customer_phone} onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 ${errors.customer_phone ? "border-red-500 focus:ring-red-500" : "border-neutral-300"}`}
                                                placeholder={t("placeholders.phone")} />
                                            {errors.customer_phone && <p className="mt-1 text-sm text-red-600">{errors.customer_phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("deceasedName")} <span className="text-red-600">*</span></label>
                                            <input type="text" name="deceased_name" value={formData.deceased_name} onChange={handleChange} minLength={2}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 ${errors.deceased_name ? "border-red-500 focus:ring-red-500" : "border-neutral-300"}`}
                                                placeholder={t("placeholders.deceasedName")} />
                                            {errors.deceased_name && <p className="mt-1 text-sm text-red-600">{errors.deceased_name}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>{t("deliveryInfo")}</h2>
                                    <div className="space-y-4">
                                        {/* Location Type Dropdown */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                {locale === "en" ? "Location Type" : "地點類別"} <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                name="delivery_region"
                                                value={formData.delivery_region}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 bg-white ${errors.delivery_region ? "border-red-500 focus:ring-red-500" : "border-neutral-300"}`}
                                            >
                                                <option value="">
                                                    {locale === "en" ? "Select Type" : "選擇類別"}
                                                </option>
                                                <option value="funeral_parlour">
                                                    {locale === "en" ? "Funeral Parlour" : "殯儀館"}
                                                </option>
                                                <option value="church">
                                                    {locale === "en" ? "Church / Chapel" : "教堂 / 禮拜堂"}
                                                </option>
                                            </select>
                                            {errors.delivery_region && <p className="mt-1 text-sm text-red-600">{errors.delivery_region}</p>}
                                        </div>

                                        {/* Location Dropdown */}
                                        {formData.delivery_region && (
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    {locale === "en" ? "Location" : "地點"} <span className="text-red-600">*</span>
                                                </label>
                                                <select
                                                    name="delivery_district"
                                                    value={formData.delivery_district}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 bg-white ${errors.delivery_district ? "border-red-500 focus:ring-red-500" : "border-neutral-300"}`}
                                                >
                                                    <option value="">
                                                        {locale === "en" ? "Select location" : "選擇地點"}
                                                    </option>
                                                    {LOCATION_OPTIONS
                                                        .filter(o => o.category === formData.delivery_region)
                                                        .map((opt) => (
                                                            <option key={opt.id} value={opt.id}>
                                                                {locale === "en" ? opt.nameEn : opt.nameZh}
                                                            </option>
                                                        ))}
                                                </select>
                                                {errors.delivery_district && <p className="mt-1 text-sm text-red-600">{errors.delivery_district}</p>}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                {t("deliveryDate")} <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.delivery_date}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, delivery_date: e.target.value })
                                                    setErrors(prev => ({ ...prev, delivery_date: "" }))
                                                }}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neutral-900 ${errors.delivery_date ? "border-red-500 focus:ring-red-500" : "border-neutral-300"}`}
                                            />
                                            <p className="text-xs text-neutral-500 mt-1">{t("datePicker.minDaysNotice", { days: 3 })}</p>
                                            {errors.delivery_date && <p className="mt-1 text-sm text-red-600">{errors.delivery_date}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("notes")} ({t("optional")})</label>
                                            <textarea name="delivery_notes" value={formData.delivery_notes} onChange={handleChange} maxLength={500} rows={2}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 resize-none"
                                                placeholder={t("placeholders.notes")} />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Selector */}
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
                                                After clicking &quot;Proceed&quot;, you&apos;ll see a personalised QR code with the exact amount pre-filled.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* WhatsApp notice */}
                                {paymentMethod === "whatsapp" && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                                        <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-sm font-semibold text-green-900">WhatsApp 訂購</p>
                                            <p className="text-xs text-green-700 mt-1">
                                                點擊「前往付款」後，系統將引導您透過 WhatsApp 聯繫我們完成訂單。
                                                我們會確認訂單詳情並提供付款指示。
                                            </p>
                                            <p className="text-xs text-green-600 mt-1">
                                                After clicking &quot;Proceed&quot;, you&apos;ll be redirected to WhatsApp to confirm your order and receive payment instructions.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {totalPrice < 1000 && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-amber-800">{t("minimumOrderNotice")}</p>
                                    </div>
                                )}

                                <button type="submit" disabled={isPreparingPayment || totalPrice < 1000}
                                    className="w-full bg-neutral-900 text-white py-4 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2">
                                    {isPreparingPayment ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" />{t("preparing")}</>
                                    ) : (
                                        t("proceedToPayment")
                                    )}
                                </button>

                                {(errorMessages.length > 0) && <MultipleErrorAlert messages={errorMessages} onClose={() => setErrorMessages([])} />}
                            </form>
                        ) : (
                            clientSecret && (
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
                                        totalPrice={totalPrice}
                                    />
                                </Elements>
                            )
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 sticky top-8">
                            <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>{t("orderSummary")}</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.selectedOptionId ?? 0}`} className="flex gap-3">
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            {item.selectedOptionName && (
                                                <p className="text-xs text-neutral-500">{item.selectedOptionName}</p>
                                            )}
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
                                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                                        {deliveryFee === 0 ? t("free") : `HK$${deliveryFee.toFixed(2)}`}
                                    </span>
                                </div>
                                {hasBoardSet && deliveryFee === 0 && (
                                    <p className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded text-center">
                                        花牌套餐包含免費送貨 / Board Set Free Delivery
                                    </p>
                                )}
                                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                    <span>{t("total")}</span>
                                    <span>HK${grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}