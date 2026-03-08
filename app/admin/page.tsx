'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

type Product = {
  id: number
  name: string
  price: number
  image: string
}

export default function AdminPage() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const fetchProducts = async () => {
    setFetching(true)
    try {
      const res = await fetch('/api/product')
      const data = await res.json()
      setProducts(data.data ?? [])
    } catch {
      setProducts([])
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const addProduct = async () => {
    if (!name.trim() || !price.trim()) {
      setMessage({ text: 'Please fill in both name and price.', type: 'error' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), price: Number(price) }),
      })
      if (res.ok) {
        setMessage({ text: `"${name}" added successfully!`, type: 'success' })
        setName('')
        setPrice('')
        await fetchProducts()
      } else {
        setMessage({ text: 'Failed to add product. Are you logged in as admin?', type: 'error' })
      }
    } catch {
      setMessage({ text: 'Network error. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: number, productName: string) => {
    if (!confirm(`Delete "${productName}"?`)) return
    try {
      const res = await fetch(`/api/product/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ text: `"${productName}" deleted.`, type: 'success' })
        await fetchProducts()
      } else {
        setMessage({ text: 'Failed to delete product.', type: 'error' })
      }
    } catch {
      setMessage({ text: 'Network error. Please try again.', type: 'error' })
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

      {/* Add Product Form */}
      <Card className="mb-10 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add New Product</h2>

          {message && (
            <div
              className={`text-sm px-4 py-2 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="e.g. Love At First Swipe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              {name && (
                <p className="text-xs text-muted-foreground">
                  Image: <span className="font-mono">{name.replace(/ /g, '-')}.webp</span>
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g. 999"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full sm:w-auto" onClick={addProduct} disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </Button>

          <div className="text-xs text-muted-foreground border rounded-md p-3 space-y-1">
            <p className="font-semibold">Available images in /public:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                'Animation-Station',
                'Artwork',
                'ChristmasTreeAutomata',
                'ClapYoHands',
                'Handshake',
                'Love-At-First-Swipe',
                'SinglePin',
                'Tipping-Marble',
              ].map(img => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setName(img.replace(/-/g, ' '))}
                  className="font-mono bg-muted px-2 py-0.5 rounded hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {img}
                </button>
              ))}
            </div>
            <p className="mt-1">💡 Click an image name to auto-fill the product name.</p>
          </div>
        </CardContent>
      </Card>

      {/* Product List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          All Products{' '}
          <span className="text-muted-foreground text-sm font-normal">({products.length})</span>
        </h2>

        {fetching ? (
          <div className="text-muted-foreground text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-muted-foreground text-sm">No products yet. Add one above!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <Card key={p.id} className="shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="aspect-square w-full relative rounded-md overflow-hidden bg-muted">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-sm text-muted-foreground">₹ {p.price}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProduct(p.id, p.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
