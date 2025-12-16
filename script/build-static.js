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
 * Génère le HTML complet (sans JSX)
 */
function generateHtml({ title, content }) {
  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Portfolio Blog</title>
    <link rel="icon" type="image/svg+xml" href="${basePath}vite.svg" />
    <link rel="stylesheet" href="${basePath}index.css" />
  </head>
  <body>
    <div id="app">${content}</div>
    <script type="module" src="${basePath}src/main.jsx"><\/script>
  </body>
</html>`
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
 * Rend un article en HTML Preact
 */
function renderArticleHtml({ title, excerpt, theme, date, author, content, slug }) {
  return renderToString(
    h(
      'div',
      { className: 'bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-[1280px] w-full mx-auto' },
      // Header
      h(
        'div',
        { className: 'bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between' },
        h(
          'div',
          { className: 'flex items-center gap-3' },
          h(
            'div',
            { className: 'flex gap-2' },
            h('span', { className: 'w-3 h-3 rounded-full bg-rose-400' }),
            h('span', { className: 'w-3 h-3 rounded-full bg-amber-400' }),
            h('span', { className: 'w-3 h-3 rounded-full bg-emerald-400' })
          ),
          h('h1', { className: 'text-2xl font-semibold text-slate-800' }, title)
        ),
        h('a', { href: `${basePath}blog`, className: 'btn btn-outline btn-sm' }, '← Retour à la liste des articles')
      ),
      // Content
      h(
        'div',
        { className: 'p-8 space-y-4' },
        h(
          'div',
          { className: 'space-y-3 pb-6 border-b border-slate-200' },
          h('p', { className: 'text-lg text-slate-600' }, excerpt),
          h(
            'div',
            { className: 'flex items-center gap-3 text-sm text-slate-500' },
            h('span', { className: 'badge badge-primary' }, theme),
            h(null, `Par ${author}`),
            h(null, new Date(date).toLocaleDateString('fr-FR'))
          )
        ),
        h('div', {
          className: 'prose prose-sm max-w-none text-slate-900 py-6',
          dangerouslySetInnerHTML: { __html: content },
        })
      )
    )
  )
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
  fs.writeFileSync(outputPath, htmlContent)
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

      const articleHtml = renderArticleHtml(article)
      const fullHtml = generateHtml({
        title: article.title,
        content: articleHtml,
      })

      writeHtmlPage(output, fullHtml)
      console.log(`  ✔ /blog/${article.slug}`)
    } catch (err) {
      console.error(`  ✗ Erreur pour ${filePath}:`, err.message)
    }
  })
}

console.log('\n✅ Build statique terminé !\n')

