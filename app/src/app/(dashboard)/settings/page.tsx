import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  const shop = user?.shops[0]

  if (!shop) {
    redirect("/dashboard")
  }

  const policies = shop.policies as Record<string, string>
  const faq = shop.faq as Array<{ question: string; answer: string }>

  async function updateSettings(formData: FormData) {
    "use server"

    const tone = formData.get("tone") as string
    const signature = formData.get("signature") as string
    const autoReply = formData.get("autoReply") === "on"

    await db.shop.update({
      where: { id: shop!.id },
      data: {
        tone: tone as any,
        signature,
        autoReplyEnabled: autoReply,
      },
    })

    revalidatePath("/settings")
  }

  async function updatePolicies(formData: FormData) {
    "use server"

    const returns = formData.get("returns") as string
    const refunds = formData.get("refunds") as string
    const shipping = formData.get("shipping") as string

    await db.shop.update({
      where: { id: shop!.id },
      data: {
        policies: { returns, refunds, shipping },
      },
    })

    revalidatePath("/settings")
  }

  async function addFaqItem(formData: FormData) {
    "use server"

    const question = formData.get("question") as string
    const answer = formData.get("answer") as string

    if (!question || !answer) return

    const currentFaq = (shop!.faq as Array<{ question: string; answer: string }>) || []

    await db.shop.update({
      where: { id: shop!.id },
      data: {
        faq: [...currentFaq, { question, answer }],
      },
    })

    revalidatePath("/settings")
  }

  async function removeFaqItem(formData: FormData) {
    "use server"

    const index = parseInt(formData.get("index") as string)
    const currentFaq = (shop!.faq as Array<{ question: string; answer: string }>) || []

    await db.shop.update({
      where: { id: shop!.id },
      data: {
        faq: currentFaq.filter((_, i) => i !== index),
      },
    })

    revalidatePath("/settings")
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Parametres</h1>
        <p className="text-gray-600">Configurez le comportement de Saiv</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Parametres generaux</CardTitle>
            <CardDescription>
              Configurez le ton et la signature des reponses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Ton de communication</Label>
                <select
                  id="tone"
                  name="tone"
                  defaultValue={shop.tone}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="FORMAL">Formel (vouvoiement)</option>
                  <option value="CASUAL">Decontracte (tutoiement pro)</option>
                  <option value="FRIENDLY">Amical (tutoiement chaleureux)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Signature email</Label>
                <Textarea
                  id="signature"
                  name="signature"
                  defaultValue={shop.signature || ""}
                  placeholder="Cordialement,&#10;L'equipe {nom de la boutique}"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoReply"
                  name="autoReply"
                  defaultChecked={shop.autoReplyEnabled}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="autoReply">
                  Activer les reponses automatiques
                </Label>
              </div>

              <Button type="submit">Enregistrer</Button>
            </form>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Politiques de la boutique</CardTitle>
            <CardDescription>
              L'IA utilisera ces informations pour repondre aux clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updatePolicies} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="returns">Politique de retour</Label>
                <Textarea
                  id="returns"
                  name="returns"
                  defaultValue={policies.returns || ""}
                  placeholder="Ex: Retours acceptes sous 30 jours, produit non utilise..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refunds">Politique de remboursement</Label>
                <Textarea
                  id="refunds"
                  name="refunds"
                  defaultValue={policies.refunds || ""}
                  placeholder="Ex: Remboursement sous 14 jours apres reception du retour..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping">Informations livraison</Label>
                <Textarea
                  id="shipping"
                  name="shipping"
                  defaultValue={policies.shipping || ""}
                  placeholder="Ex: Livraison en 2-5 jours ouvrables pour la France..."
                  rows={3}
                />
              </div>

              <Button type="submit">Enregistrer</Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>FAQ personnalisee</CardTitle>
            <CardDescription>
              Ajoutez des questions/reponses frequentes pour aider l'IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Existing FAQ items */}
            {faq.length > 0 && (
              <div className="space-y-4 mb-6">
                {faq.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{item.question}</p>
                      <form action={removeFaqItem}>
                        <input type="hidden" name="index" value={index} />
                        <Button variant="ghost" size="sm" type="submit" className="text-red-600">
                          Supprimer
                        </Button>
                      </form>
                    </div>
                    <p className="text-gray-600 text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add new FAQ */}
            <form action={addFaqItem} className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  name="question"
                  placeholder="Ex: Quels sont les delais de livraison ?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Reponse</Label>
                <Textarea
                  id="answer"
                  name="answer"
                  placeholder="Ex: Nos delais de livraison sont de 2-5 jours ouvrables..."
                  rows={3}
                />
              </div>

              <Button type="submit" variant="outline">
                Ajouter a la FAQ
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Connexions</CardTitle>
            <CardDescription>
              Gerez vos integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Shopify</p>
                <p className="text-sm text-gray-600">{shop.shopifyDomain}</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Connecte</span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Gmail</p>
                <p className="text-sm text-gray-600">
                  {shop.emailAddress || "Non configure"}
                </p>
              </div>
              {shop.gmailRefreshToken ? (
                <span className="text-green-600 text-sm font-medium">Connecte</span>
              ) : (
                <a href="/api/gmail/connect">
                  <Button size="sm">Connecter</Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
