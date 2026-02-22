"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, useStripe } from "@stripe/react-stripe-js"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'
import { useCart } from "@/contexts/CartContext"

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

/**
 * Checkout Return Page - Inner Component
 *
 * Handles the redirect back from external payment pages after completion.
 *
 * This page is the return_url for ALL redirect-based payment methods:
 *  - AliPay: user pays on AliPay web/app, lands back here
 *  - WeChat Pay: user scans QR (desktop) or pays in WeChat (mobile), lands here
 *
 * Flow:
 *  1. Stripe redirects user back with ?payment_intent_client_secret=...
 *  2. We retrieve the PaymentIntent to check its status
 *  3. On success, we POST to our /api/orders/confirm/ with the saved order data
 *  4. Order is created, confirmed email sent, user redirected to order confirmation
 */
function CheckoutReturnContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const stripe = useStripe()
    const locale = useLocale()
    const { clearCart } = useCart()
    const t = useTranslations('CheckoutReturn')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const [orderNumber, setOrderNumber] = useState('')

    useEffect(() => {
        if (!stripe) return

        const clientSecret = searchParams.get('payment_intent_client_secret')

        if (!clientSecret) {
            setStatus('error')
            setMessage(t('errors.missingPaymentData'))
            return
        }

        // Retrieve the PaymentIntent to get the authoritative payment status from Stripe.
        // This is the correct way to handle return from all redirect-based methods.
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) {
                setStatus('error')
                setMessage(t('errors.cannotRetrievePayment'))
                return
            }

            switch (paymentIntent.status) {
                case 'succeeded':
                    // Payment completed — create order in our system
                    handleSuccessfulPayment(paymentIntent)
                    break

                case 'processing':
                    // Some payment methods (e.g. certain bank transfers) are async.
                    // WeChat Pay and AliPay are typically synchronous, but handle gracefully.
                    setStatus('loading')
                    setMessage(t('paymentProcessing'))
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000)
                    break

                case 'requires_payment_method':
                    // User cancelled or payment failed on the external page
                    setStatus('error')
                    setMessage(t('errors.paymentFailed'))
                    setTimeout(() => {
                        router.push(`/${locale}/checkout`)
                    }, 3000)
                    break

                default:
                    setStatus('error')
                    setMessage(t('errors.paymentFailedGeneric'))
                    break
            }
        }).catch((error) => {
            console.error('Error retrieving payment intent:', error)
            setStatus('error')
            setMessage(t('errors.cannotRetrievePayment'))
        })
    }, [stripe, searchParams, router, locale, t])

    const handleSuccessfulPayment = async (paymentIntent: any) => {
        try {
            /**
             * Retrieve the order data saved to sessionStorage before the redirect.
             *
             * This data was saved in checkout.tsx immediately before calling
             * stripe.confirmPayment(). For redirect methods (AliPay, WeChat Pay),
             * the browser navigates away then returns to this URL. sessionStorage
             * survives same-tab navigation, so the data is available on return.
             *
             * If sessionStorage is empty (e.g. user opened return URL in a new tab),
             * we cannot reconstruct the order and must show an error with the PI ID
             * so customer can contact support.
             */
            const orderDataStr = sessionStorage.getItem('pending_order_data')
            if (!orderDataStr) {
                setStatus('error')
                setMessage(t('errors.orderDataMissing') + paymentIntent.id)
                return
            }

            const orderData = JSON.parse(orderDataStr)

            // Attach payment intent ID for backend verification
            orderData.payment_intent_id = paymentIntent.id
            orderData.language=locale

            // Confirm order with our backend — this creates the Order record,
            // marks it as paid, and sends the confirmation email
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
                    setMessage(errorData.error || t('errors.orderDataInvalid'))
                } else if (response.status === 500) {
                    setStatus('error')
                    setMessage(t('errors.systemError') + paymentIntent.id)
                } else {
                    setStatus('error')
                    setMessage(t('errors.orderConfirmationFailed'))
                }
                return
            }

            const order = await response.json()

            // Clean up
            sessionStorage.removeItem('pending_order_data')
            clearCart()

            setOrderNumber(order.order_number)
            setStatus('success')
            setMessage(t('successMessage'))

            // Redirect to full order confirmation page
            setTimeout(() => {
                router.push(
                    `/${locale}/order-confirmation?order_number=${order.order_number}&email=${encodeURIComponent(orderData.customer_email)}`
                )
            }, 2000)

        } catch (error) {
            console.error('Error confirming order:', error)
            setStatus('error')
            setMessage(t('errors.confirmationError') + (error instanceof Error ? error.message : '未知錯誤'))
        }
    }

    return (
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-neutral-900" />
                        <h1 className="text-2xl font-semibold mb-2">{t('processing')}</h1>
                        <p className="text-neutral-600">{message || t('verifyingPayment')}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-semibold mb-2 text-green-600">{t('paymentSuccess')}</h1>
                        <p className="text-neutral-600 mb-4">{message}</p>
                        {orderNumber && (
                            <div className="bg-neutral-50 rounded-lg p-4">
                                <p className="text-sm text-neutral-600 mb-1">{t('orderNumber')}</p>
                                <p className="text-lg font-semibold">#{orderNumber}</p>
                            </div>
                        )}
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-semibold mb-2 text-red-600">{t('paymentFailed')}</h1>
                        <p className="text-neutral-600 mb-6">{message}</p>
                        <button
                            onClick={() => router.push(`/${locale}/checkout`)}
                            className="w-full bg-neutral-900 text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                        >
                            {t('backToCheckout')}
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
 * Must be wrapped in <Elements> so useStripe() works in the inner component.
 * No clientSecret is needed here — we call retrievePaymentIntent() using
 * the secret from the URL query param, not from state.
 */
export default function CheckoutReturnPage() {
    return (
        <Elements stripe={stripePromise}>
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
                    </div>
                }
            >
                <CheckoutReturnContent />
            </Suspense>
        </Elements>
    )
}