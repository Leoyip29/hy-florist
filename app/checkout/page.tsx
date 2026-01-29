"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
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
import {Loader2, CheckCircle, X} from "lucide-react"

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
})

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
)

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

// Success Notification Component
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

// Form Component
function CheckoutForm({
                          clientSecret,
                          initialFormData
                      }: {
    clientSecret: string
    initialFormData: {
        customer_name: string
        customer_email: string
        customer_phone: string
        delivery_address: string
        delivery_notes: string
    }
}) {
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const {items, clearCart, totalPrice} = useCart()

    const [formData, setFormData] = useState({
        ...initialFormData,
        payment_method: "stripe",
    })

    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)
    const [orderNumber, setOrderNumber] = useState("")

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
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
            // Submit payment
            const {error, paymentIntent} = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                },
                redirect: "if_required",
            })

            if (error) {
                setErrorMessage(error.message || "付款失敗，請稍後再試")
                setIsProcessing(false)
                return
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                // Prepare order data
                const orderData = {
                    ...formData,
                    items: items.map((item) => ({
                        product_id: item.id,
                        quantity: item.quantity,
                    })),
                    payment_intent_id: paymentIntent.id,
                }

                // Confirm order with backend
                const response = await fetch(`${API_BASE_URL}/api/orders/confirm/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || "訂單確認失敗")
                }

                const order = await response.json()

                // Show success notification
                setOrderNumber(order.order_number)
                setShowSuccess(true)

                // Clear cart
                clearCart()

                // Redirect after showing notification (3 seconds)
                setTimeout(() => {
                    router.push(`/order-confirmation?order_number=${order.order_number}`)
                }, 3000)
            }
        } catch (error) {
            console.error("Payment error:", error)
            setErrorMessage(
                error instanceof Error ? error.message : "付款失敗，請稍後再試"
            )
            setIsProcessing(false)
        }
    }

    const handleCloseSuccess = () => {
        setShowSuccess(false)
        router.push(`/order-confirmation?order_number=${orderNumber}`)
    }

    // Get tomorrow's date for min date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split("T")[0]

    return (
        <>
            {showSuccess && (
                <SuccessNotification
                    onClose={handleCloseSuccess}
                    orderNumber={orderNumber}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
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
                                value={formData.customer_name}
                                onChange={handleInputChange}
                                required
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
                                value={formData.customer_email}
                                onChange={handleInputChange}
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
                                value={formData.customer_phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                placeholder="9123 4567"
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                        送貨資料 / Delivery Address
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                送貨地址 <span className="text-red-600">*</span>
                            </label>
                            <textarea
                                name="delivery_address"
                                value={formData.delivery_address}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                                placeholder="請輸入完整送貨地址"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                備註 (選填) / Delivery Notes
                            </label>
                            <textarea
                                name="delivery_notes"
                                value={formData.delivery_notes}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                                placeholder="特別要求或備註"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                        付款方式
                    </h2>
                    <PaymentElement/>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {errorMessage}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full bg-neutral-900 text-white py-4 rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin"/>
                            處理中...
                        </>
                    ) : (
                        `確認付款 HK$${totalPrice.toFixed(2)}`
                    )}
                </button>
            </form>
        </>
    )
}

function CheckoutWrapper() {
    const {items, totalPrice} = useCart()
    const router = useRouter()
    const [clientSecret, setClientSecret] = useState("")
    const [isCreatingIntent, setIsCreatingIntent] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [tempFormData, setTempFormData] = useState({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        delivery_address: "",
        delivery_notes: "",
    })

    // Move redirect logic to useEffect
    useEffect(() => {
        if (items.length === 0) {
            router.push("/products")
        }
    }, [items.length, router])

    const handleTempInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setTempFormData({
            ...tempFormData,
            [e.target.name]: e.target.value,
        })
    }

    const handleProceedToPayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreatingIntent(true)

        try {
            const orderData = {
                ...tempFormData,
                payment_method: "stripe",
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
                    },
                    body: JSON.stringify(orderData),
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Payment intent error:", errorData)
                throw new Error("無法建立付款")
            }

            const data = await response.json()
            setClientSecret(data.clientSecret)
            setShowForm(true)
        } catch (error) {
            console.error("Error creating payment intent:", error)
            alert("無法建立付款，請檢查資料後再試")
        } finally {
            setIsCreatingIntent(false)
        }
    }

    // Return null while redirecting (cart is empty)
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
                                                rows={3}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                                                placeholder="請輸入完整送貨地址"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                備註 (選填) / Delivery Notes
                                            </label>
                                            <textarea
                                                name="delivery_notes"
                                                value={tempFormData.delivery_notes}
                                                onChange={handleTempInputChange}
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
                                    }}
                                >
                                    <CheckoutForm
                                        clientSecret={clientSecret}
                                        initialFormData={tempFormData}
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