import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { getTokensFromCode, getEmailAddress } from "@/lib/gmail"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const code = request.nextUrl.searchParams.get("code")
  const error = request.nextUrl.searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      new URL("/dashboard?error=gmail_denied", request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard?error=missing_code", request.url)
    )
  }

  try {
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code)

    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        new URL("/dashboard?error=no_refresh_token", request.url)
      )
    }

    // Get user's email address
    const emailAddress = await getEmailAddress(tokens.refresh_token)

    // Get user's shop
    const user = await db.user.findUnique({
      where: { id: session.userId },
      include: { shops: true },
    })

    if (!user?.shops[0]) {
      return NextResponse.redirect(
        new URL("/dashboard?error=no_shop", request.url)
      )
    }

    // Update shop with Gmail credentials
    await db.shop.update({
      where: { id: user.shops[0].id },
      data: {
        gmailRefreshToken: tokens.refresh_token,
        emailAddress: emailAddress,
      },
    })

    return NextResponse.redirect(
      new URL("/dashboard?success=gmail_connected", request.url)
    )
  } catch (error) {
    console.error("Gmail callback error:", error)
    return NextResponse.redirect(
      new URL("/dashboard?error=gmail_error", request.url)
    )
  }
}
