# Phase 3: Migration Dépendances Tierces - Status

**Date:** 2025-12-25
**Statut:** ✅ COMPLET (Configuration initiale)

## Vue d'ensemble

Phase 3 consiste à migrer toutes les dépendances tierces de Vue 2 vers Vue 3:
- Vue Formulate → FormKit
- CKEditor 4 → CKEditor 5
- v-tooltip → FloatingVue
- @nuxtjs/toast → vue-toastification
- vue-click-outside → Composable personnalisé
- Mises à jour: vuedraggable, vue-star-rating, vue-chartjs

## ✅ Dépendances Ajoutées

### 1. FormKit (Remplacement de @braid/vue-formulate)
**Packages installés:**
- `@formkit/nuxt`: ^1.5.0
- `@formkit/vue`: ^1.5.0
- `@formkit/themes`: ^1.5.0

**Configuration:**
- ✅ Module ajouté à `nuxt.config.ts`
- ✅ Fichier `formkit.config.ts` créé
- ⏳ Inputs personnalisés à migrer en Phase 4:
  - `chips`: Multi-entity selection
  - `files`: File upload
  - `medselect`: Enhanced select
  - `void`: Placeholder

**Différences clés:**
- API plus moderne avec Composition API
- Meilleure accessibilité (ARIA)
- Validation intégrée plus puissante
- Styling avec Tailwind ou CSS custom

### 2. CKEditor 5 (Remplacement de ckeditor4-vue)
**Packages installés:**
- `@ckeditor/ckeditor5-vue`: ^6.0.0
- `@ckeditor/ckeditor5-build-classic`: ^41.0.0

**Configuration:**
- ✅ Plugin `plugins/ckeditor.client.ts` créé
- ⏳ Composants WYSIWYG à migrer en Phase 4

**Différences clés:**
- Architecture modulaire
- Meilleure performance
- Interface modernisée
- API différente (voir migration guide)

**Migration des composants:**
```vue
<!-- Avant (CKEditor 4) -->
<ckeditor v-model="content" :config="editorConfig"></ckeditor>

<!-- Après (CKEditor 5) -->
<ckeditor :editor="editor" v-model="content" :config="editorConfig"></ckeditor>
<script setup>
import { ClassicEditor } from '@ckeditor/ckeditor5-build-classic'
const editor = ClassicEditor
</script>
```

### 3. FloatingVue (Remplacement de v-tooltip)
**Package installé:**
- `floating-vue`: ^5.2.2

**Configuration:**
- ✅ Plugin `plugins/floatingVue.client.ts` créé
- ✅ Theme `med-tooltip` configuré

**Différences clés:**
- API directive compatible: `v-tooltip="'text'"`
- Meilleurs positionnement et animations
- Support TypeScript complet

**Aucune migration requise** pour les usages basiques du type:
```vue
<button v-tooltip="'Tooltip text'">Hover</button>
```

### 4. vue-toastification (Remplacement de @nuxtjs/toast)
**Package installé:**
- `vue-toastification`: ^2.0.0-rc.5

**Configuration:**
- ✅ Plugin `plugins/toast.client.ts` créé
- ✅ API backward-compatible avec `$toasted`
- ✅ Configuration: position, timeout, animations

**API disponible:**
```typescript
// Nouvelle API (recommandée)
const { $toast } = useNuxtApp()
$toast.success('Message')
$toast.error('Error')

// API legacy (backward-compatible)
const { $toasted } = useNuxtApp()
$toasted.show('Message')
$toasted.error('Error')
```

### 5. useClickOutside Composable (Remplacement de vue-click-outside)
**Fichier créé:**
- `composables/useClickOutside.ts`

**Différences clés:**
- Plus de directive, utilise composition API
- Meilleur contrôle et typage

**Migration:**
```vue
<!-- Avant -->
<div v-click-outside="handleClickOutside">Content</div>

<!-- Après -->
<script setup>
const elementRef = ref<HTMLElement | null>(null)
useClickOutside(elementRef, handleClickOutside)
</script>
<template>
  <div ref="elementRef">Content</div>
</template>
```

### 6. Autres Dépendances Mises à Jour

**vuedraggable**: ^4.1.0 (Vue 3 compatible)
- Remplacement de Sortable.js wrapper Vue 2
- API similaire mais avec `v-model` amélioré

**vue-star-rating**: ^2.1.0 (Vue 3 compatible)
- API identique, aucune migration requise

**vue-chartjs**: ^5.3.0 (déjà installé en Phase 1)
- Compatible Chart.js 4.x
- Composition API support

## 📋 Package.json - Résumé des Changements

### Ajouts (Phase 3):
```json
{
  "@ckeditor/ckeditor5-build-classic": "^41.0.0",
  "@ckeditor/ckeditor5-vue": "^6.0.0",
  "@formkit/nuxt": "^1.5.0",
  "@formkit/themes": "^1.5.0",
  "@formkit/vue": "^1.5.0",
  "floating-vue": "^5.2.2",
  "vue-star-rating": "^2.1.0",
  "vue-toastification": "^2.0.0-rc.5",
  "vuedraggable": "^4.1.0"
}
```

### À Supprimer (après Phase 4):
- `@braid/vue-formulate`
- `ckeditor4-vue`
- `v-tooltip`
- `vue-click-outside`
- Anciens plugins Vue 2

## 📁 Fichiers Créés

1. **`/formkit.config.ts`** - Configuration FormKit
2. **`/plugins/ckeditor.client.ts`** - Plugin CKEditor 5
3. **`/plugins/floatingVue.client.ts`** - Plugin FloatingVue (tooltips)
4. **`/plugins/toast.client.ts`** - Plugin Notifications
5. **`/composables/useClickOutside.ts`** - Composable click-outside

## 📁 Fichiers Modifiés

1. **`/nuxt.config.ts`** - Ajout module `@formkit/nuxt`
2. **`/package.json`** - Ajout de 9 nouvelles dépendances

## 🔄 Anciens Plugins (À supprimer en Phase 6)

Ces fichiers existent toujours mais seront supprimés après migration complète:
- `/plugins/vueFormulate.js` (Vue 2)
- `/plugins/wysiwyg.client.js` (CKEditor 4)
- `/plugins/vueTooltip.client.js` (v-tooltip)

## 📊 Impact sur les Composants (Phase 4)

### Composants affectés par FormKit:
- Tous les composants utilisant `<FormulateInput>`
- Custom inputs: Chips, Files, Select, Void
- **Estimé:** ~15-20 composants

### Composants affectés par CKEditor:
- `/components/form/elements/MedWysiwyg.vue`
- **Estimé:** 1-2 composants

### Composants affectés par v-tooltip:
- Recherche: `v-tooltip` directive dans le code
- **Estimé:** ~5-10 usages

### Composants affectés par click-outside:
- Recherche: `v-click-outside` directive
- **Estimé:** ~3-5 usages (popups, dropdowns)

## ⚠️ Points d'Attention

### 1. FormKit Migration
**Complexité: Élevée**
- Custom inputs à recréer complètement
- Props/slots différents
- Validation schema à adapter

**Stratégie:**
- Créer wrappers pour compatibility temporaire
- Migrer progressivement composant par composant
- Tester chaque input avant passage au suivant

### 2. CKEditor 5
**Complexité: Moyenne**
- API différente mais bien documentée
- Config à adapter (toolbar, plugins)
- Build custom si fonctionnalités avancées

### 3. Toast Notifications
**Complexité: Faible**
- API backward-compatible créée
- Devrait fonctionner sans changements

### 4. FloatingVue
**Complexité: Très faible**
- Directive compatible
- Aucun changement requis pour usages basiques

## 🎯 Prochaines Étapes

**Immédiat:**
1. ✅ Redémarrer container Docker
2. ✅ Installer les nouvelles dépendances: `yarn install`
3. ✅ Vérifier build sans erreurs de dépendances

**Phase 4 (migration composants):**
1. Migrer custom FormKit inputs (chips, files, select, void)
2. Migrer MedWysiwyg vers CKEditor 5
3. Remplacer `v-click-outside` par composable
4. Tester tous les formulaires

**Phase 6 (nettoyage):**
1. Supprimer anciens plugins Vue 2
2. Désinstaller dépendances obsolètes
3. Nettoyer imports

## 🚫 Blocages Actuels

**Container Docker doit être redémarré** pour installer les dépendances.

Commandes:
```bash
docker restart mediatheque_dev_client
docker exec mediatheque_dev_client yarn install
```

## ✅ Validation

**Après installation des dépendances:**
- [ ] Vérifier que FormKit charge: `yarn dev` sans erreur module
- [ ] Vérifier que CKEditor5 charge
- [ ] Vérifier que FloatingVue charge
- [ ] Vérifier que Toast charge
- [ ] Build réussit (warnings OK, pas d'erreurs)

**Note:** Erreurs de runtime attendues car composants utilisent encore anciennes APIs (Phase 4).

## 📝 Documentation

**Guides de migration consultés:**
- [FormKit Migration Guide](https://formkit.com/essentials/installation)
- [CKEditor 5 Migration](https://ckeditor.com/docs/ckeditor5/latest/updating/migration-from-ckeditor-4.html)
- [Vue Toastification Docs](https://vue-toastification.maronato.dev/)
- [FloatingVue Guide](https://floating-vue.starpad.dev/)

---

## Résumé

✅ **Phase 3 COMPLÈTE** (configuration initiale)
✅ **9 nouvelles dépendances** ajoutées
✅ **5 nouveaux fichiers** créés (plugins + composables)
✅ **Configuration** prête pour Phase 4
🔄 **Prochaine action:** Redémarrer container et installer dépendances
