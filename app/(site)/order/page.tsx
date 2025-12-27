import { eq } from 'drizzle-orm'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
// import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/db'
import { order, product } from '@/db/schema'

export default async function OrderCardPage() {
  let orders = []

  orders = await db
    .select({
      orderId: order.id,
      quantity: order.quantity,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt,

      productId: product.id,
      productImage: product.image,
      productName: product.name,
      productPrice: product.price,
    })
    .from(order)
    .innerJoin(product, eq(order.productId, product.id))

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
          <Card key={order.orderId} className="overflow-hidden">
            <Image
              src={order.productImage}
              alt={order.productName}
              width={400}
              height={300}
              className="h-40 w-full object-cover"
              unoptimized
            />

            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{order.productName}</h3>
                <Badge
                  variant={
                    order.status === 'completed'
                      ? 'default'
                      : order.status === 'failed'
                        ? 'destructive'
                        : 'secondary'
                  }>
                  {order.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">Price: ₹{order.amount}</p>

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
