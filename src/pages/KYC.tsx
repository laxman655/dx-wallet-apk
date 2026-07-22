import { useState } from "react"
import { Upload, CheckCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PageHeader from "@/components/PageHeader"

export default function KYC() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ fullName: "", dob: "", nationality: "", idType: "passport", idNumber: "", address: "" })

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <PageHeader title="KYC Verification" subtitle="Identity verification status" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verification Submitted</h2>
          <p className="text-gray-400">Your documents are under review. This usually takes 1-2 business days.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageHeader title="KYC Verification" subtitle="Verify your identity to unlock full features" />
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? "bg-[#c8a822]" : "bg-white/10"}`} />
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          {step === 1 && (
            <>
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="space-y-4">
                <div className="space-y-2"><Label className="text-gray-400">Full Name</Label><Input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="John Doe" className="bg-white/5 border-white/10 text-white" /></div>
                <div className="space-y-2"><Label className="text-gray-400">Date of Birth</Label><Input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="bg-white/5 border-white/10 text-white" /></div>
                <div className="space-y-2"><Label className="text-gray-400">Nationality</Label><Input value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} placeholder="United Arab Emirates" className="bg-white/5 border-white/10 text-white" /></div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-lg font-semibold">ID Document</h3>
              <div className="space-y-4">
                <div className="space-y-2"><Label className="text-gray-400">ID Type</Label>
                  <Select value={form.idType} onValueChange={v => setForm({...form, idType: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="passport">Passport</SelectItem><SelectItem value="emirates_id">Emirates ID</SelectItem><SelectItem value="driving_license">Driving License</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label className="text-gray-400">ID Number</Label><Input value={form.idNumber} onChange={e => setForm({...form, idNumber: e.target.value})} placeholder="Enter ID number" className="bg-white/5 border-white/10 text-white" /></div>
                <div className="space-y-2"><Label className="text-gray-400">Address</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Your residential address" className="bg-white/5 border-white/10 text-white" /></div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-lg font-semibold">Upload Documents</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#c8a822]/30 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-[#c8a822] mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload front of ID</p>
                </div>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#c8a822]/30 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-[#c8a822] mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload back of ID</p>
                </div>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#c8a822]/30 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-[#c8a822] mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload selfie</p>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 border-white/10 text-white hover:bg-white/5">Back</Button>}
            {step < 3 ? <Button onClick={() => setStep(step + 1)} className="flex-1 bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90">Continue</Button>
            : <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90"><Shield className="w-4 h-4 mr-2" /> Submit Verification</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
