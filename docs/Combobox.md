# Combobox multi-sélection (base-ui + shadcn)

## Les "chips" (jetons/étiquettes)

Un **chip** (ou jeton/badge) c'est un petit élément visuel qui représente une sélection active. Tu en vois partout :

> `[JavaScript ×]  [Python ×]  [TypeScript ×]  [ Chercher... ]`

Chaque petit bloc avec un `×` = un chip. C'est la façon standard d'afficher plusieurs sélections dans un champ.

---

## Décomposition de tous les composants

```
┌─────────────────────────────────────────────────────────┐
│  ComboboxChips  (la "boîte" qui contient tout)          │
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐ │
│  │ ComboboxChip │ │ ComboboxChip │ │ ComboboxChipsIn │ │
│  │ JavaScript × │ │  Python ×    │ │ Chercher...     │ │
│  └──────────────┘ └──────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
         ▼ (quand on tape dans l'input)
┌─────────────────────────────────────────────────────────┐
│  ComboboxContent  (le popup flottant)                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ComboboxEmpty  ("Aucun résultat" si vide)       │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ComboboxList  (la liste scrollable)             │   │
│  │  ┌───────────────────────────────────────────┐  │   │
│  │  │  ComboboxItem  ✓ JavaScript               │  │   │
│  │  │  ComboboxItem    Ruby                     │  │   │
│  │  │  ComboboxItem    Go                       │  │   │
│  │  └───────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Chaque composant en détail

| Composant | Rôle |
|---|---|
| **`Combobox`** | Le composant racine. Gère l'état global (ouvert/fermé, valeurs sélectionnées). Reçoit `items`, `value`, `onValueChange`. |
| **`ComboboxChips`** | Le conteneur visible (comme un `<input>` élargi). Affiche les chips + le champ de saisie côte à côte. |
| **`ComboboxChip`** | Un tag/badge individuel pour une sélection. Contient automatiquement un bouton `×` pour retirer l'item. |
| **`ComboboxChipsInput`** | Le vrai `<input>` à l'intérieur des chips. Permet de taper pour filtrer la liste. Ouvre aussi le popup. |
| **`ComboboxValue`** | Composant "pont" entre l'état de la combobox et le rendu des chips. On y map les valeurs sélectionnées → on rend un `ComboboxChip` par valeur. |
| **`ComboboxContent`** | Le popup flottant (rendu via Portal). Gère le positionnement au-dessus ou en dessous. |
| **`ComboboxList`** | La liste scrollable à l'intérieur du popup. Accepte une fonction `{(item) => <ComboboxItem>}` que base-ui appelle pour chaque item filtré. |
| **`ComboboxItem`** | Une ligne cliquable dans la liste. Affiche automatiquement un `✓` quand l'item est sélectionné. |
| **`ComboboxEmpty`** | S'affiche automatiquement à la place de la liste quand aucun item ne correspond à la recherche. |

---

## Le flux complet

```
1. Utilisateur clique sur ComboboxChipsInput
        → le popup (ComboboxContent) s'ouvre

2. Utilisateur tape "Java"
        → base-ui filtre `items` (via itemToStringLabel)
        → ComboboxList re-rend seulement les items matchants

3. Utilisateur clique sur "JavaScript" dans ComboboxItem
        → onValueChange appelé avec les nouveaux Tag[] sélectionnés
        → notre MultiSelect convertit en number[] → appelle onSelectionChange

4. ComboboxValue re-rend → un nouveau ComboboxChip "JavaScript ×" apparaît
```

---

## Pourquoi le mode contrôlé (`value` + `onValueChange`) est obligatoire ici

Pour une combobox simple (sélection unique, non-contrôlée), base-ui gère l'état en interne et `value`/`onValueChange` ne sont pas nécessaires.

Pour la **multi-sélection avec chips**, le mode contrôlé est obligatoire pour deux raisons :

1. **Rendre les chips** — `ComboboxValue` affiche des chips en itérant sur la liste des éléments sélectionnés. Sans `value` en tant qu'état React, on n'a pas cette liste.
2. **Synchroniser avec le parent** — `MultiSelect` reçoit `selectedTagIds` depuis le parent. Sans mode contrôlé, on ne peut pas initialiser ni réinitialiser la sélection depuis l'extérieur (ex: après soumission du formulaire).

---

## Piège : combobox dans un Dialog Radix UI

Le popup de la combobox (base-ui) est rendu via un **Portal** hors du DOM du Dialog. Radix UI Dialog en mode `modal` (par défaut) piège le focus à l'intérieur du dialog. Résultat : cliquer sur un item ferme le popup avant que la sélection ne s'enregistre.

**Fix** : ajouter `modal={false}` sur le `<Dialog>` concerné.

```tsx
<Dialog open={isOpen} onOpenChange={onClose} modal={false}>
```

`modal={false}` désactive le focus trap tout en conservant l'overlay visuel.

---

## Implémentation dans ce projet (`MultiSelect.tsx`)

```tsx
<Combobox
    items={items}                          // Tag[] complet
    multiple
    value={selectedTags}                   // Tag[] dérivé des selectedTagIds
    onValueChange={(tags) => onSelectionChange(tags.map(t => t.id))}
    itemToStringValue={(tag) => tag.id.toString()}
    itemToStringLabel={(tag) => tag.name}  // utilisé pour le filtrage par texte
>
```

L'interface externe reste simple (`selectedTagIds: number[]`, `onSelectionChange: (ids: number[]) => void`). La conversion `Tag[] ↔ number[]` est gérée en interne.
