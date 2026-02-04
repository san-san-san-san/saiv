import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAuthUrl } from "@/lib/gmail"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const authUrl = getAuthUrl()
  return NextResponse.redirect(authUrl)
}
