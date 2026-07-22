import { useState } from "react";
import { cloudForgotPassword, cloudResetPassword, cloudResendOTP } from "@/lib/cloudStore";
import { toast } from "sonner";
import PageTransition from "@/components/animations/PageTransition";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "newpw">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) { toast.error("Enter email"); return; }
    setLoading(true);
    try {
      const r = await cloudForgotPassword(email);
      if (r.success) { toast.success("OTP sent!"); setStep("otp"); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (!otp) { toast.error("Enter OTP"); return; }
    setStep("newpw");
  };

  const handleReset = async () => {
    if (!newPw || newPw.length < 8) { toast.error("Min 8 characters"); return; }
    setLoading(true);
    try {
      const r = await cloudResetPassword(email, otp, newPw);
      if (r.success) { toast.success("Password reset!"); window.location.replace("/#/login"); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Reset Password</h2>
            {step === "email" && (
              <>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 16 }} />
                <button onClick={handleSendOTP} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14 }}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}
            {step === "otp" && (
              <>
                <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 16 }} />
                <button onClick={handleVerifyOTP} className="btn-gold" style={{ width: "100%", padding: 14 }}>Verify OTP</button>
              </>
            )}
            {step === "newpw" && (
              <>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password (min 8 chars)" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 16 }} />
                <button onClick={handleReset} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14 }}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
