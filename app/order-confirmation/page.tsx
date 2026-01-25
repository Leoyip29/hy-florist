"use client"

import {useEffect, useState, Suspense} from "react"
import {useSearchParams} from "next/navigation"
import {Playfair_Display} from "next/font/google"
import {CheckCircle, Loader2, Mail, MapPin, Calendar} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
})

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

interface OrderItem {
    id: number
    product_name: string
    product_price: string
    product_image_url: string | null
    quantity: number
    line_total: string
}

interface Order {
    id: number
    order_number: string
    customer_name: string
    customer_email: string
    customer_phone: string
    delivery_address: string
    delivery_date: string
    delivery_notes: string
    payment_method: string
    payment_status: string
    subtotal: string
    delivery_fee: string
    discount: string
    total: string
    status: string
    created_at: string
    items: OrderItem[]
}

function OrderConfirmationContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get("order_number")

    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!orderNumber) {
            setError("訂單編號未提供")
            setIsLoading(false)
            return
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/orders/${orderNumber}/`
                )

                if (!response.ok) {
                    throw new Error("無法載入訂單")
                }

                const data = await response.json()
                setOrder(data)
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("無法載入訂單詳情")
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrder()
    }, [orderNumber])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-900"/>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error || "訂單不存在"}</p>
                    <Link
                        href="/products"
                        className="text-neutral-900 underline hover:no-underline"
                    >
                        返回商城
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-neutral-50 py-12">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {/* Success Header */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-6 text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-16 h-16 text-green-600"/>
                    </div>
                    <h1 className={`${playfair.className} text-3xl font-semibold mb-2`}>
                        訂單確認
                    </h1>
                    <p className="text-neutral-600 mb-4">感謝您的訂購！</p>
                    <div className="bg-neutral-100 rounded-lg px-6 py-3 inline-block">
                        <p className="text-sm text-neutral-600 mb-1">訂單編號</p>
                        <p className="text-xl font-semibold">#{order.order_number}</p>
                    </div>
                </div>

                {/* Email Confirmation Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"/>
                    <div>
                        <p className="text-sm text-blue-900 font-medium">
                            訂單確認電郵已發送
                        </p>
                        <p className="text-sm text-blue-800">
                            我們已將訂單詳情發送至 {order.customer_email}
                        </p>
                    </div>
                </div>

                {/* Customer & Delivery Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                            客戶資料
                        </h2>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-neutral-600">姓名：</span>
                                <span className="font-medium">{order.customer_name}</span>
                            </p>
                            <p>
                                <span className="text-neutral-600">電郵：</span>
                                <span className="font-medium">{order.customer_email}</span>
                            </p>
                            <p>
                                <span className="text-neutral-600">電話：</span>
                                <span className="font-medium">{order.customer_phone}</span>
                            </p>
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                            送貨資料
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-2">
                                <MapPin className="w-4 h-4 text-neutral-600 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <p className="text-neutral-600 text-xs mb-1">送貨地址</p>
                                    <p className="font-medium">{order.delivery_address}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Calendar className="w-4 h-4 text-neutral-600 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <p className="text-neutral-600 text-xs mb-1">送貨日期</p>
                                    <p className="font-medium">
                                        {new Date(order.delivery_date).toLocaleDateString("zh-HK", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                            {order.delivery_notes && (
                                <div>
                                    <p className="text-neutral-600 text-xs mb-1">備註</p>
                                    <p className="font-medium">{order.delivery_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                        訂單詳情
                    </h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0 last:pb-0"
                            >
                                {item.product_image_url && (
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <Image
                                            src={item.product_image_url}
                                            alt={item.product_name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-medium mb-1">{item.product_name}</p>
                                    <p className="text-sm text-neutral-600">
                                        數量: {item.quantity} × HK${item.product_price}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">HK${item.line_total}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Totals */}
                    <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">小計</span>
                            <span>HK${order.subtotal}</span>
                        </div>
                        {parseFloat(order.delivery_fee) > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">運費</span>
                                <span>HK${order.delivery_fee}</span>
                            </div>
                        )}
                        {parseFloat(order.discount) > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">折扣</span>
                                <span>-HK${order.discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-neutral-200">
                            <span>總計</span>
                            <span>HK${order.total}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                    <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>
                        付款資料
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-600 mb-1">付款方式</p>
                            <p className="font-medium">
                                {order.payment_method === "stripe"
                                    ? "信用卡 / 扣賬卡"
                                    : order.payment_method === "apple_pay"
                                        ? "Apple Pay"
                                        : "PayMe"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-neutral-600 mb-1">付款狀態</p>
                            <span
                                className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
        已付款
        </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/products"
                        className="flex-1 text-center py-3 px-6 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
                    >
                        繼續購物
                    </Link>a
                    <button
                        onClick={() => window.print()}
                        className="flex-1 text-center py-3 px-6 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
                    >
                        列印訂單
                    </button>
                </div>
            </div>
        </main>
    )
}

export default function OrderConfirmationPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-900"/>
                </div>
            }
        >
            <OrderConfirmationContent/>
        </Suspense>
    )
}