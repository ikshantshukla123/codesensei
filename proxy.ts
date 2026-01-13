import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/profile(.*)', 
  '/wallet(.*)', 
  '/learning(.*)', 
  '/analytics(.*)'
])
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // If user is signed in and trying to access sign-in page, redirect to dashboard
  if (userId && (req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up'))) {
    return Response.redirect(new URL('/dashboard', req.url))
  }

  // If user is not signed in and trying to access protected route, redirect to sign-in
  if (!userId && isProtectedRoute(req)) {
    return Response.redirect(new URL('/sign-in', req.url))
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}