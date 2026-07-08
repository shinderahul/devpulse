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
import { Avatar, Badge } from 'shinderahul-pebble-ui'
import 'shinderahul-pebble-ui/styles.css';

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
      <div className="flex items-center gap-4 mb-6">
        <Badge variant="success">This storybook library will utilise letters</Badge>
        <Badge variant="danger">Danger</Badge>
        <Avatar src={session.user.image ?? 'Rahul Shinde'} size="lg" />
      </div>
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