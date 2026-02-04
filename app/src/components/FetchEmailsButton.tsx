"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export function FetchEmailsButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    totalEmails?: number
    processed?: number
    autoReplied?: number
    escalated?: number
    error?: string
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
      <Button onClick={fetchEmails} disabled={loading} variant="outline">
        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Récupération..." : "Récupérer les emails"}
      </Button>

      {result && (
        <div className="flex items-center gap-2 text-sm">
          {result.error ? (
            <>
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-600">{result.error}</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-600">
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
