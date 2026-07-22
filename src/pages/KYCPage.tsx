import { useState } from "react";
import { cloudSubmitKYC } from "@/lib/cloudStore";
import { toast } from "sonner";
import PageTransition from "@/components/animations/PageTransition";

export default function KYCPage() {
  const [form, setForm] = useState({ fullName: "", dob: "", nationality: "", idType: "passport" as string, idNumber: "", idFront: "", idBack: "", selfie: "", address: "", city: "", country: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await cloudSubmitKYC(form);
      if (r.success) { toast.success("KYC submitted!"); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  const inp = { width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 12px", color: "#fff", fontSize: 14, outline: "none", marginBottom: 12 } as any;

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", paddingTop: 92 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>KYC Verification</h1>
          <div className="glass-card" style={{ padding: 24 }}>
            <form onSubmit={handleSubmit}>
              <input placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} style={inp} />
              <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} style={inp} />
              <input placeholder="Nationality" value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} style={inp} />
              <select value={form.idType} onChange={e => setForm({...form, idType: e.target.value})} style={inp}>
                <option value="passport">Passport</option>
                <option value="national_id">National ID</option>
                <option value="driving_license">Driving License</option>
              </select>
              <input placeholder="ID Number" value={form.idNumber} onChange={e => setForm({...form, idNumber: e.target.value})} style={inp} />
              <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={inp} />
              <input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={inp} />
              <input placeholder="Country" value={form.country} onChange={e => setForm({...form, country: e.target.value})} style={inp} />
              <button type="submit" disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14 }}>
                {loading ? "Submitting..." : "Submit KYC"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
