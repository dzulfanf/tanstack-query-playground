import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { RootLayout } from '@/app/layout/RootLayout'

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
  component: () => (
    <div className="p-8">
      <p className="text-gray-500">Module 01 — coming in Task 5</p>
    </div>
  ),
})

const routeTree = rootRoute.addChildren([indexRoute, module01Route])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
