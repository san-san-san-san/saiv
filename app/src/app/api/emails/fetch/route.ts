import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { getNewEmails, sendEmail } from "@/lib/gmail"
import { generateResponse, classifyEmail } from "@/lib/ai"
import { getCustomer } from "@/lib/shopify"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non connecté - veuillez vous reconnecter" }, { status: 401 })
    }

    const shop = user.shops[0]
    if (!shop) {
      return NextResponse.json({ error: "Aucune boutique trouvée - connectez Shopify d'abord" }, { status: 404 })
    }

    if (!shop.gmailRefreshToken) {
      return NextResponse.json({ error: "Gmail non connecté - allez dans Paramètres pour connecter Gmail" }, { status: 400 })
    }

    // Process emails for this shop
    const result = await processShopEmails(shop)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Fetch emails error:", error)

    // More specific error messages
    let errorMessage = "Erreur lors de la récupération des emails"

    if (error?.message?.includes("invalid_grant")) {
      errorMessage = "Token Gmail expiré - reconnectez Gmail dans les paramètres"
    } else if (error?.message?.includes("insufficient")) {
      errorMessage = "Permissions Gmail insuffisantes - reconnectez Gmail"
    } else if (error?.code === "ENOTFOUND") {
      errorMessage = "Erreur de connexion au serveur Google"
    }

    return NextResponse.json(
      { error: errorMessage, details: error?.message || String(error) },
      { status: 500 }
    )
  }
}

async function processShopEmails(shop: any) {
  // Get new emails
  const emails = await getNewEmails(shop.gmailRefreshToken)

  let processed = 0
  let autoReplied = 0
  let escalated = 0
  let skipped = 0

  for (const email of emails) {
    try {
      // Skip if already processed
      const existing = await db.conversation.findFirst({
        where: {
          shopId: shop.id,
          gmailThreadId: email.threadId,
        },
      })

      if (existing) {
        skipped++
        continue
      }

      // Classify email
      const classification = await classifyEmail(email.subject, email.body)

      // Skip non-support emails
      if (!classification.isSupport) {
        skipped++
        continue
      }

      // Extract customer email from "From" header
      const emailMatch = email.from.match(/<(.+?)>/) || [null, email.from]
      const customerEmail = emailMatch[1] || email.from

      // Find or create customer
      let customer = await db.customer.findFirst({
        where: { shopId: shop.id, email: customerEmail },
      })

      if (!customer) {
        // Try to find in Shopify
        try {
          const shopifyCustomer = await getCustomer(
            shop.shopifyDomain,
            shop.shopifyAccessToken,
            customerEmail
          )

          if (shopifyCustomer.customers?.[0]) {
            const sc = shopifyCustomer.customers[0]
            customer = await db.customer.create({
              data: {
                shopId: shop.id,
                email: customerEmail,
                shopifyCustomerId: String(sc.id),
                name: `${sc.first_name} ${sc.last_name}`.trim(),
                totalOrders: sc.orders_count,
                totalSpent: parseFloat(sc.total_spent),
              },
            })
          }
        } catch {
          // Customer not found in Shopify, create basic record
          customer = await db.customer.create({
            data: {
              shopId: shop.id,
              email: customerEmail,
            },
          })
        }
      }

      // Find related order (look for order number in subject/body)
      let order = null
      const orderMatch = (email.subject + " " + email.body).match(/#?(\d{4,})/i)
      if (orderMatch) {
        order = await db.order.findFirst({
          where: {
            shopId: shop.id,
            orderNumber: { contains: orderMatch[1] },
          },
        })
      }

      // Create conversation
      const conversation = await db.conversation.create({
        data: {
          shopId: shop.id,
          customerId: customer?.id,
          orderId: order?.id,
          subject: email.subject,
          status: "PENDING",
          type: classification.type as any,
          gmailThreadId: email.threadId,
        },
      })

      // Create inbound message
      await db.message.create({
        data: {
          conversationId: conversation.id,
          direction: "INBOUND",
          sender: customerEmail,
          content: email.body,
          gmailMessageId: email.id,
        },
      })

      // Check if auto-reply is enabled
      if (shop.autoReplyEnabled) {
        // Get all messages for context
        const messages = await db.message.findMany({
          where: { conversationId: conversation.id },
          orderBy: { createdAt: "asc" },
        })

        // Generate AI response
        const aiResponse = await generateResponse({
          shop,
          customer,
          order,
          conversation,
          messages,
          newMessage: email.body,
        })

        if (aiResponse.shouldEscalate) {
          // Mark as escalated
          await db.conversation.update({
            where: { id: conversation.id },
            data: {
              status: "ESCALATED",
              type: aiResponse.classification as any,
            },
          })

          escalated++
        } else {
          // Send auto-reply
          const fullResponse = aiResponse.response + (shop.signature ? `\n\n${shop.signature}` : "")

          await sendEmail(
            shop.gmailRefreshToken,
            customerEmail,
            email.subject,
            fullResponse,
            email.threadId
          )

          // Create outbound message
          await db.message.create({
            data: {
              conversationId: conversation.id,
              direction: "OUTBOUND",
              sender: shop.shopName,
              content: aiResponse.response,
              aiGenerated: true,
            },
          })

          // Update conversation
          await db.conversation.update({
            where: { id: conversation.id },
            data: {
              status: "AUTO_REPLIED",
              type: aiResponse.classification as any,
            },
          })

          autoReplied++
        }
      }

      processed++
    } catch (error) {
      console.error("Error processing email:", error)
    }
  }

  // Update usage log
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  await db.usageLog.upsert({
    where: {
      shopId_month: {
        shopId: shop.id,
        month: monthStart,
      },
    },
    update: {
      emailsReceived: { increment: processed },
      emailsAutoReplied: { increment: autoReplied },
      emailsEscalated: { increment: escalated },
    },
    create: {
      shopId: shop.id,
      month: monthStart,
      emailsReceived: processed,
      emailsAutoReplied: autoReplied,
      emailsEscalated: escalated,
    },
  })

  return {
    success: true,
    totalEmails: emails.length,
    processed,
    autoReplied,
    escalated,
    skipped
  }
}
