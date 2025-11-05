"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const message = searchParams.get("message")
  if (message === "account_pending") {
    const displayError = "Akun admin Anda belum diaktifkan. Hubungi administrator untuk persetujuan."
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (data.user) {
        let adminUser = null
        let retries = 0
        const maxRetries = 3

        while (retries < maxRetries && !adminUser) {
          try {
            const { data: admin, error: queryError } = await supabase
              .from("admin_users")
              .select("id, is_active")
              .eq("id", data.user.id)
              .single()

            if (!queryError) {
              adminUser = admin
              break
            }
          } catch (err) {
            console.log(`[v0] Retry ${retries + 1} failed:`, err)
          }

          retries++
          if (retries < maxRetries) {
            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        }

        if (!adminUser) {
          await supabase.auth.signOut()
          setError("Akun Anda belum disetup. Silahkan hubungi administrator atau coba daftar ulang.")
          return
        }

        if (!adminUser.is_active) {
          await supabase.auth.signOut()
          setError("Akun admin Anda belum diaktifkan. Hubungi administrator untuk persetujuan.")
          return
        }

        router.push("/admin")
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal. Silahkan coba lagi.")
      console.log("[v0] Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Silakan masuk ke panel admin pemerintah desa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {(error || message === "account_pending") && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error || "Akun admin Anda belum diaktifkan. Hubungi administrator untuk persetujuan."}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="admin@desa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center text-sm">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Daftar di sini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
