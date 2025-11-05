"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    // Supabase sudah otomatis memverifikasi email lewat link,
    // jadi kita hanya tampilkan pesan sukses dan redirect ke login.
    const verified = searchParams.get("verified")

    if (verified === "true") {
      setStatus("success")
      setTimeout(() => {
        router.push("/login?verified=true")
        router.refresh()
      }, 2000)
    } else {
      // kalau user datang langsung tanpa klik link supabase
      setStatus("success")
      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 2000)
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Verifikasi Email</CardTitle>
          <CardDescription>Memverifikasi akun Anda...</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Sedang memverifikasi email Anda...</p>
            </div>
          )}

          {status === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Email berhasil diverifikasi! Redirect ke login dalam 2 detik...
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertDescription>Verifikasi gagal. Silakan coba lagi.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
