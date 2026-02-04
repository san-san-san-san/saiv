# Saiv - Resume du Projet

**Date de creation:** 2026-02-03

## Statut: MVP COMPLET

Le projet Saiv est pret pour le developpement. Tous les documents de planification et le code de base sont en place.

---

## Documents de Planification (BMAD Method)

| Document | Chemin | Statut |
|----------|--------|--------|
| Product Brief | `_bmad-output/planning/product-brief-saiv.md` | Complet |
| PRD | `_bmad-output/planning/prd-saiv.md` | Complet |
| Architecture | `_bmad-output/planning/architecture-saiv.md` | Complet |
| Epics & Stories | `_bmad-output/planning/epics-stories-saiv.md` | Complet |

---

## Code du MVP

### Structure du projet

```
Saiv/
├── _bmad/                  # BMAD Method (workflows, agents)
├── _bmad-output/           # Documents generes
│   └── planning/           # Product Brief, PRD, Architecture, Stories
├── .claude/                # Commandes Claude Code
└── app/                    # Application Next.js
    ├── prisma/             # Schema de base de donnees
    ├── src/
    │   ├── app/            # Pages et API routes
    │   ├── components/     # Composants React
    │   ├── lib/            # Bibliotheques (auth, db, ai, gmail, shopify)
    │   └── types/          # Types TypeScript
    ├── package.json
    └── README.md
```

### Fichiers crees (35 fichiers TypeScript/TSX)

**Pages:**
- Landing page (`/`)
- Login (`/login`)
- Register (`/register`)
- Dashboard (`/dashboard`)
- Conversations list (`/conversations`)
- Conversation detail (`/conversations/[id]`)
- Settings (`/settings`)
- Stats (`/stats`)
- Billing (`/billing`)

**API Routes:**
- Auth (register, login, logout)
- Shopify (install, callback)
- Gmail (connect, callback)
- AI (process-email)
- Conversations (reply)

**Bibliotheques:**
- Auth (JWT, sessions, bcrypt)
- Database (Prisma client)
- AI (Claude API client, prompts)
- Gmail (OAuth, send/receive)
- Shopify (OAuth, orders, customers)

---

## Pour demarrer le developpement

### 1. Configurer les variables d'environnement

```bash
cd ~/Desktop/Saiv/app
# Editer .env.local avec vos credentials:
# - DATABASE_URL (PostgreSQL)
# - JWT_SECRET
# - SHOPIFY_API_KEY, SHOPIFY_API_SECRET
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# - ANTHROPIC_API_KEY
# - STRIPE_SECRET_KEY (optionnel pour MVP)
```

### 2. Configurer la base de donnees

```bash
# Creer la base de donnees sur Neon (https://neon.tech)
# Puis appliquer le schema:
npm run db:push
```

### 3. Configurer Shopify

1. Creer une app sur https://partners.shopify.com
2. Ajouter les scopes: `read_orders, read_customers, read_products`
3. Configurer l'URL de callback: `{APP_URL}/api/shopify/callback`

### 4. Configurer Gmail

1. Creer un projet sur https://console.cloud.google.com
2. Activer Gmail API
3. Creer des credentials OAuth 2.0
4. Configurer le redirect URI: `{APP_URL}/api/gmail/callback`

### 5. Lancer en developpement

```bash
npm run dev
# Ouvrir http://localhost:3000
```

---

## Prochaines etapes recommandees

1. **Tester le flow complet** : Inscription -> Connexion Shopify -> Connexion Gmail
2. **Ajouter un cron job** : Pour l'endpoint `/api/ai/process-email` (toutes les 30s)
3. **Tester les reponses IA** : Verifier la qualite avec de vrais emails
4. **Integrer Stripe** : Pour le billing (actuellement UI seulement)
5. **Deployer sur Vercel** : `vercel deploy`

---

## Resume Business

| Aspect | Detail |
|--------|--------|
| **Produit** | SaaS automatisation SAV Shopify |
| **Cible** | E-commercants Shopify (tous segments) |
| **Pricing** | Starter 29EUR, Growth 79EUR, Scale 199EUR/mois |
| **Tech** | Next.js + PostgreSQL + Claude API |
| **Differenciateur** | Integration Shopify native + IA contextuelle |

---

*Projet genere avec BMAD Method + Claude Code*
