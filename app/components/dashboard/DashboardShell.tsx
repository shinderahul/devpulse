import Image from 'next/image'
import type { User } from 'next-auth'

interface Props {
  user?:       Partial<User>
  publicUser?: string
  children:    React.ReactNode
}

export function DashboardShell({ user, publicUser, children }: Props) {
  const name   = user?.name  ?? publicUser ?? ''
  const image  = user?.image ?? null
  const handle = user?.name  ?? publicUser ?? ''

  return (
    <div className="page py-8">
      <div className="flex items-center gap-4 mb-8">
        {image && (
          <Image src={image} alt={name} width={56} height={56}
                 className="rounded-full ring-2 ring-gray-100 dark:ring-gray-800" />
        )}
        <div>
          <h1 className="text-xl font-semibold">{name}</h1>
          <a href={`https://github.com/${handle}`}
             target="_blank" rel="noreferrer"
             className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            @{handle}
          </a>
        </div>
      </div>
      {children}
    </div>
  )
}