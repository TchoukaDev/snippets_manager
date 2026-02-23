# Backend

API REST Express servant les données de snippets, catégories et tags depuis une base MySQL.

## Stack

| Outil | Rôle |
|---|---|
| Express 5 + TypeScript | Serveur HTTP |
| Drizzle ORM | Requêtes SQL typées |
| mysql2 | Driver MySQL (connection pool) |
| tsx | Exécution TypeScript en développement |
| tsup | Build de production |

## Démarrage

```bash
# Installer les dépendances
npm install

# Lancer en développement (hot-reload via tsx watch)
npm run dev

# Build de production (génère dist/index.cjs)
npm run build

# Appliquer le schéma en base (locale)
npm run db:push

# Appliquer le schéma en production
npm run db:push:prod
```

Variables d'environnement dans `.env.local` (local) ou `.env.production` (prod) :

```
PORT=<port>
DB_HOST=<host>
DB_USER=<utilisateur>
DB_PASSWORD=<mot_de_passe>
DB_NAME=<nom_de_la_base>
DB_PORT=<port_mysql>
```

## API

Base URL : `http://localhost:3001`

### Snippets — `/snippets`

| Méthode | Route | Description |
|---|---|---|
| GET | `/snippets` | Tous les snippets (avec catégorie et tags) |
| GET | `/snippets/:id` | Un snippet par ID |
| POST | `/snippets` | Créer un snippet |
| PUT | `/snippets/:id` | Modifier un snippet |
| DELETE | `/snippets/:id` | Supprimer un snippet |

Corps POST/PUT :
```json
{
  "title": "Mon snippet",
  "content": "const x = 1",
  "format": "ts",
  "categoryId": 1,
  "tagIds": [1, 2]
}
```

### Catégories — `/categories`

`GET /` · `GET /:id` · `POST /` · `PUT /:id` · `DELETE /:id`

### Tags — `/tags`

`GET /` · `GET /:id` · `POST /` · `PUT /:id` · `DELETE /:id`

## Architecture

### Couches

```
routes/          Enregistrement des routes Express, instanciation des dépendances
  └── controllers/   Parse req/res, délègue au service, appelle next(error) en cas d'erreur
        └── services/    Logique métier, validation, lève des erreurs typées
              └── repositories/  Requêtes Drizzle ORM vers MySQL
```

### Gestion des erreurs

`src/utils/errors.ts` définit une hiérarchie d'erreurs métier :

| Classe | HTTP |
|---|---|
| `ValidationError` | 400 |
| `NotFoundError` | 404 |
| `DuplicateError` | 409 |
| `DatabaseError` | 500 |

Le middleware `errorHandler` intercepte toutes les erreurs via `next(error)` et renvoie `{ error: message }` avec le bon status code.

### Normalisation des données

`src/utils/NormalizeData.ts` :

- `normalizeToDb` — met en minuscules avant insertion (évite les doublons de casse)
- `normalizeToFrontend` — capitalise la première lettre au retour

### Base de données

Schéma défini dans `src/lib/schema.ts` avec Drizzle ORM. Tables :

- `snippets` — titre (unique), contenu, format, `category_id`, `created_at`
- `category` — nom (unique)
- `tags` — nom (unique)
- `snippet_tags` — table de jonction (clé primaire composite `snippetId` + `tagId`)

Les migrations SQL sont versionnées dans `drizzle/`. Lors d'une mise à jour du schéma, modifier `schema.ts` puis lancer `npm run db:push`.

La mise à jour des tags d'un snippet utilise une stratégie **delete & re-insert** : tous les tags existants sont supprimés, puis les nouveaux sont insérés en batch.
