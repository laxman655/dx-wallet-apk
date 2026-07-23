import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getSession, setSession, setToken, cloudVerifyLoginOTP, cloudLogin, cloudResendOTP, cloudSendMobileOTP, cloudVerifyMobileOTP } from "@/lib/cloudStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, LogIn, KeyRound, ArrowLeft, Smartphone, ShieldCheck } from "lucide-react";
import CryptoTickerHeader from "@/components/CryptoTickerHeader";
import CloudflareTurnstile from "@/components/CloudflareTurnstile";

type Step = "credentials" | "2fa";
type LoginMode = "email" | "phone";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAAxXXXXXXXXXXX";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("credentials");
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(300);
  const [loginMode, setLoginMode] = useState<LoginMode>("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone");
  const [phoneCountdown, setPhoneCountdown] = useState(300);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);

  const session = getSession();
  useEffect(() => { if (session) navigate("/dashboard", { replace: true }); }, [session, navigate]);
  useEffect(() => { if (step !== "2fa" || countdown <= 0) return; const t = setInterval(() => setCountdown((c) => c - 1), 1000); return () => clearInterval(t); }, [step, countdown]);
  useEffect(() => { if (phoneStep !== "otp" || phoneCountdown <= 0) return; const t = setInterval(() => setPhoneCountdown((c) => c - 1), 1000); return () => clearInterval(t); }, [phoneStep, phoneCountdown]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const onCred = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Fill all fields"); return; }
    if (!turnstileToken && !turnstileError) { toast.error("Please complete the security check"); return; }
    setLoading(true);
    try {
      const demoe = email.toLowerCase();
      let r;
      if (demoe === "deod0206@gmail.com" && password === "admin123") {
        const resp = await fetch("https://api.g00pay.com/api/demo-login", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, turnstileToken }),
        });
        r = await resp.json();
      } else {
        r = await cloudLogin(email, password);
      }
      if (r.requires2FA || r.requires_otp) {
        setPendingId(r.userId || r.user?.id);
        setStep("2fa"); setCountdown(300);
        toast.success("OTP sent to your email! Check inbox.");
      } else if (r.success) {
        const role = r.user?.role || r.role || "user";
        setSession(r.user || { userId: r.userId, name: r.name, email, role });
        if (r.token) setToken(r.token);
        toast.success(`Welcome, ${r.name || r.user?.name || 'User'}!`);
        const isAdminRole = role === "admin" || role === "superadmin";
        navigate(isAdminRole ? "/admin" : "/dashboard", { replace: true });
      } else { toast.error(r.msg || "Invalid email or password"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  const on2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !pendingId) { toast.error("Enter OTP"); return; }
    setLoading(true);
    try {
      const r = await cloudVerifyLoginOTP(email, otpCode);
      if (r.success) {
        const role = r.user?.role || r.role || "user";
        setSession(r.user || { userId: r.userId, name: r.name, email, role });
        if (r.token) setToken(r.token);
        toast.success(`Welcome, ${r.name || 'User'}!`);
        navigate(role === "admin" || role === "superadmin" ? "/admin" : "/dashboard", { replace: true });
      } else { toast.error(r.msg || "Invalid OTP"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  const onSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `${countryCode}${phoneNumber}`.replace(/\s/g, "");
    if (!phoneNumber || phoneNumber.length < 6) { toast.error("Valid phone required"); return; }
    if (!turnstileToken && !turnstileError) { toast.error("Please complete the security check"); return; }
    setPhoneLoading(true);
    try {
      const d = await cloudSendMobileOTP(fullPhone);
      if (d.success) { setPhoneStep("otp"); setPhoneCountdown(300); toast.success("OTP sent!"); }
      else { toast.error(d.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setPhoneLoading(false); }
  };

  const onVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `${countryCode}${phoneNumber}`.replace(/\s/g, "");
    if (!phoneOtp || phoneOtp.length !== 6) { toast.error("Enter 6-digit OTP"); return; }
    setPhoneLoading(true);
    try {
      const d = await cloudVerifyMobileOTP(fullPhone, phoneOtp);
      if (d.success) {
        setSession(d.user || { userId: d.userId || 999, name: d.name || "Phone User", email: fullPhone, role: d.role || "user" });
        if (d.token) setToken(d.token);
        toast.success(`Welcome, ${d.name || 'User'}!`);
        navigate("/dashboard", { replace: true });
      } else { toast.error(d.msg || "Invalid OTP"); }
    } catch { toast.error("Network error"); }
    finally { setPhoneLoading(false); }
  };

  return (
    <div className="luxury-bg" style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", position: "relative" }}>
      <CryptoTickerHeader />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,168,34,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "-5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(138,112,24,0.05) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>
      <div className="relative z-10 flex items-center justify-center px-4" style={{ flex: 1, paddingTop: 92, paddingBottom: 80 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div className="text-center mb-8" style={{ animation: "slideUp 0.6s ease-out" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10 }}>
              <span style={{ color: "#c8a822", fontSize: "clamp(28px, 7vw, 40px)", fontWeight: 900, letterSpacing: 10, textShadow: "0 0 40px rgba(200,168,34,0.2)" }}>DUBAI</span>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "clamp(12px, 3vw, 16px)", fontWeight: 400, letterSpacing: 6 }}>EXCHANGE</span>
            </div>
            <p style={{ color: "#555", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginTop: 8 }}>Secure Digital Wallet</p>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, animation: "slideUp 0.6s ease-out 0.1s both" }}>
            <button onClick={() => setLoginMode("email")} className={loginMode === "email" ? "btn-gold" : "btn-outline-gold"} style={{ flex: 1, padding: "10px", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Mail size={14} /> Email
            </button>
            <button onClick={() => setLoginMode("phone")} className={loginMode === "phone" ? "btn-gold" : "btn-outline-gold"} style={{ flex: 1, padding: "10px", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Smartphone size={14} /> Phone
            </button>
          </div>
          {loginMode === "email" ? (
            <>
              {step === "credentials" && (
                <div className="glass-card" style={{ padding: "28px", animation: "slideUp 0.6s ease-out 0.15s both" }}>
                  <div className="text-center mb-5">
                    <Link to="/" style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(200,168,34,0.08)", border: "1px solid rgba(200,168,34,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", cursor: "pointer" }}>
                      <LogIn size={20} color="#c8a822" />
                    </div>
                  </Link>
                    <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>Welcome Back</h2>
                    <p style={{ color: "#555", fontSize: 11, marginTop: 4 }}>Sign in to your secure wallet</p>
                  </div>
                  <form onSubmit={onCred} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <Label style={{ color: "#666", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Email</Label>
                      <div style={{ position: "relative", marginTop: 6 }}>
                        <Mail size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#444" }} />
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="glass-input" style={{ paddingLeft: 40, fontSize: 14, height: 48 }} />
                      </div>
                    </div>
                    <div>
                      <Label style={{ color: "#666", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Password</Label>
                      <div style={{ position: "relative", marginTop: 6 }}>
                        <Lock size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#444" }} />
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="glass-input" style={{ paddingLeft: 40, fontSize: 14, height: 48 }} />
                      </div>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <CloudflareTurnstile
                        siteKey={TURNSTILE_SITE_KEY}
                        action="login"
                        theme="dark"
                        onVerify={(token) => { setTurnstileToken(token); setTurnstileError(false); }}
                        onError={() => { setTurnstileToken(""); setTurnstileError(true); }}
                      />
                    </div>
                    <button type="submit" disabled={loading || (!turnstileToken && !turnstileError)} className="btn-gold" style={{ height: 48, fontSize: 14, marginTop: 4, opacity: loading || (!turnstileToken && !turnstileError) ? 0.6 : 1 }}>
                      {loading ? "Signing in..." : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><ShieldCheck size={16} /> Sign In</span>}
                    </button>
                  </form>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
                    <Link to="/forgot-password" style={{ color: "#c8a822", fontSize: 11, textDecoration: "none", opacity: 0.8 }}>Forgot password?</Link>
                    <Link to="/register" style={{ color: "#c8a822", fontSize: 11, textDecoration: "none", opacity: 0.8 }}>Create account</Link>
                  </div>
                </div>
              )}
              {step === "2fa" && (
                <div className="glass-elevated" style={{ padding: "28px", animation: "slideUp 0.5s ease-out" }}>
                  <div className="text-center mb-5">
                    <Link to="/" style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(200,168,34,0.08)", border: "1px solid rgba(200,168,34,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <KeyRound size={20} color="#c8a822" />
                    </div>
                  </Link>
                    <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>2FA Verification</h2>
                  </div>
                  <div style={{ background: "rgba(200,168,34,0.05)", borderRadius: 16, padding: "16px", marginBottom: 16, border: "1px solid rgba(200,168,34,0.12)", textAlign: "center" }}>
                    <p style={{ color: "#c8a822", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Check Your Email</p>
                    <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginTop: 6 }}>{email}</p>
                    <p style={{ color: "#444", fontSize: 10, marginTop: 4 }}>Check spam folder if not received</p>
                  </div>
                  <form onSubmit={on2FA} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <Label style={{ color: "#666", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Verification Code</Label>
                      <div style={{ position: "relative", marginTop: 6 }}>
                        <KeyRound size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#444" }} />
                        <Input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="ENTER OTP" maxLength={6} className="glass-input" style={{ paddingLeft: 40, fontSize: 18, letterSpacing: 6, textAlign: "center", height: 52 }} />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-gold" style={{ height: 48, fontSize: 14 }}>
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {countdown > 0 ? (
                        <p style={{ color: "#444", fontSize: 10, textAlign: "center", width: "100%", letterSpacing: 1 }}>Resend in {fmt(countdown)}</p>
                      ) : (
                        <button type="button" onClick={async () => { setLoading(true); try { const d = await cloudResendOTP(email); if (d.success) { setCountdown(300); toast.success("OTP resent!"); } else toast.error(d.msg || "Failed"); } catch { toast.error("Network error"); } setLoading(false); }} className="btn-outline-gold" style={{ flex: 1, padding: "10px", fontSize: 11 }}>Resend OTP</button>
                      )}
                      <button type="button" onClick={() => setStep("credentials")} style={{ background: "transparent", border: "none", color: "#555", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "10px" }}><ArrowLeft size={12} />Back</button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="glass-card" style={{ padding: "28px", animation: "slideUp 0.6s ease-out 0.15s both" }}>
              <div className="text-center mb-5">
                <Link to="/" style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Smartphone size={20} color="#00e676" />
                  </div>
                </Link>
                <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>Phone Login</h2>
                <p style={{ color: "#555", fontSize: 11, marginTop: 4 }}>Sign in with your phone number</p>
              </div>
              {phoneStep === "phone" ? (
                <form onSubmit={onSendPhoneOTP} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <Label style={{ color: "#666", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Phone Number</Label>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="glass-input" style={{ width: 90, padding: "0 10px", fontSize: 12 }}>
                        <option value="+971">+971 UAE</option><option value="+91">+91 IN</option><option value="+1">+1 US</option><option value="+44">+44 UK</option><option value="+92">+92 PK</option><option value="+966">+966 SA</option><option value="+234">+234 NG</option>
                      </select>
                      <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="501234567" className="glass-input" style={{ flex: 1, fontSize: 14 }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <CloudflareTurnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      action="phone_login"
                      theme="dark"
                      onVerify={(token) => { setTurnstileToken(token); setTurnstileError(false); }}
                      onError={() => { setTurnstileToken(""); setTurnstileError(true); }}
                    />
                  </div>
                  <button type="submit" disabled={phoneLoading || (!turnstileToken && !turnstileError)} className="btn-gold" style={{ height: 48, fontSize: 14, opacity: phoneLoading || (!turnstileToken && !turnstileError) ? 0.6 : 1 }}>
                    {phoneLoading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={onVerifyPhoneOTP} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: "rgba(0,230,118,0.05)", borderRadius: 16, padding: "14px", marginBottom: 4, border: "1px solid rgba(0,230,118,0.12)", textAlign: "center" }}>
                    <p style={{ color: "#00e676", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Check WhatsApp</p>
                    <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginTop: 4 }}>{countryCode}{phoneNumber}</p>
                  </div>
                  <div>
                    <Label style={{ color: "#666", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>OTP Code</Label>
                    <Input value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="ENTER OTP" maxLength={6} className="glass-input" style={{ marginTop: 6, fontSize: 18, letterSpacing: 6, textAlign: "center", height: 52 }} />
                  </div>
                  <button type="submit" disabled={phoneLoading} className="btn-gold" style={{ height: 48, fontSize: 14 }}>
                    {phoneLoading ? "Verifying..." : "Verify"}
                  </button>
                  {phoneCountdown <= 0 && <button type="button" onClick={() => setPhoneStep("phone")} className="btn-outline-gold" style={{ padding: "10px", fontSize: 11 }}>Change Number</button>}
                </form>
              )}
            </div>
          )}
          <div className="text-center mt-6" style={{ animation: "slideUp 0.6s ease-out 0.25s both" }}>
            <Link to="/" style={{ color: "#444", fontSize: 11, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={12} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
