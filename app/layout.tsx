import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { geistMono, geistSans, inter } from '@/config/font'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = siteConfig

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning={true} lang="en" className={inter.variable}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
