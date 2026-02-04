import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageSquare, CheckCircle, AlertCircle, Clock } from "lucide-react"

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.name || ""}
        </h1>
        <p className="text-gray-600">
          Voici l'activite de votre SAV aujourd'hui
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Emails aujourd'hui
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.emailsToday || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Resolus auto
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.autoResolved || 0}</div>
            <p className="text-xs text-gray-500">
              {stats?.autoResolveRate || 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En attente
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.escalated || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Temps moyen
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.avgResponseTime || "< 2"} min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Conversations recentes</CardTitle>
          <Link href="/conversations">
            <Button variant="outline" size="sm">
              Voir tout
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentConversations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune conversation pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {conv.customer?.name || conv.customer?.email || "Client"}
                      </span>
                      <StatusBadge status={conv.status} />
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.subject}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(conv.createdAt).toLocaleDateString("fr-FR")}
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
    RESOLVED: "Resolu",
  }

  return (
    <Badge variant={variants[status] || "default"}>
      {labels[status] || status}
    </Badge>
  )
}

function OnboardingPrompt({ hasShop, hasGmail }: { hasShop: boolean; hasGmail: boolean }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenue sur Saiv !
        </h1>
        <p className="text-gray-600">
          Configurez votre compte en quelques minutes
        </p>
      </div>

      <div className="space-y-4">
        <Card className={hasShop ? "border-green-200 bg-green-50" : ""}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasShop ? "bg-green-500" : "bg-gray-200"}`}>
                {hasShop ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <span className="text-gray-500 font-bold">1</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Connecter Shopify</h3>
                <p className="text-sm text-gray-600">
                  Accedez a vos commandes et clients
                </p>
              </div>
            </div>
            {!hasShop && (
              <Link href="/api/shopify/install">
                <Button>Connecter</Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className={hasGmail ? "border-green-200 bg-green-50" : ""}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasGmail ? "bg-green-500" : "bg-gray-200"}`}>
                {hasGmail ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <span className="text-gray-500 font-bold">2</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Connecter Gmail</h3>
                <p className="text-sm text-gray-600">
                  Recevez et envoyez des emails automatiquement
                </p>
              </div>
            </div>
            {hasShop && !hasGmail && (
              <Link href="/api/gmail/connect">
                <Button>Connecter</Button>
              </Link>
            )}
            {!hasShop && (
              <Button disabled variant="outline">
                Connecter
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Configurer les reponses</h3>
                <p className="text-sm text-gray-600">
                  Definissez vos politiques et ton de communication
                </p>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline" disabled={!hasGmail}>
                Configurer
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
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
