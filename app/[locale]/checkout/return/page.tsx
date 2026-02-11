"use client"

import {useEffect, useState, Suspense} from "react"
import {useSearchParams, useRouter} from "next/navigation"
import {loadStripe} from "@stripe/stripe-js"
import {Elements, useStripe} from "@stripe/react-stripe-js"
import {Loader2, CheckCircle, XCircle} from "lucide-react"
import {useLocale} from 'next-intl'
import {useCart} from "@/contexts/CartContext"

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

/**
 * Checkout Return Page - Inner Component
 *
 * Handles the redirect back from AliPay after payment completion
 */
function CheckoutReturnContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const stripe = useStripe()
    const locale = useLocale()
    const {clearCart} = useCart()

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const [orderNumber, setOrderNumber] = useState('')

    useEffect(() => {
        if (!stripe) {
            return
        }

        const clientSecret = searchParams.get('payment_intent_client_secret')

        if (!clientSecret) {
            setStatus('error')
            setMessage('付款資料缺失')
            return
        }

        // Retrieve the PaymentIntent
        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
            if (!paymentIntent) {
                setStatus('error')
                setMessage('無法獲取付款資料')
                return
            }

            switch (paymentIntent.status) {
                case 'succeeded':
                    handleSuccessfulPayment(paymentIntent)
                    break

                case 'processing':
                    setStatus('loading')
                    setMessage('付款處理中，請稍候...')
                    // Poll for status update
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000)
                    break

                case 'requires_payment_method':
                    setStatus('error')
                    setMessage('付款失敗，請返回重試')
                    setTimeout(() => {
                        router.push(`/${locale}/checkout`)
                    }, 3000)
                    break

                default:
                    setStatus('error')
                    setMessage('付款失敗')
                    break
            }
        }).catch((error) => {
            console.error('Error retrieving payment intent:', error)
            setStatus('error')
            setMessage('無法確認付款狀態')
        })
    }, [stripe, searchParams, router, locale])

    const handleSuccessfulPayment = async (paymentIntent: any) => {
        try {
            // Get the order data from session storage (saved before redirect)
            const orderDataStr = sessionStorage.getItem('pending_order_data')
            if (!orderDataStr) {
                setStatus('error')
                setMessage('訂單資料遺失，請聯絡客服並提供付款 ID: ' + paymentIntent.id)
                return
            }

            const orderData = JSON.parse(orderDataStr)

            // Add payment intent ID to order data
            orderData.payment_intent_id = paymentIntent.id

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

                if (response.status === 400) {
                    setStatus('error')
                    setMessage(errorData.error || '訂單資料無效')
                } else if (response.status === 500) {
                    setStatus('error')
                    setMessage('系統錯誤，但您的付款已完成。請聯絡客服並提供付款 ID: ' + paymentIntent.id)
                } else {
                    setStatus('error')
                    setMessage('訂單確認失敗，請聯絡客服')
                }
                return
            }

            const order = await response.json()

            // Clear session storage
            sessionStorage.removeItem('pending_order_data')

            // Clear cart
            clearCart()

            setOrderNumber(order.order_number)
            setStatus('success')
            setMessage('付款成功！正在跳轉到訂單確認頁面...')

            // Redirect to order confirmation
            setTimeout(() => {
                router.push(
                    `/${locale}/order-confirmation?order_number=${order.order_number}&email=${encodeURIComponent(orderData.customer_email)}`
                )
            }, 2000)

        } catch (error) {
            console.error('Error confirming order:', error)
            setStatus('error')
            setMessage('訂單確認失敗: ' + (error instanceof Error ? error.message : '未知錯誤'))
        }
    }

    return (
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-neutral-900"/>
                        <h1 className="text-2xl font-semibold mb-2">處理中</h1>
                        <p className="text-neutral-600">{message || '正在確認您的付款...'}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600"/>
                        </div>
                        <h1 className="text-2xl font-semibold mb-2 text-green-600">付款成功！</h1>
                        <p className="text-neutral-600 mb-4">{message}</p>
                        {orderNumber && (
                            <div className="bg-neutral-50 rounded-lg p-4">
                                <p className="text-sm text-neutral-600 mb-1">訂單編號</p>
                                <p className="text-lg font-semibold">#{orderNumber}</p>
                            </div>
                        )}
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-10 h-10 text-red-600"/>
                        </div>
                        <h1 className="text-2xl font-semibold mb-2 text-red-600">付款失敗</h1>
                        <p className="text-neutral-600 mb-6">{message}</p>
                        <button
                            onClick={() => router.push(`/${locale}/checkout`)}
                            className="w-full bg-neutral-900 text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                        >
                            返回結帳頁面
                        </button>
                    </>
                )}
            </div>
        </main>
    )
}

/**
 * Checkout Return Page - Wrapper with Stripe Elements
 *
 * This is the page component that Next.js will render
 */
export default function CheckoutReturnPage() {
    return (
        <Elements stripe={stripePromise}>
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-900"/>
                    </div>
                }
            >
                <CheckoutReturnContent/>
            </Suspense>
        </Elements>
    )
}