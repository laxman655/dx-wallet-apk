// Twilio Backend API Configuration
const API_BASE = "http://13.140.168.184:3001";

export const TWILIO_CONFIG = {
  apiBase: API_BASE,
  otpExpirySeconds: 300,
  resendDelaySeconds: 60,
};

export const COUNTRY_CODES = [
  { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
  { code: "US", name: "USA", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "UK", dial: "+44", flag: "🇬🇧" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "SA", name: "Saudi", dial: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", dial: "+973", flag: "🇧🇭" },
  { code: "OM", name: "Oman", dial: "+968", flag: "🇴🇲" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
];

export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message };
  } catch (e) {
    return { success: false, message: "Server unreachable. Check backend is running." };
  }
}

export async function sendOTPWhatsApp(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/send-otp-whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message };
  } catch (e) {
    return { success: false, message: "Server unreachable." };
  }
}

export async function verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber, code: otp }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message, token: data.token };
  } catch (e) {
    return { success: false, message: "Server unreachable." };
  }
}

export async function resendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message };
  } catch (e) {
    return { success: false, message: "Server unreachable." };
  }
}

export async function sendEmailOTP(email: string, purpose: string = "registration"): Promise<{ success: boolean; message: string; code?: string; sent?: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/send-email-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message, code: data.code, sent: data.sent };
  } catch (e) {
    return { success: false, message: "Backend server unreachable." };
  }
}

export async function verifyEmailOTP(email: string, code: string, purpose: string = "registration"): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/verify-email-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, purpose }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message, token: data.token };
  } catch (e) {
    return { success: false, message: "Backend server unreachable." };
  }
}

export async function verifyWhatsAppOTP(phone: string, code: string, purpose: string = "registration"): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/verify-whatsapp-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code, purpose }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message, token: data.token };
  } catch (e) {
    return { success: false, message: "Backend server unreachable." };
  }
}
