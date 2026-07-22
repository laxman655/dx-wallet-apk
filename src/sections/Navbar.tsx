import { Link } from "react-router"
import { Menu, X, Wallet } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Exchange", to: "/exchange" },
    { label: "Send", to: "/send" },
    { label: "History", to: "/history" },
    { label: "Settings", to: "/settings" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0a]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c8a822] to-[#e8d48b] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Dubai<span className="text-[#c8a822]">Exchange</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to} className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden md:inline-flex px-4 py-2 rounded-lg bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black text-sm font-semibold hover:opacity-90 transition-opacity">Sign In</Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-white hover:bg-white/5"><Menu className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-white">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg text-white hover:bg-white/5"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-2">
              {links.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl text-white hover:bg-white/5 transition-colors text-lg">{l.label}</Link>
              ))}
            </div>
            <div className="mt-auto">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold">Sign In</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
