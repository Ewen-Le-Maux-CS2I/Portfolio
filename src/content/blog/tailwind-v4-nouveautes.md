---
title: Tailwind CSS v4 - Les nouveautés
slug: tailwind-v4-nouveautes
excerpt: Tailwind CSS v4 apporte des changements majeurs. Découvrez les principales nouveautés et comment mettre à jour.
theme: CSS
date: 2025-12-10
author: Ewen
---

# Tailwind CSS v4 : les nouveautés

Tailwind CSS v4 est une mise à jour majeure qui simplifie la configuration et améliore les performances.

## Changements majeurs

### 1. Nouvelle syntaxe CSS

Fini les `@tailwind base/components/utilities` ! Maintenant :

```css
@import "tailwindcss";
@plugin "daisyui";
```

C'est beaucoup plus simple et plus cohérent.

### 2. Configuration simplifiée

La config PostCSS remplace le fichier `tailwind.config.js` :

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 3. Performance améliorée

Tailwind v4 est **50% plus rapide** à compiler grâce à la réécriture en Rust (Oxide).

## Conclusion

Tailwind v4 rend la configuration plus accessible et la compilation plus rapide. À adopter dès maintenant !
