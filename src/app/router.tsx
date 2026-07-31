import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { RootLayout } from '@/app/layout/RootLayout'
import { Module01Page } from '@/features/module-01/Module01Page'
import { Module02Page } from '@/features/module-02/Module02Page'
import { PokemonDetailPage } from '@/features/module-02/PokemonDetailPage'
import { Module03Page } from '@/features/module-03/Module03Page'
import { Module04Page } from '@/features/module-04/Module04Page'

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/module/01' }) },
})

export const module01Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/01',
  component: Module01Page,
})

export const module02Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/02',
  component: Module02Page,
})

export const module02DetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/02/pokemon/$name',
  component: PokemonDetailPage,
})

export const module03Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/03',
  component: Module03Page,
})

export const module04Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/04',
  component: Module04Page,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  module01Route,
  module02Route,
  module02DetailRoute,
  module03Route,
  module04Route,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
