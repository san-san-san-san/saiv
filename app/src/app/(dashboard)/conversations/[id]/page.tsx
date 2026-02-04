import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, User, Package, Mail } from "lucide-react"
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
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux conversations
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {conversation.subject}
            </h1>
            <p className="text-gray-600">
              {conversation.customer?.email || "Client inconnu"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={conversation.status} />
            {conversation.status !== "RESOLVED" && (
              <form action={markResolved}>
                <Button variant="outline" size="sm" type="submit">
                  Marquer resolu
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
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.direction === "OUTBOUND" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.direction === "OUTBOUND"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {message.direction === "OUTBOUND"
                            ? message.aiGenerated
                              ? "Saiv (IA)"
                              : "Vous"
                            : conversation.customer?.name || "Client"}
                        </span>
                        {message.aiGenerated && (
                          <Badge variant="secondary" className="text-xs">
                            Auto
                          </Badge>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.direction === "OUTBOUND"
                            ? "text-blue-200"
                            : "text-gray-400"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              {conversation.status !== "RESOLVED" && (
                <form action={sendReply} className="mt-6 pt-6 border-t">
                  <Textarea
                    name="content"
                    placeholder="Ecrivez votre reponse..."
                    className="mb-4"
                    rows={4}
                  />
                  <Button type="submit">Envoyer la reponse</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Context */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversation.customer ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="font-medium">
                      {conversation.customer.name || "Non renseigne"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{conversation.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Commandes</p>
                    <p className="font-medium">
                      {conversation.customer.totalOrders} commande(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total depense</p>
                    <p className="font-medium">
                      {Number(conversation.customer.totalSpent).toFixed(2)} EUR
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Client non identifie</p>
              )}
            </CardContent>
          </Card>

          {/* Order Info */}
          {conversation.order && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Numero</p>
                  <p className="font-medium">#{conversation.order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="font-medium">{conversation.order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Livraison</p>
                  <p className="font-medium">
                    {conversation.order.fulfillmentStatus || "Non expedie"}
                  </p>
                </div>
                {conversation.order.trackingNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Tracking</p>
                    <p className="font-medium">{conversation.order.trackingNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Montant</p>
                  <p className="font-medium">
                    {Number(conversation.order.totalPrice).toFixed(2)} EUR
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversation Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{conversation.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cree le</p>
                <p className="font-medium">
                  {new Date(conversation.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>
              {conversation.resolvedAt && (
                <div>
                  <p className="text-sm text-gray-500">Resolu le</p>
                  <p className="font-medium">
                    {new Date(conversation.resolvedAt).toLocaleString("fr-FR")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
    AUTO_REPLIED: "Repondu auto",
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
