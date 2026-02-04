import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

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
      console.error('Invalid HMAC signature for customers/data_request webhook')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = JSON.parse(body)
    console.log('Received customers/data_request webhook:', data)

    // Handle customer data request
    // In a real implementation, you would:
    // 1. Look up the customer's data in your database
    // 2. Compile all data associated with this customer
    // 3. Send the data to the specified endpoint or email

    const { shop_domain, customer, orders_requested } = data

    console.log(`Data request from ${shop_domain} for customer ${customer?.email}`)
    console.log('Orders requested:', orders_requested)

    // Acknowledge the webhook
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing customers/data_request webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
