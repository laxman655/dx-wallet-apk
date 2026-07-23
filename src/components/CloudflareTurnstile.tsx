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
  siteKey = "0x4AAAAAAAxXXXXXXXXXXX",
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
    if (window.turnstile) {
      setLoaded(true)
      return
    }

    window.onloadTurnstileCallback = () => {
      setLoaded(true)
    }

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
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex items-center gap-2 text-xs text-yellow-500/70">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Security check unavailable - you can still proceed</span>
        </div>
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
