import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutUs() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-muted/40 bg-muted/10">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-4 text-primary">About Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90 leading-relaxed">
            <p>
              At Estore Gifting, we specialize in creating customized 3D Printed LED Frames and
              personalized gifts that make every occasion memorable.
            </p>
            <p>
              Every product is crafted with care, combining innovation, quality, and elegance to
              deliver the perfect gift for your loved ones. Whether it’s a birthday, anniversary, or
              special celebration, our gifts are designed to light up hearts and homes.
            </p>
            <p>
              We believe in premium quality, thoughtful design, and personal touch, ensuring every
              gift from Surprise Soul becomes a cherished memory.
            </p>
            <h3 className="text-xl font-semibold mb-4 text-primary">Why Choose Us:</h3>
            <ul className="list-disc list-inside">
              <li>
                <strong>Customized Designs:</strong> Tailored to your preferences for a unique
                gifting experience.
              </li>
              <li>
                <strong>Premium Quality:</strong> High-quality 3D printing with warm LED glow for
                lasting impression.
              </li>
              <li>
                <strong>Perfect for Gifting:</strong> Ready-to-gift packaging, perfect for couples,
                friends, and family.
              </li>
            </ul>
            <h3 className="text-xl font-semibold mb-4 text-primary">Get in Touch</h3>
            <CardContent className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                For faster assistance, please include your order number and details when contacting
                us via email or phone:
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p>
                  <strong>Email:</strong> estore@email.com
                </p>
                <p>
                  <strong>Phone:</strong> +91 9999999999
                </p>
                <p>
                  <strong>Address:</strong> Sonipat Sector 1, Haryana, India
                </p>
                <p>
                  <strong>Response Time:</strong> We aim to respond within 5 business days
                </p>
              </div>
            </CardContent>
          </CardContent>
        </Card>
        <div className="text-center mt-12">
          <Button variant="outline" className="h-12 px-8">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
