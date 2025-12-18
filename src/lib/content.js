import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true, linkify: true, breaks: true })

/**
 * Charge tous les articles Markdown côté client avec Vite
 * Utilise import.meta.glob() pour charger dynamiquement les .md
 * @param {string} pattern - Glob pattern (ex: '../content/blog/*.md')
 * @returns {Promise<Array>} Array d'articles triés par date décroissante
 */
export async function loadArticlesClient() {
  try {
    const modules = import.meta.glob('../content/blog/*.md', { as: 'raw' })
    const articles = []

    for (const [path, loader] of Object.entries(modules)) {
      try {
        const raw = await loader()
        const { data, content } = matter(raw)

        articles.push({
          title: data.title || 'Sans titre',
          slug: data.slug || path.split('/').pop().replace('.md', ''),
          excerpt: data.excerpt || '',
          theme: data.theme || 'Général',
          date: data.date || new Date().toISOString().split('T')[0],
          author: data.author || 'Anonyme',
          content: md.render(content),
        })
      } catch (err) {
        console.error(`❌ Erreur en parsant ${path}:`, err.message)
      }
    }

    return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (err) {
    console.error('❌ Erreur en chargeant les articles:', err)
    return []
  }
}

/**
 * Charge tous les projets Markdown côté client (portfolio)
 * Schéma frontmatter recommandé:
 * - title: string
 * - slug: string (optionnel, sinon dérivé du fichier)
 * - summary: string (ou excerpt)
 * - date: YYYY-MM-DD
 * - tags: string[] (optionnel)
 * - stack: string[] (optionnel)
 * - demo: string (URL, optionnel)
 * - repo: string (URL, optionnel)
 */
export async function loadProjectsClient() {
  // Always load dynamically from Markdown (dev) — in production listings are pre-rendered
  try {
    const modules = import.meta.glob('../content/portfolio/*.md', { as: 'raw' })
    const projects = []

    for (const [path, loader] of Object.entries(modules)) {
      try {
        const raw = await loader()
        const { data, content } = matter(raw)

        projects.push({
          title: data.title || 'Sans titre',
          slug: data.slug || path.split('/').pop().replace('.md', ''),
          summary: data.summary || data.excerpt || '',
          date: data.date || new Date().toISOString().split('T')[0],
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? String(data.tags).split(',').map(s => s.trim()) : []),
          stack: Array.isArray(data.stack) ? data.stack : (data.stack ? String(data.stack).split(',').map(s => s.trim()) : []),
          demo: data.demo || '',
          repo: data.repo || '',
          content: md.render(content),
        })
      } catch (err) {
        console.error(`❌ Erreur en parsant ${path}:`, err.message)
      }
    }

    return projects.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (err) {
    console.error('❌ Erreur en chargeant les projets:', err)
    return []
  }
}

/**
 * Version Node.js pour le SSG (build-static.js)
 * À utiliser côté serveur uniquement
 */
export function loadArticlesServer(contentDir) {
  const { readFileSync, readdirSync } = require('fs')
  const { join } = require('path')

  try {
    const files = readdirSync(contentDir).filter((file) => file.endsWith('.md'))

    return files
      .map((file) => {
        const filePath = join(contentDir, file)
        const raw = readFileSync(filePath, 'utf-8')
        const { data, content } = matter(raw)

        return {
          title: data.title || 'Sans titre',
          slug: data.slug || file.replace('.md', ''),
          excerpt: data.excerpt || '',
          theme: data.theme || 'Général',
          date: data.date || new Date().toISOString().split('T')[0],
          author: data.author || 'Anonyme',
          content: md.render(content),
        }
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (err) {
    console.error(`Erreur en chargeant les articles depuis ${contentDir}:`, err)
    return []
  }
}

/**
 * Récupère un article par son slug (côté serveur)
 */
export function getArticleBySlugServer(contentDir, slug) {
  const articles = loadArticlesServer(contentDir)
  return articles.find((article) => article.slug === slug) || null
}
