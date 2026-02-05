import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
})

const PRICE_IDS: Record<string, string> = {
  STARTER: process.env.STRIPE_PRICE_STARTER!,
  GROWTH: process.env.STRIPE_PRICE_GROWTH!,
  SCALE: process.env.STRIPE_PRICE_SCALE!,
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { plan } = await req.json()

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 })
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID - we'll do this via webhook for now
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        userId: user.id,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          plan: plan,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    )
  }
}
