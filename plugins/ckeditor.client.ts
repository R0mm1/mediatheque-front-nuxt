/**
 * CKEditor 5 Plugin for Nuxt 3
 *
 * Replaces: ckeditor4-vue (Vue 2)
 * Migration: Vue Formulate components using WYSIWYG will need to import
 * CKEditor component directly in Phase 4
 */
import CKEditor from '@ckeditor/ckeditor5-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(CKEditor)
})
