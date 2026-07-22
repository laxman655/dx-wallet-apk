import { Link } from "react-router"
import { ArrowRight, Shield, Zap, Globe, Wallet, TrendingUp, Lock } from "lucide-react"
import CryptoTickerHeader from "@/components/CryptoTickerHeader"

export default function HomePage() {
  const features = [
    { icon: <Shield className="w-6 h-6" />, title: "Bank-Grade Security", desc: "256-bit encryption & multi-sig wallets protect your assets" },
    { icon: <Zap className="w-6 h-6" />, title: "Instant Transfers", desc: "Send and receive funds in seconds, 24/7" },
    { icon: <Globe className="w-6 h-6" />, title: "Global Coverage", desc: "Support for 50+ currencies across 180+ countries" },
    { icon: <Wallet className="w-6 h-6" />, title: "Multi-Currency", desc: "Hold USD, EUR, GBP, AED, BTC, ETH & more" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Crypto Trading", desc: "Buy, sell & exchange cryptocurrencies instantly" },
    { icon: <Lock className="w-6 h-6" />, title: "KYC Verified", desc: "Regulated & compliant with international standards" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <CryptoTickerHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c8a822]/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300">Live Trading Available</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight mb-6">
            Dubai's Premier<br />
            <span className="bg-gradient-to-r from-[#c8a822] to-[#e8d48b] bg-clip-text text-transparent">Digital Exchange</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Trade cryptocurrencies, manage multi-currency wallets, and send money globally — all from one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-bold text-lg hover:opacity-90 transition-opacity">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{ label: "Users", value: "50K+" }, { label: "Daily Volume", value: "$2.5M" }, { label: "Currencies", value: "50+" }, { label: "Countries", value: "180+" }].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Dubai Exchange?</h2>
            <p className="text-gray-400">Everything you need to manage your digital assets</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#c8a822]/30 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-[#c8a822]/10 flex items-center justify-center text-[#c8a822] mb-4 group-hover:bg-[#c8a822]/20 transition-colors">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-[#c8a822]/10 to-transparent border border-[#c8a822]/20">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-400 mb-8">Create your account in minutes and start trading cryptocurrencies today.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-bold hover:opacity-90 transition-opacity">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
