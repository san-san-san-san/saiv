import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

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
      <div className="text-center py-12">
        <p className="text-gray-500">Connectez d'abord votre boutique Shopify</p>
        <Link href="/dashboard">
          <Button className="mt-4">Retour au dashboard</Button>
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-600">Gerez vos echanges avec les clients</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <form className="flex-1 min-w-[200px]">
              <Input
                name="search"
                placeholder="Rechercher par email ou sujet..."
                defaultValue={search}
              />
            </form>
            <div className="flex gap-2">
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
                Escalades
              </FilterButton>
              <FilterButton href="/conversations?status=RESOLVED" active={status === "RESOLVED"}>
                Resolus
              </FilterButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {total} conversation{total > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune conversation trouvee
            </p>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">
                        {conv.customer?.name || conv.customer?.email || "Client inconnu"}
                      </span>
                      <StatusBadge status={conv.status} />
                      <TypeBadge type={conv.type} />
                    </div>
                    <p className="text-sm text-gray-900 truncate">{conv.subject}</p>
                    {conv.messages[0] && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {conv.messages[0].content.slice(0, 100)}...
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 ml-4 whitespace-nowrap">
                    {formatDate(conv.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 pt-6 border-t">
              {page > 1 && (
                <Link href={`/conversations?page=${page - 1}${status ? `&status=${status}` : ""}`}>
                  <Button variant="outline" size="sm">Precedent</Button>
                </Link>
              )}
              <span className="flex items-center px-4 text-sm text-gray-600">
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
      <Button variant={active ? "default" : "outline"} size="sm">
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
    RESOLVED: "Resolu",
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
    COMPLAINT: "Reclamation",
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
