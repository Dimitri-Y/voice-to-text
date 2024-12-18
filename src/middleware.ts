import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const isApiRequest = req.url.includes('/api');
    const currentUrl = new URL(req.url, `https://${req.headers.get('host')}`);
    if (!userId) {
        if (isApiRequest) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            const url = new URL('/', currentUrl);
            return NextResponse.redirect(url.toString());
        }
    }

    if (!isApiRequest && userId && currentUrl.pathname === '/sign-in') {
        const url = new URL('/dashboard', currentUrl);
        return NextResponse.redirect(url.toString());
    }

    if (!isApiRequest && userId && currentUrl.pathname !== '/dashboard') {
        const url = new URL('/dashboard', currentUrl);
        return NextResponse.redirect(url.toString());
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        "/((?!_next/static|_next/image|favicon.ico).*)",
        "/api/(.*)",
    ],
};
