import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getNewEmails, sendEmail } from "@/lib/gmail"
import { generateResponse, classifyEmail } from "@/lib/ai"
import { getOrders, getCustomer } from "@/lib/shopify"

// This endpoint should be called by a cron job or webhook
export async function POST(request: NextRequest) {
  // Verify cron secret (in production)
  const authHeader = request.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get all shops with Gmail connected
    const shops = await db.shop.findMany({
      where: {
        gmailRefreshToken: { not: null },
        autoReplyEnabled: true,
      },
      include: { user: true },
    })

    const results = []

    for (const shop of shops) {
      try {
        const result = await processShopEmails(shop)
        results.push({ shopId: shop.id, ...result })
      } catch (error) {
        console.error(`Error processing shop ${shop.id}:`, error)
        results.push({ shopId: shop.id, error: String(error) })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Process email error:", error)
    return NextResponse.json(
      { error: "Failed to process emails" },
      { status: 500 }
    )
  }
}

async function processShopEmails(shop: any) {
  if (!shop.gmailRefreshToken) {
    return { processed: 0, skipped: "No Gmail token" }
  }

  // Get new emails
  const emails = await getNewEmails(shop.gmailRefreshToken)

  let processed = 0
  let autoReplied = 0
  let escalated = 0

  for (const email of emails) {
    try {
      // Skip if already processed
      const existing = await db.conversation.findFirst({
        where: {
          shopId: shop.id,
          gmailThreadId: email.threadId,
        },
      })

      if (existing) continue

      // Classify email
      const classification = await classifyEmail(email.subject, email.body)

      // Skip non-support emails
      if (!classification.isSupport) continue

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

          if (shopifyCustomer.customers[0]) {
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

        // TODO: Send notification to merchant

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

  return { processed, autoReplied, escalated }
}
