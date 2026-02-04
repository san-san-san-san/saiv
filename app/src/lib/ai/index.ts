import Anthropic from '@anthropic-ai/sdk'
import { Shop, Customer, Order, Message, Conversation } from '@prisma/client'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface GenerateResponseParams {
  shop: Shop
  customer: Customer | null
  order: Order | null
  conversation: Conversation
  messages: Message[]
  newMessage: string
}

const TONE_INSTRUCTIONS = {
  FORMAL: "Utilise un ton professionnel et formel. Vouvoie le client.",
  CASUAL: "Utilise un ton decontracte mais professionnel. Tu peux tutoyer le client.",
  FRIENDLY: "Utilise un ton amical et chaleureux. Tutoie le client et sois empathique."
}

export async function generateResponse(params: GenerateResponseParams): Promise<{
  response: string
  shouldEscalate: boolean
  confidence: number
  classification: string
}> {
  const { shop, customer, order, messages, newMessage } = params

  const policies = shop.policies as Record<string, string>
  const faq = shop.faq as Array<{ question: string; answer: string }>

  const systemPrompt = `Tu es l'assistant SAV de "${shop.shopName}".
Ton role est de repondre aux clients de maniere utile, empathique et efficace.

${TONE_INSTRUCTIONS[shop.tone]}

POLITIQUES DE LA BOUTIQUE:
- Retours: ${policies.returns || "Non specifie"}
- Remboursements: ${policies.refunds || "Non specifie"}
- Livraison: ${policies.shipping || "Non specifie"}

${faq.length > 0 ? `FAQ:
${faq.map(f => `Q: ${f.question}\nR: ${f.answer}`).join('\n\n')}` : ''}

REGLES IMPORTANTES:
1. Reponds TOUJOURS dans la langue du client
2. Si tu ne peux pas resoudre le probleme, indique que tu transferes a un humain
3. Ne fais JAMAIS de promesses que tu ne peux pas tenir
4. Sois concis mais complet
5. Termine toujours par proposer ton aide pour autre chose

FORMAT DE REPONSE:
Reponds en JSON avec cette structure:
{
  "response": "Ta reponse au client",
  "shouldEscalate": true/false,
  "confidence": 0-100,
  "classification": "TRACKING|RETURN|REFUND|PRODUCT|COMPLAINT|OTHER"
}

Si shouldEscalate est true, la reponse sera revue par un humain avant envoi.
Met shouldEscalate a true si:
- Le client mentionne un avocat ou action juridique
- Le client est tres mecontent (insultes, menaces)
- Tu n'es pas sur de la reponse (confidence < 70)
- Le montant depasse 500€ et c'est une demande de remboursement`

  const contextMessages = messages.slice(-5).map(m =>
    `${m.direction === 'INBOUND' ? 'Client' : 'Support'}: ${m.content}`
  ).join('\n')

  const userPrompt = `CONTEXTE CLIENT:
${customer ? `- Nom: ${customer.name || 'Non renseigne'}
- Email: ${customer.email}
- Commandes totales: ${customer.totalOrders}
- Total depense: ${customer.totalSpent}€` : '- Client non identifie'}

${order ? `COMMANDE CONCERNEE:
- Numero: #${order.orderNumber}
- Statut: ${order.status}
- Livraison: ${order.fulfillmentStatus || 'Non expedie'}
- Tracking: ${order.trackingNumber || 'Non disponible'}
- Montant: ${order.totalPrice}€` : ''}

HISTORIQUE CONVERSATION:
${contextMessages || 'Nouvelle conversation'}

NOUVEAU MESSAGE DU CLIENT:
${newMessage}

Genere ta reponse en JSON:`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Parse JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      response: parsed.response,
      shouldEscalate: parsed.shouldEscalate || false,
      confidence: parsed.confidence || 80,
      classification: parsed.classification || 'OTHER'
    }
  } catch (error) {
    console.error('AI generation error:', error)
    return {
      response: "Je vous remercie pour votre message. Un membre de notre equipe va vous repondre dans les plus brefs delais.",
      shouldEscalate: true,
      confidence: 0,
      classification: 'OTHER'
    }
  }
}

export async function classifyEmail(subject: string, body: string): Promise<{
  isSupport: boolean
  type: string
}> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      temperature: 0,
      system: "Tu es un classificateur d'emails. Reponds uniquement en JSON.",
      messages: [
        {
          role: 'user',
          content: `Classifie cet email:
Sujet: ${subject}
Corps: ${body.slice(0, 500)}

Reponds en JSON:
{
  "isSupport": true/false (est-ce une demande de support client?),
  "type": "TRACKING|RETURN|REFUND|PRODUCT|COMPLAINT|SPAM|NEWSLETTER|OTHER"
}`
        }
      ]
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return { isSupport: true, type: 'OTHER' }
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { isSupport: true, type: 'OTHER' }
    }

    return JSON.parse(jsonMatch[0])
  } catch {
    return { isSupport: true, type: 'OTHER' }
  }
}
