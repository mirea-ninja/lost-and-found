import { createTRPCRouter } from '@/server/api/trpc'
import { usersRouter } from '@/server/api/routers/users'
import { postsRouter } from '@/server/api/routers/posts'
import { adminMenuRouter } from '@/server/api/routers/admin-menu'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  posts: postsRouter,
  adminMenu: adminMenuRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
