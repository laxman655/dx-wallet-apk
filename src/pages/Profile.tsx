import { useState } from "react"
import { User, Mail, Phone, Shield, Edit, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/PageHeader"

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe", email: "john@example.com", phone: "+971 50 123 4567",
    kycStatus: "verified", joined: "2024-01-15",
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader title="Profile" subtitle="Manage your account settings" />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c8a822] to-[#e8d48b] flex items-center justify-center text-black text-2xl font-bold">{profile.name.charAt(0)}</div>
            <div>
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <div className="flex items-center gap-1 text-sm"><Shield className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400 capitalize">{profile.kycStatus}</span></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-400 flex items-center gap-1"><User className="w-3.5 h-3.5" /> Full Name</Label>
              {editing ? <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-white/5 border-white/10 text-white" />
              : <p className="text-white px-3 py-2">{profile.name}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</Label>
              {editing ? <Input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="bg-white/5 border-white/10 text-white" />
              : <p className="text-white px-3 py-2">{profile.email}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</Label>
              {editing ? <Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="bg-white/5 border-white/10 text-white" />
              : <p className="text-white px-3 py-2">{profile.phone}</p>}
            </div>
          </div>

          <Button onClick={() => setEditing(!editing)} className="w-full bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90">
            {editing ? <><Save className="w-4 h-4 mr-2" /> Save Changes</> : <><Edit className="w-4 h-4 mr-2" /> Edit Profile</>}
          </Button>
        </div>
      </div>
    </div>
  )
}
