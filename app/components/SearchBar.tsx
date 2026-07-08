'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface User { login: string; avatar: string }

export function SearchBar() {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [open,    setOpen]    = useState(false)
  const router = useRouter()
  const timer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (query.length < 2) { setResults([]); setLoading(false); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.users ?? [])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [query])

  function go(login: string) {
    setQuery(''); setOpen(false)
    router.push(`/u/${login}`)
  }

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search GitHub users…"
        className="w-full h-8 px-3 text-sm rounded-lg border
                   bg-gray-50 dark:bg-gray-900
                   placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
      {open && (results.length > 0 || loading) && (
        <div className="absolute top-full mt-1 w-full z-50 overflow-hidden
                        bg-white dark:bg-gray-900 border rounded-xl shadow-lg">
          {loading && (
            <p className="px-3 py-2 text-xs text-gray-400">Searching…</p>
          )}
          {results.map(u => (
            <button
              key={u.login}
              onMouseDown={() => go(u.login)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm
                         text-left hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Image src={u.avatar} alt={u.login} width={20} height={20}
                     className="rounded-full" />
              {u.login}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}