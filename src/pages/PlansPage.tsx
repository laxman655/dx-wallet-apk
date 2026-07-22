import { Check, Crown, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/PageHeader"

const plans = [
  {
    name: "Basic", icon: <Zap className="w-6 h-6" />, price: "Free",
    features: ["Multi-currency wallet", "Send & receive funds", "Basic exchange", "Email support"],
    cta: "Get Started", popular: false,
  },
  {
    name: "Premium", icon: <Crown className="w-6 h-6" />, price: "$9.99/mo",
    features: ["Everything in Basic", "Priority transfers", "Advanced charts", "Lower fees", "24/7 support", "Crypto trading"],
    cta: "Upgrade Now", popular: true,
  },
  {
    name: "Enterprise", icon: <Shield className="w-6 h-6" />, price: "Custom",
    features: ["Everything in Premium", "API access", "Dedicated manager", "Custom integrations", "SLA guarantee", "White-label option"],
    cta: "Contact Sales", popular: false,
  },
]

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader title="Pricing Plans" subtitle="Choose the plan that fits your needs" />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.name} className={`relative p-6 rounded-2xl border ${plan.popular ? "border-[#c8a822]/50 bg-gradient-to-b from-[#c8a822]/5 to-transparent" : "border-white/5 bg-white/[0.02]"}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#c8a822] text-black text-xs font-bold">Most Popular</div>}
              <div className="w-12 h-12 rounded-xl bg-[#c8a822]/10 flex items-center justify-center text-[#c8a822] mb-4">{plan.icon}</div>
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="text-3xl font-bold text-white mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-green-400 shrink-0" />{f}</li>
                ))}
              </ul>
              <Button className={`w-full ${plan.popular ? "bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90" : "bg-white/5 text-white hover:bg-white/10"}`}>{plan.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
