import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Products } from '@/types'

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/product`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return []
  }

  const { data } = await res.json()
  const products: Products[] = data ?? []

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 pb-4 sm:px-6 lg:max-w-7xl lg:px-8 ">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ">
          {products.length > 0 ? products.map(product => (
            <Card key={product.id} className="group relative shadow-sm">
              <Link href={`/product/${product.id}`}>
                <CardContent className="px-4">
                  <Image
                    alt={product.name}
                    src={product.image}
                    width={400}
                    height={400}
                    loading="eager"
                    unoptimized
                    className="aspect-square w-full rounded-md object-cover group-hover:opacity-85 lg:aspect-auto lg:h-80 cursor-pointer"
                  />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{product.name}</h3>
                      <p className="text-sm font-medium">₹ {product.price}</p>
                    </div>

                    <Button variant={'secondary'}>Buy Now</Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          )) : (
            <div className="col-span-full flex items-center justify-center">
              <Card className="max-w-sm text-center">
                <CardContent className="p-6 space-y-2">
                  <p className="text-lg font-semibold">
                    No Products Available
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please check back later or refresh the page.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
