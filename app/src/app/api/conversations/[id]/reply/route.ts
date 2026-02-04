import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/gmail"
import { z } from "zod"

const replySchema = z.object({
  content: z.string().min(1),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { content } = replySchema.parse(body)

    // Get conversation with shop
    const conversation = await db.conversation.findFirst({
      where: { id },
      include: {
        shop: true,
        customer: true,
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Verify ownership
    if (conversation.shop.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Send email
    if (conversation.shop.gmailRefreshToken && conversation.customer?.email) {
      const fullContent = content + (conversation.shop.signature ? `\n\n${conversation.shop.signature}` : "")

      await sendEmail(
        conversation.shop.gmailRefreshToken,
        conversation.customer.email,
        conversation.subject,
        fullContent,
        conversation.gmailThreadId || undefined
      )
    }

    // Create message
    const message = await db.message.create({
      data: {
        conversationId: id,
        direction: "OUTBOUND",
        sender: conversation.shop.shopName,
        content,
        aiGenerated: false,
      },
    })

    // Update conversation status
    await db.conversation.update({
      where: { id },
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
    })

    return NextResponse.json({ message })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    console.error("Reply error:", error)
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 })
  }
}
