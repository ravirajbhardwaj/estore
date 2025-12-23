'use client'

import Link from 'next/link'
import { useState } from 'react'
import { GoogleIcon } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// import { signIn } from '@/lib/client'
import { cn } from '@/lib/utils'

export default function SignIn() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full min-h-screen">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Sign in to your account using one of the providers below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className={cn('w-full gap-2 flex items-center', 'justify-between flex-col')}>
              <Button
                variant="outline"
                className={cn('w-full gap-2')}
                disabled={loading}
                onClick={async () => {
                  // await signIn.social(
                  //   {
                  //     provider: 'google',
                  //     callbackURL: '/',
                  //   },
                  //   {
                  //     onRequest: () => {
                  //       setLoading(true)
                  //     },
                  //     onResponse: () => {
                  //       setLoading(false)
                  //     },
                  //   }
                  // )
                }}>
                <GoogleIcon />
                Sign in with Google
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground text-center text-xs text-balance px-4 md:px-6 mb-6 mt-4">
            By continue, you agree to our{' '}
            <Link
              href="/terms"
              className="text-primary hover:text-blue-700 underline underline-offset-4">
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="text-primary hover:text-blue-700 underline underline-offset-4">
              Privacy Policy
            </Link>
            <p className="pt-4">All rights reserved &copy; {new Date().getFullYear()}.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
