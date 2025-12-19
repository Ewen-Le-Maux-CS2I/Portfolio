import fs from 'fs'
import path from 'path'
import { renderToString } from 'preact-render-to-string'
import { h } from 'preact'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

// Dossiers
const CONTENT_DIR = path.resolve('src/content')
const DIST_DIR = path.resolve('dist')
// Chemin de base GitHub Pages (doit correspondre à vite.config.js)
const basePath = '/Portfolio/'
const templatePath = path.resolve('dist/index.html')
const baseTemplate = fs.readFileSync(templatePath, 'utf-8')

const md = new MarkdownIt('commonmark', { 
  html: true, 
  linkify: true, 
  breaks: true
})

console.log('🔨 Démarrage du build statique SSG...\n')

// Crée le dossier dist s'il n'existe pas
fs.mkdirSync(DIST_DIR, { recursive: true })

/**
 * Génère le HTML complet (sans JSX)
 */
function generateHtml({ content, includeScript = false }) {
  let html = baseTemplate
    .replace('<div id="app"></div>', `<div id="app">${content}</div>`)

  // Ajuster ou supprimer le script selon le besoin
  if (includeScript) {
    html = html.replace(
      /<script type="module" src="[^"]*main\.jsx"><\/script>/,
      `<script type="module" src="${basePath}src/main.jsx"></script>`
    )
  } else {
    html = html.replace(/\s*<script type="module" src="[^"]*main\.jsx"><\/script>/, '')
  }

  return html
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
    content: md.render(content),
  }
}

/**
 * Rend un article en HTML Preact
 */
function renderArticleHtml({ title, excerpt, theme, date, author, content, slug: _slug }) {
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
  const articlesIndex = []

  blogFiles.forEach((filePath) => {
    try {
      const article = parseArticle(filePath)
      const output = path.join(DIST_DIR, 'blog', article.slug, 'index.html')

      const articleHtml = renderArticleHtml(article)
      const fullHtml = generateHtml({
        content: articleHtml,
        includeScript: false,
      })

      writeHtmlPage(output, fullHtml)
      console.log(`  ✔ /blog/${article.slug}`)

      // collect minimal metadata for index
      articlesIndex.push({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        theme: article.theme,
        date: article.date,
        author: article.author
      })
    } catch (err) {
      console.error(`  ✗ Erreur pour ${filePath}:`, err.message)
    }
  })

  // --- Générer la page index du blog (cards pré-rendues)
  try {
    const cards = articlesIndex.map((a) =>
      h(
        'div',
        { className: 'card bg-base-100 border border-slate-200 hover:shadow-md transition' },
        h(
          'div',
          { className: 'card-body p-4' },
          h(
            'div',
            { className: 'flex items-start justify-between gap-4' },
            h(
              'div',
              { className: 'flex-1' },
              h(
                'a',
                { href: `${basePath}blog/${a.slug}`, className: 'card-title text-lg hover:underline text-slate-900' },
                a.title
              ),
              h('p', { className: 'text-sm text-slate-600 mt-2' }, a.excerpt),
              h(
                'div',
                { className: 'flex items-center gap-3 mt-3 text-xs text-slate-500' },
                h('span', { className: 'badge badge-primary' }, a.theme),
                h('span', null, new Date(a.date).toLocaleDateString('fr-FR')),
                h('span', null, `Par ${a.author}`)
              )
            )
          )
        )
      )
    )

    const indexHtml = renderToString(
      h(
        'div',
        { className: 'max-w-[1280px] w-full mx-auto' },
        h('div', { className: 'space-y-4' }, ...cards)
      )
    )

    const full = generateHtml({ content: indexHtml, includeScript: false })
    writeHtmlPage(path.join(DIST_DIR, 'blog', 'index.html'), full)
    console.log('  ✔ /blog/index.html généré')
  } catch (err) {
    console.error('  ✗ Erreur en générant /blog/index.html:', err.message)
  }
}

// ===== GÉNÉRATION DES PROJETS PORTFOLIO =====
console.log('\n🎨 Génération des pages portfolio...')

const portfolioDir = path.join(CONTENT_DIR, 'portfolio')
if (fs.existsSync(portfolioDir)) {
  const projFiles = walk(portfolioDir).filter((file) => file.endsWith('.md'))
  const projectsIndex = []

  projFiles.forEach((filePath) => {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)

      const project = {
        title: data.title || 'Sans titre',
        slug: data.slug || path.basename(filePath, '.md'),
        summary: data.summary || data.excerpt || '',
        date: data.date || new Date().toISOString().split('T')[0],
        tags: Array.isArray(data.tags) ? data.tags : (data.tags ? String(data.tags).split(',').map(s => s.trim()) : []),
        stack: Array.isArray(data.stack) ? data.stack : (data.stack ? String(data.stack).split(',').map(s => s.trim()) : []),
        demo: data.demo || '',
        repo: data.repo || '',
        content: md.render(content),
      }

      // render project page
      const projectHtml = renderToString(
        h(
          'div',
          { className: 'bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-[1280px] w-full mx-auto' },
          h(
            'div',
            { className: 'bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between' },
            h(
              'div',
              { className: 'flex items-center gap-3' },
              h('div', { className: 'flex gap-2' },
                h('span', { className: 'w-3 h-3 rounded-full bg-rose-400' }),
                h('span', { className: 'w-3 h-3 rounded-full bg-amber-400' }),
                h('span', { className: 'w-3 h-3 rounded-full bg-emerald-400' })
              ),
              h('h1', { className: 'text-2xl font-semibold text-slate-800' }, project.title)
            ),
            h('a', { href: `${basePath}portfolio`, className: 'btn btn-outline btn-sm' }, '← Retour au portfolio')
          ),
          h('div', { className: 'p-8 space-y-4' },
            h('div', { className: 'space-y-3 pb-6 border-b border-slate-200' },
              h('p', { className: 'text-lg text-slate-600' }, project.summary),
              h('div', { className: 'flex items-center gap-3 text-sm text-slate-500' },
                h('span', { className: '' }, new Date(project.date).toLocaleDateString('fr-FR'))
              )
            ),
            h('div', { className: 'prose prose-sm max-w-none text-slate-900 py-6', dangerouslySetInnerHTML: { __html: project.content } })
          )
        )
      )

      const output = path.join(DIST_DIR, 'portfolio', project.slug, 'index.html')
      const fullHtml = generateHtml({ content: projectHtml, includeScript: false })
      writeHtmlPage(output, fullHtml)
      console.log(`  ✔ /portfolio/${project.slug}`)

      projectsIndex.push({
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        stack: project.stack,
        demo: project.demo,
        repo: project.repo,
        date: project.date
      })
    } catch (err) {
      console.error(`  ✗ Erreur pour ${filePath}:`, err.message)
    }
  })

  // projectsIndex kept for rendering index page (no JSON written)

  // --- Générer la page index du portfolio (cards pré-rendues)
  try {
    const cards = projectsIndex.map((p) =>
      h(
        'div',
        { className: 'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow transition hover:shadow-lg' },
        h('div', { className: 'h-28 bg-gradient-to-br from-indigo-500/80 via-sky-500/70 to-emerald-400/70' }),
        h(
          'div',
          { className: 'p-4 space-y-3' },
          h('h3', { className: 'text-lg font-semibold text-slate-900' }, p.title),
          p.summary ? h('p', { className: 'text-sm text-slate-600 line-clamp-3' }, p.summary) : null,
          p.stack && p.stack.length ? h('div', { className: 'flex flex-wrap gap-2' }, ...p.stack.slice(0, 6).map((t) => h('span', { className: 'badge badge-outline badge-sm' }, t))) : null,
          h('div', { className: 'flex items-center gap-2 pt-2' },
            p.demo ? h('a', { href: p.demo, className: 'btn btn-primary btn-xs' }, 'Demo') : null,
            p.repo ? h('a', { href: p.repo, className: 'btn btn-ghost btn-xs' }, 'Code') : null
          )
        )
      )
    )

    const indexHtml = renderToString(
      h(
        'div',
        { className: 'max-w-[1280px] w-full mx-auto' },
        h('div', { className: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' }, ...cards)
      )
    )

    const full = generateHtml({ content: indexHtml, includeScript: false })
    writeHtmlPage(path.join(DIST_DIR, 'portfolio', 'index.html'), full)
    console.log('  ✔ /portfolio/index.html généré')
  } catch (err) {
    console.error('  ✗ Erreur en générant /portfolio/index.html:', err.message)
  }
}

console.log('\n✅ Build statique terminé !\n')

