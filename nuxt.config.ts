// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    auth: {
      name: 'oauth2-bridge-session',
      password: 'my-super-secret-password-is-minimum-32-characters-long',
    },
  },
  compatibilityDate: '2024-04-03',
  nitro: {
    storage: {
      'proxies': {
        driver: 'fs',
        base: './data/proxies',
      },
      'states': {
        driver: 'fs',
        base: './data/states',
      },
      'api-tokens': {
        driver: 'fs',
        base: './data/api-tokens',
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
