import Link from 'next/link'

export async function Navbar() {

    return (
        <header className="sticky top-0 z-40 border-b
                       bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
            <div className="page h-14 flex items-center gap-4">

                <Link href="/"
                    className="font-semibold text-brand-600 dark:text-brand-400 shrink-0">
                    DevPulse
                </Link>


                <nav className="ml-auto flex items-center gap-3">
                    <button type="submit"
                        className="text-sm px-3 py-1.5 rounded-lg
                                 bg-brand-600 text-white
                                 hover:bg-brand-800 transition-colors">
                        Sign in with GitHub
                    </button>
                </nav>
            </div>
        </header>
    )
}