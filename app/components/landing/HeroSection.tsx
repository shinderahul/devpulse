import { signIn } from '@/lib/auth'

export function HeroSection() {
    return (
        <div className="page flex flex-col items-center justify-center
                    min-h-[80vh] text-center gap-6 py-20">

            <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full
                      border border-brand-200 text-brand-600 dark:text-brand-400
                      bg-brand-50 dark:bg-brand-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                Public beta
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl">
                Your GitHub activity,{' '}
                <span className="text-brand-600 dark:text-brand-400">
                    beautifully visualised
                </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">
                DevPulse turns your GitHub data into a clean dashboard — commit heatmaps,
                top repos, language breakdowns, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <form action={async () => {
                    'use server'
                    await signIn('github')
                }}>
                    <button type="submit"
                        className="px-6 py-3 rounded-xl bg-brand-600 text-white
                             font-medium hover:bg-brand-800 transition-colors">
                        Sign in with GitHub
                    </button>
                </form>

                <a href="/u/torvalds"
                    className="px-6 py-3 rounded-xl border font-medium
                      text-gray-700 dark:text-gray-300
                      hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    See an example →
                </a>
            </div>

            <p className="text-xs text-gray-400">
                Only reads public data · No write access required
            </p>
        </div>
    )
}