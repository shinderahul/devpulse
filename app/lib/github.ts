import { auth } from './auth'

const BASE = 'https://api.github.com'

async function ghFetch(path: string, token?: string) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    headers,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${path}`)
  return res.json()
}

export interface UserStats {
  login:       string
  name:        string
  avatar:      string
  bio:         string | null
  followers:   number
  following:   number
  publicRepos: number
  totalStars:  number
}

export interface CommitDay  { date: string; count: number }

export interface Repo {
  name:        string
  description: string | null
  stars:       number
  forks:       number
  language:    string | null
  url:         string
  updatedAt:   string
}

export interface LanguageStat {
  name:    string
  bytes:   number
  percent: number
}

export async function getUserStats(username: string): Promise<UserStats> {
  const session = await auth().catch(() => null)
  const token   = session?.user?.accessToken

  const [user, repos] = await Promise.all([
    ghFetch(`/users/${username}`, token),
    ghFetch(`/users/${username}/repos?per_page=100&sort=pushed`, token),
  ])

  const totalStars = (repos as { stargazers_count: number }[])
    .reduce((s, r) => s + r.stargazers_count, 0)

  return {
    login:       user.login,
    name:        user.name ?? user.login,
    avatar:      user.avatar_url,
    bio:         user.bio,
    followers:   user.followers,
    following:   user.following,
    publicRepos: user.public_repos,
    totalStars,
  }
}

export async function getCommitActivity(username: string): Promise<CommitDay[]> {
  const session = await auth().catch(() => null)
  const token   = session?.user?.accessToken

  const repos = await ghFetch(
    `/users/${username}/repos?per_page=10&sort=pushed`, token
  ) as { name: string }[]

  const now  = new Date()
  const days: Record<string, number> = {}
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days[d.toISOString().slice(0, 10)] = 0
  }

  const results = await Promise.allSettled(
    repos.slice(0, 5).map(r =>
      ghFetch(`/repos/${username}/${r.name}/stats/commit_activity`, token)
    )
  )

  for (const r of results) {
    if (r.status !== 'fulfilled' || !Array.isArray(r.value)) continue
    for (const week of r.value as { week: number; days: number[] }[]) {
      week.days.forEach((count, i) => {
        const key = new Date((week.week + i * 86400) * 1000)
          .toISOString().slice(0, 10)
        if (key in days) days[key] += count
      })
    }
  }

  return Object.entries(days).map(([date, count]) => ({ date, count }))
}

export async function getTopRepos(username: string): Promise<Repo[]> {
  const session = await auth().catch(() => null)
  const token   = session?.user?.accessToken

  const repos = await ghFetch(
    `/users/${username}/repos?per_page=100&sort=pushed`, token
  ) as {
    name: string; description: string | null
    stargazers_count: number; forks_count: number
    language: string | null; html_url: string
    updated_at: string; fork: boolean
  }[]

  return repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map(r => ({
      name:        r.name,
      description: r.description,
      stars:       r.stargazers_count,
      forks:       r.forks_count,
      language:    r.language,
      url:         r.html_url,
      updatedAt:   r.updated_at,
    }))
}

export async function getLanguages(username: string): Promise<LanguageStat[]> {
  const session = await auth().catch(() => null)
  const token   = session?.user?.accessToken

  const repos = await ghFetch(
    `/users/${username}/repos?per_page=30&sort=pushed`, token
  ) as { name: string; fork: boolean }[]

  const maps = await Promise.allSettled(
    repos.filter(r => !r.fork).slice(0, 10).map(r =>
      ghFetch(`/repos/${username}/${r.name}/languages`, token)
    )
  )

  const totals: Record<string, number> = {}
  for (const r of maps) {
    if (r.status !== 'fulfilled') continue
    for (const [lang, bytes] of Object.entries(r.value as Record<string, number>)) {
      totals[lang] = (totals[lang] ?? 0) + bytes
    }
  }

  const grand = Object.values(totals).reduce((a, b) => a + b, 0)
  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name, bytes,
      percent: Math.round((bytes / grand) * 100),
    }))
}