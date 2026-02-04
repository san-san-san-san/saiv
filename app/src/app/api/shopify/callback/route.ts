import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { verifyHmac, getAccessToken, getShopInfo } from "@/lib/shopify"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const searchParams = request.nextUrl.searchParams
  const shop = searchParams.get("shop")
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  // Verify state
  const savedState = request.cookies.get("shopify_state")?.value
  if (!state || state !== savedState) {
    return NextResponse.redirect(
      new URL("/dashboard?error=invalid_state", request.url)
    )
  }

  // Verify HMAC
  const query: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    query[key] = value
  })

  if (!verifyHmac(query)) {
    return NextResponse.redirect(
      new URL("/dashboard?error=invalid_hmac", request.url)
    )
  }

  if (!shop || !code) {
    return NextResponse.redirect(
      new URL("/dashboard?error=missing_params", request.url)
    )
  }

  try {
    // Exchange code for access token
    const accessToken = await getAccessToken(shop, code)

    // Get shop info
    const shopInfo = await getShopInfo(shop, accessToken)

    // Check if shop already exists
    const existingShop = await db.shop.findUnique({
      where: { shopifyDomain: shop },
    })

    if (existingShop) {
      // Update existing shop
      await db.shop.update({
        where: { id: existingShop.id },
        data: {
          shopifyAccessToken: accessToken,
          shopName: shopInfo.shop.name,
        },
      })
    } else {
      // Create new shop
      await db.shop.create({
        data: {
          userId: session.userId,
          shopifyDomain: shop,
          shopifyAccessToken: accessToken,
          shopName: shopInfo.shop.name,
        },
      })
    }

    // Clear state cookie
    const response = NextResponse.redirect(
      new URL("/dashboard?success=shopify_connected", request.url)
    )
    response.cookies.delete("shopify_state")

    return response
  } catch (error) {
    console.error("Shopify callback error:", error)
    return NextResponse.redirect(
      new URL("/dashboard?error=shopify_error", request.url)
    )
  }
}
