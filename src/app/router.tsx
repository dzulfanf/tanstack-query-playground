import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { RootLayout } from '@/app/layout/RootLayout'
import { Module01Page } from '@/features/module-01/Module01Page'
import { Module02Page } from '@/features/module-02/Module02Page'
import { PokemonDetailPage } from '@/features/module-02/PokemonDetailPage'
import { Module03Page } from '@/features/module-03/Module03Page'
import { Module04Page } from '@/features/module-04/Module04Page'
import { Module05Page } from '@/features/module-05/Module05Page'
import { Module06Page } from '@/features/module-06/Module06Page'
import { Module07Page } from '@/features/module-07/Module07Page'
import { Module08Page } from '@/features/module-08/Module08Page'
import { Module09Page } from '@/features/module-09/Module09Page'

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

export const module05Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/05',
  component: Module05Page,
})

export const module06Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/06',
  component: Module06Page,
})

export const module07Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/07',
  component: Module07Page,
})

export const module08Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/08',
  component: Module08Page,
})

export const module09Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/09',
  component: Module09Page,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  module01Route,
  module02Route,
  module02DetailRoute,
  module03Route,
  module04Route,
  module05Route,
  module06Route,
  module07Route,
  module08Route,
  module09Route,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
