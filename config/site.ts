import type { Metadata } from 'next'

const TITLE = ''
const DESCRIPTION = ''

const CREATOR = ''

const PREVIEW_IMAGE_URL = ''
const ALT_TITLE = ''
const BASE_URL = ''

export const siteConfig: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
  },
  authors: [{ name: CREATOR }],
  creator: CREATOR,
  publisher: CREATOR,
  applicationName: '',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  twitter: {
    creator: '@eravitw',
    title: TITLE,
    description: DESCRIPTION,
    card: 'summary_large_image',
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Estore',
    url: BASE_URL,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  category: 'ecommerce',
  classification: 'Sell and Buy products',
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: ['', '', ''],
}
