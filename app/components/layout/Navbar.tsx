import Link from 'next/link'
import Image from 'next/image'
import { auth, signIn, signOut } from '@/lib/auth'
import { SearchBar } from '@/components/SearchBar'

export async function Navbar() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-40 border-b
                       bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div className="page h-14 flex items-center gap-4">

        <Link href="/"
              className="font-semibold text-brand-600 dark:text-brand-400 shrink-0">
          DevPulse
        </Link>

        <div className="flex-1 max-w-sm">
          <SearchBar />
        </div>

        <nav className="ml-auto flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/dashboard"
                    className="text-sm text-gray-600 dark:text-gray-400
                               hover:text-gray-900 dark:hover:text-white transition-colors">
                Dashboard
              </Link>

              <form action={async () => {
                'use server'
                await signOut({ redirectTo: '/' })
              }}>
                <button type="submit"
                        className="text-sm text-gray-500
                                   hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign out
                </button>
              </form>

              {session.user.image && (
                <Image src={session.user.image}
                       alt={session.user.name ?? ''}
                       width={28} height={28}
                       className="rounded-full ring-1 ring-gray-200 dark:ring-gray-800" />
              )}
            </>
          ) : (
            <form action={async () => {
              'use server'
              await signIn('github')
            }}>
              <button type="submit"
                      className="text-sm px-3 py-1.5 rounded-lg
                                 bg-brand-600 text-white
                                 hover:bg-brand-800 transition-colors">
                Sign in with GitHub
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  )
}