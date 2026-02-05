"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Conversations", href: "/conversations", icon: MessageSquare },
  { name: "Statistiques", href: "/stats", icon: BarChart3 },
  { name: "Paramètres", href: "/settings", icon: Settings },
  { name: "Abonnement", href: "/billing", icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <div className="flex h-screen w-64 flex-col glass-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-white/[0.08]">
        <Link href="/dashboard" className="text-2xl font-bold tracking-tight">
          Saiv<span className="text-purple-500">.</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-purple-500/15 text-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-purple-400" : ""
              )} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Keyboard shortcuts hint */}
      <div className="mx-3 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
        <p className="text-xs text-slate-500 mb-2">Raccourcis clavier</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Navigation</span>
          <div className="flex gap-1">
            <kbd className="kbd">J</kbd>
            <kbd className="kbd">K</kbd>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-white/[0.08] p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}
