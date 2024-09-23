import type { App } from 'vue'

import { setupLayouts } from 'virtual:generated-layouts'
import type { RouteRecordRaw } from 'vue-router/auto'
// eslint-disable-next-line import/no-unresolved
import { createRouter, createWebHistory } from 'vue-router/auto'
import { checkLocalStorage, deleteLocalStorage } from '@/utils/base-utils'

function recursiveLayouts(route: RouteRecordRaw): RouteRecordRaw {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])

    return route
  }

  return setupLayouts([route])[0]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: 'smooth', top: 60 }

    return { top: 0 }
  },
  extendRoutes: pages => [
    ...[...pages].map(route => recursiveLayouts(route)),
  ],
})

router.beforeEach((to, from) => {
  const isAuthenticated = checkLocalStorage()
  if (
    // make sure the user is authenticated
    !isAuthenticated &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'login'
  ) {
    // redirect the user to the login page
    deleteLocalStorage()
    return { name: 'login' }
  }
})

export { router }

export default function (app: App) {
  app.use(router)
}
