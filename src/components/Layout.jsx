import { Nav } from './Nav'
import { Dock } from './Dock'

export function Layout({ basePath, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-base-content">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_30%_80%,rgba(16,185,129,0.12),transparent_25%)]" aria-hidden />
      <div className="relative flex flex-col min-h-screen">
        <Nav basePath={basePath} />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-28 pt-6">{children}</main>
        <Dock basePath={basePath} />
      </div>
    </div>
  )
}
