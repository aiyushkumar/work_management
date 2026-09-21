import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xpdrsolbvfbnxopobdzr.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_JILwssEDqMGsQC6ZoxXxtw_fSYJpI3k'

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    let user = null
    try {
      const { data } = await supabase.auth.getUser()
      user = data?.user
    } catch (err) {
      console.error('Supabase auth error:', err)
    }

    const url = request.nextUrl.clone()

    // Protect all routes except auth ones
    if (
      !user &&
      !url.pathname.startsWith('/login') &&
      !url.pathname.startsWith('/signup') &&
      !url.pathname.startsWith('/auth')
    ) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (user) {
      let role = 'employee'
      let status = 'active'

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', user.id)
          .maybeSingle()

        if (profile) {
          role = profile.role || 'employee'
          status = profile.status || 'pending'
        }
      } catch (profErr) {
        console.error('Proxy profile fetch error:', profErr)
      }

      // If logged in and trying to access login/signup, redirect to appropriate dashboard
      if (url.pathname.startsWith('/login') || url.pathname.startsWith('/signup')) {
        if (status === 'pending') url.pathname = '/pending'
        else if (status === 'rejected') url.pathname = '/rejected'
        else if (status === 'inactive') url.pathname = '/inactive'
        else if (role === 'manager') url.pathname = '/manager/dashboard'
        else url.pathname = '/employee/dashboard'
        return NextResponse.redirect(url)
      }

      // Role-based protection: Manager
      if (url.pathname.startsWith('/manager')) {
        if (role !== 'manager' || status !== 'active') {
          url.pathname = '/unauthorized'
          return NextResponse.redirect(url)
        }
      }

      // Role-based protection: Employee
      if (url.pathname.startsWith('/employee')) {
        if (role === 'manager') {
          url.pathname = '/manager/dashboard'
          return NextResponse.redirect(url)
        }
        
        if (status !== 'active') {
          if (status === 'pending') url.pathname = '/pending'
          else if (status === 'rejected') url.pathname = '/rejected'
          else if (status === 'inactive') url.pathname = '/inactive'
          else url.pathname = '/unauthorized'
          return NextResponse.redirect(url)
        }
      }
    }

    return supabaseResponse
  } catch (error: any) {
    console.error('Proxy top-level error:', error)
    return supabaseResponse
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
export default proxy;
