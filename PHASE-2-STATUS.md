# Phase 2: Migration Vuex → Pinia - Status

**Date:** 2025-12-25
**Statut:** ⚠️ EN COURS (3/7 stores migrés)

## ✅ Stores Migrés vers Pinia

### 1. `/stores/user.ts` ✅ COMPLET
**Complexité:** Simple
**Fonctionnalités:**
- CRUD utilisateur (get, save)
- Récupération utilisateur connecté
- Changement de mot de passe

**Transformations:**
- 4 actions (get, save, getLoggedIn, setPassword)
- 1 mutation devenue action (set)
- Async/await au lieu de Promise chains

### 2. `/stores/book.ts` ✅ COMPLET
**Complexité:** Élevée (base class)
**Fonctionnalités:**
- Gestion livre complète (titre, année, ISBN, langue, résumé)
- Gestion auteurs (add/remove)
- Gestion couverture (upload, link, unlink)
- Gestion notations utilisateur
- Groupes de livres
- Suppression
- Gestion violations API
- FlagService (isModified, readyToSave)
- HistoryService (change tracking)

**Transformations:**
- 25+ mutations → actions
- Vue.set() supprimé (réactivité Vue 3 automatique)
- EntityProxyService intégré dans state
- Services (BookService, EventService) dans state
- Getters pour flags réactifs

### 3. `/stores/bookElectronic.ts` ✅ COMPLET
**Complexité:** Élevée (étend book)
**Fonctionnalités spécifiques:**
- Upload fichier eBook
- Download eBook
- Extraction métadonnées (ElectronicBookInformation)
- Création livre depuis métadonnées
- Création couverture depuis image métadonnées
- Gestion bookFile
- Proxy pattern pour change tracking

**Pattern d'héritage:**
- Helper function `useBaseBookActions()` pour actions partagées
- Override de `set()`, `init()`, `get()`, `save()`
- Actions spécifiques électroniques ajoutées

## 🔄 Stores Restants (même pattern que bookElectronic)

### 4. `/stores/bookPaper.ts` ⏳ À FAIRE
- Similaire à bookElectronic
- Fonctionnalités: OCR, scan physique
- Environ 150 lignes

### 5. `/stores/bookAudio.ts` ⏳ À FAIRE
- Similaire à bookElectronic
- Fonctionnalités: fichiers audio, durée
- Environ 100 lignes

### 6. `/stores/list.ts` ⏳ À FAIRE - COMPLEXE
**⚠️ Store le plus complexe**
- Pagination
- Filtres dynamiques
- Tri par colonnes
- Configuration colonnes utilisateur
- Query string sync
- Left action bar
- Environ 300+ lignes

### 7. `/stores/author.ts` ⏳ À FAIRE
- CRUD auteur
- Similaire à user.ts
- Environ 80 lignes

## 📐 Patterns de Migration Documentés

**Fichier:** `PHASE-2-MIGRATION-PATTERN.md`

**Règles principales:**
1. `@Module` → `defineStore('name', { ... })`
2. State properties → `state: () => ({ ... })`
3. `@Mutation` + `@Action` → `actions` uniquement
4. `Vue.set()` → Assignment direct
5. `this.context.commit()` → `this.method()`
6. `.then()/.catch()` → `async/await`
7. `getModule(Class)` → `export const useXStore`

**Cas spéciaux:**
- Héritage: Helper functions ou duplication
- Proxy pattern: Garder proxy dans state
- Services: Instancier dans state factory

## 🔧 Impact sur le Code Existant

### Imports à changer (Phase 4)

**Avant:**
```typescript
import bookModule from '~/assets/ts/store/book/BookModule'
bookModule.setTitle('titre')
```

**Après:**
```vue
<script setup>
import { useBookStore } from '~/stores/book'
const bookStore = useBookStore()
bookStore.setTitle('titre')
</script>
```

### Fichiers affectés (estimé)
- **Composants:** ~40 fichiers importent les stores Vuex
- **Services:** Quelques services accèdent aux stores
- **Pages:** ~10 pages utilisent les stores

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| Stores migrés | 3 / 7 |
| % Progression | 43% |
| Lignes migrées | ~600 |
| Lignes restantes | ~630 |
| Vue.set() supprimés | 8+ |
| Decorators supprimés | 50+ |

## ⚠️ Points d'Attention

### 1. Store List.ts
Le plus complexe avec :
- Configuration colonnes dynamique
- Filtres multiples
- Pagination custom
- Query params URL sync
- User config persistence

**Recommandation:** Migrer en dernier, tester exhaustivement

### 2. EntityProxyService
Utilisé par tous les stores book pour change tracking.
**Status:** ✅ Pattern validé dans bookElectronic.ts

### 3. FlagService
Pattern réactif pour `isModified`, `readyToSave`.
**Status:** ✅ Fonctionne en Pinia (getters réactifs)

### 4. EventService
Service global d'événements (`EVENT_BOOK_SAVED`).
**Status:** ✅ Conservé tel quel

## 🎯 Prochaines Étapes

**Option A - Finir Phase 2 complètement:**
1. Migrer bookPaper.ts
2. Migrer bookAudio.ts
3. Migrer author.ts
4. Migrer list.ts (le plus long)
5. Tester tous les stores

**Option B - Continuer vers Phase 3:**
1. Migrer dépendances (FormKit, CKEditor...)
2. Revenir finir stores manquants

**Recommandation:** Option A - Finir Phase 2 d'abord.
Raison: Les composants (Phase 4) auront besoin des stores complets.

## 🚫 Blocages Actuels

**Aucun** - Les stores peuvent être migrés indépendamment.

## ✅ Validation

**Comment tester les stores Pinia:**
```typescript
// Dans un composant de test ou console
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
console.log(userStore.user)       // State
console.log(userStore.currentUser) // Getter
await userStore.get(1)             // Action
```

**⚠️ Note:** Tests réels impossibles tant que :
- Container non redémarré (dépendances manquantes)
- Composants non migrés (utilisent encore Vuex)

## 📝 Commits

1. `feat: Phase 2 - Migrate core Vuex stores to Pinia (partial)` (8e31889)
   - user.ts, book.ts, bookElectronic.ts
   - Documentation pattern

---

## Résumé

✅ **Fondations posées:** 3 stores les plus critiques migrés
⏳ **Restant:** 4 stores suivant le même pattern
📚 **Documentation:** Pattern complet documenté
🎯 **Prochaine action:** Migrer bookPaper, bookAudio, author, puis list
