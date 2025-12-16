---
title: Découvrez Preact pour votre prochain projet
slug: preact-decouverte
excerpt: Preact est un alternative légère à React. Découvrez pourquoi et comment l'utiliser dans vos projets.
theme: JavaScript
date: 2025-12-15
author: Ewen
---

# Preact : une alternative légère à React

Preact est une petite bibliothèque JavaScript qui implémente les mêmes concepts que React, mais avec un bundle beaucoup plus petit.

## Pourquoi Preact ?

- **Taille** : Seulement 3kB (vs 42kB pour React)
- **Performance** : Idéal pour les connexions lentes
- **Compatibilité** : API similaire à React, facile à apprendre
- **Vite** : Intégration parfaite avec Vite

## Utilisation basique

```jsx
import { render } from 'preact'

function App() {
  return <h1>Hello Preact!</h1>
}

render(<App />, document.getElementById('app'))
```

Preact est parfait pour les projets modernes où chaque kilobyte compte !
