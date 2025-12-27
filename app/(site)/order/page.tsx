import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/db'
import { order, product } from '@/db/schema'
import { auth } from '@/lib/auth'

export default async function OrderCardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/auth')
    return
  }

  let orders = []

  orders = await db
    .select()
    .from(order)
    .where(eq(order.userId, session.user.id))
    .innerJoin(product, eq(order.productId, product.id))

  if (orders.length === 0) {
    return (
      <div className="min-h-100 max-w-6xl mx-auto mt-8">
        <Card className="text-center">
          <CardContent className="p-6 space-y-2">
            <p className="text-lg font-semibold">No Orders</p>
            <p className="text-sm text-muted-foreground">You haven’t placed any orders yet.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto mt-8">
      {orders.map(order => (
        <Card key={order.order.id} className='mb-4'>
          <CardContent className="flex items-center justify-around flex-wrap">
            <Image
              src={order.product.image}
              alt={order.product.name}
              width={40}
              height={40}
              className="rounded"
              unoptimized
            />
            <p className="font-semibold">{order.product.name}</p>
            <p className="font-medium">₹{order.order.amount / 100}</p>
            <p className="font-medium">{order.order.quantity}</p>
            <p className="font-medium">{new Date(order.order.createdAt).toLocaleDateString()}</p>
            <Badge
              variant={
                order.order.status === 'completed'
                  ? 'default'
                  : order.order.status === 'failed'
                    ? 'destructive'
                    : 'secondary'
              }>
              {order.order.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
