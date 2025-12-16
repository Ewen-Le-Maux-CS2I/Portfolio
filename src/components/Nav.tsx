
import { h, Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'

function formatDateTime(now: Date) {
    const date = now.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    return { date, time }
}

export function Nav({ basePath = '/' }: { basePath?: string }) {
    const [{ date, time }, setNow] = useState(() => formatDateTime(new Date()))

    useEffect(() => {
        const id = setInterval(() => setNow(formatDateTime(new Date())), 30_000)
        return () => clearInterval(id)
    }, [])

    return (
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-black/20 border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-sm text-slate-100">
                <div className="flex items-center gap-4">
                    <nav className="flex gap-3">
                        <a className="hover:underline" href={basePath}>Accueil</a>
                        <a className="hover:underline" href={`${basePath}portfolio`}>Portfolio</a>
                        <a className="hover:underline" href={`${basePath}blog`}>Blog</a>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">{time}</span>
                    <span className="text-slate-300">{date}</span>
                </div>
            </div>
        </header>
    )
}
