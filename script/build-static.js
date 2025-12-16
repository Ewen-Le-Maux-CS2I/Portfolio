import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import render from 'preact-render-to-string';
import { h } from 'preact';

// Dossiers
const CONTENT_DIR = path.resolve('src/content');
const DIST_DIR = path.resolve('dist');

// Crée le dossier dist s'il n'existe pas
fs.mkdirSync(DIST_DIR, { recursive: true });

/**
 * Layout HTML global
 * (équivalent d'un layout Astro/Next)
 */
function HtmlLayout({ title, content }) {
  return (
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/assets/index.css" />
      </head>
      <body>
        <main class="prose prose-lg mx-auto p-8">
          {content}
        </main>
      </body>
    </html>
  );
}

/**
 * Génère une page HTML à partir d'un fichier Markdown
 */
function buildPage({ filePath, outputPath }) {
  const raw = fs.readFileSync(filePath, 'utf-8');

  // Front matter + contenu
  const { data, content } = matter(raw);

  // Markdown → HTML
  const htmlContent = marked(content);

  // Injection dans le layout
  const html = render(
    <HtmlLayout
      title={data.title ?? 'Sans titre'}
      content={<div dangerouslySetInnerHTML={{ __html: htmlContent }} />}
    />
  );

  // Écriture du fichier HTML final
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, '<!DOCTYPE html>' + html);
}

/**
 * Parcours récursivement un dossier
 */
function walk(dir) {
  return fs.readdirSync(dir).flatMap(file => {
    const fullPath = path.join(dir, file);
    return fs.statSync(fullPath).isDirectory()
      ? walk(fullPath)
      : fullPath;
  });
}

// Génération du blog
const blogFiles = walk(path.join(CONTENT_DIR, 'blog'));

blogFiles.forEach(file => {
  if (!file.endsWith('.md')) return;

  const slug = path.basename(file, '.md');
  const output = path.join(DIST_DIR, 'blog', slug, 'index.html');

  buildPage({
    filePath: file,
    outputPath: output,
  });

  console.log(`✔ Blog généré : /blog/${slug}`);
});
