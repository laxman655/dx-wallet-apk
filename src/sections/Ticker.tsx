import { useEffect, useState } from "react"

interface TickerItem {
  symbol: string
  price: string
  change: number
}

export default function Ticker() {
  const [items] = useState<TickerItem[]>([
    { symbol: "BTC/USD", price: "67,245.00", change: 2.34 },
    { symbol: "ETH/USD", price: "3,456.78", change: -1.23 },
    { symbol: "USDT/USD", price: "1.00", change: 0.01 },
    { symbol: "TRX/USD", price: "0.12", change: 5.67 },
    { symbol: "XRP/USD", price: "0.62", change: -0.45 },
    { symbol: "SOL/USD", price: "178.90", change: 3.21 },
    { symbol: "DOGE/USD", price: "0.16", change: 8.90 },
    { symbol: "ADA/USD", price: "0.45", change: -2.10 },
  ])

  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 1) % items.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [items.length])

  return (
    <div className="w-full overflow-hidden bg-black/30 border-y border-white/5 py-3">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-medium text-white">{item.symbol}</span>
            <span className="text-sm text-gray-300">${item.price}</span>
            <span className={`text-sm font-medium ${item.change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
