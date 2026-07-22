import { useState } from "react"
import { ArrowRightLeft, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PageHeader from "@/components/PageHeader"

const exchangeRates: Record<string, number> = {
  "USD-AED": 3.67, "AED-USD": 0.27, "USD-EUR": 0.92, "EUR-USD": 1.09,
  "USD-GBP": 0.79, "GBP-USD": 1.27, "USD-BTC": 0.000015, "BTC-USD": 67245,
  "USD-ETH": 0.00029, "ETH-USD": 3456, "USD-TRX": 8.33, "TRX-USD": 0.12,
  "BTC-ETH": 19.4, "ETH-BTC": 0.052, "USDT-USD": 1, "USD-USDT": 1,
}

export default function ExchangePage() {
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("AED")
  const [amount, setAmount] = useState("")
  const [result, setResult] = useState("")

  const handleExchange = () => {
    const key = `${from}-${to}`
    const rate = exchangeRates[key] || 1
    const val = parseFloat(amount) * rate
    setResult(val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 }))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader title="Currency Exchange" subtitle="Convert between currencies instantly" />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">From</label>
            <div className="flex gap-3">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["USD", "AED", "EUR", "GBP", "BTC", "ETH", "TRX", "USDT"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="flex-1 bg-white/5 border-white/10 text-white" />
            </div>
          </div>

          <div className="flex justify-center"><ArrowRightLeft className="w-5 h-5 text-[#c8a822]" /></div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">To</label>
            <div className="flex gap-3">
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["USD", "AED", "EUR", "GBP", "BTC", "ETH", "TRX", "USDT"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex-1 flex items-center px-3 rounded-md bg-white/5 border border-white/10 text-white">{result || "0.00"}</div>
            </div>
          </div>

          <Button onClick={handleExchange} className="w-full bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90">
            <TrendingUp className="w-4 h-4 mr-2" /> Exchange
          </Button>

          {result && (
            <p className="text-center text-sm text-gray-400">
              Rate: 1 {from} = {exchangeRates[`${from}-${to}`]?.toFixed(6) || "1"} {to}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
