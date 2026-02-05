import Link from "next/link"
import { Mail, MapPin, Building2 } from "lucide-react"

export const metadata = {
  title: "Contact - Saiv",
  description: "Contactez l'équipe Saiv pour toute question ou demande d'assistance",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030014] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/15 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="text-purple-400 hover:text-purple-300 mb-6 inline-block transition">
          ← Retour à l'accueil
        </Link>

        <div className="glass-card p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Contactez-nous</h1>
          <p className="text-slate-400 mb-8">
            Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous accompagner.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Card */}
            <div className="p-6 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-slate-400 mb-3">Pour toute question ou demande</p>
              <a
                href="mailto:contact@studioup.fr"
                className="text-purple-400 hover:text-purple-300 font-medium transition"
              >
                contact@studioup.fr
              </a>
            </div>

            {/* Address Card */}
            <div className="p-6 bg-pink-500/10 rounded-xl border border-pink-500/20">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Adresse</h3>
              <p className="text-slate-400">
                15 rue Mauny<br />
                17100 Saintes<br />
                France
              </p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
              <Building2 className="h-5 w-5 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Informations légales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400">
            <div>
              <p className="text-sm text-slate-500 mb-1">Raison sociale</p>
              <p className="font-medium text-white">Studio Up</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">SIRET</p>
              <p className="font-medium text-white">880 070 628 00016</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Responsable</p>
              <p className="font-medium text-white">Ait Haj Kaddour Mehdi</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Siège social</p>
              <p className="font-medium text-white">15 rue Mauny, 17100 Saintes</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            <p className="text-sm text-slate-500">
              Consultez nos{" "}
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition">
                Conditions Générales d'Utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition">
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
