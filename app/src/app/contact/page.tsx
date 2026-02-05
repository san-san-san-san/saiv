import Link from "next/link"
import { Mail, MapPin, Building2 } from "lucide-react"

export const metadata = {
  title: "Contact - Saiv",
  description: "Contactez l'équipe Saiv pour toute question ou demande d'assistance",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-gray-600 mb-8">
            Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous accompagner.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Card */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-3">Pour toute question ou demande</p>
              <a
                href="mailto:contact@studioup.fr"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                contact@studioup.fr
              </a>
            </div>

            {/* Address Card */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adresse</h3>
              <p className="text-gray-600">
                15 rue Mauny<br />
                17100 Saintes<br />
                France
              </p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Informations légales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="text-sm text-gray-400 mb-1">Raison sociale</p>
              <p className="font-medium text-gray-900">Studio Up</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">SIRET</p>
              <p className="font-medium text-gray-900">880 070 628 00016</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Responsable</p>
              <p className="font-medium text-gray-900">Ait Haj Kaddour Mehdi</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Siège social</p>
              <p className="font-medium text-gray-900">15 rue Mauny, 17100 Saintes</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Consultez nos{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Conditions Générales d'Utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Politique de Confidentialité
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
