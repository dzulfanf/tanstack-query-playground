import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { RootLayout } from '@/app/layout/RootLayout'
import { Module01Page } from '@/features/module-01/Module01Page'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/module/01' })
  },
})

export const module01Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/01',
  component: Module01Page,
})

const routeTree = rootRoute.addChildren([indexRoute, module01Route])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
