import matter from 'gray-matter'
import { marked } from 'marked'

/**
 * Charge tous les articles Markdown côté client avec Vite
 * Utilise import.meta.glob() pour charger dynamiquement les .md
 * @param {string} pattern - Glob pattern (ex: '../content/blog/*.md')
 * @returns {Promise<Array>} Array d'articles triés par date décroissante
 */
export async function loadArticlesClient(pattern) {
  try {
    const modules = import.meta.glob('../content/blog/*.md', { as: 'raw' })
    const articles = []

    for (const [path, loader] of Object.entries(modules)) {
      const raw = await loader()
      const { data, content } = matter(raw)

      articles.push({
        title: data.title || 'Sans titre',
        slug: data.slug || path.split('/').pop().replace('.md', ''),
        excerpt: data.excerpt || '',
        theme: data.theme || 'Général',
        date: data.date || new Date().toISOString().split('T')[0],
        author: data.author || 'Anonyme',
        content: marked(content),
      })
    }

    return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (err) {
    console.error('Erreur en chargeant les articles:', err)
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
          content: marked(content),
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
