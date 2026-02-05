import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const invoices = await db.invoice.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des factures" },
      { status: 500 }
    )
  }
}
