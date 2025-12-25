import { sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import ProductsDisplay from '@/components/ProductDisplay'
import { db } from '@/db'
import { product } from '@/db/schema'
import type { Products } from '@/types'

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  let adminProducts: Products[] = []

  try {
    const result = await db
      .select({ id: product.id, name: product.name, image: product.image, price: product.price })
      .from(product)
      .where(sql`${product.id} = ${Number(id)}`)

    adminProducts = result
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }

  if (!adminProducts || adminProducts.length === 0) notFound()

  return <ProductsDisplay product={adminProducts[0]} />
}
