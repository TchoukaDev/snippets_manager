# Frontend

Application React permettant de gérer, créer et consulter des snippets de code, organisés par catégories et tags.

## Stack

| Outil | Rôle |
|---|---|
| React 19 + Vite | UI et bundler |
| TypeScript | Typage statique |
| Tailwind CSS v4 | Styles |
| TanStack Query v5 | État serveur (fetch, cache, mutations) |
| shadcn/ui + Radix UI | Composants UI |
| Monaco Editor | Éditeur de code |
| vite-plugin-pwa | Progressive Web App |
| React Compiler | Optimisation automatique des renders |

## Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (port 5173)
npm run dev

# Build de production
npm run build

# Linter
npm run lint
```

Variable d'environnement requise dans `.env` :

```
VITE_API_URL=http://localhost:3001
```

## Architecture

### Alias de chemins

- `@/` → `src/`
- `@shared/` → `../shared/` (types partagés avec le backend)

### Flux de données

```
API REST (backend)
  └── services/        fetch HTTP brut, retourne des types @shared
        └── hooks/     TanStack Query (useQuery / useMutation)
              └── contexts/  SnippetContext : état de sélection et filtres client
                    └── components/  UI
```

### État serveur — `src/hooks/`

Chaque ressource a son propre fichier de hooks :

- `useSnippets.ts` — `useSnippets`, `useCreateSnippet`, `useUpdateSnippet`, `useDeleteSnippet`
- `useCategories.ts` — `useCategories`, `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory`
- `useTags.ts` — `useTags`, `useCreateTag`, `useUpdateTag`, `useDeleteTag`

Les mutations sur les snippets utilisent des **mises à jour optimistes** (rollback automatique en cas d'erreur).

### État client — `SnippetContext`

`src/contexts/SnippetContext.tsx` centralise :

- Le snippet actuellement sélectionné (`currentSnippetId`)
- Les filtres actifs : catégorie, tags, recherche textuelle

Les filtres sont appliqués en séquence : **catégorie → tags → recherche**.
Le composant consommateur reçoit directement la liste filtrée via `snippets`.

### Composants principaux

- `App.tsx` — Layout principal (sidebar + zone de contenu + modals)
- `SnippetList` / `SnippetAccordion` — Liste des snippets groupés par catégorie (accordion)
- `SnippetCard` — Affichage d'un snippet (bascule view/edit)
- `SnippetCardCreate` — Formulaire de création inline
- `SnippetCardEdit` — Formulaire d'édition inline
- `components/ui/` — Composants shadcn (accordion, button, select, dialog, dropdown-menu…)

### PWA

Configurée dans `vite.config.ts` avec `vite-plugin-pwa` :

- Précache de tous les assets du build
- Stratégie **NetworkFirst** pour les appels API vers le backend de production (`snippets-manager.onrender.com`), avec fallback cache de 24h
