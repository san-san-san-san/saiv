"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertCircle, Mail } from "lucide-react"

export function FetchEmailsButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    totalEmails?: number
    processed?: number
    autoReplied?: number
    escalated?: number
    error?: string
    details?: string
  } | null>(null)

  const fetchEmails = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/emails/fetch", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        // Refresh the page after a short delay to show updated conversations
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setResult({ error: data.error || "Erreur lors de la récupération" })
      }
    } catch (error) {
      setResult({ error: "Erreur de connexion" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={fetchEmails} disabled={loading} variant="secondary">
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Récupération..." : "Récupérer les emails"}
      </Button>

      {result && (
        <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl ${
          result.error
            ? "bg-red-500/10 border border-red-500/20"
            : "bg-emerald-500/10 border border-emerald-500/20"
        }`}>
          {result.error ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-red-300">{result.error}</span>
              </div>
              {result.details && (
                <span className="text-xs text-red-400/70 ml-6">{result.details}</span>
              )}
            </div>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-300">
                {result.totalEmails} emails trouvés, {result.processed} traités
                {result.autoReplied! > 0 && `, ${result.autoReplied} répondus auto`}
                {result.escalated! > 0 && `, ${result.escalated} escaladés`}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
