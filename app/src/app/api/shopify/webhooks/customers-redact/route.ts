import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'

const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || ''

function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  const hash = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(body, 'utf8')
    .digest('base64')
  return hash === hmacHeader
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256') || ''

    // Verify HMAC signature
    if (!verifyShopifyWebhook(body, hmacHeader)) {
      console.error('Invalid HMAC signature for customers/redact webhook')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = JSON.parse(body)
    console.log('Received customers/redact webhook:', data)

    const { shop_domain, customer } = data

    // Find the shop
    const shop = await db.shop.findUnique({
      where: { shopifyDomain: shop_domain }
    })

    if (shop && customer?.email) {
      // Delete customer data
      await db.customer.deleteMany({
        where: {
          shopId: shop.id,
          email: customer.email
        }
      })
      console.log(`Deleted customer data for ${customer.email} from ${shop_domain}`)
    }

    // Acknowledge the webhook
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing customers/redact webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
