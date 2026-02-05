import Link from "next/link"

export const metadata = {
  title: "Politique de Confidentialité - Saiv",
  description: "Politique de confidentialité de l'application Saiv",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 5 février 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Saiv, édité par Studio Up (SIRET : 880 070 628 00016), s'engage à protéger la vie privée des utilisateurs
            de notre service d'automatisation du service client pour Shopify. Cette politique de confidentialité
            explique comment nous collectons, utilisons et protégeons vos informations.
          </p>
          <div className="text-gray-700 leading-relaxed space-y-1 text-sm bg-gray-50 p-4 rounded-lg">
            <p><strong>Responsable du traitement :</strong> Studio Up</p>
            <p><strong>Adresse :</strong> 15 rue Mauny, 17100 Saintes, France</p>
            <p><strong>Contact :</strong> contact@studioup.fr</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Données collectées</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Nous collectons les types de données suivants :</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Informations de compte :</strong> email, nom, mot de passe (chiffré)</li>
            <li><strong>Données Shopify :</strong> informations sur les commandes, clients et produits de votre boutique</li>
            <li><strong>Données Gmail :</strong> emails de support client (avec votre autorisation)</li>
            <li><strong>Données d&apos;utilisation :</strong> statistiques d&apos;utilisation de l&apos;application</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Utilisation des données</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Vos données sont utilisées pour :</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Fournir le service d&apos;automatisation des réponses client</li>
            <li>Analyser les emails entrants et générer des réponses appropriées</li>
            <li>Améliorer la qualité de nos services</li>
            <li>Vous contacter concernant votre compte ou nos services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Partage des données</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nous partageons vos données uniquement avec les services tiers nécessaires au fonctionnement de l&apos;application :
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Anthropic (Claude AI) :</strong> pour le traitement des emails par intelligence artificielle</li>
            <li><strong>Stripe :</strong> pour le traitement des paiements</li>
            <li><strong>Google (Gmail API) :</strong> pour l&apos;accès à vos emails de support</li>
            <li><strong>Shopify :</strong> pour l&apos;accès aux données de votre boutique</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Nous ne vendons jamais vos données personnelles à des tiers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Sécurité des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données, notamment :
            le chiffrement des données sensibles, l&apos;utilisation de connexions sécurisées (HTTPS),
            et le stockage sécurisé des tokens d&apos;accès.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Conservation des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous conservons vos données tant que votre compte est actif. Vous pouvez demander la suppression
            de vos données à tout moment en nous contactant.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Vos droits</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Vous avez le droit de :</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Accéder à vos données personnelles</li>
            <li>Corriger vos données inexactes</li>
            <li>Demander la suppression de vos données</li>
            <li>Retirer votre consentement à tout moment</li>
            <li>Exporter vos données</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Pour toute question concernant cette politique de confidentialité ou vos données personnelles,
            contactez-nous à : <a href="mailto:contact@studioup.fr" className="text-blue-600 hover:underline">contact@studioup.fr</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Modifications</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous pouvons mettre à jour cette politique de confidentialité de temps en temps.
            Nous vous informerons de tout changement important par email ou via l&apos;application.
          </p>
        </section>
      </div>
    </div>
  )
}
