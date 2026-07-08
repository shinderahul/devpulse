'use client'

import type { CommitDay } from '@/lib/github'

interface Props { data: CommitDay[] }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                'Jul','Aug','Sep','Oct','Nov','Dec']

function color(count: number) {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
  if (count < 3)   return 'bg-brand-50  dark:bg-brand-900'
  if (count < 7)   return 'bg-brand-400 dark:bg-brand-600'
  if (count < 15)  return 'bg-brand-600 dark:bg-brand-400'
  return 'bg-brand-800 dark:bg-brand-200'
}

export function CommitHeatmap({ data }: Props) {
  const weeks: CommitDay[][] = []
  let week: CommitDay[] = []

  for (const day of data) {
    const dow = new Date(day.date + 'T00:00:00').getDay()
    if (dow === 0 && week.length) { weeks.push(week); week = [] }
    week.push(day)
  }
  if (week.length) weeks.push(week)

  const labels: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((wk, i) => {
    const m = new Date(wk[0].date + 'T00:00:00').getMonth()
    if (m !== lastMonth) { labels.push({ label: MONTHS[m], col: i }); lastMonth = m }
  })

  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <section className="bg-white dark:bg-gray-900 border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">Commit activity</h2>
        <span className="text-xs text-gray-500">
          {total.toLocaleString()} commits · last year
        </span>
      </div>
      <div className="overflow-x-auto pb-1">
        <div style={{ minWidth: weeks.length * 14 + 28 }}>
          <div className="flex ml-6 mb-1 relative h-4">
            {labels.map(({ label, col }) => (
              <span key={label + col}
                    className="absolute text-[10px] text-gray-400"
                    style={{ left: col * 14 }}>
                {label}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 mr-1 mt-0.5">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <span key={i} className="text-[10px] text-gray-400 h-3 flex items-center">
                  {d}
                </span>
              ))}
            </div>
            <div className="flex gap-0.5">
              {weeks.map((wk, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {Array.from({ length: 7 }, (_, di) => {
                    const day = wk.find(
                      d => new Date(d.date + 'T00:00:00').getDay() === di
                    )
                    return (
                      <div key={di}
                           title={day ? `${day.date}: ${day.count}` : undefined}
                           className={`w-3 h-3 rounded-sm ${day ? color(day.count) : 'bg-transparent'}`} />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 justify-end">
        <span className="text-[10px] text-gray-400">Less</span>
        {[0,2,5,10,20].map(n => (
          <div key={n} className={`w-3 h-3 rounded-sm ${color(n)}`} />
        ))}
        <span className="text-[10px] text-gray-400">More</span>
      </div>
    </section>
  )
}