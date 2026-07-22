import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CryptoDeposit() {
  const [amount, setAmount] = useState("")
  const [crypto, setCrypto] = useState("BTC")
  const [submitted, setSubmitted] = useState(false)

  const cryptoAddresses: Record<string, string> = {
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    USDT: "TQiB8E73Q7Xxz6b1RG7oR7yJ8R7oR7yJ8R",
    TRX: "TV6MuMXfLbA3o5uJ6QQZ8QQZ8QQZ8QQZ8",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-lg font-semibold text-white">Crypto Deposit Initiated</h3>
        <p className="text-gray-400 text-sm mt-2">Send {crypto} to the address below. Funds will be credited after network confirmation.</p>
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Deposit Address</p>
          <p className="text-white text-sm font-mono break-all mt-1">{cryptoAddresses[crypto]}</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Cryptocurrency</Label>
        <Select value={crypto} onValueChange={setCrypto}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
            <SelectItem value="USDT">Tether (USDT)</SelectItem>
            <SelectItem value="TRX">Tron (TRX)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-white">Amount</Label>
        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="bg-white/5 border-white/10 text-white" required min="0.001" step="0.001" />
      </div>
      <div className="p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-gray-400">Deposit Address ({crypto})</p>
        <p className="text-white text-sm font-mono break-all mt-1">{cryptoAddresses[crypto]}</p>
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90">I've Sent the Crypto</Button>
    </form>
  )
}
