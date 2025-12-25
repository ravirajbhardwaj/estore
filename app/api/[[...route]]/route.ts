import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'
import { secureHeaders } from 'hono/secure-headers'
import { handle } from 'hono/vercel'
import { db } from '@/db'
import { product } from '@/db/schema'
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

// Auth API Routes
app.on(['POST', 'GET'], '/auth/*', c => auth.handler(c.req.raw))

app.use('*', async (c, next) => {
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

// Product API Routes
app
  .get('/product', async c => {
    const products = await db.select().from(product)

    return ok(c, [...products], 'Products fetch successfully')
  })
  .post('/product', isAdmin, async c => {
    const { name, price } = await c.req.json()
    const image = `${process.env.NEXT_PUBLIC_APP_URL}/${name}`

    const products = await db.insert(product).values({
      name,
      price,
      image,
      adminId: '1',
    })

    return created(c, products, 'Products created successfully')
  })

// Order API Routes
app.get('/order').post('')

app.notFound(c => {
  return c.text('Not found 404 Message', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

export const GET = handle(app)
export const POST = handle(app)
