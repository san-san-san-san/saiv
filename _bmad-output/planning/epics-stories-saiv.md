---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ["product-brief-saiv.md", "prd-saiv.md", "architecture-saiv.md"]
date: 2026-02-03
author: User
status: complete
version: 1.0
---

# Epics & Stories: Saiv MVP

## Vue d'Ensemble Sprint

**Objectif MVP:** Application fonctionnelle permettant a un marchand Shopify de connecter sa boutique et Gmail, puis de laisser l'IA repondre automatiquement aux emails SAV.

**Duree estimee:** 4-6 semaines (solo dev + IA)

---

## Epic 1: Setup & Infrastructure

**Description:** Mise en place du projet, configuration, et infrastructure de base.

**Stories:**

### E1-S1: Initialisation Projet Next.js
**Points:** 2
**Priorite:** P0

```
En tant que developpeur
Je veux initialiser le projet Next.js avec la stack complete
Afin d'avoir une base de code fonctionnelle

Criteres d'acceptation:
- [ ] Next.js 14 avec App Router
- [ ] TypeScript configure
- [ ] Tailwind CSS + shadcn/ui installe
- [ ] ESLint + Prettier configures
- [ ] Structure dossiers selon architecture
- [ ] Git initialise avec .gitignore
```

### E1-S2: Configuration Base de Donnees
**Points:** 2
**Priorite:** P0

```
En tant que developpeur
Je veux configurer Prisma avec PostgreSQL (Neon)
Afin de persister les donnees

Criteres d'acceptation:
- [ ] Prisma installe et configure
- [ ] Schema initial cree (tous les models)
- [ ] Migration initiale executee
- [ ] Seed script pour donnees de test
- [ ] Connexion DB fonctionnelle en dev
```

### E1-S3: Configuration Variables Environnement
**Points:** 1
**Priorite:** P0

```
En tant que developpeur
Je veux configurer les variables d'environnement
Afin de gerer les secrets de maniere securisee

Criteres d'acceptation:
- [ ] .env.local avec toutes les variables
- [ ] .env.example documente
- [ ] Validation Zod des env vars
- [ ] Config TypeScript type-safe
```

### E1-S4: Setup Redis (Upstash)
**Points:** 1
**Priorite:** P1

```
En tant que developpeur
Je veux configurer Redis pour le cache et les queues
Afin de gerer les jobs asynchrones

Criteres d'acceptation:
- [ ] Upstash Redis configure
- [ ] Client Redis initialise
- [ ] Rate limiter configure
- [ ] Test connexion OK
```

---

## Epic 2: Authentication & Users

**Description:** Systeme d'authentification et gestion des utilisateurs.

### E2-S1: Inscription Utilisateur
**Points:** 3
**Priorite:** P0

```
En tant que visiteur
Je veux creer un compte avec email/password
Afin d'acceder a Saiv

Criteres d'acceptation:
- [ ] Page /register avec formulaire
- [ ] Validation email + password (min 8 chars)
- [ ] Hash password avec bcrypt
- [ ] Creation User en DB
- [ ] Redirect vers onboarding
- [ ] Gestion erreurs (email existe)
```

### E2-S2: Connexion Utilisateur
**Points:** 2
**Priorite:** P0

```
En tant que utilisateur inscrit
Je veux me connecter a mon compte
Afin d'acceder au dashboard

Criteres d'acceptation:
- [ ] Page /login avec formulaire
- [ ] Verification credentials
- [ ] Creation session (cookie HTTP-only)
- [ ] Redirect vers dashboard
- [ ] Message erreur si invalide
```

### E2-S3: Middleware Protection Routes
**Points:** 2
**Priorite:** P0

```
En tant que systeme
Je veux proteger les routes dashboard
Afin d'empecher acces non autorise

Criteres d'acceptation:
- [ ] Middleware Next.js
- [ ] Redirect /login si non authentifie
- [ ] Protection routes /dashboard/*
- [ ] Routes publiques accessibles
```

### E2-S4: Deconnexion
**Points:** 1
**Priorite:** P1

```
En tant que utilisateur connecte
Je veux me deconnecter
Afin de securiser mon compte

Criteres d'acceptation:
- [ ] Bouton logout dans header
- [ ] Suppression session
- [ ] Redirect vers /login
```

---

## Epic 3: Integration Shopify

**Description:** Connexion OAuth Shopify et synchronisation des donnees.

### E3-S1: OAuth Shopify - Installation
**Points:** 3
**Priorite:** P0

```
En tant que marchand
Je veux connecter ma boutique Shopify
Afin que Saiv accede a mes donnees

Criteres d'acceptation:
- [ ] Bouton "Connecter Shopify"
- [ ] Redirect vers OAuth Shopify
- [ ] Scopes: read_orders, read_customers, read_products
- [ ] Page d'autorisation Shopify
```

### E3-S2: OAuth Shopify - Callback
**Points:** 3
**Priorite:** P0

```
En tant que systeme
Je veux traiter le callback OAuth Shopify
Afin de stocker l'access token

Criteres d'acceptation:
- [ ] Endpoint /api/shopify/callback
- [ ] Verification HMAC
- [ ] Echange code contre access_token
- [ ] Creation Shop en DB (token chiffre)
- [ ] Redirect vers onboarding step 2
```

### E3-S3: Sync Commandes Shopify
**Points:** 3
**Priorite:** P0

```
En tant que systeme
Je veux synchroniser les commandes Shopify
Afin d'avoir le contexte pour l'IA

Criteres d'acceptation:
- [ ] Fetch orders (90 derniers jours)
- [ ] Fetch customers associes
- [ ] Stockage en DB (Order, Customer)
- [ ] Gestion pagination API
- [ ] Progress indicator pour user
```

### E3-S4: Webhooks Shopify
**Points:** 2
**Priorite:** P1

```
En tant que systeme
Je veux recevoir les webhooks Shopify
Afin de garder les donnees a jour

Criteres d'acceptation:
- [ ] Endpoint /api/webhooks/shopify
- [ ] Verification HMAC webhook
- [ ] Handler orders/create
- [ ] Handler orders/updated
- [ ] Handler fulfillments/create
```

---

## Epic 4: Integration Gmail

**Description:** Connexion Gmail et gestion des emails.

### E4-S1: OAuth Gmail
**Points:** 3
**Priorite:** P0

```
En tant que marchand
Je veux connecter mon email Gmail
Afin que Saiv lise et envoie des emails

Criteres d'acceptation:
- [ ] Bouton "Connecter Gmail"
- [ ] OAuth Google avec scopes gmail
- [ ] Stockage refresh_token (chiffre)
- [ ] Test envoi email verification
```

### E4-S2: Reception Emails (Polling)
**Points:** 3
**Priorite:** P0

```
En tant que systeme
Je veux detecter les nouveaux emails
Afin de les traiter automatiquement

Criteres d'acceptation:
- [ ] Job cron toutes les 30s
- [ ] Fetch nouveaux emails (Gmail API)
- [ ] Filtrage spam/newsletters
- [ ] Creation Conversation + Message
- [ ] Trigger job process-email
```

### E4-S3: Envoi Emails
**Points:** 2
**Priorite:** P0

```
En tant que systeme
Je veux envoyer des emails via Gmail
Afin de repondre aux clients

Criteres d'acceptation:
- [ ] Fonction sendEmail(to, subject, body)
- [ ] Reply dans le thread original
- [ ] Formatage HTML propre
- [ ] Gestion erreurs (quota, etc.)
```

---

## Epic 5: Moteur IA

**Description:** Integration Claude API et generation de reponses.

### E5-S1: Client Claude API
**Points:** 2
**Priorite:** P0

```
En tant que developpeur
Je veux un client Claude API configure
Afin de generer des reponses

Criteres d'acceptation:
- [ ] SDK Anthropic installe
- [ ] Client initialise avec API key
- [ ] Fonction generateResponse()
- [ ] Gestion rate limits
- [ ] Logging tokens utilises
```

### E5-S2: Prompt Engineering
**Points:** 3
**Priorite:** P0

```
En tant que systeme
Je veux un prompt optimise pour le SAV
Afin de generer des reponses pertinentes

Criteres d'acceptation:
- [ ] Template prompt avec variables
- [ ] Inclusion contexte client
- [ ] Inclusion contexte commande
- [ ] Inclusion politiques boutique
- [ ] Inclusion historique conversation
- [ ] Instructions ton de communication
```

### E5-S3: Classification Demandes
**Points:** 2
**Priorite:** P0

```
En tant que systeme
Je veux classifier le type de demande
Afin d'adapter le traitement

Criteres d'acceptation:
- [ ] Detection: tracking, retour, remboursement, produit, reclamation
- [ ] Prompt de classification
- [ ] Stockage type dans Conversation
- [ ] Metriques par type
```

### E5-S4: Detection Escalade
**Points:** 2
**Priorite:** P0

```
En tant que systeme
Je veux detecter les cas d'escalade
Afin de ne pas repondre automatiquement

Criteres d'acceptation:
- [ ] Detection sentiment negatif
- [ ] Detection mots cles (avocat, etc.)
- [ ] Detection montant eleve
- [ ] Detection 3eme message meme sujet
- [ ] Score de confiance IA
- [ ] Regles configurables
```

### E5-S5: Job Process Email
**Points:** 3
**Priorite:** P0

```
En tant que systeme
Je veux un job qui traite les emails entrants
Afin d'automatiser les reponses

Criteres d'acceptation:
- [ ] Queue BullMQ ou cron
- [ ] Fetch contexte (customer, orders)
- [ ] Classification demande
- [ ] Check regles escalade
- [ ] Si OK: generer + envoyer reponse
- [ ] Si escalade: notifier marchand
- [ ] Update status conversation
- [ ] Log usage (tokens)
```

---

## Epic 6: Dashboard Marchand

**Description:** Interface utilisateur pour le marchand.

### E6-S1: Layout Dashboard
**Points:** 2
**Priorite:** P0

```
En tant que marchand
Je veux un layout dashboard coherent
Afin de naviguer facilement

Criteres d'acceptation:
- [ ] Sidebar avec navigation
- [ ] Header avec user menu
- [ ] Responsive (mobile-friendly)
- [ ] Theme clair
```

### E6-S2: Page Dashboard Home
**Points:** 2
**Priorite:** P0

```
En tant que marchand
Je veux une page d'accueil dashboard
Afin de voir un resume de mon SAV

Criteres d'acceptation:
- [ ] Cards: emails today, taux auto, temps reponse
- [ ] Liste conversations recentes
- [ ] Alertes escalades en attente
- [ ] Quick actions
```

### E6-S3: Liste Conversations
**Points:** 3
**Priorite:** P0

```
En tant que marchand
Je veux voir la liste de mes conversations
Afin de suivre mon SAV

Criteres d'acceptation:
- [ ] Page /conversations
- [ ] Tableau avec: client, sujet, statut, date
- [ ] Filtres: tous, auto, escalades, resolus
- [ ] Recherche
- [ ] Pagination
- [ ] Badge couleur selon statut
```

### E6-S4: Detail Conversation
**Points:** 3
**Priorite:** P0

```
En tant que marchand
Je veux voir le detail d'une conversation
Afin de comprendre l'echange

Criteres d'acceptation:
- [ ] Page /conversations/[id]
- [ ] Thread messages (bulles)
- [ ] Sidebar contexte client
- [ ] Info commande liee
- [ ] Actions: repondre, resoudre
```

### E6-S5: Reponse Manuelle
**Points:** 2
**Priorite:** P1

```
En tant que marchand
Je veux repondre manuellement a une conversation
Afin de gerer les cas escalades

Criteres d'acceptation:
- [ ] Textarea de reponse
- [ ] Bouton envoyer
- [ ] Envoi email via Gmail
- [ ] Update conversation status
```

---

## Epic 7: Configuration & Settings

**Description:** Parametrage de la boutique et du compte.

### E7-S1: Page Settings Boutique
**Points:** 2
**Priorite:** P0

```
En tant que marchand
Je veux configurer ma boutique
Afin que l'IA reponde selon mes regles

Criteres d'acceptation:
- [ ] Page /settings
- [ ] Form: nom boutique, signature
- [ ] Choix ton (formal/casual/friendly)
- [ ] Toggle auto-reply on/off
```

### E7-S2: Configuration Politiques
**Points:** 2
**Priorite:** P0

```
En tant que marchand
Je veux definir mes politiques
Afin que l'IA les respecte

Criteres d'acceptation:
- [ ] Section politiques
- [ ] Champ: politique retours
- [ ] Champ: politique remboursement
- [ ] Champ: delais livraison
- [ ] Sauvegarde en JSON
```

### E7-S3: FAQ Personnalisee
**Points:** 2
**Priorite:** P1

```
En tant que marchand
Je veux creer une FAQ
Afin que l'IA ait des reponses precises

Criteres d'acceptation:
- [ ] Liste Q/R editables
- [ ] Ajouter/supprimer entrees
- [ ] Stockage JSON
- [ ] Inclusion dans prompt IA
```

---

## Epic 8: Billing & Plans

**Description:** Gestion des abonnements et paiements.

### E8-S1: Integration Stripe
**Points:** 3
**Priorite:** P1

```
En tant que developpeur
Je veux integrer Stripe Checkout
Afin de gerer les paiements

Criteres d'acceptation:
- [ ] Stripe SDK configure
- [ ] Products/Prices crees
- [ ] Checkout session creation
- [ ] Webhook subscription events
```

### E8-S2: Page Billing
**Points:** 2
**Priorite:** P1

```
En tant que marchand
Je veux voir mon abonnement
Afin de gerer mon plan

Criteres d'acceptation:
- [ ] Page /billing
- [ ] Plan actuel + usage
- [ ] Boutons upgrade/downgrade
- [ ] Lien Stripe Portal
- [ ] Historique factures
```

### E8-S3: Gestion Quotas
**Points:** 2
**Priorite:** P1

```
En tant que systeme
Je veux verifier les quotas
Afin de respecter les limites du plan

Criteres d'acceptation:
- [ ] Counter emails/mois
- [ ] Check avant envoi reponse auto
- [ ] Notification quota 80%
- [ ] Blocage si quota depasse
- [ ] Upgrade CTA
```

---

## Epic 9: Statistiques

**Description:** Metriques et analytics du SAV.

### E9-S1: Page Stats
**Points:** 3
**Priorite:** P1

```
En tant que marchand
Je veux voir les statistiques de mon SAV
Afin de mesurer l'efficacite

Criteres d'acceptation:
- [ ] Page /stats
- [ ] Graphique emails/jour
- [ ] Taux resolution auto (%)
- [ ] Temps reponse moyen
- [ ] Repartition par type
- [ ] Filtres periode
```

### E9-S2: Calcul Metriques
**Points:** 2
**Priorite:** P1

```
En tant que systeme
Je veux calculer les metriques en temps reel
Afin d'afficher des stats a jour

Criteres d'acceptation:
- [ ] Query agregations DB
- [ ] Cache Redis (5 min TTL)
- [ ] Endpoint API /stats
```

---

## Epic 10: Onboarding

**Description:** Guide de configuration pour nouveaux utilisateurs.

### E10-S1: Flow Onboarding
**Points:** 3
**Priorite:** P0

```
En tant que nouvel utilisateur
Je veux un guide de setup
Afin de configurer Saiv rapidement

Criteres d'acceptation:
- [ ] Page /onboarding
- [ ] Steps: Shopify > Gmail > Settings
- [ ] Progress indicator
- [ ] Skip possible
- [ ] Completion tracking
```

### E10-S2: Page Success
**Points:** 1
**Priorite:** P1

```
En tant que utilisateur ayant complete l'onboarding
Je veux une confirmation
Afin de savoir que tout est pret

Criteres d'acceptation:
- [ ] Page de succes
- [ ] Resume configuration
- [ ] CTA vers dashboard
- [ ] Liens ressources (docs, support)
```

---

## Backlog Priorise (Sprint 1)

### Sprint 1 - Foundation (Semaine 1-2)
| Story | Points | Priorite |
|-------|--------|----------|
| E1-S1 Init Projet | 2 | P0 |
| E1-S2 Config DB | 2 | P0 |
| E1-S3 Config Env | 1 | P0 |
| E2-S1 Inscription | 3 | P0 |
| E2-S2 Connexion | 2 | P0 |
| E2-S3 Middleware Auth | 2 | P0 |
| E6-S1 Layout Dashboard | 2 | P0 |
| **Total** | **14** | |

### Sprint 2 - Integrations (Semaine 2-3)
| Story | Points | Priorite |
|-------|--------|----------|
| E3-S1 OAuth Shopify | 3 | P0 |
| E3-S2 Callback Shopify | 3 | P0 |
| E3-S3 Sync Commandes | 3 | P0 |
| E4-S1 OAuth Gmail | 3 | P0 |
| E4-S2 Reception Emails | 3 | P0 |
| E4-S3 Envoi Emails | 2 | P0 |
| **Total** | **17** | |

### Sprint 3 - Core AI (Semaine 3-4)
| Story | Points | Priorite |
|-------|--------|----------|
| E5-S1 Client Claude | 2 | P0 |
| E5-S2 Prompt Engineering | 3 | P0 |
| E5-S3 Classification | 2 | P0 |
| E5-S4 Detection Escalade | 2 | P0 |
| E5-S5 Job Process Email | 3 | P0 |
| E7-S1 Settings Boutique | 2 | P0 |
| E7-S2 Config Politiques | 2 | P0 |
| **Total** | **16** | |

### Sprint 4 - Dashboard & Polish (Semaine 4-5)
| Story | Points | Priorite |
|-------|--------|----------|
| E6-S2 Dashboard Home | 2 | P0 |
| E6-S3 Liste Conversations | 3 | P0 |
| E6-S4 Detail Conversation | 3 | P0 |
| E10-S1 Flow Onboarding | 3 | P0 |
| E1-S4 Setup Redis | 1 | P1 |
| E2-S4 Deconnexion | 1 | P1 |
| **Total** | **13** | |

### Sprint 5 - Billing & Stats (Semaine 5-6)
| Story | Points | Priorite |
|-------|--------|----------|
| E8-S1 Integration Stripe | 3 | P1 |
| E8-S2 Page Billing | 2 | P1 |
| E8-S3 Gestion Quotas | 2 | P1 |
| E9-S1 Page Stats | 3 | P1 |
| E9-S2 Calcul Metriques | 2 | P1 |
| E6-S5 Reponse Manuelle | 2 | P1 |
| E7-S3 FAQ Personnalisee | 2 | P1 |
| **Total** | **16** | |

---

## Definition of Done

Chaque story est consideree terminee quand:
- [ ] Code ecrit et type-safe
- [ ] Tests unitaires passes
- [ ] Review IA (Claude) effectuee
- [ ] Build sans erreur
- [ ] Feature testee manuellement
- [ ] Commit avec message descriptif

---

*Epics & Stories Saiv v1.0 - Genere avec BMAD Method*
