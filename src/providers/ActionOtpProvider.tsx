import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { cloudSendActionOTP, cloudSendActionEmailOTP, cloudVerifyActionOTP } from "@/lib/cloudStore";
import { toast } from "sonner";

type ActionType = "exchange" | "send" | "deposit" | "withdraw";
type OtpChannel = "sms" | "email";

interface ActionOtpContextValue {
  isOpen: boolean;
  action: ActionType | null;
  actionLabel: string;
  otp: string;
  loading: boolean;
  sending: boolean;
  phoneMask: string;
  emailMask: string;
  channel: OtpChannel;
  cooldown: number;
  openOtp: (action: ActionType, onVerified?: () => void) => void;
  closeOtp: () => void;
  setOtp: (otp: string) => void;
  sendOtp: () => Promise<void>;
  sendEmailOtp: () => Promise<void>;
  setChannel: (c: OtpChannel) => void;
  verifyOtp: () => Promise<boolean>;
  isVerified: (action: ActionType) => boolean;
  clearVerification: (action: ActionType) => void;
  requireOtp: (action: ActionType, onVerified: () => void) => boolean;
}

const ActionOtpContext = createContext<ActionOtpContextValue | null>(null);

export function useActionOtpContext() {
  const ctx = useContext(ActionOtpContext);
  if (!ctx) throw new Error("useActionOtpContext must be used within ActionOtpProvider");
  return ctx;
}

const ACTION_LABELS: Record<ActionType, string> = {
  exchange: "Exchange",
  send: "Send Money",
  deposit: "Deposit",
  withdraw: "Withdrawal",
};

export function ActionOtpProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [otp, setOtpState] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [phoneMask, setPhoneMask] = useState("");
  const [emailMask, setEmailMask] = useState("");
  const [channel, setChannel] = useState<OtpChannel>("sms");
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef<(() => void) | null>(null);

  const startCooldown = useCallback((seconds: number) => {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const openOtp = useCallback((a: ActionType, onVerified?: () => void) => {
    setAction(a);
    setOtpState("");
    setPhoneMask("");
    setEmailMask("");
    setChannel("sms");
    setCooldown(0);
    callbackRef.current = onVerified || null;
    setIsOpen(true);
  }, []);

  const closeOtp = useCallback(() => {
    setIsOpen(false);
    setAction(null);
    callbackRef.current = null;
    if (cooldownRef.current) clearInterval(cooldownRef.current);
  }, []);

  const setOtp = useCallback((v: string) => {
    setOtpState(v.replace(/\D/g, "").slice(0, 6));
  }, []);

  const sendOtp = useCallback(async () => {
    if (!action) return;
    setSending(true);
    try {
      const res = await cloudSendActionOTP(action);
      if (res.success) {
        toast.success(res.msg || "SMS OTP sent!");
        setPhoneMask(res.phoneMask || "");
        setChannel("sms");
        startCooldown(60);
      } else {
        toast.error(res.msg || "Failed to send SMS OTP");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSending(false);
    }
  }, [action, startCooldown]);

  const sendEmailOtp = useCallback(async () => {
    if (!action) return;
    setSending(true);
    try {
      const res = await cloudSendActionEmailOTP(action);
      if (res.success) {
        toast.success(res.msg || "Email OTP sent!");
        setEmailMask(res.emailMask || "");
        setChannel("email");
        startCooldown(60);
      } else {
        toast.error(res.msg || "Failed to send email OTP");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSending(false);
    }
  }, [action, startCooldown]);

  const verifyOtp = useCallback(async (): Promise<boolean> => {
    if (!action || !otp || otp.length < 6) {
      toast.error("Enter 6-digit OTP");
      return false;
    }
    setLoading(true);
    try {
      const res = await cloudVerifyActionOTP(action, otp);
      if (res.success && res.verified) {
        toast.success("Verified!");
        sessionStorage.setItem(`dx_otp_${action}`, res.token || "verified");
        const cb = callbackRef.current;
        closeOtp();
        if (cb) {
          setTimeout(() => cb(), 100);
        }
        return true;
      } else {
        toast.error(res.msg || "Invalid OTP");
        return false;
      }
    } catch {
      toast.error("Network error");
      return false;
    } finally {
      setLoading(false);
    }
  }, [action, otp, closeOtp]);

  const isVerified = useCallback((a: ActionType): boolean => {
    return !!sessionStorage.getItem(`dx_otp_${a}`);
  }, []);

  const clearVerification = useCallback((a: ActionType) => {
    sessionStorage.removeItem(`dx_otp_${a}`);
  }, []);

  const requireOtp = useCallback((a: ActionType, onVerified: () => void): boolean => {
    sessionStorage.removeItem(`dx_otp_${a}`);
    openOtp(a, onVerified);
    return false;
  }, [openOtp]);

  return (
    <ActionOtpContext.Provider
      value={{
        isOpen,
        action,
        actionLabel: action ? ACTION_LABELS[action] : "",
        otp,
        loading,
        sending,
        phoneMask,
        emailMask,
        channel,
        cooldown,
        openOtp,
        closeOtp,
        setOtp,
        sendOtp,
        sendEmailOtp,
        setChannel,
        verifyOtp,
        isVerified,
        clearVerification,
        requireOtp,
      }}
    >
      {children}
    </ActionOtpContext.Provider>
  );
}
