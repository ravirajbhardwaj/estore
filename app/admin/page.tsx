'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProductPage() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  const addProduct = async () => {
    if (!name || !price) return
    await fetch('/api/product', {
      method: 'POST',
      body: JSON.stringify({ name, price }),
    })
    setName('')
    setPrice('')
  }

  return (
    <div className="min-h-90 flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold text-center">Add Product</h2>

        <div className="space-y-2">
          <div>
            <Label htmlFor="name" className="mt-3">
              Product Name
            </Label>
            <Input
              id="name"
              value={name}
              className="mt-3"
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="price" className="mt-3">
              Price
            </Label>
            <Input
              id="price"
              value={price}
              className="mt-3"
              onChange={e => setPrice(e.target.value)}
            />
          </div>

          <Button className="w-full mt-3" onClick={addProduct}>
            Add Product
          </Button>
        </div>
      </div>
    </div>
  )
}
