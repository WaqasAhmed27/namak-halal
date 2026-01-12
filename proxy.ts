import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const protectedRoutes = createRouteMatcher([
    '/account(.*)',
    '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (protectedRoutes(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        '/((?!_next|.*\\.(?:css|js|png|jpg|jpeg|webp|svg|ico)).*)',
    ],
};
