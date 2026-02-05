import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Settings, MessageSquare, FileText, Link2, Trash2, Plus, CheckCircle, Zap } from "lucide-react"

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
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-purple-400" />
          Paramètres
        </h1>
        <p className="text-slate-400">Configurez le comportement de Saiv</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              Paramètres généraux
            </CardTitle>
            <CardDescription>
              Configurez le ton et la signature des réponses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone" className="text-slate-300">Ton de communication</Label>
                <select
                  id="tone"
                  name="tone"
                  defaultValue={shop.tone}
                  className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="FORMAL" className="bg-[#0a0a0f] text-white">Formel (vouvoiement)</option>
                  <option value="CASUAL" className="bg-[#0a0a0f] text-white">Décontracté (tutoiement pro)</option>
                  <option value="FRIENDLY" className="bg-[#0a0a0f] text-white">Amical (tutoiement chaleureux)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature" className="text-slate-300">Signature email</Label>
                <Textarea
                  id="signature"
                  name="signature"
                  defaultValue={shop.signature || ""}
                  placeholder="Cordialement,&#10;L'équipe {nom de la boutique}"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <input
                  type="checkbox"
                  id="autoReply"
                  name="autoReply"
                  defaultChecked={shop.autoReplyEnabled}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/30"
                />
                <div>
                  <Label htmlFor="autoReply" className="text-white font-medium cursor-pointer">
                    Activer les réponses automatiques
                  </Label>
                  <p className="text-sm text-slate-400">L'IA répondra automatiquement aux emails clients</p>
                </div>
              </div>

              <Button type="submit">Enregistrer</Button>
            </form>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              Politiques de la boutique
            </CardTitle>
            <CardDescription>
              L'IA utilisera ces informations pour répondre aux clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updatePolicies} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="returns" className="text-slate-300">Politique de retour</Label>
                <Textarea
                  id="returns"
                  name="returns"
                  defaultValue={policies?.returns || ""}
                  placeholder="Ex: Retours acceptés sous 30 jours, produit non utilisé..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refunds" className="text-slate-300">Politique de remboursement</Label>
                <Textarea
                  id="refunds"
                  name="refunds"
                  defaultValue={policies?.refunds || ""}
                  placeholder="Ex: Remboursement sous 14 jours après réception du retour..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping" className="text-slate-300">Informations livraison</Label>
                <Textarea
                  id="shipping"
                  name="shipping"
                  defaultValue={policies?.shipping || ""}
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
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              FAQ personnalisée
            </CardTitle>
            <CardDescription>
              Ajoutez des questions/réponses fréquentes pour aider l'IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Existing FAQ items */}
            {faq && faq.length > 0 && (
              <div className="space-y-4 mb-6">
                {faq.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-white">{item.question}</p>
                      <form action={removeFaqItem}>
                        <input type="hidden" name="index" value={index} />
                        <Button variant="ghost" size="sm" type="submit" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                    <p className="text-slate-400 text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add new FAQ */}
            <form action={addFaqItem} className="space-y-4 pt-4 border-t border-white/[0.08]">
              <div className="space-y-2">
                <Label htmlFor="question" className="text-slate-300">Question</Label>
                <Input
                  id="question"
                  name="question"
                  placeholder="Ex: Quels sont les délais de livraison ?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer" className="text-slate-300">Réponse</Label>
                <Textarea
                  id="answer"
                  name="answer"
                  placeholder="Ex: Nos délais de livraison sont de 2-5 jours ouvrables..."
                  rows={3}
                />
              </div>

              <Button type="submit" variant="outline">
                <Plus className="h-4 w-4" />
                Ajouter à la FAQ
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Connections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-purple-400" />
              Connexions
            </CardTitle>
            <CardDescription>
              Gérez vos intégrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div>
                <p className="font-medium text-white">Shopify</p>
                <p className="text-sm text-slate-400">{shop.shopifyDomain}</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Connecté
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div>
                <p className="font-medium text-white">Gmail</p>
                <p className="text-sm text-slate-400">
                  {shop.emailAddress || "Non configuré"}
                </p>
              </div>
              {shop.gmailRefreshToken ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Connecté
                </div>
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
