export type Products = {
  id: number
  name: string
  price: number
  image: string
}

export type RazorpayHandlerResponse = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}
