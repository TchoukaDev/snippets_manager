# Transformer une app Vite + React en PWA

## Prérequis

| Requis | Détail |
|---|---|
| **HTTPS** | Obligatoire pour le Service Worker (fourni automatiquement par Vercel/Netlify) |
| **Vite** | Rend la config très simple via `vite-plugin-pwa` |

---

## Étape 1 — Installer le plugin

```bash
npm install -D vite-plugin-pwa
```

---

## Étape 2 — Configurer `vite.config.ts`

```ts
import { VitePWA } from 'vite-plugin-pwa'

VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/mon-backend\.onrender\.com\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 24h
          },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
  manifest: {
    name: 'Mon App',
    short_name: 'App',
    description: 'Description de mon app',
    theme_color: '#0f172a',
    background_color: '#0f172a',
    display: 'standalone',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
})
```

### `registerType`

| Valeur | Comportement |
|---|---|
| `autoUpdate` | Le SW se met à jour en silence à chaque nouveau déploiement ✅ |
| `prompt` | Demande à l'utilisateur (nécessite du code UI supplémentaire) |

### `workbox`

| Option | Rôle |
|---|---|
| `globPatterns` | Types de fichiers à **precacher** au premier chargement (tout l'app shell) |
| `runtimeCaching` | Stratégies de cache pour les requêtes réseau (API, images...) |

#### Stratégies de cache disponibles

| Stratégie | Comportement | Idéal pour |
|---|---|---|
| `NetworkFirst` | Réseau → si KO, cache | **APIs** (données fraîches prioritaires) |
| `CacheFirst` | Cache → si absent, réseau | Assets statiques (images, fonts) |
| `StaleWhileRevalidate` | Cache immédiat + mise à jour en arrière-plan | Bon compromis général |

### `manifest`

| Champ | Rôle |
|---|---|
| `name` | Nom complet affiché à l'installation |
| `short_name` | Nom court sous l'icône (écran d'accueil) |
| `theme_color` | Couleur de la barre système (Android/Chrome) |
| `background_color` | Couleur du splash screen au lancement |
| `display` | Mode d'affichage (voir ci-dessous) |
| `icons` | Icônes de l'app (minimum : 192×192 et 512×512) |

#### Valeurs de `display`

| Valeur | Comportement |
|---|---|
| `standalone` | App native sans barre d'adresse ✅ |
| `fullscreen` | Plein écran complet (jeux) |
| `minimal-ui` | Quelques contrôles de navigation conservés |
| `browser` | Onglet normal (inutile pour une PWA) |

---

## Étape 3 — Ajouter les icônes

Placer dans `frontend/public/` :
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

> **Outil gratuit** : [favicon.io/favicon-generator](https://favicon.io/favicon-generator)
> → Télécharger le ZIP → renommer `android-chrome-192x192.png` et `android-chrome-512x512.png`

---

## Étape 4 — Builder et vérifier

```bash
npm run build
```

Fichiers générés dans `dist/` :

| Fichier | Rôle |
|---|---|
| `manifest.webmanifest` | Le manifest injecté dans l'HTML |
| `sw.js` | Le Service Worker généré par Workbox |
| `workbox-*.js` | La bibliothèque Workbox |
| `registerSW.js` | Script qui enregistre le SW dans le navigateur |

---

## Étape 5 — Déployer

```bash
git add .
git commit -m "feat: add PWA support"
git push
```

> Vercel redéploie automatiquement. Le Service Worker ne fonctionne qu'en **HTTPS**.

---

## Tester la PWA

### Vérifier l'installation
1. Ouvrir l'app dans Chrome
2. Icône d'installation dans la barre d'adresse → **Installer**

### Tester le mode offline
1. `F12` → onglet **Application** → **Service Workers**
2. Cocher **Offline**
3. Recharger → l'app doit s'afficher depuis le cache

> Les données API sont disponibles offline uniquement si elles ont été chargées au moins une fois (`NetworkFirst` les met en cache à chaque requête réussie).

---

## Adapter pour une autre app

1. Modifier les valeurs du `manifest` (nom, couleurs, icônes)
2. Mettre à jour l'`urlPattern` pour pointer vers ton backend
3. Choisir la bonne stratégie selon le type de données
4. Remplacer les icônes dans `public/`
