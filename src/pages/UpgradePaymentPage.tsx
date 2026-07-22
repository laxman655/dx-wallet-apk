import { useState } from "react"
import { CreditCard, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/PageHeader"

export default function UpgradePaymentPage() {
  const [submitted, setSubmitted] = useState(false)
  const [plan] = useState({ name: "Premium", price: "$9.99/mo" })

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <PageHeader title="Payment Successful" subtitle="Your account has been upgraded" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Welcome to {plan.name}!</h2>
          <p className="text-gray-400">Your subscription is now active. Enjoy all premium features.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader title="Complete Payment" subtitle="Upgrade your account" />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#c8a822]/10 to-transparent border border-[#c8a822]/20 mb-6">
          <h3 className="text-lg font-semibold">{plan.name} Plan</h3>
          <p className="text-2xl font-bold text-[#c8a822] mt-1">{plan.price}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-4"><CreditCard className="w-5 h-5 text-[#c8a822]" /><h3 className="font-semibold">Card Details</h3></div>
          <div className="space-y-2"><Label className="text-gray-400">Card Number</Label><Input placeholder="1234 5678 9012 3456" className="bg-white/5 border-white/10 text-white" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="text-gray-400">Expiry</Label><Input placeholder="MM/YY" className="bg-white/5 border-white/10 text-white" /></div>
            <div className="space-y-2"><Label className="text-gray-400">CVV</Label><Input type="password" placeholder="123" className="bg-white/5 border-white/10 text-white" /></div>
          </div>
          <div className="space-y-2"><Label className="text-gray-400">Cardholder Name</Label><Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white" /></div>
          <Button onClick={() => setSubmitted(true)} className="w-full bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90 mt-4">Pay {plan.price}</Button>
        </div>
      </div>
    </div>
  )
}
