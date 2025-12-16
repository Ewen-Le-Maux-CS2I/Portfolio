const dockItems = (
  basePath,
) => [
  { label: 'Accueil', href: `${basePath}` },
  { label: 'Portfolio', href: `${basePath}portfolio` },
  { label: 'Blog', href: `${basePath}blog` },
  { label: 'Contact', href: 'mailto:contact@example.com', external: true },
]

export function Dock({ basePath }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center">
      <div className="pointer-events-auto backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl px-4 py-2 flex gap-3 items-end">
        {dockItems(basePath).map((item) => (
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              className="btn btn-ghost btn-sm text-white"
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          ) : (
            <a
              key={item.label}
              href={item.href}
              className="btn btn-ghost btn-sm text-white"
            >
              {item.label}
            </a>
          )
        ))}
      </div>
    </div>
  )
}
