import Link from "next/link"

export const metadata = {
  title: "Conditions Générales d'Utilisation - Saiv",
  description: "Conditions générales d'utilisation de l'application Saiv",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Conditions Générales d'Utilisation</h1>
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 5 février 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Mentions légales</h2>
          <div className="text-gray-700 leading-relaxed space-y-2">
            <p><strong>Éditeur :</strong> Studio Up</p>
            <p><strong>SIRET :</strong> 880 070 628 00016</p>
            <p><strong>Siège social :</strong> 15 rue Mauny, 17100 Saintes, France</p>
            <p><strong>Responsable de la publication :</strong> Ait Haj Kaddour Mehdi</p>
            <p><strong>Contact :</strong> <a href="mailto:contact@studioup.fr" className="text-blue-600 hover:underline">contact@studioup.fr</a></p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Objet</h2>
          <p className="text-gray-700 leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités
            et conditions d'utilisation du service Saiv, une application d'automatisation du service client
            pour les boutiques Shopify utilisant l'intelligence artificielle.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Acceptation des conditions</h2>
          <p className="text-gray-700 leading-relaxed">
            L'utilisation de Saiv implique l'acceptation pleine et entière des présentes CGU.
            Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Description du service</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Saiv propose les fonctionnalités suivantes :</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Connexion à votre boutique Shopify pour accéder aux données de commandes et clients</li>
            <li>Connexion à votre compte Gmail pour lire et répondre aux emails de support</li>
            <li>Génération automatique de réponses personnalisées grâce à l'intelligence artificielle</li>
            <li>Tableau de bord de suivi des conversations et statistiques</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Inscription et compte</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Pour utiliser Saiv, vous devez créer un compte en fournissant des informations exactes et complètes.
            Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les
            activités effectuées sous votre compte.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Vous vous engagez à nous informer immédiatement de toute utilisation non autorisée de votre compte.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Tarification et paiement</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Saiv propose différentes formules d'abonnement dont les tarifs sont indiqués sur notre site.
            Les paiements sont effectués par carte bancaire via notre prestataire Stripe.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Les abonnements sont facturés mensuellement</li>
            <li>Vous pouvez changer de formule ou annuler à tout moment</li>
            <li>En cas d'annulation, l'accès reste actif jusqu'à la fin de la période payée</li>
            <li>Aucun remboursement n'est effectué pour les périodes partiellement utilisées</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Obligations de l'utilisateur</h2>
          <p className="text-gray-700 leading-relaxed mb-4">En utilisant Saiv, vous vous engagez à :</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Utiliser le service conformément aux lois en vigueur</li>
            <li>Ne pas utiliser le service à des fins illégales ou frauduleuses</li>
            <li>Ne pas tenter de contourner les mesures de sécurité du service</li>
            <li>Respecter les conditions d'utilisation de Shopify et Gmail</li>
            <li>Vérifier les réponses automatiques avant leur envoi si vous activez la validation manuelle</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Propriété intellectuelle</h2>
          <p className="text-gray-700 leading-relaxed">
            Saiv, son logo, son interface et son code source sont la propriété exclusive de Studio Up.
            Toute reproduction, représentation ou exploitation non autorisée est interdite.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Limitation de responsabilité</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Saiv est fourni "tel quel". Nous ne garantissons pas que le service sera exempt d'erreurs
            ou d'interruptions. Notre responsabilité est limitée au montant des sommes versées par
            l'utilisateur au cours des 12 derniers mois.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nous ne sommes pas responsables des réponses générées par l'intelligence artificielle.
            Il vous appartient de vérifier et valider les réponses automatiques si nécessaire.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Protection des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Le traitement de vos données personnelles est régi par notre{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Politique de Confidentialité
            </Link>
            . En utilisant Saiv, vous consentez au traitement de vos données conformément à cette politique.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Résiliation</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Vous pouvez résilier votre compte à tout moment depuis les paramètres de l'application
            ou en nous contactant. Nous nous réservons le droit de suspendre ou résilier votre compte
            en cas de violation des présentes CGU.
          </p>
          <p className="text-gray-700 leading-relaxed">
            En cas de résiliation, vos données seront supprimées conformément à notre politique de confidentialité.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Modifications des CGU</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les modifications
            prendront effet dès leur publication sur le site. Nous vous informerons de tout changement
            important par email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Droit applicable</h2>
          <p className="text-gray-700 leading-relaxed">
            Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux français
            seront seuls compétents.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Pour toute question concernant ces CGU, vous pouvez nous contacter à :{" "}
            <a href="mailto:contact@studioup.fr" className="text-blue-600 hover:underline">
              contact@studioup.fr
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
