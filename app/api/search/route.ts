import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q || q.length < 2) return NextResponse.json({ users: [] })

  // GitHub search works without a token (60 req/hr)
  // Add GITHUB_TOKEN to .env.local for 5000 req/hr
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const res = await fetch(
    `https://api.github.com/search/users?q=${encodeURIComponent(q)}&per_page=6`,
    { headers, next: { revalidate: 60 } }
  )

  if (!res.ok) return NextResponse.json({ users: [] }, { status: res.status })

  const data = await res.json()
  return NextResponse.json({
    users: (data.items as { login: string; avatar_url: string }[]).map(u => ({
      login:  u.login,
      avatar: u.avatar_url,
    })),
  })
}