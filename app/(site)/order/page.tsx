'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
// import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Order {
  id: number
  amount: number
  quantity: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  product: {
    name: string
    image: string
    price: number
  }
}

export default function OrderCardPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch('/api/order')
      .then(res => res.json())
      .then(setOrders)
  }, [])

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-sm text-center">
          <CardContent className="p-6 space-y-2">
            <p className="text-lg font-semibold">No Orders</p>
            <p className="text-sm text-muted-foreground">You haven’t placed any orders yet.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            <Image
              src={order.product.image}
              alt={order.product.name}
              width={400}
              height={300}
              className="h-40 w-full object-cover"
              unoptimized
            />

            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{order.product.name}</h3>
                {/* <Badge
                  variant={
                    order.status === 'completed'
                      ? 'default'
                      : order.status === 'failed'
                        ? 'destructive'
                        : 'secondary'
                  }>
                  {order.status}
                </Badge> */}
              </div>

              <p className="text-sm text-muted-foreground">Price: ₹{order.product.price}</p>

              <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>

              <p className="font-medium">Total: ₹{order.amount}</p>

              <p className="text-xs text-muted-foreground">
                Ordered on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
