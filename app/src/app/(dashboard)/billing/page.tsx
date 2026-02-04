import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

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
    features: ["10 000 emails/mois", "5 boutiques", "Historique 1 an", "Support dedie"],
  },
]

export default async function BillingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const shop = user.shops[0]

  // Get current month usage
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const emailsThisMonth = shop
    ? await db.conversation.count({
        where: {
          shopId: shop.id,
          createdAt: { gte: startOfMonth },
        },
      })
    : 0

  const currentPlan = PLANS.find((p) => p.id === user.plan) || PLANS[0]
  const usagePercentage = Math.min(
    Math.round((emailsThisMonth / currentPlan.emails) * 100),
    100
  )

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Abonnement</h1>
        <p className="text-gray-600">Gerez votre plan et votre facturation</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Plan actuel</CardTitle>
          <CardDescription>
            Votre utilisation ce mois-ci
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{currentPlan.name}</h3>
              <p className="text-gray-600">
                {currentPlan.price > 0 ? `${currentPlan.price} EUR/mois` : "Gratuit"}
              </p>
            </div>
            {user.plan !== "FREE" && (
              <Button variant="outline">
                Gerer l'abonnement
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Emails utilises</span>
              <span>
                {emailsThisMonth} / {currentPlan.emails}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  usagePercentage > 90 ? "bg-red-500" : "bg-blue-600"
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            {usagePercentage > 80 && (
              <p className="text-sm text-yellow-600">
                Vous approchez de votre limite mensuelle
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular ? "border-blue-500 border-2" : ""
            } ${user.plan === plan.id ? "bg-gray-50" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Populaire
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-600">EUR/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              {user.plan === plan.id ? (
                <Button className="w-full" disabled>
                  Plan actuel
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {PLANS.findIndex((p) => p.id === user.plan) <
                  PLANS.findIndex((p) => p.id === plan.id)
                    ? "Passer a ce plan"
                    : "Changer de plan"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Questions frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Puis-je changer de plan a tout moment ?</h4>
            <p className="text-sm text-gray-600">
              Oui, vous pouvez upgrader ou downgrader a tout moment. Le changement
              sera effectif immediatement.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Que se passe-t-il si je depasse ma limite ?</h4>
            <p className="text-sm text-gray-600">
              Les emails supplementaires ne seront pas traites automatiquement.
              Vous serez notifie pour upgrader votre plan.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Comment annuler mon abonnement ?</h4>
            <p className="text-sm text-gray-600">
              Vous pouvez annuler a tout moment depuis le portail Stripe.
              Votre plan restera actif jusqu'a la fin de la periode payee.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
