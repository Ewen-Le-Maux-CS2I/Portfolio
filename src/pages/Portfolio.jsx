import { useEffect, useState } from 'preact/hooks'
import { AppWindow } from '../components/AppWindows'
import { loadProjectsClient } from '../lib/content'

const basePath = import.meta.env.BASE_URL

export function Portfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjectsClient().then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <AppWindow title="Portfolio">
        <div className="alert alert-info">
          <span>Chargement des projets...</span>
        </div>
      </AppWindow>
    )
  }

  return (
    <AppWindow title="Portfolio">
      {projects.length === 0 ? (
        <div className="alert">
          <span>
            Aucun projet pour le moment.
          </span>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.slug}
              role="link"
              tabIndex={0}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer"
              onClick={() => {
                window.location.href = `${basePath}portfolio/${p.slug}`
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  window.location.href = `${basePath}portfolio/${p.slug}`
                }
              }}
            >
              <div className="h-28 bg-gradient-to-br from-indigo-500/80 via-sky-500/70 to-emerald-400/70" />
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:underline">{p.title}</h3>
                {p.summary && <p className="text-sm text-slate-600 line-clamp-3">{p.summary}</p>}
                {p.stack?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.stack.slice(0, 6).map((tech) => (
                      <span key={tech} className="badge badge-outline badge-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Demo
                    </a>
                  )}
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppWindow>
  )
}
