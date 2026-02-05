import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Saiv</div>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="ghost">Connexion</Button>
          </Link>
          <Link href="/register">
            <Button>Commencer</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Automatisez votre SAV Shopify avec l'IA
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Saiv repond automatiquement aux emails de vos clients avec le contexte
            complet de leurs commandes. Gagnez du temps, ameliorez la satisfaction.
          </p>
          <div className="space-x-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Essayer gratuitement
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-600">70%+</div>
            <div className="text-gray-600 mt-2">Emails resolus automatiquement</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-600">&lt; 2 min</div>
            <div className="text-gray-600 mt-2">Temps de reponse moyen</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-600">10x</div>
            <div className="text-gray-600 mt-2">Moins cher qu'un employe</div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-32">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ca marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Connectez Shopify</h3>
              <p className="text-gray-600">
                En 1 clic, Saiv accede a vos commandes, clients et produits.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Connectez Gmail</h3>
              <p className="text-gray-600">
                Saiv lit et repond aux emails de votre boite SAV.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. L'IA repond</h3>
              <p className="text-gray-600">
                Reponses personnalisees avec le contexte de chaque commande.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-center mb-12">Tarifs simples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold">Starter</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">29€</span>
                <span className="text-gray-600">/mois</span>
              </div>
              <ul className="mt-6 space-y-3 text-gray-600">
                <li>✓ 500 emails/mois</li>
                <li>✓ 1 boutique</li>
                <li>✓ Historique 30 jours</li>
                <li>✓ Support email</li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Choisir</Button>
            </div>
            <div className="p-6 bg-blue-600 text-white rounded-lg shadow-lg scale-105">
              <div className="text-sm font-medium mb-2">Populaire</div>
              <h3 className="text-xl font-semibold">Growth</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">79€</span>
                <span className="text-blue-200">/mois</span>
              </div>
              <ul className="mt-6 space-y-3 text-blue-100">
                <li>✓ 2 000 emails/mois</li>
                <li>✓ 2 boutiques</li>
                <li>✓ Historique 90 jours</li>
                <li>✓ Support prioritaire</li>
              </ul>
              <Button className="w-full mt-6 !bg-white !text-blue-600 hover:!bg-blue-50 !shadow-none">
                Choisir
              </Button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold">Scale</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">199€</span>
                <span className="text-gray-600">/mois</span>
              </div>
              <ul className="mt-6 space-y-3 text-gray-600">
                <li>✓ 10 000 emails/mois</li>
                <li>✓ 5 boutiques</li>
                <li>✓ Historique 1 an</li>
                <li>✓ Support dedie</li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Choisir</Button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pret a automatiser votre SAV ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Essayez gratuitement pendant 14 jours, sans carte bancaire.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">© 2026 Saiv. Tous droits reserves.</div>
          <div className="space-x-6 text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900">Confidentialite</Link>
            <Link href="/terms" className="hover:text-gray-900">CGU</Link>
            <Link href="/contact" className="hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
