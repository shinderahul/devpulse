import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
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

export const revalidate = 3600

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/')

  const username = session.user.name ?? ''

  const [stats, commits, repos, langs] = await Promise.all([
    getUserStats(username),
    getCommitActivity(username),
    getTopRepos(username),
    getLanguages(username),
  ])

  return (
    <DashboardShell user={session.user}>
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
}