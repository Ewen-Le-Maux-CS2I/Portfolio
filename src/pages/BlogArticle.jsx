import { useState, useEffect } from 'preact/hooks'
import { AppWindow } from '../components/AppWindows'
import { loadArticlesClient } from '../lib/content'

const basePath = import.meta.env.BASE_URL

export function BlogArticle({ slug }) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    loadArticlesClient().then((articles) => {
      const found = articles.find((a) => a.slug === slug)
      if (found) {
        setArticle(found)
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
          <span>Chargement de l'article...</span>
        </div>
      </AppWindow>
    )
  }

  if (notFound || !article) {
    return (
      <AppWindow title="Article non trouvé">
        <div className="alert alert-error">
          <span>L'article "{slug}" n'existe pas.</span>
        </div>
        <div className="mt-4">
          <a href={`${basePath}blog`} className="btn btn-primary btn-sm">
            ← Retour au blog
          </a>
        </div>
      </AppWindow>
    )
  }

  const { title, excerpt, theme, date, author, content } = article

  return (
    <AppWindow
      title={title}
      actions={
        <a href={`${basePath}blog`} className="btn btn-outline btn-sm">
          ← Retour au blog
        </a>
      }
    >
        {/* En-tête */}
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
          <p className="text-lg text-slate-600">{excerpt}</p>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="badge badge-primary">{theme}</span>
            <span>Par {author}</span>
            <span>{new Date(date).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        {/* Contenu */}
        <div className="prose prose-sm max-w-none text-slate-900 py-6">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        {/* Lien retour déplacé dans l'en-tête via AppWindow.actions */}
      </AppWindow>
  )
}
