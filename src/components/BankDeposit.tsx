import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BankDeposit() {
  const [amount, setAmount] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-lg font-semibold text-white">Deposit Request Submitted</h3>
        <p className="text-gray-400 text-sm mt-2">Your bank deposit request is being processed. Funds will be credited within 1-2 business days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bankName" className="text-white">Bank Name</Label>
        <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Enter bank name" className="bg-white/5 border-white/10 text-white" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="accountNumber" className="text-white">Account Number</Label>
        <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Enter account number" className="bg-white/5 border-white/10 text-white" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="bg-white/5 border-white/10 text-white" required min="1" />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90">Submit Deposit Request</Button>
    </form>
  )
}
