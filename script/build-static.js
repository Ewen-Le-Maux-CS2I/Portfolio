import fs from 'fs'
import path from 'path'
import { renderToString } from 'preact-render-to-string'
import { h } from 'preact'
import matter from 'gray-matter'
import { marked } from 'marked'

// Dossiers
const CONTENT_DIR = path.resolve('src/content')
const DIST_DIR = path.resolve('dist')
const basePath = '/Portfolio/' // À adapter selon ton repo GitHub

console.log('🔨 Démarrage du build statique SSG...\n')

// Crée le dossier dist s'il n'existe pas
fs.mkdirSync(DIST_DIR, { recursive: true })

/**
 * Layout HTML global minimal
 */
function HtmlLayout({ title, content, htmlContent }) {
  return (
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} - Portfolio Blog</title>
        <link rel="icon" type="image/svg+xml" href={`${basePath}vite.svg`} />
        <script type="module" src={`${basePath}src/main.jsx`}></script>
      </head>
      <body>
        <div id="app">{content}</div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__SSG_DATA__ = ${JSON.stringify({ htmlContent })}`,
          }}
        />
      </body>
    </html>
  )
}

/**
 * Composant Article (simplifié pour SSG)
 */
function ArticleSSG({ article }) {
  return (
    <div className="max-w-4xl w-full mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* En-tête */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">{article.title}</h1>
          </div>
        </div>

        <div className="p-8 space-y-4">
          {/* Metadata */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <p className="text-lg text-slate-600">{article.excerpt}</p>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="badge badge-primary">{article.theme}</span>
              <span>Par {article.author}</span>
              <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Contenu */}
          <div
            className="prose prose-sm max-w-none text-slate-900"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Lien retour */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <a href={`${basePath}blog`} className="btn btn-outline btn-sm">
              ← Retour au blog
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Parse un fichier Markdown et retourne l'article
 */
function parseArticle(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    title: data.title || 'Sans titre',
    slug: data.slug || path.basename(filePath, '.md'),
    excerpt: data.excerpt || '',
    theme: data.theme || 'Général',
    date: data.date || new Date().toISOString().split('T')[0],
    author: data.author || 'Anonyme',
    content: marked(content),
  }
}

/**
 * Parcourt un dossier récursivement
 */
function walk(dir) {
  return fs.readdirSync(dir).flatMap((file) => {
    const fullPath = path.join(dir, file)
    return fs.statSync(fullPath).isDirectory() ? walk(fullPath) : fullPath
  })
}

/**
 * Génère une page HTML statique
 */
function writeHtmlPage(outputPath, htmlContent) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  const html = `<!DOCTYPE html>\n${htmlContent}`
  fs.writeFileSync(outputPath, html)
}

// ===== GÉNÉRATION DES ARTICLES BLOG =====
console.log('📝 Génération des pages d\'articles...')

const blogDir = path.join(CONTENT_DIR, 'blog')
if (fs.existsSync(blogDir)) {
  const blogFiles = walk(blogDir).filter((file) => file.endsWith('.md'))

  blogFiles.forEach((filePath) => {
    try {
      const article = parseArticle(filePath)
      const output = path.join(DIST_DIR, 'blog', article.slug, 'index.html')

      // Rendre le composant en HTML
      const articleHtml = renderToString(h(ArticleSSG, { article }))
      const fullHtml = renderToString(
        h(HtmlLayout, {
          title: article.title,
          content: articleHtml,
          htmlContent: article.content,
        })
      )

      writeHtmlPage(output, fullHtml)
      console.log(`  ✔ /blog/${article.slug}`)
    } catch (err) {
      console.error(`  ✗ Erreur pour ${filePath}:`, err.message)
    }
  })
}

console.log('\n✅ Build statique terminé !\n')

