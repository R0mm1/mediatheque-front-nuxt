/**
 * FloatingVue Plugin for Nuxt 3
 *
 * Replaces: v-tooltip (Vue 2)
 * Provides: v-tooltip directive, Dropdown, Tooltip, Menu components
 *
 * Usage in components (Phase 4):
 * <button v-tooltip="'Tooltip text'">Hover me</button>
 */
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue, {
    // Configuration options
    themes: {
      'med-tooltip': {
        $extend: 'tooltip',
        triggers: ['hover', 'focus', 'touch'],
        autoHide: true,
        distance: 8
      }
    }
  })
})
