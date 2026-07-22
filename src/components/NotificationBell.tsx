import { useState } from "react"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications] = useState<Notification[]>([
    { id: 1, title: "Deposit Received", message: "Your deposit of $500 has been credited.", time: "2 min ago", read: false },
    { id: 2, title: "KYC Verified", message: "Your identity verification is complete.", time: "1 hour ago", read: false },
    { id: 3, title: "Price Alert", message: "BTC is up 5% in the last 24 hours.", time: "3 hours ago", read: true },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={cn("p-3 border-b border-white/5 hover:bg-white/5 transition-colors", !n.read && "bg-white/[0.02]")}>
                  <div className="flex items-start gap-2">
                    {!n.read && <div className="w-2 h-2 rounded-full bg-[#c8a822] mt-1.5 shrink-0" />}
                    <div className={cn("flex-1", n.read && "pl-4")}>
                      <p className="text-white text-sm font-medium">{n.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{n.message}</p>
                      <p className="text-gray-500 text-[10px] mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
