import { useEffect, useRef, useState } from "react"

interface CloudflareTurnstileProps {
  siteKey?: string
  onVerify: (token: string) => void
  onError?: () => void
  action?: string
  theme?: "light" | "dark"
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onloadTurnstileCallback?: () => void
  }
}

export default function CloudflareTurnstile({
  siteKey = "0x4AAAAAAAxXXXXXXXXXXX", // Replace with your actual site key
  onVerify,
  onError,
  action = "login",
  theme = "dark",
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Check if Turnstile script is already loaded
    if (window.turnstile) {
      setLoaded(true)
      return
    }

    // Define global callback
    window.onloadTurnstileCallback = () => {
      setLoaded(true)
    }

    // Load Turnstile script
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit"
    script.async = true
    script.defer = true
    script.onerror = () => {
      setError(true)
      onError?.()
    }
    document.head.appendChild(script)

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [onError])

  useEffect(() => {
    if (!loaded || !containerRef.current || !window.turnstile) return

    // Render Turnstile widget
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      theme,
      callback: (token: string) => {
        onVerify(token)
      },
      "error-callback": () => {
        setError(true)
        onError?.()
      },
      "expired-callback": () => {
        // Token expired, reset widget
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
      },
    })

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [loaded, siteKey, action, theme, onVerify, onError])

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
        Security check failed to load. Please refresh the page or try again later.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />
      {!loaded && (
        <div className="text-xs text-gray-400 animate-pulse">Loading security check...</div>
      )}
    </div>
  )
}
