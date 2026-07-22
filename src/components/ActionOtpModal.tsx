import { useActionOtpContext } from "@/providers/ActionOtpProvider";
import { X } from "lucide-react";

export default function ActionOtpModal() {
  const { isOpen, closeOtp, otp, setOtp, sendOtp, verifyOtp, loading, sending, actionLabel, cooldown, phoneMask } = useActionOtpContext();

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}>
      <div className="glass-elevated" style={{ padding: 28, width: "90%", maxWidth: 360 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Verify {actionLabel}</h3>
          <button onClick={closeOtp} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
        </div>
        {phoneMask && <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Code sent to {phoneMask}</p>}
        <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6} className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 12, fontSize: 18, letterSpacing: 6, textAlign: "center" }} />
        <button onClick={verifyOtp} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14, marginBottom: 8 }}>
          {loading ? "Verifying..." : "Verify"}
        </button>
        <button onClick={sendOtp} disabled={sending || cooldown > 0} className="btn-outline-gold" style={{ width: "100%", padding: 10, fontSize: 12 }}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : sending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
