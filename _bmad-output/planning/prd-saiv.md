---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
inputDocuments: ["product-brief-saiv.md"]
date: 2026-02-03
author: User
status: complete
version: 1.0
---

# PRD: Saiv - Automatisation SAV Shopify

## 1. Executive Summary

**Saiv** est un SaaS B2B qui automatise le Service Apres-Vente des boutiques Shopify via intelligence artificielle (Claude API). Le produit permet aux e-commercants de deleguer entierement la gestion des emails clients tout en maintenant une qualite de reponse humaine.

**Objectif MVP** : Permettre a un marchand Shopify de connecter sa boutique et son email, puis laisser l'IA repondre automatiquement aux demandes SAV avec le contexte complet des commandes.

---

## 2. Personas Detailles

### 2.1 Persona Principal : Marc, le Marchand Solo

**Demographics:**
- Age : 28-45 ans
- Localisation : France
- Business : Boutique Shopify mode/accessoires
- CA : 10 000 - 100 000 EUR/mois
- Commandes : 200-2000/mois

**Contexte quotidien:**
- Se leve, check emails : 15-30 demandes SAV
- Questions recurrentes : "Ou est ma commande ?", "Comment retourner ?", "Remboursement ?"
- Passe 1-3h/jour a repondre
- Frustre car empeche de developper son business

**Jobs to be Done:**
1. Repondre rapidement aux clients pour maintenir bonne reputation
2. Reduire le temps passe sur les taches repetitives
3. Offrir un support 24/7 sans embaucher
4. Garder le controle sur les reponses envoyees

**Criteres de decision d'achat:**
- Prix < cout d'un employe (< 200 EUR/mois)
- Mise en place rapide (< 30 min)
- Qualite des reponses (pas de reponses robot)
- Securite des donnees clients

### 2.2 Persona Secondaire : Sophie, la Responsable E-commerce

**Demographics:**
- Age : 30-40 ans
- Role : Responsable e-commerce en PME
- Gere : 3-5 boutiques Shopify
- Equipe : 2-5 personnes

**Besoins specifiques:**
- Vision multi-boutiques
- Delegation a l'equipe
- Reporting pour direction

---

## 3. User Stories Detaillees

### 3.1 Onboarding & Setup

```
US-001: Inscription
En tant que marchand Shopify
Je veux creer un compte Saiv avec mon email
Afin de commencer a utiliser le service

Criteres d'acceptation:
- Inscription email/password ou Google OAuth
- Verification email
- Redirection vers onboarding guide
```

```
US-002: Connexion Shopify
En tant que marchand inscrit
Je veux connecter ma boutique Shopify en 1 clic
Afin que Saiv accede a mes commandes et clients

Criteres d'acceptation:
- Bouton "Connecter Shopify"
- OAuth Shopify standard
- Permissions demandees : read_orders, read_customers, read_products
- Sync initiale des 90 derniers jours
- Indicateur de progression sync
```

```
US-003: Connexion Email
En tant que marchand connecte a Shopify
Je veux connecter mon email SAV (Gmail)
Afin que Saiv puisse recevoir et envoyer des emails

Criteres d'acceptation:
- Connexion Gmail OAuth
- Permissions : lecture + envoi
- Option SMTP/IMAP pour autres providers (v2)
- Test d'envoi de verification
```

```
US-004: Configuration Boutique
En tant que marchand connecte
Je veux configurer mes politiques et ton de communication
Afin que l'IA reponde selon mes regles

Criteres d'acceptation:
- Formulaire politique retours (delai, conditions)
- Formulaire politique remboursement
- Choix du ton (formel/decontracte/amical)
- FAQ personnalisee (questions/reponses)
- Nom de la boutique et signature email
```

### 3.2 Core Loop - Traitement Emails

```
US-010: Reception Email
En tant que systeme Saiv
Je veux detecter les nouveaux emails entrants
Afin de les traiter automatiquement

Criteres d'acceptation:
- Polling Gmail toutes les 30 secondes
- Detection emails SAV vs spam/newsletter
- Extraction expediteur, sujet, corps
- Stockage en base
```

```
US-011: Analyse Contexte
En tant que systeme Saiv
Je veux analyser le contexte client/commande
Afin de fournir une reponse pertinente

Criteres d'acceptation:
- Identification client par email
- Recuperation commandes recentes
- Recuperation historique conversations
- Detection du type de demande (tracking, retour, question produit, reclamation)
```

```
US-012: Generation Reponse IA
En tant que systeme Saiv
Je veux generer une reponse via Claude API
Afin de repondre au client automatiquement

Criteres d'acceptation:
- Prompt incluant : contexte client, commande, politique boutique, ton
- Reponse en < 10 secondes
- Reponse dans la langue du client
- Formatage email propre (salutation, corps, signature)
```

```
US-013: Envoi Reponse
En tant que systeme Saiv
Je veux envoyer la reponse generee au client
Afin de resoudre sa demande

Criteres d'acceptation:
- Envoi via Gmail API
- Reply au thread original
- Copie stockee en base
- Marquage conversation comme "traitee"
```

```
US-014: Escalade Intelligente
En tant que systeme Saiv
Je veux detecter les cas necessitant intervention humaine
Afin de ne pas envoyer de reponse inappropriee

Criteres d'acceptation:
- Detection : reclamation grave, menace juridique, demande hors scope
- Notification marchand (email + dashboard)
- Conversation marquee "en attente"
- Marchand peut repondre manuellement ou valider suggestion IA
```

### 3.3 Dashboard Marchand

```
US-020: Vue Conversations
En tant que marchand connecte
Je veux voir toutes les conversations SAV
Afin de suivre l'activite de mon support

Criteres d'acceptation:
- Liste conversations avec : client, sujet, statut, date
- Filtres : toutes, traitees auto, escaladees, en attente
- Recherche par client ou sujet
- Pagination
```

```
US-021: Detail Conversation
En tant que marchand
Je veux voir le detail d'une conversation
Afin de comprendre l'echange et intervenir si besoin

Criteres d'acceptation:
- Thread complet (emails client + reponses Saiv)
- Contexte client affiche (commandes, historique)
- Bouton "Repondre manuellement"
- Bouton "Marquer comme resolu"
```

```
US-022: Statistiques
En tant que marchand
Je veux voir les statistiques de mon SAV
Afin de mesurer l'efficacite de Saiv

Criteres d'acceptation:
- Emails recus / jour, semaine, mois
- Taux de resolution automatique
- Temps de reponse moyen
- Repartition par type de demande
- Evolution dans le temps (graphique)
```

### 3.4 Gestion Compte

```
US-030: Gestion Abonnement
En tant que marchand
Je veux gerer mon abonnement
Afin de choisir le plan adapte a mon volume

Criteres d'acceptation:
- Vue plan actuel et consommation
- Upgrade/downgrade en 1 clic
- Historique factures
- Moyen de paiement (Stripe)
```

```
US-031: Parametres
En tant que marchand
Je veux modifier mes parametres
Afin d'ajuster le comportement de Saiv

Criteres d'acceptation:
- Modifier politiques boutique
- Modifier ton communication
- Activer/desactiver reponse auto
- Configurer notifications
```

---

## 4. Regles Metier

### 4.1 Classification des Demandes

| Type | Description | Action |
|------|-------------|--------|
| TRACKING | "Ou est ma commande ?" | Reponse auto avec statut tracking |
| RETOUR | Demande de retour/echange | Reponse auto avec procedure |
| REMBOURSEMENT | Demande de remboursement | Reponse auto ou escalade selon montant |
| PRODUIT | Question sur un produit | Reponse auto si info dispo |
| RECLAMATION | Plainte, insatisfaction | Escalade systematique |
| AUTRE | Non classifiable | Escalade |

### 4.2 Regles d'Escalade

L'IA escalade automatiquement si :
- Sentiment tres negatif detecte
- Mention "avocat", "juridique", "DGCCRF"
- Montant commande > 500 EUR et demande remboursement
- 3eme email du meme client sur meme sujet
- Demande explicite de parler a un humain
- Confiance IA < 70%

### 4.3 Limites et Quotas

| Plan | Emails/mois | Boutiques | Historique |
|------|-------------|-----------|------------|
| Starter | 500 | 1 | 30 jours |
| Growth | 2 000 | 2 | 90 jours |
| Scale | 10 000 | 5 | 1 an |

---

## 5. Specifications Techniques

### 5.1 API Endpoints

#### Auth
```
POST /api/auth/register - Inscription
POST /api/auth/login - Connexion
POST /api/auth/logout - Deconnexion
GET  /api/auth/me - User courant
```

#### Shopify
```
GET  /api/shopify/install - Debut OAuth
GET  /api/shopify/callback - Fin OAuth
POST /api/shopify/webhook - Reception webhooks
GET  /api/shopify/orders - Liste commandes
GET  /api/shopify/orders/:id - Detail commande
GET  /api/shopify/customers/:email - Info client
```

#### Email
```
GET  /api/email/connect - OAuth Gmail
GET  /api/email/callback - Fin OAuth Gmail
GET  /api/conversations - Liste conversations
GET  /api/conversations/:id - Detail conversation
POST /api/conversations/:id/reply - Reponse manuelle
POST /api/conversations/:id/resolve - Marquer resolu
```

#### Settings
```
GET  /api/settings - Parametres boutique
PUT  /api/settings - Modifier parametres
GET  /api/settings/policies - Politiques
PUT  /api/settings/policies - Modifier politiques
```

#### Stats
```
GET  /api/stats/overview - Stats globales
GET  /api/stats/daily - Stats par jour
GET  /api/stats/types - Repartition types
```

#### Billing
```
GET  /api/billing/subscription - Abonnement actuel
POST /api/billing/subscribe - Souscrire plan
POST /api/billing/portal - Acces Stripe Portal
```

### 5.2 Modele de Donnees

```
User
- id: UUID
- email: string (unique)
- password_hash: string
- name: string
- created_at: timestamp
- plan: enum (free, starter, growth, scale)
- stripe_customer_id: string

Shop
- id: UUID
- user_id: UUID (FK)
- shopify_domain: string
- shopify_access_token: string (encrypted)
- name: string
- email_address: string
- gmail_refresh_token: string (encrypted)
- policies: jsonb
- tone: enum (formal, casual, friendly)
- auto_reply_enabled: boolean
- created_at: timestamp

Customer
- id: UUID
- shop_id: UUID (FK)
- email: string
- shopify_customer_id: string
- name: string
- total_orders: int
- total_spent: decimal
- created_at: timestamp

Order
- id: UUID
- shop_id: UUID (FK)
- customer_id: UUID (FK)
- shopify_order_id: string
- order_number: string
- status: string
- fulfillment_status: string
- tracking_number: string
- tracking_url: string
- total_price: decimal
- created_at: timestamp

Conversation
- id: UUID
- shop_id: UUID (FK)
- customer_id: UUID (FK)
- order_id: UUID (FK, nullable)
- subject: string
- status: enum (pending, auto_replied, escalated, resolved)
- type: enum (tracking, return, refund, product, complaint, other)
- gmail_thread_id: string
- created_at: timestamp
- resolved_at: timestamp

Message
- id: UUID
- conversation_id: UUID (FK)
- direction: enum (inbound, outbound)
- sender: string
- content: text
- gmail_message_id: string
- ai_generated: boolean
- created_at: timestamp

UsageLog
- id: UUID
- shop_id: UUID (FK)
- month: date
- emails_received: int
- emails_auto_replied: int
- emails_escalated: int
- ai_tokens_used: int
```

### 5.3 Integrations

#### Shopify App
- **Scopes** : read_orders, read_customers, read_products, read_fulfillments
- **Webhooks** : orders/create, orders/updated, fulfillments/create

#### Gmail API
- **Scopes** : gmail.readonly, gmail.send, gmail.modify
- **Watch** : Push notifications via Pub/Sub

#### Claude API
- **Model** : claude-sonnet-4-20250514 (balance cout/qualite)
- **Max tokens** : 1024 par reponse
- **Temperature** : 0.3 (coherence)

#### Stripe
- **Products** : 3 plans (starter, growth, scale)
- **Billing** : Mensuel, carte bancaire
- **Webhooks** : checkout.session.completed, subscription.updated, subscription.deleted

---

## 6. UI/UX Specifications

### 6.1 Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | / | Page marketing |
| Login | /login | Connexion |
| Register | /register | Inscription |
| Onboarding | /onboarding | Setup guide |
| Dashboard | /dashboard | Vue principale |
| Conversations | /conversations | Liste emails |
| Conversation | /conversations/:id | Detail thread |
| Stats | /stats | Statistiques |
| Settings | /settings | Parametres |
| Billing | /billing | Abonnement |

### 6.2 Composants Cles

**ConversationList**
- Avatar client
- Sujet (tronque)
- Badge statut (couleur)
- Date relative
- Preview derniere reponse

**ConversationDetail**
- Header : client, commande liee
- Thread messages (bulles)
- Sidebar : contexte client
- Actions : repondre, resoudre, escalader

**StatsCards**
- Emails today
- Auto-resolution rate
- Avg response time
- Pending escalations

### 6.3 Design System

- **Couleurs** : Bleu primaire (#2563EB), Vert succes (#10B981), Orange warning (#F59E0B), Rouge erreur (#EF4444)
- **Typo** : Inter (sans-serif)
- **Spacing** : Base 4px (4, 8, 12, 16, 24, 32, 48)
- **Radius** : 8px (cards), 4px (buttons)
- **Shadows** : Subtle (sm) pour cards

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load : < 2s
- API response : < 500ms (p95)
- AI response generation : < 15s
- Email sending : < 5s

### 7.2 Securite
- HTTPS obligatoire
- Tokens Shopify/Gmail chiffres (AES-256)
- Rate limiting API (100 req/min)
- CORS configure
- Validation inputs (Zod)
- SQL injection prevention (ORM)

### 7.3 Scalabilite
- Stateless API (horizontal scaling)
- Queue pour jobs async (email processing)
- Connection pooling DB
- CDN pour assets

### 7.4 Compliance
- RGPD : consentement, droit suppression, export data
- Donnees EU : serveurs en Europe
- Retention : selon plan (30j-1an)
- DPA disponible pour entreprises

---

## 8. Out of Scope (MVP)

- Chat widget
- Reseaux sociaux
- Multi-langues auto-detect
- Actions automatiques (remboursement direct)
- App mobile
- API publique
- White-label
- SSO enterprise

---

## 9. Success Metrics

### Launch Criteria (MVP)
- [ ] Onboarding complete en < 10 min
- [ ] Premier email traite en < 5 min apres setup
- [ ] Taux resolution auto > 50% sur beta testers
- [ ] Zero fuite de donnees
- [ ] Uptime > 99% sur 1 semaine

### Post-Launch KPIs (M1)
- 20 utilisateurs beta
- Taux resolution auto > 60%
- NPS > 30
- Churn < 10%

---

*PRD Saiv v1.0 - Genere avec BMAD Method*
