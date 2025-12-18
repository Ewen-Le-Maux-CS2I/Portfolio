// Vérification automatique de la structure du projet selon .github/instructions.md
import fs from 'fs'
import path from 'path'

const errors = []

function exists(p) {
  return fs.existsSync(path.resolve(p))
}

// 1. Le script SSG doit être dans scripts/build-static.js
if (!exists('scripts/build-static.js')) {
  errors.push('Le script SSG manquant: scripts/build-static.js (déplacez-le depuis script/build-static.js)')
}

// 2. Dossiers clefs
if (!exists('src/components') || !exists('src/pages') || !exists('src/content') || !exists('src/lib/content.js')) {
  errors.push('Structure src incomplète (components/pages/content/lib/content.js requis)')
}

// 3. Dist doit exister après build (optionnel ici)
// if (!exists('dist')) {
//   errors.push('Le dossier dist devrait être créé par le build')
// }

if (errors.length) {
  console.error('\u274c Vérification instructions.md échouée:')
  for (const e of errors) console.error(' -', e)
  process.exit(1)
} else {
  console.log('\u2705 Structure conforme à instructions.md')
}
