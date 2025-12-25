# Phase 1: Migration Framework Core - Status

**Date:** 2025-12-25
**Statut:** ⚠️ EN ATTENTE DE REDÉMARRAGE CONTAINER

## ✅ Changements complétés

### 1. package.json mis à jour
- ✅ Nuxt 3.13.2 (au lieu de 2.15.8)
- ✅ Vue 3.4.0
- ✅ Pinia 2.1.7 (remplacement de Vuex)
- ✅ @pinia/nuxt 0.5.1
- ✅ TypeScript 5.3.0
- ✅ Vitest 3.2.0 (remplacement de Jest)
- ✅ Cypress 13.6.0

**Supprimé:**
- ❌ vue-property-decorator
- ❌ vue-class-component
- ❌ vuex, vuex-module-decorators
- ❌ @nuxtjs/axios (→ $fetch natif)
- ❌ @braid/vue-formulate (→ Phase 3)
- ❌ ckeditor4-vue (→ Phase 3)
- ❌ @nuxtjs/style-resources (→ vite.css)
- ❌ @nuxtjs/toast (→ Phase 6)
- ❌ @nuxt/typescript-build (TypeScript natif dans Nuxt 3)

**Conservé (compatible):**
- ✅ tsyringe 4.7.0 (DI)
- ✅ reflect-metadata 0.1.13
- ✅ animejs 3.2.1
- ✅ tesseract.js 5.0.0
- ✅ chart.js 4.4.0
- ✅ vue-chartjs 5.3.0

### 2. tsconfig.json mis à jour
- ✅ Extends `./.nuxt/tsconfig.json` (Nuxt 3)
- ✅ moduleResolution: "Bundler"
- ✅ experimentalDecorators: true (pour tsyringe)
- ✅ emitDecoratorMetadata: true (pour tsyringe)

### 3. nuxt.config.ts créé
- ✅ Syntaxe Nuxt 3 avec `defineNuxtConfig()`
- ✅ Modules: @pinia/nuxt, @nuxtjs/i18n@8, @nuxtjs/device@3
- ✅ publicRuntimeConfig → runtimeConfig.public
- ✅ styleResources → vite.css.preprocessorOptions.scss
- ✅ head → app.head
- ✅ server.host: 0.0.0.0 (conservé)
- ✅ ssr: false (conservé)
- ✅ i18n config migré pour v8

### 4. plugins/tsyringe.ts mis à jour
- ✅ Syntaxe Nuxt 3 : `defineNuxtPlugin()`
- ✅ useRuntimeConfig() au lieu de app.$config
- ✅ Type imports avec `type` keyword
- ✅ Provide $container pour accès global

### 5. Anciens fichiers supprimés
- ✅ nuxt.config.js (remplacé par nuxt.config.ts)

## ⚠️ PROCHAINES ÉTAPES REQUISES

### Action immédiate : Redémarrer le container Docker

Le container a démarré avec l'ancien `package.json` et tente constamment de réinstaller les anciennes dépendances. Il faut le redémarrer pour prendre en compte les nouveaux fichiers.

**Commandes:**
```bash
# Depuis le répertoire contenant docker-compose.yml
docker-compose restart mediatheque_dev_client
# Ou
docker restart mediatheque_dev_client
```

### Après le redémarrage

Le container devrait automatiquement :
1. Détecter le nouveau `package.json`
2. Installer les dépendances Nuxt 3 / Vue 3
3. Tenter de démarrer le serveur Nuxt 3

**⚠️ ERREURS ATTENDUES:**
Le serveur **NE DÉMARRERA PAS** car :
- Les composants utilisent encore `vue-property-decorator` (supprimé)
- Les stores utilisent encore `vuex-module-decorators` (supprimé)
- Les plugins référencent des packages supprimés
- Les layouts/pages utilisent l'ancienne syntaxe

**C'est NORMAL !** Les phases suivantes vont résoudre ces problèmes :
- **Phase 2:** Migration des stores Vuex → Pinia
- **Phase 3:** Migration des dépendances (FormKit, CKEditor, etc.)
- **Phase 4:** Migration des composants → Composition API
- **Phase 5:** Migration des pages/layouts
- **Phase 6:** Migration des plugins restants

## 📝 Commits effectués

1. `feat: Phase 1 - Update framework to Nuxt 3 + Vue 3` (0db91f4)
2. `chore: Remove old Nuxt 2 config file` (c37bb92)
3. `fix: Update vitest to v3.2.0 for compatibility with @nuxt/test-utils` (99f91b9)

## 🎯 Checkpoint Phase 1

**Status:** Configuration migrée, en attente d'installation des dépendances

**Prochaine phase:** Phase 2 - Migration Vuex → Pinia (après redémarrage container)

---

## Logs d'installation (pour référence)

Tentatives d'installation dans le container sans redémarrage :
- Yarn: Erreurs de cache/réseau (tarball corruption)
- NPM: Conflit peer dependency vitest résolu
- Processus yarn automatique du container interfère avec installation manuelle

**Solution:** Redémarrage requis pour installation propre.
