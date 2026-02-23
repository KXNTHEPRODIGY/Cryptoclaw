import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('status')
            .eq('id', session.user.id)
            .single();

        const status = profile?.status || 'waitlist';
        const isWaitlistPage = request.nextUrl.pathname === '/waitlist';
        const isApi = request.nextUrl.pathname.startsWith('/api');
        const isAdmin = request.nextUrl.pathname.startsWith('/admin');

        if (status === 'waitlist' && !isWaitlistPage && !isApi && !isAdmin) {
            return NextResponse.redirect(new URL('/waitlist', request.url));
        }

        if (status === 'active' && isWaitlistPage) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|login|signup|auth).*)'],
};
