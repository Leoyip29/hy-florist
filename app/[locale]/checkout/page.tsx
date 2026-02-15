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
import { Loader2, CheckCircle, X, AlertCircle, Calendar, CreditCard, ExternalLink } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
})

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
                min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
            />
            <p className="text-xs text-neutral-500 mt-1">
                {t("datePicker.minDaysNotice", { days: 3 })}
            </p>
        </div>
    )
}

function ErrorAlert({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="text-sm text-red-800">{message}</p>
            </div>
            <button onClick={onClose} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

/**
 * Redirect Payment Notice
 *
 * Shown when the user selects AliPay or WeChat Pay.
 * Both are redirect-based: Stripe will navigate the user to the external
 * payment page, then redirect back to our /checkout/return page.
 */
function RedirectPaymentNotice({ paymentType }: { paymentType: 'alipay' | 'wechat_pay' | null }) {
    const locale = useLocale()

    if (!paymentType) return null

    const config = {
        alipay: {
            icon: '🟡',
            name: 'AliPay',
            description: locale === 'en'
                ? 'You will be redirected to the AliPay page to complete payment. After payment, you will be automatically returned to confirm your order.'
                : '您將被導向至 AliPay 頁面完成付款，付款後將自動返回本站確認訂單。',
            color: 'from-amber-50 to-yellow-50',
            border: 'border-amber-200',
            text: 'text-amber-900',
            subtext: 'text-amber-700',
            redirectText: locale === 'en'
                ? 'Will redirect to external page after clicking "Confirm Payment"'
                : '點擊「確認付款」後將跳轉至外部頁面'
        },
        wechat_pay: {
            icon: '💚',
            name: 'WeChat Pay',
            description: locale === 'en'
                ? 'You will be redirected to the WeChat Pay page to complete payment. After payment, you will be automatically returned to confirm your order. Please ensure WeChat is installed on your device.'
                : '您將被導向至 WeChat Pay 頁面完成付款，付款後將自動返回本站確認訂單。請確保您的裝置已安裝微信 (WeChat)。',
            color: 'from-green-50 to-emerald-50',
            border: 'border-green-200',
            text: 'text-green-900',
            subtext: 'text-green-700',
            redirectText: locale === 'en'
                ? 'Will redirect to external page after clicking "Confirm Payment"'
                : '點擊「確認付款」後將跳轉至外部頁面'
        },
    }

    const c = config[paymentType]

    return (
        <div className={`bg-gradient-to-r ${c.color} border ${c.border} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{c.icon}</span>
                <div>
                    <p className={`text-sm font-semibold ${c.text} mb-1`}>
                        {locale === 'en' ? `Pay with ${c.name}` : `使用 ${c.name} 付款`}
                    </p>
                    <p className={`text-xs ${c.subtext} leading-relaxed`}>
                        {c.description}
                    </p>
                    <div className={`flex items-center gap-1 mt-2 text-xs ${c.subtext}`}>
                        <ExternalLink className="w-3 h-3" />
                        <span>{c.redirectText}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Payment Form Component
function CheckoutForm({
                          clientSecret,
                          initialFormData,
                          expectedAmount,
                          conversionDetails,
                      }: {
    clientSecret: string
    initialFormData: any
    expectedAmount: number
    conversionDetails: {
        amountHKD: number
        amountUSD: number
        exchangeRate: number
    }
}) {
    const t = useTranslations("Checkout")
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const { items } = useCart()
    const locale = useLocale()
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    /**
     * Detect redirect-based payment method from the PaymentElement.
     *
     * Stripe's PaymentElement doesn't expose the selected method directly,
     * but we can read it from the elements instance after submit.
     * We show the notice based on what Stripe reports in the error/result.
     *
     * For the notice shown BEFORE submit, we use a lightweight onChange listener.
     */
    const [selectedRedirectMethod, setSelectedRedirectMethod] = useState<'alipay' | 'wechat_pay' | null>(null)

    // Listen for PaymentElement changes to detect redirect methods
    useEffect(() => {
        if (!elements) return

        const paymentElement = elements.getElement('payment')
        if (!paymentElement) return

        const handleChange = (event: any) => {
            const value = event?.value?.type as string | undefined
            if (value === 'alipay') {
                setSelectedRedirectMethod('alipay')
            } else if (value === 'wechat_pay') {
                setSelectedRedirectMethod('wechat_pay')
            } else {
                setSelectedRedirectMethod(null)
            }
        }

        paymentElement.on('change', handleChange)
        return () => {
            paymentElement.off('change', handleChange)
        }
    }, [elements])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setIsProcessing(true)
        setErrorMessage("")

        try {
            /**
             * Save order data to sessionStorage BEFORE redirecting.
             *
             * For redirect-based methods (AliPay, WeChat Pay), Stripe will
             * navigate the user away from the site. When they return via the
             * return_url, the checkout/return page reads this data from
             * sessionStorage to confirm the order with our backend.
             *
             * Note: sessionStorage persists within the same browser tab session,
             * so it survives same-tab redirects. For WeChat Pay on mobile, the
             * user may switch apps, but the browser tab remains, so sessionStorage
             * is preserved on return.
             */
            sessionStorage.setItem('pending_order_data', JSON.stringify({
                ...initialFormData,
                items: items.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            }))

            const returnUrl = `${window.location.origin}/${locale}/checkout/return`

            /**
             * confirmPayment with redirect: "if_required"
             *
             * - For cards / Apple Pay / Google Pay: completes inline, no redirect.
             * - For AliPay: redirects to AliPay web page, returns via return_url.
             * - For WeChat Pay: redirects to WeChat QR page (desktop) or WeChat
             *   app (mobile), returns via return_url after completion.
             *
             * In all cases, Stripe handles the redirect logic automatically.
             */
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: { return_url: returnUrl },
                redirect: "if_required",
            })

            if (error) {
                // Payment failed or was cancelled
                sessionStorage.removeItem('pending_order_data')
                setErrorMessage(error.message || t("errors.paymentFailed"))
                setIsProcessing(false)
                return
            }

            if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
                // Non-redirect payment succeeded inline — go to return page to confirm order
                router.push(`${returnUrl}?payment_intent_client_secret=${clientSecret}`)
            }
            // If redirect happened, browser navigates away automatically — no code runs here

        } catch (error) {
            console.error("Payment error:", error)
            sessionStorage.removeItem('pending_order_data')
            setErrorMessage(t("errors.paymentProcessFailed"))
            setIsProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && <ErrorAlert message={errorMessage} onClose={() => setErrorMessage("")} />}

            {/* Customer Info Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                    {t("customerInfo")}
                </h2>
                <div className="space-y-2 text-sm">
                    <div className="flex">
                        <span className="text-neutral-600 w-20">{t("name")}:</span>
                        <span className="font-medium">{initialFormData.customer_name}</span>
                    </div>
                    <div className="flex">
                        <span className="text-neutral-600 w-20">{t("email")}:</span>
                        <span className="font-medium">{initialFormData.customer_email}</span>
                    </div>
                    <div className="flex">
                        <span className="text-neutral-600 w-20">{t("phone")}:</span>
                        <span className="font-medium">{initialFormData.customer_phone}</span>
                    </div>
                    <div className="flex">
                        <span className="text-neutral-600 w-20">{t("deliveryAddress")}:</span>
                        <span className="font-medium">{initialFormData.delivery_address}</span>
                    </div>
                </div>
            </div>

            {/* Currency Conversion Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">💱</span>
                    {locale === 'en' ? 'Payment Information' : '付款資訊'}
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between bg-white bg-opacity-50 p-2 rounded">
                        <span className="text-blue-800">
                            {locale === 'en' ? 'Amount in HKD:' : '港幣金額:'}
                        </span>
                        <span className="font-bold text-blue-900">
                            HK${conversionDetails.amountHKD.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between bg-white bg-opacity-50 p-2 rounded">
                        <span className="text-blue-800">
                            {locale === 'en' ? 'Payment Amount (USD):' : '實際付款 (美元):'}
                        </span>
                        <span className="font-bold text-blue-900">
                            US${conversionDetails.amountUSD.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs text-blue-700 pt-1">
                        <span>{locale === 'en' ? 'Exchange Rate:' : '匯率:'}</span>
                        <span className="font-mono">
                            1 USD = {conversionDetails.exchangeRate.toFixed(4)} HKD
                        </span>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-700">
                        ℹ️ {locale === 'en'
                        ? 'All payments are processed in USD. AliPay and WeChat Pay will charge in USD directly; credit/debit cards will be converted by your bank.'
                        : '所有付款以美元 (USD) 處理。AliPay 及 WeChat Pay 將直接以美元支付；信用卡/扣賬卡將由您的銀行自動轉換。'
                    }
                    </p>
                </div>
            </div>

            {/* Payment Element */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                    {locale === 'en' ? 'Select Payment Method' : '選擇付款方式'}
                </h2>
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {/* Redirect notice for AliPay / WeChat Pay */}
            <RedirectPaymentNotice paymentType={selectedRedirectMethod} />

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800">{t("securityNotice")}</p>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-neutral-900 text-white py-4 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t("processing")}
                    </>
                ) : selectedRedirectMethod ? (
                    <>
                        <ExternalLink className="w-5 h-5" />
                        {t("confirmPayment", { amount: conversionDetails.amountUSD.toFixed(2) }).replace('HK$', 'US$')}
                    </>
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        {t("confirmPayment", { amount: conversionDetails.amountUSD.toFixed(2) }).replace('HK$', 'US$')}
                    </>
                )}
            </button>
        </form>
    )
}

// Main Checkout Component
export default function CheckoutWrapper() {
    const t = useTranslations("Checkout")
    const { items, totalPrice, isLoading } = useCart()
    const router = useRouter()
    const locale = useLocale()
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isPreparingPayment, setIsPreparingPayment] = useState(false)
    const [clientSecret, setClientSecret] = useState("")
    const [conversionDetails, setConversionDetails] = useState<any>(null)

    const [formData, setFormData] = useState({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        delivery_address: "",
        delivery_date: "",
        delivery_notes: "",
    })

    useEffect(() => {
        if (!isLoading && items.length === 0) {
            router.push(`/${locale}/products`)
        }
    }, [items.length, router, isLoading, locale])

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

    const handleProceedToPayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPreparingPayment(true)
        setErrorMessage("")

        try {
            // Validation
            if (formData.customer_name.length < 2) throw new Error(t("validation.nameRequired"))
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) throw new Error(t("validation.emailRequired"))
            if (formData.customer_phone.length < 8) throw new Error(t("validation.phoneRequired"))
            if (formData.delivery_address.length < 10) throw new Error(t("validation.addressRequired"))
            if (!formData.delivery_date) throw new Error(t("validation.dateRequired"))

            const orderData = {
                ...formData,
                payment_method: 'card_pay', // Default; actual method detected server-side after payment
                items: items.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            }

            const response = await fetch(`${API_BASE_URL}/api/orders/create-payment-intent/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || t("errors.createPaymentFailed"))
            }

            const data = await response.json()
            console.log("Payment intent created:", data)

            setClientSecret(data.clientSecret)
            setConversionDetails(data.conversionDetails)
            setShowPaymentForm(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })

        } catch (error: any) {
            setErrorMessage(error.message || t("errors.networkError"))
        } finally {
            setIsPreparingPayment(false)
        }
    }

    return (
        <main className="min-h-screen bg-neutral-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h1 className={`${playfair.className} text-4xl font-light mb-8`}>
                    {t("title")}
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {!showPaymentForm ? (
                            <form onSubmit={handleProceedToPayment} className="space-y-6">
                                {errorMessage && <ErrorAlert message={errorMessage} onClose={() => setErrorMessage("")} />}

                                {/* Customer Info */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                                        {t("customerInfo")}
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                {t("name")} <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                required
                                                minLength={2}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
                                                placeholder={t("placeholders.name")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                {t("email")} <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="customer_email"
                                                value={formData.customer_email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
                                                placeholder={t("placeholders.email")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                {t("phone")} <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="customer_phone"
                                                value={formData.customer_phone}
                                                onChange={handleChange}
                                                required
                                                minLength={8}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900"
                                                placeholder={t("placeholders.phone")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                                        {t("deliveryInfo")}
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                {t("deliveryAddress")} <span className="text-red-600">*</span>
                                            </label>
                                            <textarea
                                                name="delivery_address"
                                                value={formData.delivery_address}
                                                onChange={handleChange}
                                                required
                                                minLength={10}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 resize-none"
                                                placeholder={t("placeholders.address")}
                                            />
                                        </div>
                                        <DatePicker
                                            value={formData.delivery_date}
                                            onChange={(date) => setFormData({ ...formData, delivery_date: date })}
                                        />
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                {t("notes")} ({t("optional")})
                                            </label>
                                            <textarea
                                                name="delivery_notes"
                                                value={formData.delivery_notes}
                                                onChange={handleChange}
                                                maxLength={500}
                                                rows={2}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 resize-none"
                                                placeholder={t("placeholders.notes")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPreparingPayment}
                                    className="w-full bg-neutral-900 text-white py-4 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isPreparingPayment ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t("preparing")}
                                        </>
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
                                        appearance: {
                                            theme: "stripe",
                                            variables: { colorPrimary: "#1a1a1a" }
                                        }
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

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 sticky top-8">
                            <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                                {t("orderSummary")}
                            </h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-sm text-neutral-600">
                                                {t("quantity")}: {item.quantity}
                                            </p>
                                            <p className="text-sm font-medium">
                                                HK${(item.price * item.quantity).toFixed(2)}
                                            </p>
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