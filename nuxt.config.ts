import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    head: {
      title: "Médiathèque",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: process.env.npm_package_description || "",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      script: [
        {
          src:
            "https://kit.fontawesome.com/" +
            process.env.FONT_AWESOME_KIT_NAME +
            ".js",
          crossOrigin: "anonymous",
        },
      ],
    },
  },

  // CSS files
  css: [],

  // Plugins
  plugins: [
    "~/plugins/tsyringe",
    "~/plugins/vueChartjs.client",
    "~/plugins/wysiwyg.client",
  ],

  // Modules
  modules: ["@nuxtjs/i18n", "@pinia/nuxt"],

  // i18n configuration
  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json" },
      { code: "fr", language: "fr-FR", file: "fr.json" },
    ],
    defaultLocale: "fr",
    langDir: "locales/",
    strategy: "prefix_except_default",
  },

  // Dev server configuration
  devServer: {
    https: process.env.NODE_ENV === "production",
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // Build configuration
  build: {
    transpile: ["tsyringe", "reflect-metadata"],
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8000",
    },
  },
});
