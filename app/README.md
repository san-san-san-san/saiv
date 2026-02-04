# Saiv - Automatisation SAV Shopify

Saiv est un SaaS qui automatise le Service Apres-Vente des boutiques Shopify via IA (Claude API).

## Fonctionnalites

- **Connexion Shopify** : Acces aux commandes, clients et produits
- **Connexion Gmail** : Reception et envoi d'emails automatiques
- **IA Claude** : Reponses personnalisees avec contexte complet
- **Dashboard** : Suivi des conversations et statistiques
- **Escalade intelligente** : Detection des cas necessitant intervention humaine

## Stack Technique

- **Frontend** : Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend** : Next.js API Routes, Prisma
- **Database** : PostgreSQL (Neon)
- **IA** : Claude API (Anthropic)
- **Integrations** : Shopify API, Gmail API, Stripe

## Installation

```bash
# Cloner le repo
cd app

# Installer les dependances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Editer .env.local avec vos credentials

# Generer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:push

# Lancer en dev
npm run dev
```

## Variables d'Environnement

Voir `.env.example` pour la liste complete.

## Structure du Projet

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Pages authentification
│   ├── (dashboard)/        # Pages protegees
│   └── api/                # API Routes
├── components/             # Composants React
├── lib/                    # Bibliotheques (db, auth, ai, etc.)
├── services/               # Logique metier
└── types/                  # Types TypeScript
```

## Deploiement

Le projet est configure pour Vercel :

```bash
vercel deploy
```

## Licence

MIT
