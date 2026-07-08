import type { UserStats } from '@/lib/github'

interface Props { stats: UserStats }

export function StatsGrid({ stats }: Props) {
  const cards = [
    { label: 'Public repos', value: stats.publicRepos.toLocaleString() },
    { label: 'Total stars',  value: stats.totalStars.toLocaleString() },
    { label: 'Followers',    value: stats.followers.toLocaleString() },
    { label: 'Following',    value: stats.following.toLocaleString() },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(({ label, value }) => (
        <div key={label}
             className="bg-white dark:bg-gray-900 border rounded-xl p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      ))}
    </div>
  )
}