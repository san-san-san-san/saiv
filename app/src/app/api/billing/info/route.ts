import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const billingInfo = await db.billingInfo.findUnique({
      where: { userId: user.id },
    })

    return NextResponse.json({ billingInfo })
  } catch (error) {
    console.error("Error fetching billing info:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des informations" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const data = await req.json()
    const { companyName, address, city, postalCode, country, vatNumber } = data

    const billingInfo = await db.billingInfo.upsert({
      where: { userId: user.id },
      update: {
        companyName,
        address,
        city,
        postalCode,
        country,
        vatNumber,
      },
      create: {
        userId: user.id,
        companyName,
        address,
        city,
        postalCode,
        country,
        vatNumber,
      },
    })

    return NextResponse.json({ billingInfo })
  } catch (error) {
    console.error("Error updating billing info:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des informations" },
      { status: 500 }
    )
  }
}
