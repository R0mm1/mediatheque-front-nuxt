export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://kit.fontawesome.com/' + process.env.FONT_AWESOME_KIT_NAME + '.js', crossOrigin: 'anonymous' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '@/plugins/tsyringe',
    '@/plugins/vueFormulate',
    '@/plugins/vuePaginate.client',
    '@/plugins/vueTooltip.client',
    '@/plugins/wysiwyg.client',
    '@/plugins/vueStarRating.client',
    '@/plugins/vueChartjs.client'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/toast'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  },
  styleResources: {
    scss: [
      '~/assets/scss/breakpoints.scss',
      '~/assets/scss/colors.scss'
    ]
  },
  ssr: false,
  publicRuntimeConfig: {
    api: {
      endpoint: process.env.API_ENDPOINT || 'err-missing-api-endpoint',
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
  },
  privateRuntimeConfig: {
    fontawesome_kit_name: process.env.FONT_AWESOME_KIT_NAME || 'err-missing-font-awesome-kit-name'
  },
  server: {
    host: '0.0.0.0'
  }
}
