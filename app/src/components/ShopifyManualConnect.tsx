"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, ExternalLink, Key, Store } from "lucide-react"

export function ShopifyManualConnect() {
  const [shopDomain, setShopDomain] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/shopify/connect-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopDomain, accessToken }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erreur lors de la connexion")
        return
      }

      setSuccess(true)
      // Reload page after success
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError("Erreur lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-800">Boutique connectée !</h3>
            <p className="text-emerald-600 text-sm mt-1">Redirection en cours...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-500" />
          Connexion manuelle Shopify
        </CardTitle>
        <CardDescription>
          Créez une Custom App dans votre admin Shopify et entrez les informations ci-dessous
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="font-medium text-blue-900 mb-2">Comment obtenir votre token :</h4>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Allez dans votre <strong>Admin Shopify</strong> → Settings → Apps and sales channels</li>
            <li>Cliquez sur <strong>"Develop apps"</strong> puis <strong>"Create an app"</strong></li>
            <li>Nommez l'app (ex: "Saiv SAV")</li>
            <li>Dans <strong>"Configuration"</strong> → Admin API, activez ces scopes :
              <ul className="ml-4 mt-1 text-blue-700">
                <li>• <code>read_orders</code></li>
                <li>• <code>read_customers</code></li>
                <li>• <code>read_products</code></li>
                <li>• <code>read_fulfillments</code></li>
              </ul>
            </li>
            <li>Cliquez sur <strong>"Install app"</strong></li>
            <li>Copiez le <strong>"Admin API access token"</strong></li>
          </ol>
          <a
            href="https://help.shopify.com/en/manual/apps/app-types/custom-apps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mt-3"
          >
            Documentation Shopify <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="shopDomain" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Domaine de la boutique
            </Label>
            <Input
              id="shopDomain"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
              placeholder="ma-boutique.myshopify.com"
              required
            />
            <p className="text-xs text-gray-500">
              Le domaine .myshopify.com de votre boutique
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessToken" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Admin API Access Token
            </Label>
            <Input
              id="accessToken"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
              required
            />
            <p className="text-xs text-gray-500">
              Le token commence par "shpat_"
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Connecter la boutique"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
