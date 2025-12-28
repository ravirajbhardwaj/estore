import crypto from 'node:crypto'
import { eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'
import { secureHeaders } from 'hono/secure-headers'
import { handle } from 'hono/vercel'
import Razorpay from 'razorpay'
import { Resend } from 'resend'
import { db } from '@/db'
import { order, product, user } from '@/db/schema'
import { auth } from '@/lib/auth'
import { created, error, HttpStatus, ok } from '@/lib/http'

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}>().basePath('/api')

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL as string,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
)
app.use(secureHeaders())

const sessionMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) {
    c.set('user', null)
    c.set('session', null)
    await next()
    return
  }
  c.set('user', session.user)
  c.set('session', session.session)
  await next()
})

const isAdmin = createMiddleware(async (c, next) => {
  const user = c.get('user')
  if (user.email === process.env.ADMIN) {
    await next()
    return
  }
  error(HttpStatus.UNAUTHORIZED, 'Unauthorized user!')
})

const requireAuth = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('user', session.user)
  c.set('session', session.session)

  await next()
})

// Auth API Routes
app.on(['POST', 'GET'], '/auth/*', c => auth.handler(c.req.raw))

// Product API Routes
app.post('/product', sessionMiddleware, isAdmin, async c => {
  const user = c.get('user')
  const { name, price } = await c.req.json()
  const image = `${name.replace(' ', '-')}.webp`

  const products = await db.insert(product).values({
    name,
    price,
    image,
    adminId: user?.id,
  })

  return created(c, products, 'Products created successfully')
})

// RAZORPAY | ORDER API Routes
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
})

app.post('/order', sessionMiddleware, requireAuth, async c => {
  const user = c.get('user')
  const { productId, quantity, amount } = await c.req.json()

  const rzpOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100) * quantity,
    currency: 'INR',
    receipt: `receipt-${Date.now()}`,
    notes: {
      productId: productId.toString(),
      userId: user!.id.toString(),
      quantity: quantity.toString(),
      amount: amount.toString(),
    },
  })

  const [dbOrder] = await db
    .insert(order)
    .values({
      userId: user!.id,
      productId: Number(productId),
      amount: Number(rzpOrder.amount),
      razorpayOrderId: rzpOrder.id,
      razorpayPaymentId: null,
      quantity: Number(quantity),
      status: 'pending',
    })
    .returning()

  return ok(c, dbOrder, 'Order created successfully')
})

app.post('/webhooks/razorpay', async c => {
  const body = await c.req.text()
  const signature = c.req.header('x-razorpay-signature')

  if (!signature) {
    return error(HttpStatus.BAD_REQUEST, 'Missing signature')
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RZP_WEBHOOK_SECRET as string)
    .update(body)
    .digest('hex')

  if (expectedSignature !== signature) {
    return error(HttpStatus.BAD_REQUEST, 'Invalid Signature')
  }

  const event = JSON.parse(body)

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity

    const [updatedOrder] = await db
      .update(order)
      .set({
        razorpayPaymentId: payment.id,
        status: 'completed',
      })
      .where(eq(order.razorpayOrderId, payment.order_id))
      .returning()

    if (updatedOrder) {
      const [orderDetails] = await db.select().from(order)
      const [existedUser] = await db.select().from(user).where(sql`${orderDetails.userId}`)

      const amountInRupees = orderDetails.amount / 100
      const resend = new Resend(process.env.RESEND_API_KEY as string)

      await resend.emails.send({
        from: '"Estore" <noreply@estore.com>',
        to: [existedUser.email],
        subject: 'Payment Confirmation',
        html: `
        Thanks for purchance
      Order ID: ${orderDetails.id}
      Amount: ₹${amountInRupees}
      Quantity: ${orderDetails.quantity}
    `,
      })
    }

    return ok(c, { received: true })
  }
})

app.notFound(c => {
  return c.text('Not found 404 Message', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

export const GET = handle(app)
export const POST = handle(app)
