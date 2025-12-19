import { useEffect, useState } from 'preact/hooks'
import { AppWindow } from '../components/AppWindows'
import { loadProjectsClient } from '../lib/content'

const basePath = import.meta.env.BASE_URL

export function PortfolioProject({ slug }) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    loadProjectsClient().then((projects) => {
      const found = projects.find((p) => p.slug === slug)
      if (found) {
        setProject(found)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <AppWindow title="Chargement...">
        <div className="alert alert-info">
          <span>Chargement du projet...</span>
        </div>
      </AppWindow>
    )
  }

  if (notFound || !project) {
    return (
      <AppWindow title="Projet introuvable">
        <div className="alert alert-error">
          <span>Le projet "{slug}" n'existe pas.</span>
        </div>
        <div className="mt-4">
          <a href={`${basePath}portfolio`} className="btn btn-primary btn-sm">
            ← Retour au portfolio
          </a>
        </div>
      </AppWindow>
    )
  }

  const { title, summary, stack, tags, demo, repo, content, date } = project

  return (
    <AppWindow
      title=""
      headerLayout="column"
      actions={
        <a href={`${basePath}portfolio`} className="btn btn-outline btn-sm">
          ← Retour au portfolio
        </a>
      }
    >
      <div className="space-y-4 pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 break-words">{title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="badge badge-primary">{new Date(date).toLocaleDateString('fr-FR')}</span>
          {stack?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {stack.slice(0, 8).map((tech) => (
                <span key={tech} className="badge badge-outline badge-sm">
                  {tech}
                </span>
              ))}
            </div>
          )}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 8).map((tag) => (
                <span key={tag} className="badge badge-accent badge-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {summary && <p className="text-lg text-slate-600">{summary}</p>}
        <div className="flex items-center gap-2">
          {demo && (
            <a href={demo} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
              Voir la démo
            </a>
          )}
          {repo && (
            <a href={repo} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
              Voir le code
            </a>
          )}
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-slate-900 py-6">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </AppWindow>
  )
}
