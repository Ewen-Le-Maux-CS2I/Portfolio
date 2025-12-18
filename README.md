# Portfolio Blog — SSG

Ce dépôt génère un site statique avec un script Node maison (`scripts/build-static.js`). Le rendu utilise Preact pour pré-générer le HTML des cartes et des pages de détail, et `markdown-it` + `gray-matter` pour transformer le Markdown.

## Dépendances clés
- Rendu Markdown : `gray-matter` (frontmatter) + `markdown-it` (options `html`, `linkify`, `breaks` activées).
- Rendu statique Preact : `preact` + `preact-render-to-string`.
- Modèle HTML : le script lit le `index.html` racine et injecte le contenu dans `#app` en ajustant le `<title>`.

## Script SSG : `scripts/build-static.js`
- Sources : `src/content/blog/*.md` et `src/content/portfolio/*.md`.
- Sortie : pages pré-rendues dans `dist/blog/<slug>/index.html`, `dist/blog/index.html`, `dist/portfolio/<slug>/index.html`, `dist/portfolio/index.html`.
- Injection JS : par défaut **désactivée** sur ces pages (`includeScript:false`), donc pas de chargement du bundle Preact pour les sections blog/portfolio. On peut réactiver en passant `includeScript:true` dans l’appel à `generateHtml` si besoin d’hydratation.
- Base path : `basePath` configuré dans le script (actuellement `/Portfolio/`), à ajuster selon le déploiement (ex. GitHub Pages).

### Méthodes de `scripts/build-static.js`
- `generateHtml({ title, content, includeScript })` : lit le `index.html` racine, remplace le `<title>`, injecte le HTML rendu dans `#app` et conserve ou retire le script `main.jsx` selon `includeScript` (par défaut `false` pour éviter le bundle JS sur blog/portfolio).
- `parseArticle(filePath)` : lit un fichier Markdown, extrait le frontmatter avec `gray-matter`, convertit le corps en HTML via `markdown-it`, construit un objet article (titre, slug, date, extrait, thème, auteur, contenu HTML).
- `renderArticleHtml(article)` : rend une page article (layout type AppWindow) en HTML avec `preact-render-to-string` + `h()` pour produire le markup final.
- `walk(dir)` : parcours récursif pour lister tous les fichiers d’un dossier (utilisé pour récupérer les `.md`).
- `writeHtmlPage(outputPath, htmlContent)` : crée les dossiers manquants et écrit le fichier HTML généré.
- Boucles de génération :
	- Blog : pour chaque `.md` → page de détail, puis page index avec cartes pré-rendues.
	- Portfolio : pour chaque `.md` → page de détail, puis page index en grille pré-rendue.

### Fonctionnement du build
1) Lecture du template : le script charge `index.html`, remplace le `<title>` et insère le HTML rendu dans `#app`.
2) Parsing Markdown : `markdown-it` pour le corps, `gray-matter` pour le frontmatter.
3) Rendu : Preact génère les cartes et pages de détail (blog et portfolio).
4) Écriture : les fichiers HTML sont écrits dans `dist/…` avec la structure attendue pour un hosting statique.

## Commandes utiles
```bash
npm install          # installe les dépendances
npm run build        # ssg puis build Vite
npm run preview      # prévisualise dist
```

## Intégration Continue (CI)
- Déclencheurs: `push` et `pull_request` sur `main`.
- Environnement: Ubuntu + Node 18.
- Étapes:
	- Checkout du repo et `npm install` (avec `npm audit`).
	- Lint: `npm run lint` (ESLint flat config).
	- Tests: `npm run test` (Vitest, environnement `happy-dom`).
	- Build: `npm run build` (exécute le SSG puis `vite build`).
	- Déploiement: upload de `dist/` puis `deploy-pages` (GitHub Pages).

Voir le workflow: `.github/workflows/ci.yml`.

## Tests
- Runner: **Vitest** (mode `run` par défaut, `watch` disponible).
- Commandes:
```bash
npm run test         # exécute toute la suite
npm run test:watch   # relance à chaque changement
```
- Portée actuelle des tests:
	- Validation du schéma de frontmatter des contenus (blog/portfolio) dans `tests/`.
- Conseils:
	- Cibler un fichier: `vitest tests/mon-fichier.test.js`
	- Cibler un test: `vitest -t "nom du test"`

## Adapter ou étendre
- Pour activer le bundle JS sur certaines pages, passer `includeScript:true` dans l’appel à `generateHtml` correspondant.
- Pour changer le chemin de base (basePath) ou les options markdown (`MarkdownIt`), modifier les constantes en tête de `scripts/build-static.js`.
- Pour forcer l’échec en cas d’avertissements lint, ajouter `--max-warnings=0` à la commande `lint`.

## Notes CI
- La CI exécute lint, tests, SSG/build et déploie `dist/`. Une étape vérifie la structure imposée par `.github/instructions.md` (script SSG dans `scripts/`).
