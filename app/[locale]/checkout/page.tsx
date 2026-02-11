"use client"

import {useEffect, useState} from "react"
import {useRouter, usePathname} from "next/navigation"
import {loadStripe} from "@stripe/stripe-js"
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js"
import {useCart} from "@/contexts/CartContext"
import Image from "next/image"
import {Playfair_Display} from "next/font/google"
import {Loader2, CheckCircle, X, AlertCircle, Calendar} from "lucide-react"
import {useLocale} from 'next-intl'


const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
})

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
)

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

// ---------------------------------------------------------------------------
// Date Picker Component with 3-day advance rule
// ---------------------------------------------------------------------------
function DatePicker({
                        value,
                        onChange,
                        minDaysAdvance = 3,
                    }: {
    value: string
    onChange: (date: string) => void
    minDaysAdvance?: number
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    // Calculate minimum selectable date (today + minDaysAdvance)
    const getMinDate = () => {
        const date = new Date()
        date.setDate(date.getDate() + minDaysAdvance)
        date.setHours(0, 0, 0, 0)
        return date
    }

    // Calculate maximum selectable date (90 days from today)
    const getMaxDate = () => {
        const date = new Date()
        date.setDate(date.getDate() + 90)
        date.setHours(0, 0, 0, 0)
        return date
    }

    const minDate = getMinDate()
    const maxDate = getMaxDate()

    const isDateDisabled = (date: Date) => {
        const compareDate = new Date(date)
        compareDate.setHours(0, 0, 0, 0)
        return compareDate < minDate || compareDate > maxDate
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "請選擇送貨日期"
        const date = new Date(dateString)
        return date.toLocaleDateString("zh-HK", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        return {daysInMonth, startingDayOfWeek, year, month}
    }

    const handleDateSelect = (day: number) => {
        const selected = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        )

        if (!isDateDisabled(selected)) {
            // Format as YYYY-MM-DD for the backend
            const formatted = selected.toISOString().split("T")[0]
            onChange(formatted)
            setIsOpen(false)
        }
    }

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentMonth((prev) => {
            const newDate = new Date(prev)
            if (direction === "prev") {
                newDate.setMonth(newDate.getMonth() - 1)
            } else {
                newDate.setMonth(newDate.getMonth() + 1)
            }
            return newDate
        })
    }

    const {daysInMonth, startingDayOfWeek, year, month} =
        getDaysInMonth(currentMonth)

    const monthName = currentMonth.toLocaleDateString("zh-HK", {
        year: "numeric",
        month: "long",
    })

    // Create array of day cells including empty cells for alignment
    const dayCells = []
    for (let i = 0; i < startingDayOfWeek; i++) {
        dayCells.push(<div key={`empty-${i}`} className="h-10"/>)
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const isDisabled = isDateDisabled(date)
        const isSelected =
            value === date.toISOString().split("T")[0]

        dayCells.push(
            <button
                key={day}
                type="button"
                onClick={() => handleDateSelect(day)}
                disabled={isDisabled}
                className={`
                    h-10 rounded-lg text-sm font-medium transition-all
                    ${
                    isSelected
                        ? "bg-neutral-900 text-white shadow-md"
                        : isDisabled
                            ? "text-neutral-300 cursor-not-allowed"
                            : "hover:bg-neutral-100 text-neutral-700"
                }
                `}
            >
                {day}
            </button>
        )
    }

    return (
        <div className="relative">
            <label className="block text-sm font-medium mb-2">
                送貨日期 / Delivery Date <span className="text-red-600">*</span>
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-left flex items-center justify-between"
            >
                <span className={value ? "text-neutral-900" : "text-neutral-400"}>
                    {formatDate(value)}
                </span>
                <Calendar className="w-5 h-5 text-neutral-400"/>
            </button>

            <p className="text-xs text-neutral-500 mt-1">
                最少需提前 {minDaysAdvance} 天訂購
            </p>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Calendar Popup */}
                    <div
                        className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 p-4 z-50 w-80">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={() => navigateMonth("prev")}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                ←
                            </button>
                            <span className={`${playfair.className} font-semibold`}>
                                {monthName}
                            </span>
                            <button
                                type="button"
                                onClick={() => navigateMonth("next")}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                →
                            </button>
                        </div>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                                <div
                                    key={day}
                                    className="h-8 flex items-center justify-center text-xs font-medium text-neutral-500"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">{dayCells}</div>

                        {/* Helper Text */}
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                            <p className="text-xs text-neutral-600 text-center">
                                灰色日期不可選擇（需提前 {minDaysAdvance} 天）
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

// ---------------------------------------------------------------------------
// Success Notification
// ---------------------------------------------------------------------------
function SuccessNotification({
                                 onClose,
                                 orderNumber,
                             }: {
    onClose: () => void
    orderNumber: string
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-[slideIn_0.3s_ease-out]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
                    aria-label="關閉"
                >
                    <X className="w-5 h-5"/>
                </button>

                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600"/>
                        </div>
                    </div>

                    <h2 className={`${playfair.className} text-2xl font-semibold mb-2`}>
                        付款成功！
                    </h2>
                    <p className="text-neutral-600 mb-4">
                        您的訂單已確認
                    </p>

                    <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-neutral-600 mb-1">訂單編號</p>
                        <p className="text-lg font-semibold">#{orderNumber}</p>
                    </div>

                    <p className="text-sm text-neutral-600 mb-6">
                        確認電郵已發送至您的信箱
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-neutral-900 text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                    >
                        查看訂單詳情
                    </button>
                </div>
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Error Alert
// ---------------------------------------------------------------------------
function ErrorAlert({message, onClose}: { message: string; onClose: () => void }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"/>
            <div className="flex-1">
                <p className="text-sm text-red-800">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="text-red-400 hover:text-red-600"
                aria-label="關閉"
            >
                <X className="w-4 h-4"/>
            </button>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Payment Form
// ---------------------------------------------------------------------------
function CheckoutForm({
                          clientSecret,
                          initialFormData,
                          expectedAmount,
                          requiresRedirect = false,
                      }: {
    clientSecret: string
    initialFormData: {
        customer_name: string
        customer_email: string
        customer_phone: string
        delivery_address: string
        delivery_date: string
        delivery_notes: string
        payment_method: string
    }
    expectedAmount: number
    requiresRedirect?: boolean
}) {
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const {items, clearCart} = useCart()
    const locale = useLocale()

    const [formData] = useState(initialFormData)
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)
    const [orderNumber, setOrderNumber] = useState("")

    const buildConfirmationUrl = (orderNum: string) =>
        `/${locale}/order-confirmation?order_number=${orderNum}&email=${encodeURIComponent(formData.customer_email)}`

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("zh-HK", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsProcessing(true)
        setErrorMessage("")

        try {
            // For redirect-based payments (AliPay), save order data to session storage
            // so we can retrieve it after redirect
            sessionStorage.setItem('pending_order_data', JSON.stringify({
                ...formData,
                items: items.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            }))

            // Build return URL for redirect payments
            const returnUrl = `${window.location.origin}/${locale}/checkout/return`

            // Configure confirmation parameters based on payment type
            const confirmParams: any = {
                elements,
                confirmParams: {
                    return_url: returnUrl,  // needed for AliPay redirect, ignored for card
                },
                redirect: "if_required",
            }

            const {error, paymentIntent} = await stripe.confirmPayment(confirmParams)

            if (error) {
                if (error.type === 'card_error') {
                    setErrorMessage(error.message || '付款卡被拒絕，請檢查卡片資料')
                } else if (error.type === 'validation_error') {
                    setErrorMessage('請填寫完整的付款資料')
                } else {
                    setErrorMessage(error.message || '付款失敗，請稍後再試')
                }
                setIsProcessing(false)
                return
            }

            // For redirect payments, the user will be redirected and won't reach this code
            // This only runs for inline payments (card, Apple Pay, Google Pay)
            if (paymentIntent && paymentIntent.status === "succeeded") {
                const paidAmount = paymentIntent.amount / 100
                if (Math.abs(paidAmount - expectedAmount) > 0.01) {
                    setErrorMessage('付款金額不符，請聯絡客服')
                    setIsProcessing(false)
                    return
                }

                const orderData = {
                    ...formData,
                    items: items.map((item) => ({
                        product_id: item.id,
                        quantity: item.quantity,
                    })),
                    payment_intent_id: paymentIntent.id,
                }

                const response = await fetch(`${API_BASE_URL}/api/orders/confirm/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                })

                if (!response.ok) {
                    const errorData = await response.json()

                    if (response.status === 400) {
                        setErrorMessage(errorData.error || '訂單資料無效，請稍後再試')
                    } else if (response.status === 500) {
                        setErrorMessage('系統錯誤，但您的付款已完成。請聯絡客服並提供訂單編號。')
                    } else {
                        setErrorMessage('訂單確認失敗，請聯絡客服')
                    }
                    setIsProcessing(false)
                    return
                }

                const order = await response.json()

                setOrderNumber(order.order_number)
                setShowSuccess(true)

                clearCart()

                setTimeout(() => {
                    router.push(buildConfirmationUrl(order.order_number))
                }, 3000)
            }
        } catch (error) {
            console.error("Payment error:", error)
            setErrorMessage(
                error instanceof Error ? error.message : "付款處理失敗，請稍後再試"
            )
            setIsProcessing(false)
        }
    }

    const handleCloseSuccess = () => {
        setShowSuccess(false)
        router.push(buildConfirmationUrl(orderNumber))
    }

    return (
        <>
            {showSuccess && (
                <SuccessNotification
                    onClose={handleCloseSuccess}
                    orderNumber={orderNumber}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                    <ErrorAlert
                        message={errorMessage}
                        onClose={() => setErrorMessage("")}
                    />
                )}

                {/* Customer Information (read-only) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                        客戶資料 / Customer Information
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="text-neutral-600">姓名：</span>
                            <span className="font-medium">{formData.customer_name}</span>
                        </div>
                        <div>
                            <span className="text-neutral-600">電郵：</span>
                            <span className="font-medium">{formData.customer_email}</span>
                        </div>
                        <div>
                            <span className="text-neutral-600">電話：</span>
                            <span className="font-medium">{formData.customer_phone}</span>
                        </div>
                        <div>
                            <span className="text-neutral-600">送貨地址：</span>
                            <span className="font-medium">{formData.delivery_address}</span>
                        </div>
                        <div>
                            <span className="text-neutral-600">送貨日期：</span>
                            <span className="font-medium">
                                {formatDisplayDate(formData.delivery_date)}
                            </span>
                        </div>
                        {formData.delivery_notes && (
                            <div>
                                <span className="text-neutral-600">備註：</span>
                                <span className="font-medium">{formData.delivery_notes}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                        付款方式
                    </h2>
                    <PaymentElement/>

                    {requiresRedirect && formData.payment_method === 'alipay' && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                💡 點擊「確認付款」後，您將被導向到 AliPay 完成付款
                            </p>
                        </div>
                    )}
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <p className="text-blue-800">
                        🔒 您的付款資料受到 Stripe 加密保護，我們不會儲存您的信用卡資料。
                    </p>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full bg-neutral-900 text-white py-4 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin"/>
                            {requiresRedirect ? '準備跳轉...' : '處理中...'}
                        </>
                    ) : (
                        `確認付款 HK$${expectedAmount.toFixed(2)}`
                    )}
                </button>

                <p className="text-xs text-center text-neutral-500">
                    點擊「確認付款」即表示您同意我們的服務條款及私隱政策
                </p>
            </form>
        </>
    )
}

// ---------------------------------------------------------------------------
// Payment Method Selector
// ---------------------------------------------------------------------------
function PaymentMethodSelector({
                                   selected,
                                   onChange,
                               }: {
    selected: string
    onChange: (method: string) => void
}) {
    const paymentMethods = [
        {value: 'card_pay', label: '信用卡 / 扣賬卡', icon: '💳'},
        {value: 'apple_pay', label: 'Apple Pay', icon: ''},
        {value: 'google_pay', label: 'Google Pay', icon: 'G'},
        {value: 'alipay', label: 'AliPay', icon: '💵'},
    ]

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium mb-2">
                選擇付款方式
            </label>
            <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                    <button
                        key={method.value}
                        type="button"
                        onClick={() => onChange(method.value)}
                        className={`
                            p-4 border-2 rounded-lg text-left transition-all
                            ${
                            selected === method.value
                                ? 'border-neutral-900 bg-neutral-50'
                                : 'border-neutral-200 hover:border-neutral-400'
                        }
                        `}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{method.icon}</span>
                            <span className="text-sm font-medium">{method.label}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Main Checkout Wrapper
// ---------------------------------------------------------------------------
function CheckoutWrapper() {
    const {items, totalPrice, isLoading} = useCart()
    const router = useRouter()
    const locale = useLocale()
    const pathname = usePathname()
    const [clientSecret, setClientSecret] = useState("")
    const [isCreatingIntent, setIsCreatingIntent] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [requiresRedirect, setRequiresRedirect] = useState(false)

    const [tempFormData, setTempFormData] = useState({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        delivery_address: "",
        delivery_date: "",
        delivery_notes: "",
        payment_method: "card_pay",  // Default to card
    })

    useEffect(() => {
        if (!isLoading && items.length === 0) {
            router.push(`/${locale}/products`)
        }
    }, [items.length, router, isLoading, locale])

    // Show loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-neutral-50 py-12 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-neutral-900"/>
                    <p className="text-neutral-600">載入中...</p>
                </div>
            </main>
        )
    }

    if (items.length === 0) {
        return null
    }

    const handleTempInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setTempFormData({
            ...tempFormData,
            [e.target.name]: e.target.value,
        })
    }

    const handleDateChange = (date: string) => {
        setTempFormData({
            ...tempFormData,
            delivery_date: date,
        })
    }

    const handlePaymentMethodChange = (method: string) => {
        setTempFormData({
            ...tempFormData,
            payment_method: method,
        })
    }

    const handleProceedToPayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreatingIntent(true)
        setErrorMessage("")

        try {
            // Client-side validation
            if (tempFormData.customer_name.length < 2) {
                setErrorMessage('請輸入有效的姓名')
                setIsCreatingIntent(false)
                return
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempFormData.customer_email)) {
                setErrorMessage('請輸入有效的電郵地址')
                setIsCreatingIntent(false)
                return
            }
            if (tempFormData.customer_phone.length < 8) {
                setErrorMessage('請輸入有效的電話號碼')
                setIsCreatingIntent(false)
                return
            }
            if (tempFormData.delivery_address.length < 10) {
                setErrorMessage('請輸入完整的送貨地址')
                setIsCreatingIntent(false)
                return
            }
            if (!tempFormData.delivery_date) {
                setErrorMessage('請選擇送貨日期')
                setIsCreatingIntent(false)
                return
            }

            const orderData = {
                ...tempFormData,
                items: items.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            }

            const response = await fetch(
                `${API_BASE_URL}/api/orders/create-payment-intent/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Origin": window.location.origin,  // Send origin for return URL
                    },
                    body: JSON.stringify(orderData),
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Payment intent error:", errorData)

                if (response.status === 429) {
                    setErrorMessage('請求過於頻繁，請稍後再試')
                } else if (errorData.error) {
                    setErrorMessage(typeof errorData.error === 'string'
                        ? errorData.error
                        : '無法建立付款，請檢查資料後再試')
                } else {
                    setErrorMessage('無法建立付款，請稍後再試')
                }
                setIsCreatingIntent(false)
                return
            }

            const data = await response.json()
            setClientSecret(data.clientSecret)
            setRequiresRedirect(data.requiresRedirect || false)
            setShowForm(true)
        } catch (error) {
            console.error("Error creating payment intent:", error)
            setErrorMessage('網絡錯誤，請檢查連接後再試')
            setIsCreatingIntent(false)
        }
    }

    if (items.length === 0) {
        return null
    }

    return (
        <main className="min-h-screen bg-neutral-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h1 className={`${playfair.className} text-4xl font-light mb-8`}>
                    結帳
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {!showForm ? (
                            <form onSubmit={handleProceedToPayment} className="space-y-6">
                                {errorMessage && (
                                    <ErrorAlert
                                        message={errorMessage}
                                        onClose={() => setErrorMessage("")}
                                    />
                                )}

                                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                                        客戶資料 / Customer Information
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                姓名 / Name <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={tempFormData.customer_name}
                                                onChange={handleTempInputChange}
                                                required
                                                minLength={2}
                                                maxLength={255}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                                placeholder="請輸入您的姓名"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                電郵 / Email <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="customer_email"
                                                value={tempFormData.customer_email}
                                                onChange={handleTempInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                電話 / Phone <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="customer_phone"
                                                value={tempFormData.customer_phone}
                                                onChange={handleTempInputChange}
                                                required
                                                minLength={8}
                                                maxLength={20}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                                placeholder="9123 4567"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                                        送貨資料 / Delivery Information
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                送貨地址 / Delivery Address <span className="text-red-600">*</span>
                                            </label>
                                            <textarea
                                                name="delivery_address"
                                                value={tempFormData.delivery_address}
                                                onChange={handleTempInputChange}
                                                required
                                                minLength={10}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                                                placeholder="請輸入完整送貨地址"
                                            />
                                        </div>

                                        <DatePicker
                                            value={tempFormData.delivery_date}
                                            onChange={handleDateChange}
                                            minDaysAdvance={3}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                備註 (選填) / Delivery Notes
                                            </label>
                                            <textarea
                                                name="delivery_notes"
                                                value={tempFormData.delivery_notes}
                                                onChange={handleTempInputChange}
                                                maxLength={500}
                                                rows={2}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                                                placeholder="特別要求或備註"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <button
                                    type="submit"
                                    disabled={isCreatingIntent}
                                    className="w-full bg-neutral-900 text-white py-4 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {isCreatingIntent ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin"/>
                                            準備中...
                                        </>
                                    ) : (
                                        "前往付款"
                                    )}
                                </button>
                            </form>
                        ) : (
                            clientSecret && (
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        clientSecret,
                                        appearance: {
                                            theme: "stripe",
                                            variables: {
                                                colorPrimary: "#1a1a1a",
                                            },
                                        },
                                        defaultValues: {
                                            billingDetails: {},
                                        },
                                        // Pre-select the payment method type chosen in step 1
                                        paymentMethodOrder: tempFormData.payment_method === 'alipay'
                                            ? ['alipay']
                                            : tempFormData.payment_method === 'apple_pay'
                                                ? ['apple_pay', 'card']
                                                : tempFormData.payment_method === 'google_pay'
                                                    ? ['google_pay', 'card']
                                                    : ['card'],
                                    }}
                                >
                                    <CheckoutForm
                                        clientSecret={clientSecret}
                                        initialFormData={tempFormData}
                                        expectedAmount={totalPrice}
                                        requiresRedirect={requiresRedirect}
                                    />
                                </Elements>
                            )
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 sticky top-8">
                            <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                                訂單摘要
                            </h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-neutral-600">
                                                數量: {item.quantity}
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
                                    <span className="text-neutral-600">小計</span>
                                    <span>HK${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-600">運費</span>
                                    <span>免費</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                    <span>總計</span>
                                    <span>HK${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </main>
    )
}

export default CheckoutWrapper