import { useState, useCallback, useRef } from "react";
import { cloudSendActionOTP, cloudVerifyActionOTP } from "@/lib/cloudStore";
import { toast } from "sonner";

type ActionType = "exchange" | "send" | "deposit" | "withdraw";

const ACTION_LABELS: Record<ActionType, string> = {
  exchange: "Exchange",
  send: "Send Money",
  deposit: "Deposit",
  withdraw: "Withdrawal",
};

export function useActionOtp() {
  const [state, setState] = useState({ isOpen: false, action: null as ActionType | null, targetPath: "", otp: "", loading: false, sending: false, phoneMask: "", cooldown: 0 });
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = useCallback((seconds: number) => {
    setState((p) => ({ ...p, cooldown: seconds }));
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setState((p) => {
        if (p.cooldown <= 1) { if (cooldownRef.current) clearInterval(cooldownRef.current); return { ...p, cooldown: 0 }; }
        return { ...p, cooldown: p.cooldown - 1 };
      });
    }, 1000);
  }, []);

  const openOtp = useCallback((action: ActionType, targetPath: string) => {
    setState({ isOpen: true, action, targetPath, otp: "", loading: false, sending: false, phoneMask: "", cooldown: 0 });
  }, []);

  const closeOtp = useCallback(() => {
    setState((p) => ({ ...p, isOpen: false }));
    if (cooldownRef.current) clearInterval(cooldownRef.current);
  }, []);

  const setOtp = useCallback((otp: string) => setState((p) => ({ ...p, otp: otp.replace(/\D/g, "").slice(0, 6) })), []);

  const sendOtp = useCallback(async () => {
    if (!state.action) return;
    setState((p) => ({ ...p, sending: true }));
    try {
      const res = await cloudSendActionOTP(state.action);
      if (res.success) { toast.success(res.msg || "OTP sent!"); setState((p) => ({ ...p, phoneMask: res.phoneMask || "" })); startCooldown(60); }
      else toast.error(res.msg || "Failed to send OTP");
    } catch { toast.error("Network error"); }
    finally { setState((p) => ({ ...p, sending: false })); }
  }, [state.action, startCooldown]);

  const verifyOtp = useCallback(async (): Promise<string | null> => {
    if (!state.action || !state.otp || state.otp.length < 6) { toast.error("Enter 6-digit OTP"); return null; }
    setState((p) => ({ ...p, loading: true }));
    try {
      const res = await cloudVerifyActionOTP(state.action, state.otp);
      if (res.success && res.verified) {
        toast.success("Verified!");
        sessionStorage.setItem(`dx_otp_${state.action}`, res.token || "verified");
        const path = state.targetPath;
        closeOtp();
        return path;
      } else toast.error(res.msg || "Invalid OTP");
    } catch { toast.error("Network error"); }
    finally { setState((p) => ({ ...p, loading: false })); }
    return null;
  }, [state.action, state.otp, state.targetPath, closeOtp]);

  const isVerified = useCallback((action: ActionType): boolean => !!sessionStorage.getItem(`dx_otp_${action}`), []);
  const clearVerification = useCallback((action: ActionType) => sessionStorage.removeItem(`dx_otp_${action}`), []);

  return { ...state, actionLabel: state.action ? ACTION_LABELS[state.action] : "", openOtp, closeOtp, setOtp, sendOtp, verifyOtp, isVerified, clearVerification };
}
