# Migration Baseline - État Initial du Projet

**Date:** 2025-12-25
**Branche:** feat/vue3-nuxt4-migration (créée depuis develop)
**Commit de départ:** (à documenter après premier commit)

## État des Tests

### Tests Unitaires (Jest)

**Status:** ❌ ÉCHOUENT actuellement

**Erreur principale:**
```
Cannot find module 'babel-plugin-transform-typescript-metadata'
```

**Tests identifiés (7 suites):**
1. `test/components/list/List.spec.js`
2. `test/assets/ts/service/RequestService.spec.js`
3. `test/components/form/elements/formulate/Chips.spec.js`
4. `test/components/list/LeftActionBar.spec.js`
5. `test/components/form/elements/formulate/Files.spec.js`
6. `test/assets/ts/store/ListModule.spec.js`
7. `test/components/form/elements/MedInputButton.spec.js`

**Problème:** Configuration Babel incomplète pour les decorators TypeScript.

**Action requise post-migration:**
- Phase 7 devra migrer Jest → Vitest
- Vérifier que les tests passent après migration complète

### Tests E2E (Cypress)

**Version:** 12.11.0
**Status:** À tester manuellement

**Action:** Documenter les flows critiques qui fonctionnent actuellement via l'interface.

## Stack Technique Actuel

### Framework
- **Nuxt:** 2.15.8
- **Vue:** 2.x (implicite)
- **TypeScript:** 4.8.4

### State Management
- **Vuex** avec decorators (`vuex-module-decorators` 2.0.0)
- 7+ modules identifiés

### Composants
- **Approche:** Class Components (`vue-property-decorator` 9.1.2)
- **Total:** 139 fichiers Vue
- **Avec decorators:** 57 composants (41%)

### Dépendances Critiques à Migrer
- `@nuxtjs/axios`: 5.13.6
- `@braid/vue-formulate`: 2.5.3
- `ckeditor4-vue`: 2.2.0
- `vue-click-outside`: 1.1.0
- `vuedraggable`: 2.24.3
- `v-tooltip`: 2.1.3
- `vuejs-paginate`: 2.1.0
- `vue-star-rating`: 1.7.0

### Architecture Préservée
- ✅ **tsyringe** (4.7.0) - Dependency Injection
- ✅ **reflect-metadata** (0.1.13)
- ✅ Service layer architecture
- ✅ Descriptor-based forms

## Flows Critiques à Valider Manuellement

**URL de test:** https://localhost/
**Credentials:** login: `test` / password: `test`

### Checklist QA Manuelle (À compléter avant migration)

#### Authentification
- [ ] Login avec credentials test/test
- [ ] Navigation après login
- [ ] Refresh token fonctionne
- [ ] Logout

#### Gestion des Livres
- [ ] Liste des livres s'affiche
- [ ] Filtres fonctionnent
- [ ] Tri par colonnes
- [ ] Pagination
- [ ] Création livre papier
- [ ] Création livre électronique
- [ ] Création livre audio
- [ ] Édition livre existant
- [ ] Upload de couverture
- [ ] Ajout/suppression auteurs
- [ ] Suppression livre

#### Auteurs et Éditeurs
- [ ] Liste auteurs
- [ ] Création auteur
- [ ] Édition auteur
- [ ] Bibliographie auteur
- [ ] Liste éditeurs
- [ ] Création éditeur

#### Groupes
- [ ] Liste groupes
- [ ] Création groupe
- [ ] Ajout livres au groupe
- [ ] Retrait livres du groupe
- [ ] Suppression groupe

#### Formulaires
- [ ] Validation errors s'affichent
- [ ] Chips input (recherche auteur)
- [ ] Select avec création
- [ ] WYSIWYG editor
- [ ] Upload fichiers
- [ ] Notation par étoiles

## Inventaire Complet

### Modules Vuex (7)
1. `/assets/ts/store/book/BookModule.ts` (base)
2. `/assets/ts/store/book/BookElectronicModule.ts`
3. `/assets/ts/store/book/BookPaperModule.ts`
4. `/assets/ts/store/book/BookAudioModule.ts`
5. `/assets/ts/store/user/UserModule.ts`
6. `/assets/ts/store/ListModule.ts`
7. `/assets/ts/store/AuthorModule.ts`

### Plugins (7)
1. `/plugins/tsyringe.ts` - ✅ Garder
2. `/plugins/vueFormulate.js` - 🔄 Migrer vers FormKit
3. `/plugins/wysiwyg.client.js` - 🔄 CKEditor 4 → 5
4. `/plugins/vueTooltip.client.js` - 🔄 FloatingVue
5. `/plugins/vuePaginate.client.js` - 🔄 Mettre à jour
6. `/plugins/vueStarRating.client.js` - 🔄 Mettre à jour
7. `/plugins/vueChartjs.client.js` - 🔄 Vérifier compatibilité

### Composants par Complexité

**Simple (20):**
- Widgets: Loader, Popup, Tabs, Accordion, SimpleList
- Page: Column
- Form elements basiques: MedInputButton
- Formulate: 4 composants custom

**Moyen (25):**
- Form elements: MedInputText, MedChips, MedSelect, MedFiles, MedWysiwyg
- Form containers: FormElement, FormContainer
- Author components: 3 fichiers
- Book elements

**Complexe (12):**
- 🔴 `/components/list/List.vue` (LE PLUS COMPLEXE)
- List components: Row, Header, LeftActionBar, ColumnSelectionPopup
- 🔴 `/components/book/Book.vue` (CRITIQUE)
- Book variants: PaperBook, ElectronicBook, AudioBook
- Group components: 6 fichiers

## Objectifs Post-Migration

### Metrics de Succès
- [ ] 0 erreurs TypeScript
- [ ] 0 erreurs ESLint
- [ ] Tests unitaires passent (Vitest)
- [ ] Tests E2E passent (Cypress)
- [ ] Tous les flows QA ✅
- [ ] Bundle size ≤ baseline + 10%
- [ ] Application démarre sans erreur

### Tech Stack Cible
- Nuxt 4.x
- Vue 3.x
- Pinia (state management)
- Composition API (tous composants)
- FormKit (forms)
- CKEditor 5 (WYSIWYG)
- Native $fetch (axios removed)
- Vitest (tests)

## Notes

- Les tests actuels ne passent pas mais c'est documenté
- Configuration Babel incomplète pour decorators
- Sera résolu par migration complète vers Composition API
- Docker container: `mediatheque_dev_client`
- Package manager: `yarn`
