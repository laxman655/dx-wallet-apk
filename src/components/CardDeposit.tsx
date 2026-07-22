import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CardDeposit() {
  const [amount, setAmount] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-lg font-semibold text-white">Card Deposit Processing</h3>
        <p className="text-gray-400 text-sm mt-2">Your card deposit is being processed. Funds will be credited shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
        <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" className="bg-white/5 border-white/10 text-white" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
          <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="bg-white/5 border-white/10 text-white" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv" className="text-white">CVV</Label>
          <Input id="cvv" type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" className="bg-white/5 border-white/10 text-white" required maxLength={4} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="bg-white/5 border-white/10 text-white" required min="1" />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90">Deposit with Card</Button>
    </form>
  )
}
