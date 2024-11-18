export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Auth middleware', from.path, to.path)
  const token = await $fetch('/api/auth/token')

  if (!token && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }

  if (token && to.path === '/auth/login') {
    return navigateTo('/')
  }
})
