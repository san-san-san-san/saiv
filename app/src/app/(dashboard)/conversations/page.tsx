import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, MessageSquare, ChevronRight } from "lucide-react"

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const user = await getCurrentUser()
  const shop = user?.shops[0]

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/50 mb-6">
          <MessageSquare className="h-12 w-12 text-gray-400" />
        </div>
        <p className="text-gray-500 mb-4">Connectez d'abord votre boutique Shopify</p>
        <Link href="/dashboard">
          <Button>Retour au dashboard</Button>
        </Link>
      </div>
    )
  }

  const status = params.status
  const search = params.search
  const page = parseInt(params.page || "1")
  const perPage = 20

  const where = {
    shopId: shop.id,
    ...(status && status !== "all" ? { status: status as any } : {}),
    ...(search
      ? {
          OR: [
            { subject: { contains: search, mode: "insensitive" as const } },
            { customer: { email: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  }

  const [conversations, total] = await Promise.all([
    db.conversation.findMany({
      where,
      include: { customer: true, messages: { take: 1, orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.conversation.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-500">Gérez vos échanges avec les clients</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <form className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                name="search"
                placeholder="Rechercher par email ou sujet..."
                defaultValue={search}
                className="pl-10"
              />
            </form>
            <div className="flex gap-2 flex-wrap">
              <FilterButton href="/conversations" active={!status || status === "all"}>
                Tous
              </FilterButton>
              <FilterButton href="/conversations?status=PENDING" active={status === "PENDING"}>
                En attente
              </FilterButton>
              <FilterButton href="/conversations?status=AUTO_REPLIED" active={status === "AUTO_REPLIED"}>
                Auto
              </FilterButton>
              <FilterButton href="/conversations?status=ESCALATED" active={status === "ESCALATED"}>
                Escaladés
              </FilterButton>
              <FilterButton href="/conversations?status=RESOLVED" active={status === "RESOLVED"}>
                Résolus
              </FilterButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card>
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            {total} conversation{total > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/50 mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Aucune conversation trouvée</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200/50">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="flex items-center justify-between py-4 px-6 hover:bg-gray-50/50 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 truncate">
                        {conv.customer?.name || conv.customer?.email || "Client inconnu"}
                      </span>
                      <StatusBadge status={conv.status} />
                      <TypeBadge type={conv.type} />
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.subject}</p>
                    {conv.messages[0] && (
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {conv.messages[0].content.slice(0, 100)}...
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {formatDate(conv.createdAt)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-6 border-t border-gray-200/50">
              {page > 1 && (
                <Link href={`/conversations?page=${page - 1}${status ? `&status=${status}` : ""}`}>
                  <Button variant="outline" size="sm">Précédent</Button>
                </Link>
              )}
              <span className="flex items-center px-4 text-sm text-gray-500">
                Page {page} sur {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/conversations?page=${page + 1}${status ? `&status=${status}` : ""}`}>
                  <Button variant="outline" size="sm">Suivant</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function FilterButton({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link href={href}>
      <Button variant={active ? "default" : "secondary"} size="sm">
        {children}
      </Button>
    </Link>
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

function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    TRACKING: "Suivi",
    RETURN: "Retour",
    REFUND: "Remboursement",
    PRODUCT: "Produit",
    COMPLAINT: "Réclamation",
    OTHER: "Autre",
  }

  return (
    <Badge variant="outline" className="text-xs">
      {labels[type] || type}
    </Badge>
  )
}

function formatDate(date: Date): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} min`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}j`

  return d.toLocaleDateString("fr-FR")
}
