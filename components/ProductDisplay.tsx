'use client'

import { MinusSignIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/client'
import type { Products } from '@/types'

export default function ProductsDisplay({ product }: { product: Products }) {
  const [quantity, setQuantity] = React.useState<number>(1)
  const router = useRouter()

  const handlePurchase = async () => {
    const { data: session } = await authClient.getSession()

    // User must be logged in
    if (!session) {
      router.push('/auth')
      return
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          amount: product.price,
        }),
      })

      const data = await response.json()

      const { razorpayOrderId, amount } = data

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount,
        name: 'Pinecraft',
        image: session.user.image ?? '',
        description: `${product.name} - ${amount}`,
        order_id: razorpayOrderId,
        callback_url: '/order',

        handler: (paymentResponse: Response) => {
          console.log(paymentResponse)
          router.push('/order')
        },

        config: {
          display: {
            blocks: {
              upi_qr: {
                name: 'Pay With UPI QR',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['qr'],
                  },
                ],
              },

              other_methods: {
                name: 'Cards, UPI & More',
                instruments: [
                  { method: 'card' },
                  { method: 'upi' },
                  { method: 'netbanking' },
                  { method: 'wallet' },
                ],
              },
            },

            sequence: ['block.upi_qr', 'block.other_methods'],

            preferences: {
              show_default_blocks: false,
            },
          },
        },

        prefill: {
          email: session.user.email,
          name: session.user.name,
        },

        theme: {
          color: '#ff7700',
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Payment error:', error)
      console.log(error instanceof Error ? error.message : 'Payment failed', 'error')
    }
  }

  return (
    <div className="flex items-center justify-center md:p-10 mx-4">
      <div className="mx-auto grid md:grid-cols-2 gap-8 md:gap-24 rounded-xl border shadow-sm p-6">
        <div className="flex justify-center">
          <Image
            alt={product.name}
            src={product.image}
            width={350}
            height={350}
            loading="eager"
            className="rounded-md object-cover"
          />
        </div>

        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-xl font-bold m-px">{product.name}</h1>
          <p className="text-md font-semibold">₹ {product.price * quantity}</p>

          <div className="flex justify-center md:justify-start gap-4">
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setQuantity(Math.max(1, quantity - 1))
                }}>
                <HugeiconsIcon icon={MinusSignIcon} />
              </Button>

              <span className="w-5 text-center text-sm font-bold">{quantity}</span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setQuantity(quantity + 1)
                }}>
                <HugeiconsIcon icon={PlusSignIcon} />
              </Button>
            </div>
            <Button variant="outline" onClick={handlePurchase}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
