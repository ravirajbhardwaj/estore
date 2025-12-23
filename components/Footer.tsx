'use client'

import { InstagramIcon, NewTwitterIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { TITLE } from '@/config/site'
import { Logo } from './Logo'

export default function Footer() {
  return (
    <footer className="w-full bottom-0 bg-background text-foreground px-4">
      <div className="mx-auto max-w-7xl py-10 flex flex-wrap justify-between gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">{TITLE}</span>
          </div>
          <p className="text-sm text-muted-foreground">Build beautiful 3D stuff</p>
        </div>

        <div className="flex gap-16">
          <FooterColumn title="Company">
            <FooterLink href="/about">About</FooterLink>
          </FooterColumn>

          <FooterColumn title="Help">
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </FooterColumn>

          <FooterColumn title="Social">
            <div className="flex gap-2">
              <FooterLink href="https://twitter.com">
                <HugeiconsIcon icon={NewTwitterIcon} size={16} />
              </FooterLink>
              <FooterLink href="https://instagram.com">
                <HugeiconsIcon icon={InstagramIcon} size={16} />
              </FooterLink>
            </div>
          </FooterColumn>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {children}
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-muted-foreground hover:text-foreground">
      {children}
    </Link>
  )
}
