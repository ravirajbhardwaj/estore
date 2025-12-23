import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div>
      <header className="sticky top-0 z-50 px-4 bg-background text-foreground">
        <nav className="mx-auto flex max-w-7xl items-center justify-between py-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-2xl px-4 pb-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {Array.from({ length: 8 }).map(() => (
            <div key={Math.random()} className="group relative">
              <Skeleton className="aspect-square w-full rounded-md lg:h-80" />
              <div className="mt-4 flex justify-between gap-4">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
