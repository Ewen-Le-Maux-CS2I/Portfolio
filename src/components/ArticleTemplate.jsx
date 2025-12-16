import { AppWindow } from './AppWindows'

export function ArticleTemplate({ article }) {
  if (!article) {
    return (
      <div className="max-w-4xl w-full mx-auto">
        <AppWindow title="Article">
          <div className="alert alert-error">
            <span>Article non trouvé</span>
          </div>
        </AppWindow>
      </div>
    )
  }

  const { title, excerpt, theme, date, author, content } = article

  return (
    <div className="max-w-4xl w-full mx-auto">
      <AppWindow title={title}>
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
        <div className="prose prose-sm max-w-none text-slate-900">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        {/* Lien retour */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <a href="/blog" className="btn btn-outline btn-sm">
            ← Retour à la liste des articles
          </a>
        </div>
      </AppWindow>
    </div>
  )
}
