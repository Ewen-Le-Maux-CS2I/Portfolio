# Portfolio Blog — SSG

Ce dépôt génère un site statique avec un script Node maison (`scripts/build-static.js`). Le rendu utilise Preact pour pré-générer le HTML des cartes et des pages de détail, et `markdown-it` + `gray-matter` pour transformer le Markdown.


## Script SSG : `scripts/build-static.js`
- Sources des fichier markdowns : `src/content/blog/*.md` et `src/content/portfolio/*.md`.
- Sortie : pages pré-rendues dans `dist/blog/<slug>/index.html`, `dist/blog/index.html`, `dist/portfolio/<slug>/index.html`, `dist/portfolio/index.html`.
- Base path : `basePath` configuré dans le script (actuellement `/Portfolio/`). Correspond au nom du repository

### Méthodes de `scripts/build-static.js`
- `generateHtml({ title, content, includeScript })` : lit le `index.html` racine, injecte le HTML rendu dans `#app` 
- `parseArticle(filePath)` : lit un fichier Markdown, extrait le frontmatter avec `gray-matter`, convertit le corps en HTML via `markdown-it`, construit un objet article (titre, slug, date, extrait, thème, auteur, contenu HTML).
- `renderArticleHtml(article)` : rend une page article (layout type AppWindow) en HTML avec `preact-render-to-string` + `h()` pour produire le markup final.
- `walk(dir)` : parcours récursif pour lister tous les fichiers d’un dossier (utilisé pour récupérer les `.md`).
- `writeHtmlPage(outputPath, htmlContent)` : crée les dossiers manquants et écrit le fichier HTML généré.
- Boucles de génération :
	- Blog : pour chaque `.md` → page de détail, puis page index avec cartes pré-rendues.
	- Portfolio : pour chaque `.md` → page de détail, puis page index en grille pré-rendue.

## Commandes utiles
```bash
npm install          # installe les dépendances
npm run build        # ssg puis build Vite
npm run preview      # prévisualise dist
```

## Intégration Continue (CI)
- Déclencheurs: `push` et `pull_request` sur `main`.
- Environnement: Ubuntu + Node 23.
- Étapes:
	- Audit des packages : `npm audit`
	- Lint: `npm run lint` (ESLint flat config).
	- Tests: `npm run test` (Vitest : test la bonne écriture des fichiers markdown).
	- Build: `npm run build` (exécute le SSG).
	- Déploiement: upload de `dist/` puis `deploy-pages` (GitHub Pages).

Voir le workflow: `.github/workflows/ci.yml`.
