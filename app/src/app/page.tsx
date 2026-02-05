import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030014] text-white antialiased selection:bg-purple-500 selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#030014]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">Saiv<span className="text-purple-500">.</span></div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">Produit</a>
            <a href="#pricing" className="hover:text-white transition">Tarifs</a>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition hidden sm:block">Connexion</Link>
            <Link href="/register" className="bg-white text-black hover:bg-slate-200 px-5 py-2.5 rounded-full text-sm font-bold transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Essayer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Compatible Claude AI
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Votre SAV Shopify <br />
            <span className="gradient-text">en pilote automatique.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Saiv se connecte à votre boutique et répond intelligemment à vos clients avant même que vous n'ayez lu l'email.
            <span className="text-white font-medium"> Réduisez vos tickets de 80%.</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold text-lg transition shadow-[0_0_40px_rgba(147,51,234,0.5)]">
              Installer gratuitement
            </Link>
            <button className="px-8 py-4 glass-card rounded-full font-bold text-lg text-slate-200 hover:text-white transition">
              Voir la démo
            </button>
          </div>

          {/* Demo Card */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30" />
            <div className="relative glass-card rounded-xl p-4 md:p-8 border border-white/10 bg-[#0B0C15]">
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">👤</div>
                <div className="space-y-4 w-full">
                  <div className="bg-slate-900/50 p-4 rounded-lg rounded-tl-none border border-white/5">
                    <p className="text-slate-400 text-sm mb-1">Client • Commande #1024</p>
                    <p className="text-slate-200">Bonjour, où est ma commande ? Ça fait 3 jours...</p>
                  </div>

                  <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saiv analyse Shopify...
                  </div>

                  <div className="bg-purple-900/20 p-4 rounded-lg rounded-tr-none border border-purple-500/30">
                    <p className="text-purple-300 text-sm mb-1">Saiv • Réponse automatique</p>
                    <p className="text-slate-200">Bonjour Julie ! 👋 <br/>Je vois que votre commande <strong>#1024</strong> est en cours de transit. Elle devrait arriver ce jeudi. Voici votre lien de suivi : <span className="text-blue-400 underline decoration-blue-400/30">track.chk/1024</span>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Plus qu'un simple auto-répondeur.</h2>
            <p className="text-slate-400 text-lg">Une intelligence connectée à vos données réelles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-600/30 transition duration-500" />
              <h3 className="text-2xl font-bold mb-2 text-white">Contexte Shopify Total</h3>
              <p className="text-slate-400 mb-6">Saiv ne devine pas. Il sait. Il vérifie le statut de la commande, l'adresse de livraison et l'historique client avant de rédiger une réponse.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-slate-300">📦 Statut Commande</span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-slate-300">🚚 Tracking</span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-slate-300">↩️ Remboursements</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Réponse &lt; 2 min</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Pendant que vous dormez, Saiv traite les demandes. Zéro temps d'attente = Clients ravis.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl flex flex-col justify-between group">
              <h3 className="text-xl font-bold mb-2">Multilingue Natif 🌍</h3>
              <p className="text-slate-400 text-sm">Votre client parle allemand ? Saiv répond en allemand parfait. Plus de barrière de langue.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2">90%</div>
              <p className="text-slate-400 text-sm">Taux de résolution automatique</p>
            </div>

            <div className="glass-card p-8 rounded-3xl border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <p className="text-slate-400 text-sm">Disponibilité garantie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 bg-[#050511]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Investissement <span className="gradient-text">rentable dès le J1</span></h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="glass-card p-8 rounded-2xl flex flex-col">
              <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Starter</div>
              <div className="text-4xl font-bold mb-6">29€<span className="text-lg text-slate-500 font-normal">/mois</span></div>
              <ul className="space-y-4 mb-8 text-slate-300 text-sm">
                <li className="flex items-center gap-3"><span className="text-green-400">✓</span> 500 emails / mois</li>
                <li className="flex items-center gap-3"><span className="text-green-400">✓</span> 1 Boutique</li>
                <li className="flex items-center gap-3"><span className="text-slate-600">✕</span> Support Prioritaire</li>
              </ul>
              <Link href="/register" className="mt-auto w-full py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-center transition font-medium">Commencer</Link>
            </div>

            {/* Growth - Popular */}
            <div className="relative p-8 rounded-2xl bg-[#131125] border border-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.15)] flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAIRE</div>
              <div className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-2">Growth</div>
              <div className="text-4xl font-bold mb-6">79€<span className="text-lg text-slate-500 font-normal">/mois</span></div>
              <ul className="space-y-4 mb-8 text-slate-300 text-sm">
                <li className="flex items-center gap-3"><span className="text-purple-400">✓</span> 2 000 emails / mois</li>
                <li className="flex items-center gap-3"><span className="text-purple-400">✓</span> 3 Boutiques</li>
                <li className="flex items-center gap-3"><span className="text-purple-400">✓</span> IA Personnalisable</li>
              </ul>
              <Link href="/register" className="mt-auto w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-center transition shadow-lg shadow-purple-900/50">Choisir Growth</Link>
            </div>

            {/* Scale */}
            <div className="glass-card p-8 rounded-2xl flex flex-col">
              <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Scale</div>
              <div className="text-4xl font-bold mb-6">199€<span className="text-lg text-slate-500 font-normal">/mois</span></div>
              <ul className="space-y-4 mb-8 text-slate-300 text-sm">
                <li className="flex items-center gap-3"><span className="text-green-400">✓</span> Illimité</li>
                <li className="flex items-center gap-3"><span className="text-green-400">✓</span> Multi-Boutiques</li>
                <li className="flex items-center gap-3"><span className="text-green-400">✓</span> Agent dédié</li>
              </ul>
              <Link href="/contact" className="mt-auto w-full py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-center transition font-medium">Contacter Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#02000d] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold">Saiv.</div>
          <div className="text-slate-500 text-sm">© 2026 Studio Up. Tous droits réservés.</div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/terms" className="hover:text-white transition">CGU</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
