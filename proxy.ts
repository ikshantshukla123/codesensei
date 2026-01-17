import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/features',
  '/how-it-works',
  '/pricing',
  '/sign-in(.*)',
  '/api/webhooks(.*)', // GitHub webhooks should be public
  '/api/inngest(.*)',  // Inngest endpoints should be public
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const isPublic = isPublicRoute(req)

  // If user is logged in and tries to access home page, redirect to dashboard
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect all routes that aren't public
  if (!isPublic && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}