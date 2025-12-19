const links = (basePath) => [
  { label: 'Accueil', href: join(basePath)},
  { label: 'Portfolio', href: join(basePath, 'portfolio') },
  { label: 'Blog', href: join(basePath, 'blog') },
  { label: 'Contact', href: 'mailto:contact@bob-it.com', external: true },
]

function join(base, slug) {
  const b = (base || '/').replace(/\/+$/, '')
  if (!slug) return b || '/'
  return `${b}/${slug}`
}

function normalize(path) {
  if (!path) return '/'
  return ('/' + path.replace(/^\/+/, '')).replace(/\/+$/, '') || '/'
}

function isActive(href, basePath) {
  if (typeof window === 'undefined') return false

  const current = normalize(window.location.pathname)
  const target = normalize(href)
  const root = "/Portfolio"


  if (target === root) {
    return current === root
  }

  // Autres liens 
  return current === target || current.startsWith(`${target}/`)
}


export function Dock({ basePath = '/' }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center">
      <div className="pointer-events-auto backdrop-blur-xl bg-white/20 border border-white/25 shadow-2xl rounded-2xl px-4 py-2 flex gap-3 items-end">
        {links(basePath).map((item) => {
          const active = !item.external && isActive(item.href)
          const baseCls =
            'px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform border'
          const hoverCls = 'hover:-translate-y-1 hover:shadow-xl'
          const themeCls = active
            ? 'bg-white text-slate-900 border-emerald-300 ring-2 ring-emerald-400/80 shadow-2xl'
            : 'bg-white/80 text-slate-900 border-white/40 hover:bg-white hover:text-slate-900'
          const sharedCls = `${baseCls} ${hoverCls} ${themeCls}`

          return item.external ? (
            <a
              key={item.label}
              href={item.href}
              className={sharedCls}
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          ) : (
            <a key={item.label} href={item.href} className={sharedCls}>
              {item.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}