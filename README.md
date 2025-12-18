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

### Fonctionnement en bref
1) Lecture du template : le script charge `index.html`, remplace le `<title>` et insère le HTML rendu dans `#app`.
2) Parsing Markdown : `markdown-it` pour le corps, `gray-matter` pour le frontmatter.
3) Rendu : Preact génère les cartes et pages de détail (blog et portfolio).
4) Écriture : les fichiers HTML sont écrits dans `dist/…` avec la structure attendue pour un hosting statique.

## Commandes utiles
```bash
npm install          # installe les dépendances (incl. markdown-it)
npm run ssg          # génère le site statique dans dist/
npm run build        # ssg puis build Vite (si besoin du bundle)
npm run preview      # prévisualise dist/ (nécessite le build Vite)
```

## Adapter ou étendre
- Pour activer le bundle JS sur certaines pages, passer `includeScript:true` dans l’appel à `generateHtml` correspondant.
- Pour changer le chemin de base (basePath) ou les options markdown (`MarkdownIt`), modifier les constantes en tête de `scripts/build-static.js`.
- Pour forcer l’échec en cas d’avertissements lint, ajouter `--max-warnings=0` à la commande `lint`.

## Notes CI
- La CI exécute lint, tests, SSG/build et déploie `dist/`. Une étape vérifie la structure imposée par `.github/instructions.md` (script SSG dans `scripts/`).
