"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, FileText, Building2, Loader2 } from "lucide-react"

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    emails: 50,
    features: ["50 emails/mois", "1 boutique", "Historique 7 jours"],
  },
  {
    id: "STARTER",
    name: "Starter",
    price: 29,
    emails: 500,
    features: ["500 emails/mois", "1 boutique", "Historique 30 jours", "Support email"],
  },
  {
    id: "GROWTH",
    name: "Growth",
    price: 79,
    emails: 2000,
    popular: true,
    features: ["2 000 emails/mois", "2 boutiques", "Historique 90 jours", "Support prioritaire"],
  },
  {
    id: "SCALE",
    name: "Scale",
    price: 199,
    emails: 10000,
    features: ["10 000 emails/mois", "5 boutiques", "Historique 1 an", "Support dédié"],
  },
]

interface BillingInfo {
  companyName?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  vatNumber?: string
}

interface Invoice {
  id: string
  number: string
  amount: number
  status: string
  paidAt?: string
  pdfUrl?: string
  createdAt: string
}

interface UserData {
  plan: string
  stripeCustomerId?: string
  stripeCurrentPeriodEnd?: string
}

export default function BillingPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({})
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [emailsThisMonth, setEmailsThisMonth] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [userRes, billingRes, invoicesRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/billing/info"),
        fetch("/api/billing/invoices"),
      ])

      if (userRes.ok) {
        const userData = await userRes.json()
        setUser(userData.user)
        setEmailsThisMonth(userData.emailsThisMonth || 0)
      }

      if (billingRes.ok) {
        const data = await billingRes.json()
        if (data.billingInfo) {
          setBillingInfo(data.billingInfo)
        }
      }

      if (invoicesRes.ok) {
        const data = await invoicesRes.json()
        setInvoices(data.invoices || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckout(planId: string) {
    setCheckoutLoading(planId)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Erreur lors de la création du paiement")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Erreur lors de la création du paiement")
    } finally {
      setCheckoutLoading(null)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Erreur lors de l'ouverture du portail")
      }
    } catch (error) {
      console.error("Portal error:", error)
      alert("Erreur lors de l'ouverture du portail")
    } finally {
      setPortalLoading(false)
    }
  }

  async function handleSaveBillingInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/billing/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billingInfo),
      })

      if (res.ok) {
        alert("Informations de facturation enregistrées")
      } else {
        const data = await res.json()
        alert(data.error || "Erreur lors de l'enregistrement")
      }
    } catch (error) {
      console.error("Save billing info error:", error)
      alert("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  const currentPlan = PLANS.find((p) => p.id === user?.plan) || PLANS[0]
  const usagePercentage = Math.min(
    Math.round((emailsThisMonth / currentPlan.emails) * 100),
    100
  )

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Abonnement</h1>
        <p className="text-gray-500">Gérez votre plan et votre facturation</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-500" />
            Plan actuel
          </CardTitle>
          <CardDescription>Votre utilisation ce mois-ci</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentPlan.name}</h3>
              <p className="text-gray-500">
                {currentPlan.price > 0 ? `${currentPlan.price} €/mois` : "Gratuit"}
              </p>
              {user?.stripeCurrentPeriodEnd && (
                <p className="text-sm text-gray-400 mt-1">
                  Renouvellement le {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
            {user?.plan !== "FREE" && user?.stripeCustomerId && (
              <Button
                variant="outline"
                onClick={handlePortal}
                disabled={portalLoading}
              >
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Gérer l'abonnement"
                )}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Emails utilisés</span>
              <span className="text-gray-900 font-medium">
                {emailsThisMonth} / {currentPlan.emails}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  usagePercentage > 90 ? "bg-red-500" : "bg-blue-500"
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            {usagePercentage > 80 && (
              <p className="text-sm text-amber-600">
                Vous approchez de votre limite mensuelle
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular ? "!border-blue-400 !border-2" : ""
            } ${user?.plan === plan.id ? "!bg-blue-50/50" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white border-blue-500">
                Populaire
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-gray-900">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500"> €/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              {user?.plan === plan.id ? (
                <Button className="w-full" disabled variant="secondary">
                  Plan actuel
                </Button>
              ) : plan.id === "FREE" ? (
                <Button className="w-full" disabled variant="outline">
                  Plan de base
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleCheckout(plan.id)}
                  disabled={checkoutLoading !== null}
                >
                  {checkoutLoading === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : PLANS.findIndex((p) => p.id === user?.plan) <
                    PLANS.findIndex((p) => p.id === plan.id) ? (
                    "Passer à ce plan"
                  ) : (
                    "Changer de plan"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Billing Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            Informations de facturation
          </CardTitle>
          <CardDescription>
            Ces informations apparaîtront sur vos factures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveBillingInfo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  value={billingInfo.companyName || ""}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, companyName: e.target.value })
                  }
                  placeholder="Ma Société SAS"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatNumber">Numéro de TVA</Label>
                <Input
                  id="vatNumber"
                  value={billingInfo.vatNumber || ""}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, vatNumber: e.target.value })
                  }
                  placeholder="FR12345678901"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={billingInfo.address || ""}
                onChange={(e) =>
                  setBillingInfo({ ...billingInfo, address: e.target.value })
                }
                placeholder="123 rue de la Paix"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  value={billingInfo.postalCode || ""}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, postalCode: e.target.value })
                  }
                  placeholder="75001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={billingInfo.city || ""}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, city: e.target.value })
                  }
                  placeholder="Paris"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={billingInfo.country || "FR"}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, country: e.target.value })
                  }
                  placeholder="FR"
                />
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Historique des factures
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune facture pour le moment
            </p>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-200/50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{invoice.number}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">
                      {Number(invoice.amount).toFixed(2)} €
                    </span>
                    <Badge
                      variant={invoice.status === "paid" ? "success" : "secondary"}
                    >
                      {invoice.status === "paid" ? "Payée" : "En attente"}
                    </Badge>
                    {invoice.pdfUrl && (
                      <a
                        href={invoice.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">
              Puis-je changer de plan à tout moment ?
            </h4>
            <p className="text-sm text-gray-500">
              Oui, vous pouvez upgrader ou downgrader à tout moment. Le changement
              sera effectif immédiatement.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              Que se passe-t-il si je dépasse ma limite ?
            </h4>
            <p className="text-sm text-gray-500">
              Les emails supplémentaires ne seront pas traités automatiquement.
              Vous serez notifié pour upgrader votre plan.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              Comment annuler mon abonnement ?
            </h4>
            <p className="text-sm text-gray-500">
              Vous pouvez annuler à tout moment depuis le portail de facturation.
              Votre plan restera actif jusqu'à la fin de la période payée.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
