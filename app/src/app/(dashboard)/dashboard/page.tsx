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
          <h1 className="text-2xl font-bold text-white">
            Bonjour, {user?.name || ""} 👋
          </h1>
          <p className="text-slate-400">
            Voici l'activité de votre SAV aujourd'hui
          </p>
        </div>
        <FetchEmailsButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Emails aujourd'hui
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/15">
              <MessageSquare className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.emailsToday || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Résolus auto
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/15">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.autoResolved || 0}</div>
            <p className="text-xs text-emerald-400 mt-1">
              {stats?.autoResolveRate || 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              En attente
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/15">
              <AlertCircle className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.escalated || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Temps moyen
            </CardTitle>
            <div className="p-2 rounded-lg bg-pink-500/15">
              <Clock className="h-4 w-4 text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.avgResponseTime || "< 2"} <span className="text-lg text-slate-500">min</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.08]">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-purple-400" />
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
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-4">
                <MessageSquare className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-slate-500">Aucune conversation pour le moment</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.08]">
              {recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="flex items-center justify-between p-4 hover:bg-white/[0.03] transition-all duration-200 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">
                        {conv.customer?.name || conv.customer?.email || "Client"}
                      </span>
                      <StatusBadge status={conv.status} />
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {conv.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">
                      {new Date(conv.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
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
        <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 border border-purple-500/30 mb-4">
          <Sparkles className="h-8 w-8 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Bienvenue sur Saiv !
        </h1>
        <p className="text-slate-400">
          Configurez votre compte en quelques minutes
        </p>
      </div>

      {/* Show Shopify connection options if no shop */}
      {!hasShop && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-sm flex items-center justify-center">1</span>
            Connecter votre boutique Shopify
          </h2>

          {/* Manual connection - Primary option */}
          <ShopifyManualConnect />

          {/* OAuth option - Secondary */}
          <div className="mt-4 p-4 border border-dashed border-white/20 rounded-xl bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-300">Connexion OAuth (App Shopify)</p>
                  <p className="text-sm text-slate-500">Nécessite l'approbation de l'app Shopify</p>
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
          <Card className="!border-emerald-500/30 !bg-emerald-500/10">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Shopify connecté</h3>
                  <p className="text-sm text-slate-400">
                    Accès aux commandes et clients activé
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gmail */}
          <Card className={hasGmail ? "!border-emerald-500/30 !bg-emerald-500/10" : ""}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  hasGmail
                    ? "bg-emerald-500/20"
                    : "bg-white/5 border border-white/10"
                }`}>
                  {hasGmail ? (
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <Mail className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">Connecter Gmail</h3>
                  <p className="text-sm text-slate-400">
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
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Configurer les réponses</h3>
                  <p className="text-sm text-slate-400">
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
