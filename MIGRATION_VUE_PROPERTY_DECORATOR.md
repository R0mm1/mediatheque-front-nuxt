# Analyse des Composants Vue avec vue-property-decorator

## Résumé Exécutif

- **Total de composants analysés**: 34
- **Composants simples**: 9 (26.5%) - Priorité haute pour migration
- **Composants moyens**: 25 (73.5%) - Priorité moyenne pour migration
- **Composants complexes**: 0

## Composants SIMPLES (Priorité 1 - Migration rapide)

Ces composants peuvent être convertis en Composition API très rapidement car ils n'utilisent que des props sans watchers, lifecycle hooks complexes ou nombreuses méthodes.

| #   | Fichier                                                     | Props | Méthodes | Lifecycle | Watchers | Émits |
| --- | ----------------------------------------------------------- | ----- | -------- | --------- | -------- | ----- |
| 1   | `components/groups/groups/mainTab/GroupInformation.vue`     | 0     | 0        | ❌        | ❌       | ❌    |
| 2   | `components/author/groups/mainTab/GroupBibliography.vue`    | 0     | 1        | ❌        | ❌       | ❌    |
| 3   | `components/groups/groups/MainTab.vue`                      | 0     | 2        | ❌        | ❌       | ❌    |
| 4   | `components/groups/GroupListPopupDelete.vue`                | 1     | 0        | ❌        | ❌       | ❌    |
| 5   | `components/author/groups/mainTab/GroupInformation.vue`     | 1     | 0        | ❌        | ❌       | ❌    |
| 6   | `components/book/BookListPopupDelete.vue`                   | 1     | 0        | ❌        | ❌       | ❌    |
| 7   | `components/groups/GroupListRowDetails.vue`                 | 1     | 1        | ❌        | ❌       | ❌    |
| 8   | `components/form/elements/MedInputButton.vue`               | 1     | 1        | ❌        | ❌       | ❌    |
| 9   | `components/groups/groups/mainTab/GroupBookDeletePopup.vue` | 2     | 0        | ❌        | ❌       | ❌    |

**Temps estimé de migration**: ~2-3 heures pour les 9 composants

---

## Composants MOYENS (Priorité 2)

Ces composants ont une complexité modérée et peuvent être migrés après les composants simples.

### Sous-catégorie: Seulement des méthodes (6 composants)

```
- components/groups/groups/mainTab/GroupBooks.vue (6 méthodes)
```

### Sous-catégorie: Lifecycle hooks présents (21 composants)

Les composants avec `mounted`, `created`, `updated`, etc. nécessitent plus d'attention:

- `components/list/ColumnSelectionPopup.vue` - 6 méthodes, lifecycle, @Emit
- `components/list/Header.vue` - 11 méthodes, lifecycle, watchers ⚠️
- `components/book/groups/mainTab/GroupReferences.vue` - 29 méthodes, lifecycle ⚠️
- `components/groups/Group.vue` - 1 méthode, lifecycle
- `components/author/Author.vue` - 4 méthodes, lifecycle
- `components/form/elements/MedChips.vue` - 2 méthodes, @Emit
- `components/book/BookListRowDetails.vue` - 4 méthodes
- `components/book/audioBook/groups/AudioGroupInformation.vue` - 5 méthodes
- `components/book/electronicBook/groups/ElectronicGroupInformation.vue` - 5 méthodes
- `components/book/paperBook/groups/PaperGroupInformation.vue` - 6 méthodes
- `components/list/LeftActionBar.vue` - 18 méthodes ⚠️
- `components/book/paperBook/BookEditPopupOcrSummary.vue` - 23 méthodes, watchers, @Emit ⚠️
- `components/list/HeaderPopup.vue` - 2 méthodes, lifecycle, @Emit
- `components/form/elements/MedInputText.vue` - 3 méthodes, lifecycle, watchers
- `components/form/elements/MedInputTextWithButton.vue` - 3 méthodes, lifecycle, watchers
- `components/form/elements/MedSelect.vue` - 7 méthodes, lifecycle, watchers
- `components/book/groups/mainTab/GroupInformation.vue` - 10 méthodes, watchers
- `components/list/Row.vue` - 14 méthodes, lifecycle ⚠️
- `components/page/EntityLayout.vue` - 2 méthodes, lifecycle, watchers, @Emit
- `components/book/Book.vue` - 7 méthodes, 6 props, lifecycle
- `components/form/elements/formulate/Select.vue` - 12 méthodes, lifecycle, watchers
- `components/list/List.vue` - 12 méthodes, lifecycle, watchers
- `components/form/elements/formulate/Files.vue` - 8 props, 9 méthodes
- `components/form/elements/formulate/Chips.vue` - 11 props, 10 méthodes, watchers

---

## Recommandations de Migration

### Phase 1: Composants Simples (Semaine 1)

Migrer les 9 composants simples d'abord:

1. Convertir les `@Prop` en `defineProps()`
2. Ajouter `<script setup>`
3. Remplacer les imports `vue-property-decorator` par imports Vue 3
4. Tester et valider

### Phase 2: Composants Moyens sans Watchers/Lifecycle (Semaine 2-3)

- `components/groups/groups/mainTab/GroupBooks.vue`
- `components/form/elements/MedChips.vue`
- `components/book/BookListRowDetails.vue`
- `components/book/audioBook/groups/AudioGroupInformation.vue`
- `components/book/electronicBook/groups/ElectronicGroupInformation.vue`
- `components/book/paperBook/groups/PaperGroupInformation.vue`

### Phase 3: Composants avec Watchers et Lifecycle (Semaine 3-4)

Commencer par les plus simples:

- `components/groups/Group.vue` (1 méthode + lifecycle)
- `components/author/Author.vue` (4 méthodes + lifecycle)
- `components/list/HeaderPopup.vue` (2 méthodes + lifecycle + @Emit)

### Phase 4: Composants Complexes (Semaine 5+)

Réserver pour plus tard (attention requise):

- ⚠️ `components/book/paperBook/BookEditPopupOcrSummary.vue` - 23 méthodes
- ⚠️ `components/list/LeftActionBar.vue` - 18 méthodes
- ⚠️ `components/book/groups/mainTab/GroupReferences.vue` - 29 méthodes
- ⚠️ `components/list/Row.vue` - 14 méthodes
- ⚠️ `components/list/Header.vue` - 11 méthodes + watchers

---

## Notes d'Implémentation

### Patterns de Conversion

**Props simples:**

```javascript
// Avant
@Prop() message: string

// Après
const message = defineProps<{ message: string }>()
```

**Watchers:**

```javascript
// Avant
@Watch('prop')
onPropChange(newVal: string) { }

// Après
const prop = ref('')
watch(() => prop.value, (newVal) => { })
```

**Lifecycle hooks:**

```javascript
// Avant
mounted() { }

// Après
onMounted(() => { })
```

**Émits:**

```javascript
// Avant
@Emit()
onClick() { this.$emit('click') }

// Après
const emit = defineEmits<{ click: [] }>()
const onClick = () => emit('click')
```

---

## Fichier d'Analyse Brute

Voir `vue-property-decorator-analysis.json` pour le JSON complet avec toutes les métriques.
