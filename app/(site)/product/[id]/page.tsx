import { notFound } from 'next/navigation'
import ProductsDisplay from '@/components/ProductDisplay'
import type { Products } from '@/types'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/product`)

  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }

  const { data } = await res.json()
  const products: Products[] = data ?? []

  console.log(id)
  const product = products.find(p => p.id === Number(id))

  if (!product) notFound()

  return <ProductsDisplay product={product} />
}
