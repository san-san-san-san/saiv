---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ["product-brief-saiv.md", "prd-saiv.md"]
date: 2026-02-03
author: User
status: complete
version: 1.0
---

# Architecture Technique: Saiv

## 1. Vue d'Ensemble

### 1.1 Architecture Pattern

**Monolithe Modulaire** - Choix optimal pour MVP solo-dev :
- Simplicite de deploiement
- Facilite de debug
- Evolution vers microservices possible
- Un seul repo, une seule DB

### 1.2 Diagramme Haut Niveau

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Browser    │  │   Shopify    │  │    Gmail     │               │
│  │  (Marchand)  │  │   Webhooks   │  │   Pub/Sub    │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EDGE / CDN                                   │
│                      (Vercel / Cloudflare)                          │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Next.js 14 (App Router)                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │   │
│  │  │   Pages     │  │    API      │  │  Server     │          │   │
│  │  │  (React)    │  │   Routes    │  │  Actions    │          │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Business Logic Layer                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │  Auth    │ │  Shop    │ │  Email   │ │   AI     │       │   │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │       │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  PostgreSQL  │  │    Redis     │  │     S3       │               │
│  │   (Neon)     │  │  (Upstash)   │  │ (Cloudflare) │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Shopify    │  │    Gmail     │  │    Claude    │               │
│  │     API      │  │     API      │  │     API      │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐                                 │
│  │    Stripe    │  │    Resend    │                                 │
│  │     API      │  │   (emails)   │                                 │
│  └──────────────┘  └──────────────┘                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Technique Detaillee

### 2.1 Frontend

| Technologie | Version | Justification |
|-------------|---------|---------------|
| Next.js | 14.x | App Router, RSC, excellent DX |
| React | 18.x | Composants, hooks |
| TypeScript | 5.x | Type safety, meilleur tooling |
| Tailwind CSS | 3.x | Utility-first, rapide |
| shadcn/ui | latest | Composants accessibles, customisables |
| React Query | 5.x | Data fetching, cache |
| Zustand | 4.x | State management leger |
| React Hook Form | 7.x | Formulaires performants |
| Zod | 3.x | Validation schemas |

### 2.2 Backend

| Technologie | Version | Justification |
|-------------|---------|---------------|
| Next.js API Routes | 14.x | Serverless, meme stack |
| Prisma | 5.x | ORM type-safe, migrations |
| PostgreSQL | 15.x | Robuste, JSONB, full-text |
| Redis (Upstash) | - | Cache, rate limiting, queues |
| BullMQ | 5.x | Job queues (email processing) |

### 2.3 Services Externes

| Service | Usage | Cout estime |
|---------|-------|-------------|
| Vercel | Hosting frontend + API | Free -> Pro ($20/mo) |
| Neon | PostgreSQL serverless | Free tier -> Pro |
| Upstash | Redis serverless | Free tier -> Pay per use |
| Claude API | Generation reponses | ~$0.003/1K tokens |
| Stripe | Paiements | 1.4% + 0.25€/transaction |
| Resend | Emails transactionnels | Free tier (3000/mo) |
| Cloudflare | CDN, R2 storage | Free tier |

### 2.4 Dev Tools

| Tool | Usage |
|------|-------|
| pnpm | Package manager (rapide) |
| ESLint | Linting |
| Prettier | Formatting |
| Husky | Git hooks |
| Vitest | Unit tests |
| Playwright | E2E tests |

---

## 3. Architecture Detaillee

### 3.1 Structure du Projet

```
saiv/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Routes auth (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Routes protegees
│   │   │   ├── dashboard/
│   │   │   ├── conversations/
│   │   │   ├── stats/
│   │   │   ├── settings/
│   │   │   └── billing/
│   │   ├── (marketing)/        # Landing page
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   ├── shopify/
│   │   │   ├── email/
│   │   │   ├── conversations/
│   │   │   ├── stats/
│   │   │   ├── settings/
│   │   │   ├── billing/
│   │   │   └── webhooks/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui base
│   │   ├── layout/             # Header, Sidebar, etc.
│   │   ├── conversations/      # Conversation components
│   │   ├── stats/              # Charts, cards
│   │   └── forms/              # Form components
│   │
│   ├── lib/                    # Core libraries
│   │   ├── db/                 # Prisma client, queries
│   │   ├── auth/               # Auth utilities
│   │   ├── shopify/            # Shopify API client
│   │   ├── gmail/              # Gmail API client
│   │   ├── ai/                 # Claude API client
│   │   ├── stripe/             # Stripe client
│   │   ├── email/              # Email processing logic
│   │   └── utils/              # Helpers
│   │
│   ├── services/               # Business logic
│   │   ├── auth.service.ts
│   │   ├── shop.service.ts
│   │   ├── conversation.service.ts
│   │   ├── ai.service.ts
│   │   └── billing.service.ts
│   │
│   ├── jobs/                   # Background jobs
│   │   ├── process-email.ts
│   │   ├── sync-shopify.ts
│   │   └── usage-tracker.ts
│   │
│   ├── hooks/                  # React hooks
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript types
│   └── config/                 # App configuration
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/
│
├── public/                     # Static assets
├── tests/                      # Test files
├── .env.local                  # Environment variables
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 3.2 Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Plan {
  FREE
  STARTER
  GROWTH
  SCALE
}

enum ConversationStatus {
  PENDING
  AUTO_REPLIED
  ESCALATED
  RESOLVED
}

enum ConversationType {
  TRACKING
  RETURN
  REFUND
  PRODUCT
  COMPLAINT
  OTHER
}

enum MessageDirection {
  INBOUND
  OUTBOUND
}

enum Tone {
  FORMAL
  CASUAL
  FRIENDLY
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  passwordHash      String?
  name              String?
  plan              Plan     @default(FREE)
  stripeCustomerId  String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  shops             Shop[]
}

model Shop {
  id                  String    @id @default(cuid())
  userId              String
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Shopify
  shopifyDomain       String    @unique
  shopifyAccessToken  String    // Encrypted
  shopName            String

  // Email
  emailAddress        String?
  gmailRefreshToken   String?   // Encrypted

  // Settings
  tone                Tone      @default(CASUAL)
  autoReplyEnabled    Boolean   @default(true)
  policies            Json      @default("{}")
  faq                 Json      @default("[]")
  signature           String?

  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  customers           Customer[]
  orders              Order[]
  conversations       Conversation[]
  usageLogs           UsageLog[]
}

model Customer {
  id                 String    @id @default(cuid())
  shopId             String
  shop               Shop      @relation(fields: [shopId], references: [id], onDelete: Cascade)

  email              String
  shopifyCustomerId  String?
  name               String?
  totalOrders        Int       @default(0)
  totalSpent         Decimal   @default(0)

  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  orders             Order[]
  conversations      Conversation[]

  @@unique([shopId, email])
}

model Order {
  id                 String    @id @default(cuid())
  shopId             String
  shop               Shop      @relation(fields: [shopId], references: [id], onDelete: Cascade)
  customerId         String?
  customer           Customer? @relation(fields: [customerId], references: [id])

  shopifyOrderId     String
  orderNumber        String
  status             String
  fulfillmentStatus  String?
  trackingNumber     String?
  trackingUrl        String?
  totalPrice         Decimal
  lineItems          Json      @default("[]")

  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  conversations      Conversation[]

  @@unique([shopId, shopifyOrderId])
}

model Conversation {
  id              String             @id @default(cuid())
  shopId          String
  shop            Shop               @relation(fields: [shopId], references: [id], onDelete: Cascade)
  customerId      String?
  customer        Customer?          @relation(fields: [customerId], references: [id])
  orderId         String?
  order           Order?             @relation(fields: [orderId], references: [id])

  subject         String
  status          ConversationStatus @default(PENDING)
  type            ConversationType   @default(OTHER)
  gmailThreadId   String?

  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  resolvedAt      DateTime?

  messages        Message[]

  @@index([shopId, status])
  @@index([shopId, createdAt])
}

model Message {
  id              String           @id @default(cuid())
  conversationId  String
  conversation    Conversation     @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  direction       MessageDirection
  sender          String
  content         String
  gmailMessageId  String?
  aiGenerated     Boolean          @default(false)

  createdAt       DateTime         @default(now())
}

model UsageLog {
  id                 String   @id @default(cuid())
  shopId             String
  shop               Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)

  month              DateTime @db.Date
  emailsReceived     Int      @default(0)
  emailsAutoReplied  Int      @default(0)
  emailsEscalated    Int      @default(0)
  aiTokensUsed       Int      @default(0)

  @@unique([shopId, month])
}
```

---

## 4. Flux de Donnees

### 4.1 Flux Onboarding

```
1. User s'inscrit (email/password)
   └─> Creer User en DB
   └─> Envoyer email verification

2. User connecte Shopify
   └─> Redirect OAuth Shopify
   └─> Callback avec access_token
   └─> Creer Shop en DB
   └─> Declencher sync initiale (job)

3. Sync Shopify (job background)
   └─> Fetch orders (90 derniers jours)
   └─> Fetch customers
   └─> Stocker en DB
   └─> Configurer webhooks

4. User connecte Gmail
   └─> Redirect OAuth Gmail
   └─> Callback avec refresh_token
   └─> Update Shop en DB
   └─> Configurer Gmail watch

5. User configure politiques
   └─> Formulaire settings
   └─> Update Shop.policies en DB
```

### 4.2 Flux Traitement Email

```
1. Nouveau email recu
   └─> Gmail Pub/Sub notification
   └─> API /webhooks/gmail
   └─> Ajouter job "process-email" a la queue

2. Job process-email
   └─> Fetch email content (Gmail API)
   └─> Identifier customer (par email)
   └─> Creer/Update Conversation
   └─> Creer Message (inbound)

3. Analyse & Classification
   └─> Detecter type demande (tracking, retour, etc.)
   └─> Recuperer contexte (commandes, historique)
   └─> Verifier regles escalade

4a. Si auto-reply possible
   └─> Generer reponse (Claude API)
   └─> Envoyer email (Gmail API)
   └─> Creer Message (outbound, ai_generated=true)
   └─> Update Conversation status=AUTO_REPLIED

4b. Si escalade necessaire
   └─> Update Conversation status=ESCALATED
   └─> Notifier marchand (email + push)
   └─> Marchand repond manuellement
```

### 4.3 Flux Generation Reponse IA

```
Input Context:
├── Customer info (nom, historique)
├── Order info (numero, statut, tracking)
├── Previous messages (thread)
├── Shop policies (retours, remboursements)
├── Shop tone (formal/casual/friendly)
└── Shop FAQ

Prompt Template:
"""
Tu es l'assistant SAV de {shop_name}.
Ton role est de repondre aux clients de maniere {tone}.

CONTEXTE CLIENT:
- Nom: {customer_name}
- Email: {customer_email}
- Commandes totales: {total_orders}

COMMANDE CONCERNEE:
- Numero: {order_number}
- Statut: {order_status}
- Suivi: {tracking_info}
- Articles: {line_items}

POLITIQUES BOUTIQUE:
{policies}

HISTORIQUE CONVERSATION:
{messages}

NOUVEAU MESSAGE CLIENT:
{new_message}

Reponds de maniere {tone}, utile et empathique.
Si tu ne peux pas resoudre, indique que tu transferes a un humain.
"""

Output:
└─> Reponse formatee (salutation + corps + signature)
```

---

## 5. Securite

### 5.1 Authentication

- **Session-based** avec cookies HTTP-only
- **JWT** pour API calls (optionnel)
- Middleware Next.js pour protection routes
- CSRF protection

### 5.2 Encryption

```typescript
// lib/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 5.3 Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

---

## 6. Deploiement

### 6.1 Environnements

| Env | URL | Usage |
|-----|-----|-------|
| Development | localhost:3000 | Dev local |
| Preview | *.vercel.app | PR previews |
| Production | saiv.app | Production |

### 6.2 Variables d'Environnement

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://saiv.app

# Shopify
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...

# Gmail
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Claude
ANTHROPIC_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_SCALE=price_...

# Redis
UPSTASH_REDIS_URL=...
UPSTASH_REDIS_TOKEN=...

# Encryption
ENCRYPTION_KEY=... # 32 bytes hex

# Email
RESEND_API_KEY=...
```

### 6.3 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 7. Monitoring & Observabilite

### 7.1 Logging

- **Vercel Logs** : Logs API built-in
- **Structured logging** : JSON format pour parsing

### 7.2 Metriques

- **Vercel Analytics** : Web vitals, usage
- **Custom metrics** : Redis counters pour KPIs

### 7.3 Alerting

- **Vercel** : Alerts sur erreurs, latence
- **Uptime Robot** : Monitoring endpoint health
- **PagerDuty** (future) : On-call rotation

---

## 8. Decisions Architecturales (ADR)

### ADR-001: Monolithe vs Microservices

**Decision:** Monolithe modulaire

**Contexte:** Solo dev, MVP, time-to-market prioritaire

**Consequences:**
- (+) Deploiement simple
- (+) Debug facile
- (+) Pas d'overhead communication inter-services
- (-) Scaling vertical limite
- (-) Refactoring necessaire si scale

### ADR-002: Next.js Full-Stack

**Decision:** Next.js pour frontend ET backend

**Contexte:** Un seul framework, serverless-ready

**Consequences:**
- (+) DX excellent, un seul projet
- (+) Serverless auto-scaling
- (+) RSC pour performance
- (-) Lock-in Vercel (mitigeable)

### ADR-003: PostgreSQL vs MongoDB

**Decision:** PostgreSQL (Neon)

**Contexte:** Donnees relationnelles, ACID, JSONB pour flexibilite

**Consequences:**
- (+) Relations fortes (User->Shop->Orders)
- (+) JSONB pour policies/FAQ
- (+) Prisma excellent support
- (-) Schema migrations a gerer

### ADR-004: Claude vs GPT-4

**Decision:** Claude API (claude-sonnet-4-20250514)

**Contexte:** Qualite francais, cout, politique usage

**Consequences:**
- (+) Excellent en francais
- (+) Moins d'hallucinations
- (+) Meilleur suivi instructions
- (-) Moins de market share (docs, community)

---

*Architecture Saiv v1.0 - Genere avec BMAD Method*
