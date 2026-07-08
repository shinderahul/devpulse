import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { TopRepos } from '@/components/dashboard/TopRepos'
import { CommitHeatmap } from '@/components/charts/CommitHeatmap'
import { LanguageChart } from '@/components/charts/LanguageChart'
import {
  getUserStats,
  getCommitActivity,
  getTopRepos,
  getLanguages,
} from '@/lib/github'

// Next.js 15/16 — params is a Promise
interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return {
    title:       username,
    description: `GitHub activity for ${username}`,
  }
}

export const revalidate = 3600

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params

  try {
    const [stats, commits, repos, langs] = await Promise.all([
      getUserStats(username),
      getCommitActivity(username),
      getTopRepos(username),
      getLanguages(username),
    ])

    return (
      <DashboardShell publicUser={username}>
        <StatsGrid stats={stats} />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CommitHeatmap data={commits} />
          </div>
          <LanguageChart data={langs} />
        </div>
        <div className="mt-6">
          <TopRepos repos={repos} />
        </div>
      </DashboardShell>
    )
  } catch {
    notFound()
  }
}