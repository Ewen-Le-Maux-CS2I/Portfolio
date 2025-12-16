---
title: SSG avec Preact : guide complet
slug: ssg-preact-guide
excerpt: Comment implémenter un générateur de site statique avec Preact et Node.js pour un portfolio performant.
theme: SSG
date: 2025-12-08
author: Ewen
---

# SSG avec Preact : guide complet

Un SSG (Static Site Generator) pré-render votre site en HTML pur. Parfait pour les blogs et portfolios !

## Avantages du SSG

- **Performance** : Zéro serveur, pages pré-rendues en HTML
- **Sécurité** : Rien à exécuter côté serveur
- **SEO** : Contenu statique, facilement crawlé par les moteurs
- **Déploiement** : GitHub Pages, Netlify, AWS S3

## Implémentation avec Preact

1. **Parser le Markdown** avec `gray-matter` et `marked`
2. **Rendre les composants JSX** en HTML avec `preact-render-to-string`
3. **Sauvegarder les fichiers** HTML dans `dist/`

```javascript
import { renderToString } from 'preact-render-to-string'
import ArticleTemplate from './ArticleTemplate'

const html = renderToString(<ArticleTemplate article={data} />)
// Sauvegarde dans dist/blog/slug.html
```

## Résultat

Un site ultra-performant, deploiable partout, sans coûts d'infrastructure !
