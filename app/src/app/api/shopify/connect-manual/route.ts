import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { shopDomain, accessToken, shopName } = await req.json()

    // Validate inputs
    if (!shopDomain || !accessToken) {
      return NextResponse.json(
        { error: "Le domaine et le token sont requis" },
        { status: 400 }
      )
    }

    // Clean up shop domain (remove https://, trailing slashes, etc.)
    let cleanDomain = shopDomain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .toLowerCase()

    // Add .myshopify.com if not present
    if (!cleanDomain.includes(".myshopify.com")) {
      cleanDomain = `${cleanDomain}.myshopify.com`
    }

    // Verify the token works by making a test API call
    try {
      const testResponse = await fetch(
        `https://${cleanDomain}/admin/api/2024-01/shop.json`,
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      )

      if (!testResponse.ok) {
        const errorText = await testResponse.text()
        console.error("Shopify API test failed:", errorText)
        return NextResponse.json(
          { error: "Token invalide ou permissions insuffisantes. Vérifiez votre token et les scopes." },
          { status: 400 }
        )
      }

      const shopData = await testResponse.json()
      const fetchedShopName = shopData.shop?.name || shopName || cleanDomain

      // Check if shop already exists for this user
      const existingShop = await db.shop.findFirst({
        where: {
          userId: user.id,
          shopifyDomain: cleanDomain,
        },
      })

      if (existingShop) {
        // Update existing shop
        await db.shop.update({
          where: { id: existingShop.id },
          data: {
            shopifyAccessToken: accessToken,
            shopName: fetchedShopName,
          },
        })

        return NextResponse.json({
          success: true,
          message: "Boutique mise à jour",
          shop: { domain: cleanDomain, name: fetchedShopName },
        })
      }

      // Create new shop
      const shop = await db.shop.create({
        data: {
          userId: user.id,
          shopifyDomain: cleanDomain,
          shopifyAccessToken: accessToken,
          shopName: fetchedShopName,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Boutique connectée avec succès",
        shop: { domain: cleanDomain, name: fetchedShopName },
      })
    } catch (fetchError) {
      console.error("Error verifying Shopify token:", fetchError)
      return NextResponse.json(
        { error: "Impossible de se connecter à Shopify. Vérifiez le domaine et le token." },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error in manual Shopify connection:", error)
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    )
  }
}
