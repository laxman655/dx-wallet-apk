import { useState, useRef } from "react"
import { Upload, CheckCircle, Shield, FileImage, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PageHeader from "@/components/PageHeader"
import { uploadKYCDocument, compressImage } from "@/lib/r2Upload"
import { toast } from "sonner"

export default function KYC() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ fullName: "", dob: "", nationality: "", idType: "passport", idNumber: "", address: "" })

  const idFrontRef = useRef<HTMLInputElement>(null)
  const idBackRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File, type: "id_front" | "id_back" | "selfie") => {
    setUploading(prev => ({ ...prev, [type]: true }))
    try {
      // Compress image before upload
      const compressed = await compressImage(file, 1920, 0.85)
      const result = await uploadKYCDocument(compressed, type)

      if (result.success && result.url) {
        setUploadedFiles(prev => ({ ...prev, [type]: result.url! }))
        toast.success(`${type.replace("_", " ").toUpperCase()} uploaded successfully`)
      } else {
        toast.error(result.error || `Failed to upload ${type}`)
      }
    } catch {
      toast.error(`Error uploading ${type}`)
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  const handleDrop = (e: React.DragEvent, type: "id_front" | "id_back" | "selfie") => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file, type)
  }

  const allDocsUploaded = uploadedFiles.id_front && uploadedFiles.id_back && uploadedFiles.selfie

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <PageHeader title="KYC Verification" subtitle="Identity verification status" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verification Submitted</h2>
          <p className="text-gray-400">Your documents are under review. This usually takes 1-2 business days.</p>
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-gray-400">Uploaded Documents</p>
            <div className="flex flex-col gap-2 mt-3">
              {Object.entries(uploadedFiles).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#c8a822] hover:underline flex items-center gap-2">
                  <FileImage className="w-4 h-4" /> {key.replace("_", " ").toUpperCase()}
                </a>
              ))}
            </div>
          </div>
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
              <p className="text-sm text-gray-400">Upload clear, high-quality images. All files are encrypted and stored securely via Cloudflare R2.</p>

              {/* ID Front */}
              <div className="space-y-2">
                <Label className="text-gray-400 flex items-center gap-2">
                  ID Front {uploadedFiles.id_front && <CheckCircle className="w-4 h-4 text-green-400" />}
                </Label>
                <input ref={idFrontRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], "id_front")} />
                <div
                  onClick={() => idFrontRef.current?.click()}
                  onDrop={e => handleDrop(e, "id_front")}
                  onDragOver={e => e.preventDefault()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#c8a822]/30 transition-colors cursor-pointer"
                >
                  {uploading.id_front ? (
                    <Loader2 className="w-6 h-6 text-[#c8a822] animate-spin mx-auto" />
                  ) : uploadedFiles.id_front ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                      <span className="text-sm text-green-400">Uploaded successfully</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-[#c8a822]" />
                      <span className="text-sm text-gray-400">Click or drag to upload front of ID</span>
                      <span className="text-xs text-gray-500">JPG, PNG, WebP (max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ID Back */}
              <div className="space-y-2">
                <Label className="text-gray-400 flex items-center gap-2">
                  ID Back {uploadedFiles.id_back && <CheckCircle className="w-4 h-4 text-green-400" />}
                </Label>
                <input ref={idBackRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], "id_back")} />
                <div
                  onClick={() => idBackRef.current?.click()}
                  onDrop={e => handleDrop(e, "id_back")}
                  onDragOver={e => e.preventDefault()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#c8a822]/30 transition-colors cursor-pointer"
                >
                  {uploading.id_back ? (
                    <Loader2 className="w-6 h-6 text-[#c8a822] animate-spin mx-auto" />
                  ) : uploadedFiles.id_back ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                      <span className="text-sm text-green-400">Uploaded successfully</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-[#c8a822]" />
                      <span className="text-sm text-gray-400">Click or drag to upload back of ID</span>
                      <span className="text-xs text-gray-500">JPG, PNG, WebP (max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Selfie */}
              <div className="space-y-2">
                <Label className="text-gray-400 flex items-center gap-2">
                  Selfie {uploadedFiles.selfie && <CheckCircle className="w-4 h-4 text-green-400" />}
                </Label>
                <input ref={selfieRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], "selfie")} />
                <div
                  onClick={() => selfieRef.current?.click()}
                  onDrop={e => handleDrop(e, "selfie")}
                  onDragOver={e => e.preventDefault()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#c8a822]/30 transition-colors cursor-pointer"
                >
                  {uploading.selfie ? (
                    <Loader2 className="w-6 h-6 text-[#c8a822] animate-spin mx-auto" />
                  ) : uploadedFiles.selfie ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                      <span className="text-sm text-green-400">Uploaded successfully</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-[#c8a822]" />
                      <span className="text-sm text-gray-400">Click or drag to upload selfie</span>
                      <span className="text-xs text-gray-500">JPG, PNG, WebP (max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 border-white/10 text-white hover:bg-white/5">Back</Button>}
            {step < 3 ? <Button onClick={() => setStep(step + 1)} className="flex-1 bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90">Continue</Button>
            : <Button onClick={() => allDocsUploaded ? setSubmitted(true) : toast.error("Please upload all documents")} className="flex-1 bg-gradient-to-r from-[#c8a822] to-[#e8d48b] text-black font-semibold hover:opacity-90" disabled={!allDocsUploaded}>
              <Shield className="w-4 h-4 mr-2" /> Submit Verification
            </Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
