import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageSquare, CheckCircle, AlertCircle, Clock, ArrowRight, Sparkles, Mail, Zap, Key } from "lucide-react"
import { FetchEmailsButton } from "@/components/FetchEmailsButton"
import { ShopifyManualConnect } from "@/components/ShopifyManualConnect"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const shop = user?.shops[0]

  // Get stats
  const stats = shop ? await getStats(shop.id) : null

  // Get recent conversations
  const recentConversations = shop
    ? await db.conversation.findMany({
        where: { shopId: shop.id },
        include: { customer: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    : []

  // Check if onboarding is complete
  const needsOnboarding = !shop || !shop.gmailRefreshToken

  if (needsOnboarding) {
    return <OnboardingPrompt hasShop={!!shop} hasGmail={!!shop?.gmailRefreshToken} />
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {user?.name || ""} 👋
          </h1>
          <p className="text-gray-500">
            Voici l'activité de votre SAV aujourd'hui
          </p>
        </div>
        <FetchEmailsButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Emails aujourd'hui
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.emailsToday || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Résolus auto
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.autoResolved || 0}</div>
            <p className="text-xs text-emerald-600 mt-1">
              {stats?.autoResolveRate || 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              En attente
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.escalated || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Temps moyen
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.avgResponseTime || "< 2"} <span className="text-lg text-gray-500">min</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200/50">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            Conversations récentes
          </CardTitle>
          <Link href="/conversations">
            <Button variant="secondary" size="sm">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/50 mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Aucune conversation pour le moment</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200/50">
              {recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-all duration-200 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {conv.customer?.name || conv.customer?.email || "Client"}
                      </span>
                      <StatusBadge status={conv.status} />
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      {new Date(conv.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "success" | "warning" | "secondary" | "default"> = {
    AUTO_REPLIED: "success",
    ESCALATED: "warning",
    PENDING: "secondary",
    RESOLVED: "default",
  }

  const labels: Record<string, string> = {
    AUTO_REPLIED: "Auto",
    ESCALATED: "Escalade",
    PENDING: "En attente",
    RESOLVED: "Résolu",
  }

  return (
    <Badge variant={variants[status] || "default"}>
      {labels[status] || status}
    </Badge>
  )
}

function OnboardingPrompt({ hasShop, hasGmail }: { hasShop: boolean; hasGmail: boolean }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-200/50 mb-4">
          <Sparkles className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenue sur Saiv !
        </h1>
        <p className="text-gray-500">
          Configurez votre compte en quelques minutes
        </p>
      </div>

      {/* Show Shopify connection options if no shop */}
      {!hasShop && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">1</span>
            Connecter votre boutique Shopify
          </h2>

          {/* Manual connection - Primary option */}
          <ShopifyManualConnect />

          {/* OAuth option - Secondary */}
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Connexion OAuth (App Shopify)</p>
                  <p className="text-sm text-gray-500">Nécessite l'approbation de l'app Shopify</p>
                </div>
              </div>
              <Link href="/api/shopify/install">
                <Button variant="outline" size="sm">
                  Utiliser OAuth
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Steps when shop is connected */}
      {hasShop && (
        <div className="space-y-4">
          {/* Shopify - Done */}
          <Card className="!border-emerald-300 !bg-emerald-50/50">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shopify connecté</h3>
                  <p className="text-sm text-gray-500">
                    Accès aux commandes et clients activé
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gmail */}
          <Card className={hasGmail ? "!border-emerald-300 !bg-emerald-50/50" : ""}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  hasGmail
                    ? "bg-emerald-100"
                    : "bg-gray-50 border border-gray-200"
                }`}>
                  {hasGmail ? (
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Mail className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Connecter Gmail</h3>
                  <p className="text-sm text-gray-500">
                    Recevez et envoyez des emails automatiquement
                  </p>
                </div>
              </div>
              {!hasGmail && (
                <Link href="/api/gmail/connect">
                  <Button>Connecter</Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Configure */}
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Configurer les réponses</h3>
                  <p className="text-sm text-gray-500">
                    Définissez vos politiques et ton de communication
                  </p>
                </div>
              </div>
              <Link href="/settings">
                <Button variant="secondary" disabled={!hasGmail}>
                  Configurer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

async function getStats(shopId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [emailsToday, autoResolved, escalated] = await Promise.all([
    db.conversation.count({
      where: {
        shopId,
        createdAt: { gte: today },
      },
    }),
    db.conversation.count({
      where: {
        shopId,
        createdAt: { gte: today },
        status: "AUTO_REPLIED",
      },
    }),
    db.conversation.count({
      where: {
        shopId,
        status: "ESCALATED",
      },
    }),
  ])

  const autoResolveRate = emailsToday > 0
    ? Math.round((autoResolved / emailsToday) * 100)
    : 0

  return {
    emailsToday,
    autoResolved,
    escalated,
    autoResolveRate,
    avgResponseTime: 2,
  }
}
