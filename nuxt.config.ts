// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@formkit/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/device'
  ],

  css: [
    '~/assets/scss/layout.scss'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "~/assets/scss/breakpoints.scss";
            @import "~/assets/scss/colors.scss";
          `
        }
      }
    }
  },

  runtimeConfig: {
    fontawesomeKitName: process.env.FONT_AWESOME_KIT_NAME || 'err-missing-font-awesome-kit-name',

    public: {
      api: {
        endpoint: process.env.API_ENDPOINT || 'err-missing-api-endpoint'
      },
      auth: {
        userinfo_endpoint: process.env.USERINFO_ENDPOINT || 'err-missing-userinfo-endpoint',
        authorization_endpoint: process.env.AUTHORIZATION_ENDPOINT || 'err-missing-authorization-endpoint',
        token_endpoint: process.env.TOKEN_ENDPOINT || 'err-missing-token-endpoint',
        end_session_endpoint: process.env.END_SESSION_ENDPOINT || 'err-missing-end-session-endpoint',
        account_management_web_ui: process.env.ACCOUNT_MANAGEMENT_WEB_UI || 'err-missing-account-management-web-ui',
        client_id: process.env.CLIENT_ID || 'err-missing-client-id'
      },
      default: {
        page: '/book',
        notification_settings: {
          duration: 1500,
          iconPack: 'fontawesome'
        }
      }
    }
  },

  app: {
    head: {
      title: 'Médiathèque',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
        {
          src: 'https://kit.fontawesome.com/' + (process.env.FONT_AWESOME_KIT_NAME || '') + '.js',
          crossorigin: 'anonymous'
        }
      ]
    }
  },

  devServer: {
    host: '0.0.0.0'
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', file: 'fr.js' }
    ],
    langDir: 'locales',
    defaultLocale: 'fr',
    strategy: 'no_prefix'
  },

  // Temporary: keep plugins list (will be updated in Phase 6)
  plugins: [
    '~/plugins/tsyringe.ts'
  ],

  compatibilityDate: '2024-12-25'
})
