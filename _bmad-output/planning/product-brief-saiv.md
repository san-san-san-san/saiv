---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
date: 2026-02-03
author: User
status: complete
---

# Product Brief: Saiv

## 1. Vision du Produit

### Probleme a Resoudre

Les e-commercants Shopify passent un temps considerable a gerer leur Service Apres-Vente (SAV) :
- **Reponses repetitives** aux memes questions (suivi de commande, retours, remboursements)
- **Cout eleve** d'un employe dedie au SAV (1500-3000 EUR/mois minimum)
- **Delais de reponse** qui impactent la satisfaction client et les avis
- **Disponibilite limitee** (pas de support 24/7 sans equipe internationale)
- **Scalabilite** difficile lors des pics d'activite (Black Friday, soldes)

### Solution Proposee

**Saiv** est un SaaS qui automatise entierement le SAV des boutiques Shopify via IA (Claude API) :
- Reponses automatiques aux emails clients avec contexte complet (commande, historique, politique boutique)
- Integration native Shopify pour acces aux donnees en temps reel
- Personnalisation du ton et des politiques de chaque boutique
- Escalade intelligente vers le marchand uniquement si necessaire

### Proposition de Valeur Unique

> "Saiv remplace votre employe SAV par une IA qui connait parfaitement votre boutique, repond en 2 minutes 24/7, et coute 10x moins cher."

**Differenciateurs cles :**
1. **Integration Shopify native** - Pas de copier-coller, l'IA voit tout (commandes, tracking, client)
2. **IA Claude** - Reponses naturelles et empathiques, excellent en francais
3. **Zero configuration complexe** - Connecter Shopify + email = operationnel en 10 minutes
4. **100% autonome** - Le marchand n'intervient que sur les cas vraiment complexes

---

## 2. Utilisateurs Cibles

### Persona Principal : Le Marchand Solo/PME

**Profil :**
- Proprietaire de boutique Shopify
- 100 a 5000 commandes/mois
- Gere seul ou avec 1-2 personnes
- Passe 1-3h/jour sur le SAV
- Francophone (marche initial)

**Frustrations :**
- "Je passe mes soirees a repondre aux memes questions"
- "Je ne peux pas me payer un employe SAV"
- "Les clients se plaignent des delais de reponse"
- "Pendant les soldes, c'est l'enfer"

**Objectifs :**
- Reduire le temps passe sur le SAV de 80%+
- Ameliorer le temps de reponse (< 5 min vs 24h)
- Maintenir une qualite de reponse humaine
- Scaler sans embaucher

### Persona Secondaire : L'Agence/Multi-boutiques

**Profil :**
- Gere plusieurs boutiques Shopify
- Equipe de 5-20 personnes
- Volume eleve (10000+ commandes/mois cumule)

**Besoins specifiques :**
- Dashboard multi-boutiques
- Reporting centralise
- Gestion des equipes/permissions

---

## 3. Metriques de Succes

### KPIs Produit (MVP)

| Metrique | Objectif | Mesure |
|----------|----------|--------|
| Taux de resolution auto | > 70% | Emails resolus sans intervention humaine |
| Temps de reponse | < 2 min | Temps entre reception et reponse |
| Satisfaction client | > 4.5/5 | Rating post-interaction |
| Taux d'escalade | < 30% | Emails necessitant intervention humaine |

### KPIs Business

| Metrique | Objectif M6 | Objectif M12 |
|----------|-------------|--------------|
| MRR | 5 000 EUR | 25 000 EUR |
| Clients payants | 50 | 200 |
| Churn mensuel | < 5% | < 3% |
| NPS | > 40 | > 50 |

### KPIs Techniques

| Metrique | Objectif |
|----------|----------|
| Uptime | 99.9% |
| Latence API | < 500ms |
| Erreurs IA | < 1% |

---

## 4. Scope MVP

### Fonctionnalites IN (Must Have)

1. **Connexion Shopify**
   - OAuth Shopify App
   - Sync commandes, clients, produits
   - Webhooks temps reel

2. **Connexion Email**
   - Integration Gmail/SMTP
   - Reception et envoi d'emails
   - Detection emails SAV vs spam/marketing

3. **Moteur IA (Claude API)**
   - Analyse du contexte client/commande
   - Generation de reponse personnalisee
   - Respect du ton et politiques de la boutique

4. **Configuration Boutique**
   - Politique de retour/remboursement
   - FAQ personnalisee
   - Ton de communication (formel/decontracte)

5. **Dashboard Marchand**
   - Vue des conversations
   - Statistiques basiques
   - Historique des reponses

6. **Escalade**
   - Detection des cas complexes
   - Notification au marchand
   - Interface de prise en charge manuelle

### Fonctionnalites OUT (Post-MVP)

- Chat widget sur site
- Integration reseaux sociaux (Instagram, Facebook)
- Multi-langues automatique
- Actions automatiques (remboursement, avoir)
- App mobile
- API publique
- White-label pour agences

---

## 5. Contraintes et Risques

### Contraintes Techniques

| Contrainte | Impact | Mitigation |
|------------|--------|------------|
| Rate limits Claude API | Latence pics | Queue + retry + cache reponses similaires |
| Limites API Shopify | Sync incomplete | Webhooks + batch sync nocturne |
| Delivrabilite email | Spam | SPF/DKIM/DMARC + warm-up domaine |

### Contraintes Business

| Contrainte | Impact | Mitigation |
|------------|--------|------------|
| Cout Claude API | Marge reduite | Optimisation prompts + cache + modele adaptatif |
| RGPD | Compliance | Serveurs EU + DPA + retention limitee |
| Confiance marchands | Adoption lente | Trial gratuit + garantie satisfaction |

### Risques Identifies

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Reponses IA incorrectes | Moyenne | Eleve | Validation humaine initiale + feedback loop |
| Shopify change API | Faible | Moyen | Abstraction + veille changelog |
| Concurrent bien finance | Moyenne | Eleve | Niche francophone + UX superieure |
| Churn eleve | Moyenne | Eleve | Onboarding guide + success metrics visibles |

---

## 6. Modele Economique

### Plans Tarifaires (Proposition)

| Plan | Prix/mois | Emails/mois | Cible |
|------|-----------|-------------|-------|
| **Starter** | 29 EUR | 500 | Petits marchands < 500 cmd/mois |
| **Growth** | 79 EUR | 2 000 | Marchands moyens 500-2000 cmd/mois |
| **Scale** | 199 EUR | 10 000 | Gros marchands 2000-10000 cmd/mois |
| **Enterprise** | Sur devis | Illimite | Agences, grands comptes |

### Unit Economics (Estimation)

- **Cout Claude API** : ~0.02 EUR/email (moyenne)
- **Marge brute Starter** : 29 - (500 * 0.02) = 19 EUR (65%)
- **Marge brute Growth** : 79 - (2000 * 0.02) = 39 EUR (49%)
- **Marge brute Scale** : 199 - (10000 * 0.02) = -1 EUR (a optimiser)

**Action :** Optimiser les prompts et implementer du caching pour ameliorer les marges Scale.

---

## 7. Stack Technique (Recommandation)

### Frontend
- **Next.js 14** (App Router) - Dashboard marchand
- **Tailwind CSS** + **shadcn/ui** - UI rapide et propre
- **Vercel** - Hosting frontend

### Backend
- **Node.js** + **TypeScript** - API principale
- **PostgreSQL** (Supabase ou Neon) - Base de donnees
- **Redis** (Upstash) - Cache et queues
- **Claude API** - Moteur IA

### Integrations
- **Shopify App Bridge** - Integration native
- **Gmail API** ou **SMTP/IMAP** - Emails
- **Resend** - Envoi emails transactionnels

### Infrastructure
- **Railway** ou **Render** - Backend hosting
- **Vercel** - Frontend + Edge functions
- **Cloudflare** - CDN + protection

---

## 8. Prochaines Etapes

1. **Creer le PRD detaille** - Specifications fonctionnelles completes
2. **Architecture technique** - Design systeme et choix definitifs
3. **MVP en 4-6 semaines** - Focus sur le flow email complet
4. **Beta privee** - 10-20 marchands francais
5. **Lancement public** - Shopify App Store

---

*Document genere avec BMAD Method - Saiv Product Brief v1.0*
