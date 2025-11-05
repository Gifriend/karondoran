"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (!token_hash || !type) {
          setError("Token verifikasi tidak ditemukan")
          setLoading(false)
          return
        }

        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as "signup" | "recovery" | "invite" | "magiclink",
        })

        if (verifyError) {
          throw verifyError
        }

        if (data?.user) {
          setSuccess(true)
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/login?verified=true")
            router.refresh()
          }, 2000)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Verifikasi email gagal"
        setError(errorMessage)
        console.log("Email verification error:", err)
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Verifikasi Email</CardTitle>
          <CardDescription>Memverifikasi akun Anda...</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Sedang memverifikasi email Anda...</p>
            </div>
          )}

          {error && !loading && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && !loading && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Email berhasil diverifikasi! Redirect ke login dalam 2 detik...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
