import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, User, Package, Mail, Sparkles, Send, CheckCircle } from "lucide-react"
import { revalidatePath } from "next/cache"

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  const shop = user?.shops[0]

  if (!shop) {
    redirect("/dashboard")
  }

  const conversation = await db.conversation.findFirst({
    where: {
      id,
      shopId: shop.id,
    },
    include: {
      customer: true,
      order: true,
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!conversation) {
    notFound()
  }

  async function sendReply(formData: FormData) {
    "use server"

    const content = formData.get("content") as string
    if (!content?.trim()) return

    // Create message
    await db.message.create({
      data: {
        conversationId: id,
        direction: "OUTBOUND",
        sender: shop!.shopName,
        content: content.trim(),
        aiGenerated: false,
      },
    })

    // Update conversation status
    await db.conversation.update({
      where: { id },
      data: { status: "RESOLVED", resolvedAt: new Date() },
    })

    // TODO: Actually send email via Gmail API

    revalidatePath(`/conversations/${id}`)
  }

  async function markResolved() {
    "use server"

    await db.conversation.update({
      where: { id },
      data: { status: "RESOLVED", resolvedAt: new Date() },
    })

    revalidatePath(`/conversations/${id}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/conversations"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux conversations
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {conversation.subject}
            </h1>
            <p className="text-gray-500">
              {conversation.customer?.email || "Client inconnu"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={conversation.status} />
            {conversation.status !== "RESOLVED" && (
              <form action={markResolved}>
                <Button variant="secondary" size="sm" type="submit">
                  <CheckCircle className="h-4 w-4" />
                  Marquer résolu
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-200/50">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {conversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.direction === "OUTBOUND" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.direction === "OUTBOUND"
                          ? message.aiGenerated
                            ? "message-outbound-ai"
                            : "message-outbound"
                          : "message-inbound"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-medium text-sm ${
                          message.direction === "OUTBOUND" ? "text-white" : "text-gray-700"
                        }`}>
                          {message.direction === "OUTBOUND"
                            ? message.aiGenerated
                              ? "Saiv"
                              : "Vous"
                            : conversation.customer?.name || "Client"}
                        </span>
                        {message.aiGenerated && (
                          <Badge className="bg-purple-500/20 text-purple-600 border-purple-300 text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                      <p className={`whitespace-pre-wrap text-sm leading-relaxed ${
                        message.direction === "OUTBOUND" ? "text-white" : "text-gray-600"
                      }`}>
                        {message.content}
                      </p>
                      <p className={`text-xs mt-3 ${
                        message.direction === "OUTBOUND"
                          ? "text-white/70"
                          : "text-gray-400"
                      }`}>
                        {new Date(message.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              {conversation.status !== "RESOLVED" && (
                <form action={sendReply} className="mt-6 pt-6 border-t border-gray-200/50">
                  <Textarea
                    name="content"
                    placeholder="Écrivez votre réponse..."
                    className="mb-4"
                    rows={4}
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                    Envoyer la réponse
                  </Button>
                </form>
              )}

              {conversation.status === "RESOLVED" && (
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <div className="flex items-center justify-center gap-2 py-4 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Conversation résolue</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Context */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="border-b border-gray-200/50">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-blue-500" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {conversation.customer ? (
                <>
                  <InfoRow label="Nom" value={conversation.customer.name || "Non renseigné"} />
                  <InfoRow label="Email" value={conversation.customer.email} />
                  <InfoRow label="Commandes" value={`${conversation.customer.totalOrders} commande(s)`} />
                  <InfoRow label="Total dépensé" value={`${Number(conversation.customer.totalSpent).toFixed(2)} €`} />
                </>
              ) : (
                <p className="text-gray-400 text-sm">Client non identifié</p>
              )}
            </CardContent>
          </Card>

          {/* Order Info */}
          {conversation.order && (
            <Card>
              <CardHeader className="border-b border-gray-200/50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4 text-blue-500" />
                  Commande
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <InfoRow label="Numéro" value={`#${conversation.order.orderNumber}`} />
                <InfoRow label="Statut" value={conversation.order.status} />
                <InfoRow label="Livraison" value={conversation.order.fulfillmentStatus || "Non expédié"} />
                {conversation.order.trackingNumber && (
                  <InfoRow label="Tracking" value={conversation.order.trackingNumber} />
                )}
                <InfoRow label="Montant" value={`${Number(conversation.order.totalPrice).toFixed(2)} €`} />
              </CardContent>
            </Card>
          )}

          {/* Conversation Info */}
          <Card>
            <CardHeader className="border-b border-gray-200/50">
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4 text-blue-500" />
                Détails
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <InfoRow label="Type" value={getTypeLabel(conversation.type)} />
              <InfoRow label="Créé le" value={new Date(conversation.createdAt).toLocaleString("fr-FR")} />
              {conversation.resolvedAt && (
                <InfoRow label="Résolu le" value={new Date(conversation.resolvedAt).toLocaleString("fr-FR")} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value}</p>
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
    AUTO_REPLIED: "Répondu auto",
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

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    TRACKING: "Suivi de commande",
    RETURN: "Retour",
    REFUND: "Remboursement",
    PRODUCT: "Question produit",
    COMPLAINT: "Réclamation",
    OTHER: "Autre",
  }
  return labels[type] || type
}
