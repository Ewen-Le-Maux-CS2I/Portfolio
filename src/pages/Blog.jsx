import { useState, useMemo, useEffect } from 'preact/hooks'
import { AppWindow } from '../components/AppWindows'
import { loadArticlesClient } from '../lib/content'

const basePath = import.meta.env.BASE_URL

export function Blog() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Charger les articles au montage
  useEffect(() => {
    loadArticlesClient().then((data) => {
      setArticles(data)
      setLoading(false)
    })
  }, [])

  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.theme.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query)
    )
  }, [searchQuery, articles])

  const themes = [...new Set(articles.map((a) => a.theme))].sort()

  const handleThemeFilter = (theme) => {
    setSearchQuery(theme)
  }

  if (loading) {
    return (
      <AppWindow title="Blog">
        <div className="alert alert-info">
          <span>Chargement des articles...</span>
        </div>
      </AppWindow>
    )
  }

  return (
    <AppWindow title="Blog">
        {/* Barre de recherche */}
        <div className="space-y-4 pb-6 border-b border-slate-200">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-900">Rechercher</span>
            </label>
            <input
              type="text"
              placeholder="Titre, thème, contenu..."
              className="input input-bordered input-sm w-full bg-white text-slate-900 placeholder-slate-400"
              value={searchQuery}
              onInput={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filtres par thème */}
          <div className="flex gap-2 flex-wrap">
            <button
              className={`badge badge-sm cursor-pointer transition ${
                searchQuery === '' ? 'badge-primary' : 'badge-outline'
              }`}
              onClick={() => setSearchQuery('')}
            >
              Tous ({articles.length})
            </button>
            {themes.map((theme) => (
              <button
                key={theme}
                className={`badge badge-sm cursor-pointer transition ${
                  searchQuery === theme ? 'badge-primary' : 'badge-outline'
                }`}
                onClick={() => handleThemeFilter(theme)}
              >
                {theme} ({articles.filter((a) => a.theme === theme).length})
              </button>
            ))}
          </div>
        </div>

        {/* Résultats */}
        {filteredArticles.length === 0 ? (
          <div className="alert alert-info">
            <span>Aucun article ne correspond à votre recherche.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div key={article.slug} className="card bg-base-100 border border-slate-200 hover:shadow-md transition">
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <a
                        href={`${basePath}blog/${article.slug}`}
                        className="card-title text-lg hover:underline text-slate-900"
                      >
                        {article.title}
                      </a>
                      <p className="text-sm text-slate-600 mt-2">{article.excerpt}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                        <span className="badge badge-primary">{article.theme}</span>
                        <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                        <span>Par {article.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AppWindow>
  )
}
