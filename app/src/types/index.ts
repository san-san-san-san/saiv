import { User, Shop, Customer, Order, Conversation, Message } from "@prisma/client"

export type UserWithShops = User & {
  shops: Shop[]
}

export type ConversationWithRelations = Conversation & {
  customer: Customer | null
  order: Order | null
  messages: Message[]
  shop: Shop
}

export type ShopWithRelations = Shop & {
  user: User
  customers: Customer[]
  orders: Order[]
  conversations: Conversation[]
}

export interface DashboardStats {
  emailsToday: number
  autoResolved: number
  escalated: number
  autoResolveRate: number
  avgResponseTime: number
}

export interface AIResponse {
  response: string
  shouldEscalate: boolean
  confidence: number
  classification: string
}

export interface EmailClassification {
  isSupport: boolean
  type: string
}

export interface GmailEmail {
  id: string
  threadId: string
  from: string
  to: string
  subject: string
  date: string
  body: string
  snippet: string
}
