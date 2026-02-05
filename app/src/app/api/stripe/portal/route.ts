import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
})

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: "Aucun abonnement actif" },
        { status: 400 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe portal error:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'ouverture du portail de facturation" },
      { status: 500 }
    )
  }
}
