/**
 * Vue Toastification Plugin for Nuxt 3
 *
 * Replaces: @nuxtjs/toast module (Nuxt 2)
 * Provides: $toast for displaying notifications
 *
 * Usage in components:
 * const { $toast } = useNuxtApp()
 * $toast.success('Message saved!')
 * $toast.error('An error occurred')
 */
import Toast, { POSITION, type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: POSITION.BOTTOM_RIGHT,
    timeout: 1500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
  }

  nuxtApp.vueApp.use(Toast, options)

  // Provide a compatible API with old $toasted
  return {
    provide: {
      toast: nuxtApp.vueApp.config.globalProperties.$toast,
      // Backward compatibility with old $toasted API
      toasted: {
        show: (message: string) => nuxtApp.vueApp.config.globalProperties.$toast.success(message),
        error: (message: string) => nuxtApp.vueApp.config.globalProperties.$toast.error(message),
        success: (message: string) => nuxtApp.vueApp.config.globalProperties.$toast.success(message)
      }
    }
  }
})
