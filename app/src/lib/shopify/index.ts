import crypto from 'crypto'

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY!
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || 'read_orders,read_customers,read_products'
const APP_URL = process.env.SHOPIFY_APP_URL || 'http://localhost:3000'

export function getInstallUrl(shop: string, state: string): string {
  const redirectUri = `${APP_URL}/api/shopify/callback`

  return `https://${shop}/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_API_KEY}&` +
    `scope=${SHOPIFY_SCOPES}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`
}

export function verifyHmac(query: Record<string, string>): boolean {
  const { hmac, ...rest } = query

  if (!hmac) return false

  const message = Object.keys(rest)
    .sort()
    .map(key => `${key}=${rest[key]}`)
    .join('&')

  const generatedHmac = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(message)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(generatedHmac)
  )
}

export async function getAccessToken(shop: string, code: string): Promise<string> {
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function shopifyFetch<T>(
  shop: string,
  accessToken: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`https://${shop}/admin/api/2024-01/${endpoint}`, {
    ...options,
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`)
  }

  return response.json()
}

export async function getShopInfo(shop: string, accessToken: string) {
  return shopifyFetch<{ shop: { name: string; email: string } }>(
    shop,
    accessToken,
    'shop.json'
  )
}

export async function getOrders(
  shop: string,
  accessToken: string,
  params: { since_id?: string; limit?: number; created_at_min?: string } = {}
) {
  const queryParams = new URLSearchParams()
  if (params.since_id) queryParams.set('since_id', params.since_id)
  if (params.limit) queryParams.set('limit', params.limit.toString())
  if (params.created_at_min) queryParams.set('created_at_min', params.created_at_min)

  const endpoint = `orders.json?${queryParams.toString()}&status=any`

  return shopifyFetch<{ orders: ShopifyOrder[] }>(shop, accessToken, endpoint)
}

export async function getCustomer(shop: string, accessToken: string, email: string) {
  const endpoint = `customers/search.json?query=email:${encodeURIComponent(email)}`
  return shopifyFetch<{ customers: ShopifyCustomer[] }>(shop, accessToken, endpoint)
}

export async function getOrder(shop: string, accessToken: string, orderId: string) {
  return shopifyFetch<{ order: ShopifyOrder }>(shop, accessToken, `orders/${orderId}.json`)
}

export interface ShopifyOrder {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
  financial_status: string
  fulfillment_status: string | null
  total_price: string
  customer: {
    id: number
    email: string
    first_name: string
    last_name: string
  }
  line_items: Array<{
    id: number
    title: string
    quantity: number
    price: string
  }>
  fulfillments: Array<{
    id: number
    status: string
    tracking_number: string | null
    tracking_url: string | null
  }>
}

export interface ShopifyCustomer {
  id: number
  email: string
  first_name: string
  last_name: string
  orders_count: number
  total_spent: string
}
