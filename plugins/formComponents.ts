import { defineNuxtPlugin } from '#app'

// Nuxt 4 plugin: Global component registration
// Replace Vue Formulate with custom form components

export default defineNuxtPlugin((nuxtApp) => {
  // Custom form components are auto-registered with Nuxt auto-imports
  // No additional setup needed for Nuxt 4
  // You can add global properties here if needed:
  // nuxtApp.provide('customProperty', value)
})
