# Regroupement des tags dans SnippetRepository

## Le problème de base : SQL et les relations many-to-many

Quand on fait un JOIN entre `snippets` et `tags` via `snippet_tags`,
SQL retourne **une ligne par combinaison snippet + tag** :

```
id | title     | category | tag
1  | MonSnip   | JS       | React
1  | MonSnip   | JS       | TypeScript
1  | MonSnip   | JS       | Node
2  | AutreSnip | CSS      | NULL       ← pas de tag : le LEFT JOIN retourne quand même la ligne
```

Mais on veut retourner ça au frontend :

```json
[
  { "id": 1, "title": "MonSnip", "category": "JS", "tags": ["React", "TypeScript", "Node"] },
  { "id": 2, "title": "AutreSnip", "category": "CSS", "tags": [] }
]
```

SQL ne peut pas faire ce regroupement tout seul — c'est à nous de le faire en JS.

---

## findAll — regroupement avec une Map

```typescript
const snippetMap = new Map<number, Snippet>()

for (const row of rows) {
    // Si ce snippet n'est pas encore dans la Map → on crée son entrée avec tags vide
    if (!snippetMap.has(row.id)) {
        snippetMap.set(row.id, {
            id: row.id,
            title: row.title,
            // ...
            tags: []
        })
    }
    // Si cette ligne contient un tag → on l'ajoute au tableau du bon snippet
    if (row.tag?.id) {
        snippetMap.get(row.id)!.tags.push(row.tag)
    }
}

return Array.from(snippetMap.values())
```

### Visualisation de la boucle

```
Début : Map vide {}

Ligne 1 → snippet 1, tag React
  → snippet 1 absent de la Map → on l'ajoute avec tags: []
  → tag présent → on push React
  Map : { 1: { title: "MonSnip", tags: [React] } }

Ligne 2 → snippet 1, tag TypeScript
  → snippet 1 déjà dans la Map → on ne recrée pas l'objet
  → tag présent → on push TypeScript
  Map : { 1: { title: "MonSnip", tags: [React, TypeScript] } }

Ligne 3 → snippet 1, tag Node
  → snippet 1 déjà dans la Map → on ne recrée pas l'objet
  → tag présent → on push Node
  Map : { 1: { title: "MonSnip", tags: [React, TypeScript, Node] } }

Ligne 4 → snippet 2, tag NULL
  → snippet 2 absent de la Map → on l'ajoute avec tags: []
  → tag absent (NULL) → on ne push rien
  Map : { 1: { tags: [React, TypeScript, Node] }, 2: { tags: [] } }

Fin → Array.from(snippetMap.values()) = [snippet1, snippet2]
```

### Pourquoi une Map et pas un objet `{}` ?

Une `Map` est faite pour des clés dynamiques (ici des IDs numériques).
Elle garantit aussi l'ordre d'insertion, ce qu'un objet ne garantit pas.

---

## findById — même logique, version simplifiée

Pour un seul snippet, toutes les lignes retournées ont le même `id`,
donc pas besoin de Map. On utilise directement `rows` :

```typescript
const first = rows[0]  // la première ligne donne les infos du snippet

return {
    id: first.id,
    title: first.title,
    // ...
    tags: rows.filter(r => r.tag?.id).map(r => r.tag!)
}
```

### `rows.filter(r => r.tag?.id)`

On filtre pour **ne garder que les lignes qui ont un tag**.
En effet, si le snippet n'a aucun tag, le LEFT JOIN retourne quand même
une ligne avec `tag = NULL`. Sans ce filtre, on se retrouverait avec
`tags: [null]` au lieu de `tags: []`.

```
rows = [
  { id: 1, title: "MonSnip", tag: { id: 1, name: "React" } },
  { id: 1, title: "MonSnip", tag: { id: 2, name: "TypeScript" } },
]

rows.filter(r => r.tag?.id)  → garde les deux lignes (les deux ont un tag)
    .map(r => r.tag!)        → [{ id: 1, name: "React" }, { id: 2, name: "TypeScript" }]
```

Autre exemple, snippet sans tag :

```
rows = [
  { id: 2, title: "AutreSnip", tag: { id: null, name: null } }
]

rows.filter(r => r.tag?.id)  → [] (tag.id est null → filtre élimine la ligne)
    .map(r => r.tag!)        → []
```

### Le `!` (non-null assertion)

`r.tag!` dit à TypeScript : *"je sais que `tag` n'est pas null ici,
fais-moi confiance"*.

TypeScript ne sait pas que le `filter` précédent a déjà éliminé les
lignes sans tag. Pour lui, `r.tag` est encore potentiellement `null`.
Le `!` supprime cette erreur de type.

```typescript
// Sans ! → TypeScript se plaint : "tag pourrait être null"
.map(r => r.tag)

// Avec ! → TypeScript accepte : "ok, tu garantis que ce n'est pas null"
.map(r => r.tag!)
```

> ⚠️ Le `!` est à utiliser avec parcimonie : il désactive la vérification
> de TypeScript. Ici c'est justifié car le `filter` garantit que `tag.id`
> existe avant qu'on arrive au `map`.
