# Phase 2: Pattern de Migration Vuex → Pinia

## Transformations Principales

### 1. Structure de base

**Vuex (avant):**
```typescript
@Module({ dynamic: true, name: 'user', store, namespaced: true })
class UserModule extends VuexModule {
  user: UserEntity = {}

  @Mutation
  set(entity: UserEntity): void {
    this.user = entity
  }

  @Action({ rawError: true })
  async get(id: number) {
    // ...
  }
}

export default getModule(UserModule)
```

**Pinia (après):**
```typescript
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: {} as UserEntity
  }),

  getters: {
    currentUser: (state) => state.user
  },

  actions: {
    set(entity: UserEntity): void {
      this.user = entity
    },

    async get(id: number) {
      // ...
    }
  }
})
```

### 2. Règles de Transformation

#### State
- Properties de classe → `state: () => ({ ... })`
- Initialisation dans constructor → Dans state factory function

#### Mutations
- `@Mutation` → actions dans Pinia (pas de mutations séparées)
- `Vue.set()` → **SUPPRIMÉ** (réactivité automatique Vue 3)
- `this.propriété = valeur` → Fonctionne directement

#### Actions
- `@Action` → `actions`
- `this.context.commit('mutation')` → `this.method()` (appel direct)
- `.then()/.catch()` → `async/await` (modernisation)
- `Promise.resolve()/reject()` → `return`/`throw`

#### Getters
- Computed properties → `getters` explicites
- `get propertyName()` → `getters: { propertyName: (state) => ... }`

#### Imports/Exports
- `getModule(Class)` → `export const useXStore = defineStore(...)`
- Usage: `import xModule from '...'` → `import { useXStore } from '~/stores/x'`
- Dans composants: `const xStore = useXStore()`

### 3. Cas Spécifiques

#### Héritage de classe (BookModule)
Vuex utilisait l'héritage de classe (`BookElectronicModule extends BookModule`).

En Pinia, deux approches:

**Option A: Duplication des actions communes**
```typescript
// stores/bookElectronic.ts
actions: {
  // Copier les actions communes de book.ts
  setTitle(title: string) { this.book.title = title },
  // ... actions spécifiques électroniques
}
```

**Option B: Helper function (utilisée)**
```typescript
function useBaseBookActions() {
  return {
    setTitle(title: string) { this.book.title = title },
    // ...
  }
}

export const useBookElectronicStore = defineStore('bookElectronic', {
  actions: {
    ...useBaseBookActions(),
    // Actions spécifiques
  }
})
```

#### Proxy Pattern
Les stores book utilisent EntityProxyService pour le change tracking:

```typescript
state: () => {
  const proxy = new EntityProxyService(flagService, historyService)
  return {
    book: new Proxy(bookService.getBaseBook(), proxy),
    proxy // Garder référence
  }
}
```

#### Services dans State
Services peuvent rester dans le state s'ils sont instanciés:

```typescript
state: () => ({
  bookService: new BookService(),
  flagService: new FlagService({ ... }),
  historyService: new HistoryService()
})
```

### 4. Suppression de Vue.set()

**Avant (Vue 2):**
```typescript
@Mutation setSummary(summary: string) {
  Vue.set(this.book, 'summary', summary)
}

@Mutation handleViolations(violations: Violation[]) {
  violations.forEach(v => {
    Vue.set(this.violations, v.propertyPath, v)
  })
}
```

**Après (Vue 3):**
```typescript
setSummary(summary: string) {
  this.book.summary = summary // Réactivité automatique !
}

handleViolations(violations: Violation[]) {
  violations.forEach(v => {
    this.violations[v.propertyPath] = v // Fonctionne directement
  })
}
```

### 5. Context.commit()

**Avant:**
```typescript
@Action linkNewCover(file: File) {
  return service.upload(file)
    .then(response => {
      this.context.commit('setCover', response)
      this.context.commit('setTempNewCover', file)
    })
}
```

**Après:**
```typescript
async linkNewCover(file: File) {
  const response = await service.upload(file)
  this.setCover(response)      // Appel direct
  this.setTempNewCover(file)   // Appel direct
}
```

## Stores Migrés

✅ **user.ts** - Simple, bon exemple de base (CRUD)
✅ **book.ts** - Complexe, classe abstraite avec 25+ méthodes, services multiples
✅ **bookElectronic.ts** - Héritage + fonctionnalités spécifiques (upload, extraction)
✅ **bookPaper.ts** - Similaire à bookElectronic, conversion de type
✅ **bookAudio.ts** - Gestion fichiers audio, download avec filename dynamique
✅ **author.ts** - Nested proxy pattern (author.person), custom flags
✅ **list.ts** - Le plus complexe: pagination, filtres, tri, colonnes, user config

**Phase 2 COMPLÈTE - 7/7 stores migrés**

## Impact sur les Composants

Les composants devront être mis à jour (Phase 4):

**Avant:**
```typescript
import bookModule from '~/assets/ts/store/book/BookModule'

export default class MyComponent extends Vue {
  get book() {
    return bookModule.book
  }

  saveBook() {
    bookModule.save()
  }
}
```

**Après:**
```vue
<script setup lang="ts">
import { useBookStore } from '~/stores/book'

const bookStore = useBookStore()

const book = computed(() => bookStore.book)

const saveBook = () => {
  bookStore.save()
}
</script>
```

## Stores Créés

- `/stores/user.ts` ✅
- `/stores/book.ts` ✅
- `/stores/bookElectronic.ts` ✅
