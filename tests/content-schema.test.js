import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_ROOT = path.resolve('src/content')
const BLOG_DIR = path.join(CONTENT_ROOT, 'blog')
const PORTFOLIO_DIR = path.join(CONTENT_ROOT, 'portfolio')

/**
 * Valide qu'une date est au format YYYY-MM-DD
 */
function isValidDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return false
  const match = dateString.match(/^\d{4}-\d{2}-\d{2}$/)
  if (!match) return false
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Valide qu'un slug est conforme (lettres, chiffres, tirets)
 */
function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

/**
 * Charge tous les fichiers .md d'un dossier
 */
function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(dir, file))
}

describe('Validation du contenu Markdown - Blog', () => {
  const blogFiles = getMarkdownFiles(BLOG_DIR)

  if (blogFiles.length === 0) {
    it.skip('Aucun article de blog trouvé', () => {})
  }

  blogFiles.forEach((filePath) => {
    const fileName = path.basename(filePath)

    describe(`Article: ${fileName}`, () => {
      let frontmatter
      let content

      it('doit pouvoir être parsé', () => {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const parsed = matter(raw)
        frontmatter = parsed.data
        content = parsed.content
        expect(frontmatter).toBeDefined()
        expect(content).toBeDefined()
      })

      it('doit avoir un titre (title) non vide', () => {
        expect(frontmatter.title).toBeDefined()
        expect(frontmatter.title).not.toBe('')
        expect(typeof frontmatter.title).toBe('string')
      })

      it('doit avoir un slug valide', () => {
        expect(frontmatter.slug).toBeDefined()
        expect(isValidSlug(frontmatter.slug)).toBe(true)
      })

      it('doit avoir un extrait (excerpt) non vide', () => {
        expect(frontmatter.excerpt).toBeDefined()
        expect(frontmatter.excerpt).not.toBe('')
        expect(typeof frontmatter.excerpt).toBe('string')
      })

      it('doit avoir un thème (theme) non vide', () => {
        expect(frontmatter.theme).toBeDefined()
        expect(frontmatter.theme).not.toBe('')
        expect(typeof frontmatter.theme).toBe('string')
      })

      it('doit avoir une date valide (YYYY-MM-DD)', () => {
        expect(frontmatter.date).toBeDefined()
        expect(isValidDate(frontmatter.date)).toBe(true)
      })

      it('doit avoir un auteur (author) non vide', () => {
        expect(frontmatter.author).toBeDefined()
        expect(frontmatter.author).not.toBe('')
        expect(typeof frontmatter.author).toBe('string')
      })

      it('doit avoir du contenu (body) non vide', () => {
        expect(content).toBeDefined()
        expect(content.trim()).not.toBe('')
      })
    })
  })
})

describe('Validation du contenu Markdown - Portfolio', () => {
  const portfolioFiles = getMarkdownFiles(PORTFOLIO_DIR)

  if (portfolioFiles.length === 0) {
    it.skip('Aucun projet portfolio trouvé', () => {})
  }

  portfolioFiles.forEach((filePath) => {
    const fileName = path.basename(filePath)

    describe(`Projet: ${fileName}`, () => {
      let frontmatter
      let content

      it('doit pouvoir être parsé', () => {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const parsed = matter(raw)
        frontmatter = parsed.data
        content = parsed.content
        expect(frontmatter).toBeDefined()
        expect(content).toBeDefined()
      })

      it('doit avoir un titre (title) non vide', () => {
        expect(frontmatter.title).toBeDefined()
        expect(frontmatter.title).not.toBe('')
        expect(typeof frontmatter.title).toBe('string')
      })

      it('doit avoir un slug valide', () => {
        expect(frontmatter.slug).toBeDefined()
        expect(isValidSlug(frontmatter.slug)).toBe(true)
      })

      it('doit avoir un résumé (summary) non vide', () => {
        expect(frontmatter.summary).toBeDefined()
        expect(frontmatter.summary).not.toBe('')
        expect(typeof frontmatter.summary).toBe('string')
      })

      it('doit avoir une date valide (YYYY-MM-DD)', () => {
        expect(frontmatter.date).toBeDefined()
        expect(isValidDate(frontmatter.date)).toBe(true)
      })

      it('doit avoir un stack (array ou string)', () => {
        expect(frontmatter.stack).toBeDefined()
        const isArray = Array.isArray(frontmatter.stack)
        const isString = typeof frontmatter.stack === 'string'
        expect(isArray || isString).toBe(true)
        
        if (isArray) {
          expect(frontmatter.stack.length).toBeGreaterThan(0)
        } else {
          expect(frontmatter.stack.trim()).not.toBe('')
        }
      })

      it('doit avoir du contenu (body) non vide', () => {
        expect(content).toBeDefined()
        expect(content.trim()).not.toBe('')
      })

      // Tests optionnels mais recommandés
      it('devrait avoir un lien demo ou repo', () => {
        const hasDemo = frontmatter.demo && typeof frontmatter.demo === 'string' && frontmatter.demo.trim() !== ''
        const hasRepo = frontmatter.repo && typeof frontmatter.repo === 'string' && frontmatter.repo.trim() !== ''
        expect(hasDemo || hasRepo).toBe(true)
      })
    })
  })
})
