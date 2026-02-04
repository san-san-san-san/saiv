import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getInstallUrl } from "@/lib/shopify"
import crypto from "crypto"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const shop = request.nextUrl.searchParams.get("shop")

  if (!shop) {
    // Show form to enter shop domain
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Connecter Shopify - Saiv</title>
          <style>
            body { font-family: system-ui; max-width: 400px; margin: 100px auto; padding: 20px; }
            input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }
            button { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; }
            button:hover { background: #1d4ed8; }
          </style>
        </head>
        <body>
          <h2>Connecter votre boutique Shopify</h2>
          <form method="GET">
            <input type="text" name="shop" placeholder="votre-boutique.myshopify.com" required />
            <button type="submit">Connecter</button>
          </form>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      }
    )
  }

  // Validate shop domain
  const shopDomain = shop.includes(".myshopify.com")
    ? shop
    : `${shop}.myshopify.com`

  // Generate state for CSRF protection
  const state = crypto.randomBytes(16).toString("hex")

  // Store state in cookie for verification
  const response = NextResponse.redirect(getInstallUrl(shopDomain, state))
  response.cookies.set("shopify_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600, // 10 minutes
  })

  return response
}
