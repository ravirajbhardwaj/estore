'use client'

import {
  Home01Icon,
  MenuSquareIcon,
  ShoppingBasket01Icon,
  User03Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { ModeSwitcher } from '@/components/ModeSwitcher'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from './Logo'
import { Button } from './ui/button'

// import Logo from './ui/logo'

const navItems = [
  {
    name: 'Home',
    herf: '/',
    icon: <HugeiconsIcon icon={Home01Icon} />,
  },
  {
    name: 'Order',
    herf: '/order',
    icon: <HugeiconsIcon icon={ShoppingBasket01Icon} />,
  },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 bg-background text-foreground">
      <nav className="mx-auto flex max-w-7xl items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger>
              <HugeiconsIcon icon={MenuSquareIcon} size={16} />
            </SheetTrigger>

            <SheetContent side="right" className="p-8">
              <div className="flex flex-col gap-4">
                {navItems.map(item => (
                  <Link
                    key={item.name}
                    href={item.herf}
                    className="flex items-center gap-3 text-sm font-medium">
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Separator orientation="vertical" className={'h-5 w-px'} />
          <ModeSwitcher />
          <Separator orientation="vertical" className={'h-5 w-px'} />

          <Link href={'/auth'}>
            <Button variant={'ghost'}>
              <HugeiconsIcon icon={User03Icon} strokeWidth={3} />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
