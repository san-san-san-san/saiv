import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function StatsPage() {
  const user = await getCurrentUser()
  const shop = user?.shops[0]

  if (!shop) {
    redirect("/dashboard")
  }

  // Get stats for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    totalConversations,
    autoReplied,
    escalated,
    resolved,
    byType,
  ] = await Promise.all([
    db.conversation.count({
      where: { shopId: shop.id, createdAt: { gte: thirtyDaysAgo } },
    }),
    db.conversation.count({
      where: { shopId: shop.id, status: "AUTO_REPLIED", createdAt: { gte: thirtyDaysAgo } },
    }),
    db.conversation.count({
      where: { shopId: shop.id, status: "ESCALATED", createdAt: { gte: thirtyDaysAgo } },
    }),
    db.conversation.count({
      where: { shopId: shop.id, status: "RESOLVED", createdAt: { gte: thirtyDaysAgo } },
    }),
    db.conversation.groupBy({
      by: ["type"],
      where: { shopId: shop.id, createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),
  ])

  const autoResolveRate = totalConversations > 0
    ? Math.round((autoReplied / totalConversations) * 100)
    : 0

  const typeLabels: Record<string, string> = {
    TRACKING: "Suivi de commande",
    RETURN: "Retours",
    REFUND: "Remboursements",
    PRODUCT: "Questions produit",
    COMPLAINT: "Reclamations",
    OTHER: "Autres",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Statistiques</h1>
        <p className="text-slate-400">Performances des 30 derniers jours</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Résolues automatiquement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">{autoReplied}</div>
            <p className="text-sm text-slate-500">{autoResolveRate}% du total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Escaladées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">{escalated}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Résolues manuellement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* By Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Répartition par type</CardTitle>
        </CardHeader>
        <CardContent>
          {byType.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              Pas encore de données
            </p>
          ) : (
            <div className="space-y-4">
              {byType.map((item) => {
                const percentage = totalConversations > 0
                  ? Math.round((item._count / totalConversations) * 100)
                  : 0

                return (
                  <div key={item.type}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-white">
                        {typeLabels[item.type] || item.type}
                      </span>
                      <span className="text-sm text-slate-400">
                        {item._count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Taux de résolution automatique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-center py-8 text-purple-400">
              {autoResolveRate}%
            </div>
            <p className="text-center text-slate-500">
              Objectif : 70%+
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Temps de réponse moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-center py-8 text-emerald-400">
              &lt; 2 min
            </div>
            <p className="text-center text-slate-500">
              Objectif : &lt; 5 min
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
