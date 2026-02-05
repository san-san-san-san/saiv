"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Mail, Lock, User } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background gradient orbs for depth */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md fade-in">
        <Card>
          <CardHeader className="text-center pb-2">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">Saiv</span>
            </Link>
            <CardTitle className="text-xl">Créer un compte</CardTitle>
            <CardDescription>
              Commencez à automatiser votre SAV gratuitement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Votre nom"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    minLength={8}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400">Minimum 8 caractères</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading} isLoading={loading}>
                {loading ? "Création..." : "Créer mon compte"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors">
                Se connecter
              </Link>
            </div>

            <p className="mt-4 text-xs text-center text-gray-400">
              En créant un compte, vous acceptez nos{" "}
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 underline">CGU</Link> et notre{" "}
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 underline">politique de confidentialité</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
