import type { Repo } from '@/lib/github'
import { formatDistanceToNow } from 'date-fns'

interface Props { repos: Repo[] }

const LANG_COLORS: Record<string, string> = {
  TypeScript:  '#3178c6', JavaScript: '#f0db4f',
  Python:      '#3572a5', Rust:       '#dea584',
  Go:          '#00add8', CSS:        '#563d7c',
  HTML:        '#e34c26', Java:       '#b07219',
}

export function TopRepos({ repos }: Props) {
  return (
    <section>
      <h2 className="text-base font-semibold mb-3">Top repositories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {repos.map(repo => (
          <a key={repo.name}
             href={repo.url} target="_blank" rel="noreferrer"
             className="group block bg-white dark:bg-gray-900 border rounded-xl p-4
                        hover:border-brand-400 transition-colors">
            <p className="font-medium text-sm text-brand-600 dark:text-brand-400
                          group-hover:underline truncate">
              {repo.name}
            </p>
            {repo.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full"
                        style={{ background: LANG_COLORS[repo.language] ?? '#888' }} />
                  {repo.language}
                </span>
              )}
              <span>★ {repo.stars.toLocaleString()}</span>
              <span className="ml-auto">
                {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}