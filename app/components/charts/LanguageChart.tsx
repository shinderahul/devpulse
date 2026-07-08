'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { LanguageStat } from '@/lib/github'

interface Props { data: LanguageStat[] }

const COLORS = [
  '#185FA5','#1D9E75','#D85A30','#534AB7',
  '#BA7517','#D4537E','#639922','#5F5E5A',
]

export function LanguageChart({ data }: Props) {
  if (!data.length) return null
  const total = data.reduce((s, d) => s + d.bytes, 0)

  return (
    <section className="bg-white dark:bg-gray-900 border rounded-xl p-4">
      <h2 className="text-base font-semibold mb-3">Languages</h2>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} dataKey="bytes" nameKey="name"
               cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${((value / total) * 100).toFixed(1)}%`, name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="space-y-1 mt-2">
        {data.map((lang, i) => (
          <li key={lang.name} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-gray-700 dark:text-gray-300">{lang.name}</span>
            <span className="ml-auto text-gray-400">{lang.percent}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}