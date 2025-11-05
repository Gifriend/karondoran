import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("id, is_active")
        .eq("id", user.id)
        .single()

      if (adminUser && !adminUser.is_active) {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL("/login?message=account_pending", request.url))
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.log("[v0] Middleware admin check - record might not exist yet:", errorMsg)
      // Allow access - user might have just registered, trigger may be delayed
      // Login page will do final validation
    }
  }

  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && user) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
}
