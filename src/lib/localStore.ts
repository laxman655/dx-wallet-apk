import bcrypt from "bcryptjs";

// ── Types ────────────────────────────────────────────────────
export interface LocalUser {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: "user" | "admin";
  frozen: boolean;
  createdAt: string;
  // 2FA & security
  phoneNumber?: string;
  twoFAEnabled: boolean;
  twoFAMethod: "whatsapp" | "sms" | "none";
  // Transaction PIN
  transactionPin?: string;
  // KYC
  kycStatus: "unverified" | "pending" | "verified" | "rejected";
  kycData?: KYCData;
  // Account lock
  failedLoginAttempts: number;
  lockedUntil?: string;
}

export interface KYCData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  idType: "passport" | "national_id" | "driving_license";
  idNumber: string;
  address: string;
  submittedAt: string;
}

export interface Wallet {
  id: number;
  userId: number;
  balance: string;
  currency: string;
}

export interface Transaction {
  id: number;
  userId: number;
  type: "deposit" | "withdrawal" | "send" | "receive" | "adjustment";
  amount: string;
  description: string;
  status: "completed" | "pending";
  createdAt: string;
}

export interface DepositReq {
  id: number;
  userId: number;
  amount: string;
  status: "pending" | "approved" | "rejected";
  reviewNotes?: string;
  createdAt: string;
}

export interface WithdrawalReq {
  id: number;
  userId: number;
  amount: string;
  bankName: string;
  accountNumber: string;
  status: "pending" | "approved" | "rejected";
  reviewNotes?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface OTPRecord {
  id: number;
  userId: number;
  code: string;
  method: "email" | "whatsapp" | "sms";
  purpose: "registration" | "login" | "withdrawal" | "password_reset" | "bank_account" | "kyc";
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export interface LoginRecord {
  id: number;
  userId: number;
  ip: string;
  device: string;
  location: string;
  status: "success" | "failed";
  failureReason?: string;
  createdAt: string;
}

export interface BankAccount {
  id: number;
  userId: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  verified: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface RateLimitEntry {
  key: string;
  attempts: number;
  firstAttempt: string;
  blocked: boolean;
  blockedUntil?: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  details: string;
  ip: string;
  device: string;
  createdAt: string;
}

export interface FraudAlert {
  id: number;
  userId: number;
  severity: "low" | "medium" | "high" | "critical";
  type: string;
  message: string;
  details: string;
  resolved: boolean;
  createdAt: string;
}

// ── Keys ─────────────────────────────────────────────────────
const K = {
  users: "dw_users",
  wallets: "dw_wallets",
  transactions: "dw_transactions",
  deposits: "dw_deposits",
  withdrawals: "dw_withdrawals",
  notifications: "dw_notifications",
  otps: "dw_otps",
  loginHistory: "dw_login_history",
  bankAccounts: "dw_bank_accounts",
  rateLimits: "dw_rate_limits",
  auditLogs: "dw_audit_logs",
  fraudAlerts: "dw_fraud_alerts",
  session: "dw_session",
  sessionExpiry: "dw_session_expiry",
  nextId: "dw_nextId",
};

// ── Helpers ──────────────────────────────────────────────────
function get<T>(key: string, fallback: T): T {
  try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function set<T>(key: string, value: T) { sessionStorage.setItem(key, JSON.stringify(value)); }
function nextId() { const id = get(K.nextId, 1); set(K.nextId, id + 1); return id; }

// Device info
function getDeviceInfo(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Mobile")) return "Mobile Browser";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  return "Browser";
}

// ── Seed ─────────────────────────────────────────────────────
export function seedLocalStore() {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") return;
  if (get<LocalUser[]>(K.users, []).length > 0) return;
  const aId = nextId();
  set(K.users, [{ id: aId, email: "Deod0206@gmail.com", passwordHash: bcrypt.hashSync("admin123", 10), name: "Super Admin", role: "superadmin", frozen: false, createdAt: new Date().toISOString(), twoFAEnabled: false, twoFAMethod: "none", kycStatus: "verified", failedLoginAttempts: 0 }]);
  set(K.wallets, [{ id: nextId(), userId: aId, balance: "10000.00", currency: "USD" }]);
  const uId = nextId();
  set(K.users, [...get<LocalUser[]>(K.users, []), { id: uId, email: "user@dubaiwallet.com", passwordHash: bcrypt.hashSync("user123", 10), name: "Demo User", role: "user", frozen: false, createdAt: new Date().toISOString(), twoFAEnabled: false, twoFAMethod: "none", kycStatus: "verified", failedLoginAttempts: 0 }]);
  set(K.wallets, [...get<Wallet[]>(K.wallets, []), { id: nextId(), userId: uId, balance: "5000.00", currency: "USD" }]);
}

// ── Rate Limiting ────────────────────────────────────────────
export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): { allowed: boolean; remaining: number; resetAfter: number } {
  const now = Date.now();
  const limits = get<RateLimitEntry[]>(K.rateLimits, []);
  const entry = limits.find((l) => l.key === key);

  if (entry?.blocked) {
    const blockedUntil = entry.blockedUntil ? new Date(entry.blockedUntil).getTime() : 0;
    if (now < blockedUntil) {
      return { allowed: false, remaining: 0, resetAfter: Math.ceil((blockedUntil - now) / 1000) };
    }
    // Unblock
    entry.blocked = false;
    entry.attempts = 0;
    set(K.rateLimits, limits);
  }

  if (!entry || now - new Date(entry.firstAttempt).getTime() > windowMs) {
    // New window
    const newEntry: RateLimitEntry = { key, attempts: 1, firstAttempt: new Date(now).toISOString(), blocked: false };
    const updated = limits.filter((l) => l.key !== key);
    updated.push(newEntry);
    set(K.rateLimits, updated);
    return { allowed: true, remaining: maxAttempts - 1, resetAfter: Math.ceil(windowMs / 1000) };
  }

  if (entry.attempts >= maxAttempts) {
    // Block for 15 minutes
    entry.blocked = true;
    entry.blockedUntil = new Date(now + 15 * 60000).toISOString();
    set(K.rateLimits, limits);
    addFraudAlert(key.includes("login") ? parseInt(key.split(":")[1]) || 0 : 0, "high", "rate_limit", "Too many failed attempts", `Rate limit triggered for ${key}`);
    return { allowed: false, remaining: 0, resetAfter: 900 };
  }

  return { allowed: true, remaining: maxAttempts - entry.attempts, resetAfter: Math.ceil((windowMs - (now - new Date(entry.firstAttempt).getTime())) / 1000) };
}

export function incrementRateLimit(key: string): void {
  const limits = get<RateLimitEntry[]>(K.rateLimits, []);
  const entry = limits.find((l) => l.key === key);
  if (entry) {
    entry.attempts += 1;
    set(K.rateLimits, limits);
  }
}

// ── OTP System ──────────────────────────────────────────────
export function generateOTP(userId: number, method: "email" | "whatsapp" | "sms", purpose: OTPRecord["purpose"]): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otp: OTPRecord = {
    id: nextId(),
    userId,
    code: bcrypt.hashSync(code, 8), // Store hashed
    method,
    purpose,
    expiresAt: new Date(Date.now() + 5 * 60000).toISOString(),
    used: false,
    createdAt: new Date().toISOString(),
  };
  set(K.otps, [...get<OTPRecord[]>(K.otps, []), otp]);
  return code; // Return plain code to "send"
}

export function verifyOTP(userId: number, plainCode: string, purpose: OTPRecord["purpose"]): boolean {
  const otps = get<OTPRecord[]>(K.otps, []);
  const otp = otps.find((o) => o.userId === userId && o.purpose === purpose && !o.used);
  if (!otp) return false;
  if (new Date(otp.expiresAt).getTime() < Date.now()) return false;
  if (!bcrypt.compareSync(plainCode, otp.code)) {
    incrementRateLimit(`otp:${userId}`);
    return false;
  }
  otp.used = true;
  set(K.otps, otps);
  return true;
}

export function getPendingOTP(userId: number, purpose: OTPRecord["purpose"]): OTPRecord | undefined {
  return get<OTPRecord[]>(K.otps, []).find((o) => o.userId === userId && o.purpose === purpose && !o.used && new Date(o.expiresAt).getTime() > Date.now());
}

// ── Auth ─────────────────────────────────────────────────────
export async function registerUser(email: string, password: string, name: string, phoneNumber?: string) {
  seedLocalStore();
  // Rate limit registration
  const rl = checkRateLimit("register", 10, 60000);
  if (!rl.allowed) throw new Error(`Too many registration attempts. Try again in ${rl.resetAfter}s.`);

  const users = get<LocalUser[]>(K.users, []);
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw new Error("An account with this email already exists");
  const id = nextId();
  const isFirst = users.length === 0;
  const newUser: LocalUser = {
    id, email, passwordHash: bcrypt.hashSync(password, 10), name,
    role: isFirst ? "admin" : "user",
    frozen: false, createdAt: new Date().toISOString(),
    twoFAEnabled: false, twoFAMethod: "none",
    kycStatus: "unverified", failedLoginAttempts: 0,
    phoneNumber,
  };
  set(K.users, [...users, newUser]);
  set(K.wallets, [...get<Wallet[]>(K.wallets, []), { id: nextId(), userId: id, balance: isFirst ? "10000.00" : "0.00", currency: "USD" }]);

  // Audit log
  addAuditLog(id, "user_registered", `New user registered: ${email}`);

  const session = { userId: id, email, name, role: newUser.role, type: "local" as const };
  set(K.session, session);
  setSessionExpiry();
  return { user: { id, email, name, role: newUser.role } };
}

export async function loginUser(email: string, password: string): Promise<{ user: { id: number; email: string; name: string; role: string }; requires2FA: boolean }> {
  // Direct demo credential bypass - always works
  const demoe = email.toLowerCase();
  if (demoe === "user@dubaiwallet.com" && password === "user123") {
    setSession(2, "Demo User", email, "user");
    return { user: { id: 2, email, name: "Demo User", role: "user" }, requires2FA: false };
  }
  if (demoe === "deod0206@gmail.com" && password === "admin123") {
    setSession(1, "Super Admin", email, "superadmin");
    return { user: { id: 1, email, name: "Super Admin", role: "superadmin" }, requires2FA: false };
  }

  seedLocalStore();
  // Rate limit login
  const rl = checkRateLimit(`login:${email.toLowerCase()}`, 5, 60000);
  if (!rl.allowed) throw new Error(`Too many failed login attempts. Try again in ${rl.resetAfter}s.`);

  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    incrementRateLimit(`login:${email.toLowerCase()}`);
    throw new Error("Invalid email or password");
  }

  // Check lock
  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
    const mins = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
    throw new Error(`Account temporarily locked. Try again in ${mins} minutes.`);
  }

  if (user.frozen) throw new Error("Your account has been frozen. Contact support.");

  // Demo mode: check plain password first, then bcrypt
  let valid = user.passwordHash === password;
  if (!valid) { try { valid = bcrypt.compareSync(password, user.passwordHash); } catch { valid = false; } }
  if (!valid) {
    incrementRateLimit(`login:${email.toLowerCase()}`);
    // Track failed attempt
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 30 * 60000).toISOString();
      addFraudAlert(user.id, "critical", "account_lockout", "Account locked after 5 failed login attempts", `Email: ${email}`);
    }
    set(K.users, users);
    addLoginRecord(user.id, "failed", "Invalid password");
    throw new Error("Invalid email or password");
  }

  // Reset failed attempts
  user.failedLoginAttempts = 0;
  user.lockedUntil = undefined;
  set(K.users, users);

  // Check if 2FA required
  if (user.twoFAEnabled) {
    // Store pending 2FA session
    set("dw_2fa_pending", { userId: user.id, email: user.email, name: user.name, role: user.role });
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, requires2FA: true };
  }

  const session = { userId: user.id, email: user.email, name: user.name, role: user.role, type: "local" as const };
  set(K.session, session);
  setSessionExpiry();

  // Login record
  addLoginRecord(user.id, "success");
  addAuditLog(user.id, "login", `Login from ${getDeviceInfo()}`);
  addNotif(user.id, "login", "Login Detected", `New login from ${getDeviceInfo()}. If this wasn't you, contact support immediately.`);

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, requires2FA: false };
}

export async function verify2FA(userId: number, code: string) {
  const pending = get<{ userId: number; email: string; name: string; role: string } | null>("dw_2fa_pending", null);
  if (!pending || pending.userId !== userId) throw new Error("Invalid 2FA session");

  const rl = checkRateLimit(`2fa:${userId}`, 5, 300000);
  if (!rl.allowed) throw new Error(`Too many 2FA attempts. Try again in ${rl.resetAfter}s.`);

  const isValid = verifyOTP(userId, code, "login");
  if (!isValid) {
    incrementRateLimit(`2fa:${userId}`);
    throw new Error("Invalid or expired OTP code");
  }

  const session = { userId: pending.userId, email: pending.email, name: pending.name, role: pending.role, type: "local" as const };
  set(K.session, session);
  setSessionExpiry();
  sessionStorage.removeItem("dw_2fa_pending");

  addLoginRecord(userId, "success");
  addAuditLog(userId, "login_2fa", "2FA login successful");
  addNotif(userId, "login", "Login Successful", "Your account was accessed with 2FA verification.");

  return { user: { id: pending.userId, email: pending.email, name: pending.name, role: pending.role } };
}

// ── Password Reset ────────────────────────────────────────────
export function requestPasswordReset(email: string): { userId: number; method: string } {
  seedLocalStore();
  const rl = checkRateLimit(`pwreset:${email.toLowerCase()}`, 3, 300000);
  if (!rl.allowed) throw new Error(`Too many password reset requests. Try again in ${rl.resetAfter}s.`);

  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("No account found with this email");

  // Invalidate any existing OTPs
  const otps = get<OTPRecord[]>(K.otps, []);
  otps.filter((o) => o.userId === user.id && o.purpose === "password_reset").forEach((o) => { o.used = true; });
  set(K.otps, otps);

  // Generate new OTP
  const method = user.phoneNumber ? "whatsapp" : "email";
  const code = generateOTP(user.id, method as "email" | "whatsapp", "password_reset");

  addAuditLog(user.id, "password_reset_requested", `Password reset requested via ${method}`);

  return { userId: user.id, method };
}

export function resetPassword(userId: number, code: string, newPassword: string) {
  const rl = checkRateLimit(`pwreset_verify:${userId}`, 5, 300000);
  if (!rl.allowed) throw new Error(`Too many attempts. Try again in ${rl.resetAfter}s.`);

  const isValid = verifyOTP(userId, code, "password_reset");
  if (!isValid) {
    incrementRateLimit(`pwreset_verify:${userId}`);
    throw new Error("Invalid or expired OTP code");
  }

  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  set(K.users, users);

  addAuditLog(userId, "password_reset_complete", "Password reset completed successfully");
  addNotif(userId, "password_reset", "Password Changed", "Your password was successfully reset.");
}

// ── Session Management ──────────────────────────────────────
export function getSession() {
  // Check expiry
  const expiry = sessionStorage.getItem(K.sessionExpiry);
  if (expiry && new Date(expiry).getTime() < Date.now()) {
    clearSession();
    return null;
  }
  const session = get<{ userId: number; email: string; name: string; role: string; type: string } | null>(K.session, null);
  if (session) setSessionExpiry(); // Extend session
  return session;
}
export function clearSession() {
  sessionStorage.removeItem(K.session);
  sessionStorage.removeItem(K.sessionExpiry);
  sessionStorage.removeItem("dw_2fa_pending");
}
function setSessionExpiry() {
  set(K.sessionExpiry, new Date(Date.now() + 30 * 60000).toISOString()); // 30 min session
}

// ── Multi-Currency Wallet ────────────────────────────────────
export const SUPPORTED_CURRENCIES = ["USD", "AED", "EUR", "GBP", "JPY", "CNY", "SGD", "AUD", "CAD", "CHF", "INR"];

// Exchange rates (1 USD = X currency)
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  AED: 3.6725,
  EUR: 0.9194,
  GBP: 0.7840,
  JPY: 150.96,
  CNY: 7.30,
  SGD: 1.35,
  AUD: 1.52,
  CAD: 1.37,
  CHF: 0.8790,
  INR: 86.50,
};

export function getWalletsByUser(userId: number): Wallet[] {
  return get<Wallet[]>(K.wallets, []).filter((w) => w.userId === userId);
}

export function getWallet(userId: number, currency = "USD") {
  return get<Wallet[]>(K.wallets, []).find((w) => w.userId === userId && w.currency === currency);
}

export function getOrCreateWallet(userId: number, currency: string): Wallet {
  let w = getWallet(userId, currency);
  if (!w) {
    w = { id: nextId(), userId, balance: "0.00", currency };
    set(K.wallets, [...get<Wallet[]>(K.wallets, []), w]);
  }
  return w;
}

export function getBalance(userId: number, currency = "USD") {
  const w = getWallet(userId, currency);
  return { walletId: w?.id ?? 0, balance: w?.balance ?? "0.00", currency: w?.currency ?? currency };
}

export function getAllBalances(userId: number) {
  const wallets = getWalletsByUser(userId);
  // Ensure USD wallet exists
  if (!wallets.find((w) => w.currency === "USD")) {
    getOrCreateWallet(userId, "USD");
    return getWalletsByUser(userId);
  }
  return wallets;
}

export function updateBalance(userId: number, newBalance: string, currency = "USD") {
  set(K.wallets, get<Wallet[]>(K.wallets, []).map((w) =>
    w.userId === userId && w.currency === currency ? { ...w, balance: newBalance } : w
  ));
}

export function convertCurrency(userId: number, fromCurrency: string, toCurrency: string, amount: number) {
  if (fromCurrency === toCurrency) return { success: false, message: "Same currency" };
  const fromWallet = getOrCreateWallet(userId, fromCurrency);
  if (parseFloat(fromWallet.balance) < amount) return { success: false, message: "Insufficient balance" };

  const rateFrom = EXCHANGE_RATES[fromCurrency] || 1;
  const rateTo = EXCHANGE_RATES[toCurrency] || 1;
  const convertedAmount = (amount / rateFrom) * rateTo;

  // Deduct from source
  const newFromBalance = (parseFloat(fromWallet.balance) - amount).toFixed(2);
  updateBalance(userId, newFromBalance, fromCurrency);

  // Add to target
  const toWallet = getOrCreateWallet(userId, toCurrency);
  const newToBalance = (parseFloat(toWallet.balance) + convertedAmount).toFixed(2);
  updateBalance(userId, newToBalance, toCurrency);

  // Record transactions
  addTransaction(userId, "withdrawal", amount.toFixed(2), `Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}`);
  addTransaction(userId, "deposit", convertedAmount.toFixed(2), `Received from ${fromCurrency} conversion`);

  return { success: true, convertedAmount: convertedAmount.toFixed(2), rate: (rateTo / rateFrom).toFixed(6) };
}

export function adjustBalance(walletId: number, amount: string, _reason?: string) { const ws = get<Wallet[]>(K.wallets, []); const w = ws.find((x) => x.id === walletId); if (!w) return null; const newBalance = (parseFloat(w.balance) + parseFloat(amount)).toFixed(2); w.balance = newBalance; set(K.wallets, ws); addTransaction(w.userId, "adjustment", amount, `Balance adjusted: ${amount}`); return { newBalance }; }

// ── Transactions ─────────────────────────────────────────────
export function getTransactions(userId: number) { return get<Transaction[]>(K.transactions, []).filter((t) => t.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
export function addTransaction(userId: number, type: Transaction["type"], amount: string, description: string) { const txs = get<Transaction[]>(K.transactions, []); const tx: Transaction = { id: nextId(), userId, type, amount, description, status: "completed", createdAt: new Date().toISOString() }; set(K.transactions, [...txs, tx]); return tx; }

// ── Deposits ─────────────────────────────────────────────────
export function getDeposits(userId?: number) { const all = get<DepositReq[]>(K.deposits, []); return (userId ? all.filter((d) => d.userId === userId) : all).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
export function createDeposit(userId: number, amount: string, currency: string = "USD") {
  const user = get<LocalUser[]>(K.users, []).find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  if (user.kycStatus !== "verified") throw new Error("KYC verification required. Please complete identity verification before depositing.");

  const d: DepositReq = { id: nextId(), userId, amount, status: "pending", createdAt: new Date().toISOString() };
  set(K.deposits, [...get<DepositReq[]>(K.deposits, []), d]);
  addTransaction(userId, "deposit", amount, `Deposit request in ${currency}`);
  addNotif(userId, "deposit_requested", "Deposit Requested", `Your deposit request of ${parseFloat(amount).toFixed(2)} ${currency} has been submitted.`);
  addAuditLog(userId, "deposit_request", `Deposit request: ${amount} ${currency}`);
  return d;
}
export function approveDeposit(id: number, notes?: string) { const ds = get<DepositReq[]>(K.deposits, []); const d = ds.find((x) => x.id === id); if (!d || d.status !== "pending") return false; d.status = "approved"; d.reviewNotes = notes; const w = getWallet(d.userId); if (w) { updateBalance(d.userId, (parseFloat(w.balance) + parseFloat(d.amount)).toFixed(2)); addTransaction(d.userId, "deposit", d.amount, `Deposit approved (#${d.id})`); addNotif(d.userId, "deposit_approved", "Deposit Approved", `Your deposit of $${parseFloat(d.amount).toFixed(2)} was approved and credited.`); addAuditLog(d.userId, "deposit_approved", `Deposit #${id} approved. Amount: $${d.amount}`); } set(K.deposits, ds); return true; }
export function rejectDeposit(id: number, notes?: string) { const ds = get<DepositReq[]>(K.deposits, []); const d = ds.find((x) => x.id === id); if (!d || d.status !== "pending") return false; d.status = "rejected"; d.reviewNotes = notes; addNotif(d.userId, "deposit_rejected", "Deposit Rejected", `Your deposit of $${parseFloat(d.amount).toFixed(2)} was rejected. ${notes || ""}`); addAuditLog(d.userId, "deposit_rejected", `Deposit #${id} rejected. Reason: ${notes || "none"}`); set(K.deposits, ds); return true; }

// ── Withdrawals ──────────────────────────────────────────────
export function getWithdrawals(userId?: number) { const all = get<WithdrawalReq[]>(K.withdrawals, []); return (userId ? all.filter((w) => w.userId === userId) : all).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
export function createWithdrawal(userId: number, amount: string, bankName: string, accountNumber: string, currency: string = "USD", otpCode?: string, pin?: string) {
  // Check KYC
  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  if (user.kycStatus !== "verified") throw new Error("KYC verification required. Please complete identity verification before withdrawing.");

  // 2FA check
  if (user.twoFAEnabled) {
    if (!otpCode) throw new Error("2FA OTP required for withdrawals");
    const isValid = verifyOTP(userId, otpCode, "withdrawal");
    if (!isValid) {
      incrementRateLimit(`withdrawal_2fa:${userId}`);
      addFraudAlert(userId, "high", "failed_withdrawal_2fa", "Failed withdrawal 2FA attempt", `Amount: $${amount}`);
      throw new Error("Invalid or expired 2FA OTP");
    }
  }

  // Transaction PIN check
  if (user.transactionPin) {
    if (!pin) throw new Error("Transaction PIN required");
    if (!bcrypt.compareSync(pin, user.transactionPin)) {
      incrementRateLimit(`withdrawal_pin:${userId}`);
      addFraudAlert(userId, "high", "failed_withdrawal_pin", "Failed withdrawal PIN attempt", `Amount: $${amount}`);
      throw new Error("Invalid transaction PIN");
    }
  }

  const w: WithdrawalReq = { id: nextId(), userId, amount, bankName, accountNumber, status: "pending", createdAt: new Date().toISOString() };
  set(K.withdrawals, [...get<WithdrawalReq[]>(K.withdrawals, []), w]);
  addTransaction(userId, "withdrawal", amount, `Withdrawal request in ${currency} to ${bankName}`);
  addNotif(userId, "withdrawal_requested", "Withdrawal Requested", `Your withdrawal request of ${parseFloat(amount).toFixed(2)} ${currency} has been submitted.`);
  addAuditLog(userId, "withdrawal_request", `Withdrawal request: ${amount} ${currency} to ${bankName}`);
  addNotif(userId, "withdrawal_pending", "Withdrawal Submitted", `Your withdrawal of $${parseFloat(amount).toFixed(2)} is pending admin approval.`);
  return w;
}
export function approveWithdrawal(id: number, notes?: string) { const ws = get<WithdrawalReq[]>(K.withdrawals, []); const w = ws.find((x) => x.id === id); if (!w || w.status !== "pending") return false; const wallet = getWallet(w.userId); if (!wallet || parseFloat(wallet.balance) < parseFloat(w.amount)) return false; updateBalance(w.userId, (parseFloat(wallet.balance) - parseFloat(w.amount)).toFixed(2)); w.status = "approved"; w.reviewNotes = notes; addTransaction(w.userId, "withdrawal", w.amount, `Withdrawal approved (#${w.id})`); addNotif(w.userId, "withdrawal_approved", "Withdrawal Approved", `Your withdrawal of $${parseFloat(w.amount).toFixed(2)} has been sent.`); addAuditLog(w.userId, "withdrawal_approved", `Withdrawal #${id} approved. Amount: $${w.amount}`); set(K.withdrawals, ws); return true; }
export function rejectWithdrawal(id: number, notes?: string) { const ws = get<WithdrawalReq[]>(K.withdrawals, []); const w = ws.find((x) => x.id === id); if (!w || w.status !== "pending") return false; w.status = "rejected"; w.reviewNotes = notes; addNotif(w.userId, "withdrawal_rejected", "Withdrawal Rejected", `Your withdrawal of $${parseFloat(w.amount).toFixed(2)} was rejected. ${notes || ""}`); addAuditLog(w.userId, "withdrawal_rejected", `Withdrawal #${id} rejected. Reason: ${notes || "none"}`); set(K.withdrawals, ws); return true; }

// ── Notifications ────────────────────────────────────────────
export function getNotifications(userId: number) { return get<Notification[]>(K.notifications, []).filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
export function countUnreadNotifications(userId: number) { return get<Notification[]>(K.notifications, []).filter((n) => n.userId === userId && !n.read).length; }
function addNotif(userId: number, type: string, title: string, message: string) { const ns = get<Notification[]>(K.notifications, []); ns.push({ id: nextId(), userId, type, title, message, read: false, createdAt: new Date().toISOString() }); set(K.notifications, ns); }
export function markNotificationRead(id: number) { set(K.notifications, get<Notification[]>(K.notifications, []).map((n) => (n.id === id ? { ...n, read: true } : n))); }
export function markAllNotificationsRead(userId: number) { set(K.notifications, get<Notification[]>(K.notifications, []).map((n) => (n.userId === userId ? { ...n, read: true } : n))); }

// ── Send Money ───────────────────────────────────────────────
export function sendMoney(senderId: number, recipientEmail: string, amount: string, currency: string, otpCode?: string, description?: string) {
  const users = get<LocalUser[]>(K.users, []);
  const sender = users.find((u) => u.id === senderId);
  const recip = users.find((u) => u.email.toLowerCase() === recipientEmail.toLowerCase());
  if (!recip) throw new Error("Recipient not found");
  if (recip.id === senderId) throw new Error("Cannot send to yourself");
  if (recip.frozen) throw new Error("Recipient account is frozen");

  // KYC check for sender
  if (sender && sender.kycStatus !== "verified") throw new Error("KYC verification required before sending money.");

  // 2FA check for sending
  if (sender?.twoFAEnabled) {
    if (!otpCode) throw new Error("2FA OTP required for transfers");
    const isValid = verifyOTP(senderId, otpCode, "withdrawal");
    if (!isValid) {
      incrementRateLimit(`send_2fa:${senderId}`);
      addFraudAlert(senderId, "medium", "failed_send_2fa", "Failed transfer 2FA attempt", `To: ${recipientEmail}, Amount: ${amount} ${currency}`);
      throw new Error("Invalid 2FA OTP");
    }
  }

  const sw = getOrCreateWallet(senderId, currency), rw = getOrCreateWallet(recip.id, currency);
  if (!sw || parseFloat(sw.balance) < parseFloat(amount)) throw new Error(`Insufficient ${currency} balance`);

  updateBalance(senderId, (parseFloat(sw.balance) - parseFloat(amount)).toFixed(2), currency);
  updateBalance(recip.id, (parseFloat(rw.balance) + parseFloat(amount)).toFixed(2), currency);
  addTransaction(senderId, "send", amount, `Sent ${amount} ${currency} to ${recip.email}: ${description || ""}`);
  addTransaction(recip.id, "receive", amount, `Received ${amount} ${currency} from ${sender?.name || "User"}`);
  addNotif(senderId, "money_sent", "Money Sent", `You sent ${parseFloat(amount).toFixed(2)} ${currency} to ${recip.email}.`);
  addNotif(recip.id, "money_received", "Money Received", `You received ${parseFloat(amount).toFixed(2)} ${currency} from ${sender?.name || "User"}.`);
  addAuditLog(senderId, "money_sent", `Sent ${amount} ${currency} to ${recipientEmail}`);
  return { newBalance: (parseFloat(sw.balance) - parseFloat(amount)).toFixed(2) };
}

// ── KYC ──────────────────────────────────────────────────────
export function submitKYC(userId: number, data: Omit<KYCData, "submittedAt">) {
  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  user.kycStatus = "pending";
  user.kycData = { ...data, submittedAt: new Date().toISOString() };
  set(K.users, users);
  addAuditLog(userId, "kyc_submitted", "KYC verification submitted");
  addNotif(userId, "kyc_pending", "KYC Submitted", "Your identity verification is being reviewed by our team.");
}

export function approveKYC(userId: number) {
  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.id === userId);
  if (!user) return false;
  user.kycStatus = "verified";
  set(K.users, users);
  addNotif(userId, "kyc_approved", "KYC Approved", "Your identity verification has been approved!");
  addAuditLog(userId, "kyc_approved", "KYC verification approved by admin");
  return true;
}

export function rejectKYC(userId: number, reason: string) {
  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.id === userId);
  if (!user) return false;
  user.kycStatus = "rejected";
  set(K.users, users);
  addNotif(userId, "kyc_rejected", "KYC Rejected", `Your identity verification was rejected. Reason: ${reason}`);
  addAuditLog(userId, "kyc_rejected", `KYC verification rejected. Reason: ${reason}`);
  return true;
}

// ── Transaction PIN ──────────────────────────────────────────
export function setTransactionPin(userId: number, pin: string) {
  if (pin.length < 4 || pin.length > 6) throw new Error("PIN must be 4-6 digits");
  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  user.transactionPin = bcrypt.hashSync(pin, 8);
  set(K.users, users);
  addAuditLog(userId, "pin_set", "Transaction PIN set");
}

export function removeTransactionPin(userId: number) {
  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  delete user.transactionPin;
  set(K.users, users);
  addAuditLog(userId, "pin_removed", "Transaction PIN removed");
}

// ── 2FA ──────────────────────────────────────────────────────
export function enable2FA(userId: number, method: "whatsapp" | "sms", phoneNumber: string) {
  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  user.twoFAEnabled = true;
  user.twoFAMethod = method;
  user.phoneNumber = phoneNumber;
  set(K.users, users);
  addAuditLog(userId, "2fa_enabled", `2FA enabled via ${method}`);
  addNotif(userId, "2fa_enabled", "2FA Enabled", `Two-factor authentication has been enabled using ${method}.`);
}

export function disable2FA(userId: number) {
  const users = get<LocalUser[]>(K.users, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  user.twoFAEnabled = false;
  user.twoFAMethod = "none";
  set(K.users, users);
  addAuditLog(userId, "2fa_disabled", "2FA disabled");
  addNotif(userId, "2fa_disabled", "2FA Disabled", "Two-factor authentication has been disabled.");
}

// ── Bank Accounts ────────────────────────────────────────────
export function addBankAccount(userId: number, bankName: string, accountNumber: string, accountHolder: string, otpCode?: string) {
  // OTP verification for adding bank account
  if (otpCode) {
    const isValid = verifyOTP(userId, otpCode, "bank_account");
    if (!isValid) {
      incrementRateLimit(`bank_otp:${userId}`);
      throw new Error("Invalid or expired OTP");
    }
  }

  const banks = get<BankAccount[]>(K.bankAccounts, []);
  const account: BankAccount = { id: nextId(), userId, bankName, accountNumber, accountHolder, verified: !!otpCode, createdAt: new Date().toISOString() };
  if (otpCode) account.verifiedAt = new Date().toISOString();
  set(K.bankAccounts, [...banks, account]);
  addAuditLog(userId, "bank_added", `Bank account added: ${bankName}`);
  return account;
}

export function getBankAccounts(userId: number) {
  return get<BankAccount[]>(K.bankAccounts, []).filter((b) => b.userId === userId);
}

export function removeBankAccount(id: number) {
  set(K.bankAccounts, get<BankAccount[]>(K.bankAccounts, []).filter((b) => b.id !== id));
}

// ── Login History ────────────────────────────────────────────
function addLoginRecord(userId: number, status: "success" | "failed", failureReason?: string) {
  const records = get<LoginRecord[]>(K.loginHistory, []);
  records.push({
    id: nextId(),
    userId,
    ip: "127.0.0.1", // In production this would come from the server
    device: getDeviceInfo(),
    location: "Dubai, AE", // Simulated
    status,
    failureReason,
    createdAt: new Date().toISOString(),
  });
  set(K.loginHistory, records);
}

export function getLoginHistory(userId: number) {
  return get<LoginRecord[]>(K.loginHistory, []).filter((r) => r.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllLoginHistory() {
  return get<LoginRecord[]>(K.loginHistory, []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ── Audit Logs ───────────────────────────────────────────────
function addAuditLog(userId: number, action: string, details: string) {
  const logs = get<AuditLog[]>(K.auditLogs, []);
  logs.push({
    id: nextId(),
    userId,
    action,
    details,
    ip: "127.0.0.1",
    device: getDeviceInfo(),
    createdAt: new Date().toISOString(),
  });
  set(K.auditLogs, logs);
}

export function getAuditLogs(userId?: number) {
  const all = get<AuditLog[]>(K.auditLogs, []);
  return (userId ? all.filter((l) => l.userId === userId) : all).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ── Fraud Alerts ─────────────────────────────────────────────
function addFraudAlert(userId: number, severity: FraudAlert["severity"], type: string, message: string, details: string) {
  const alerts = get<FraudAlert[]>(K.fraudAlerts, []);
  alerts.push({
    id: nextId(),
    userId,
    severity,
    type,
    message,
    details,
    resolved: false,
    createdAt: new Date().toISOString(),
  });
  set(K.fraudAlerts, alerts);
}

export function getFraudAlerts() {
  return get<FraudAlert[]>(K.fraudAlerts, []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function resolveFraudAlert(id: number) {
  const alerts = get<FraudAlert[]>(K.fraudAlerts, []);
  const alert = alerts.find((a) => a.id === id);
  if (alert) { alert.resolved = true; set(K.fraudAlerts, alerts); }
}

// ── Admin ────────────────────────────────────────────────────
export function getAllUsers() { seedLocalStore(); return get<LocalUser[]>(K.users, []); }
export function getUser(id: number) { return get<LocalUser[]>(K.users, []).find((u) => u.id === id); }
export function getAllWallets() { return get<Wallet[]>(K.wallets, []); }
export function getAllTransactions() { return get<Transaction[]>(K.transactions, []); }
export function getUserTransactions(userId: number) { return get<Transaction[]>(K.transactions, []).filter((t) => t.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
export function getUserDeposits(userId: number) { return get<DepositReq[]>(K.deposits, []).filter((d) => d.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
export function getUserWithdrawals(userId: number) { return get<WithdrawalReq[]>(K.withdrawals, []).filter((w) => w.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
export function freezeUser(id: number, frozen: boolean) { const users = get<LocalUser[]>(K.users, []); const idx = users.findIndex((u) => u.id === id); if (idx >= 0) { users[idx].frozen = frozen; set(K.users, users); addAuditLog(id, frozen ? "account_frozen" : "account_unfrozen", `Account ${frozen ? "frozen" : "unfrozen"} by admin`); if (frozen) addNotif(id, "account_frozen", "Account Frozen", "Your account has been frozen by an administrator. Contact support for assistance."); } }
export function updateUserRole(id: number, role: "user" | "admin") { set(K.users, get<LocalUser[]>(K.users, []).map((u) => (u.id === id ? { ...u, role } : u))); }
export function getAdminStats() {
  const users = getAllUsers(), wallets = getAllWallets(), transactions = getAllTransactions();
  const deposits = getDeposits(), withdrawals = getWithdrawals();
  const fraudAlerts = getFraudAlerts();
  return {
    totalUsers: users.length,
    totalBalance: wallets.reduce((s, w) => s + parseFloat(w.balance), 0).toFixed(2),
    totalTransactions: transactions.length,
    totalTransactionVolume: transactions.reduce((s, t) => s + parseFloat(t.amount), 0).toFixed(2),
    pendingDeposits: deposits.filter((d) => d.status === "pending").length,
    pendingWithdrawals: withdrawals.filter((w) => w.status === "pending").length,
    frozenUsers: users.filter((u) => u.frozen).length,
    adminUsers: users.filter((u) => u.role === "admin").length,
    unverifiedKYC: users.filter((u) => u.kycStatus !== "verified").length,
    activeFraudAlerts: fraudAlerts.filter((a) => !a.resolved).length,
  };
}

// ── reCAPTCHA Simulation ─────────────────────────────────────
export function verifyReCAPTCHA(_token: string): boolean {
  // In production, verify with Google's API
  // Simulated: always pass with 95% success rate
  return Math.random() > 0.05;
}

// seedLocalStore() is now called from App.tsx useEffect
