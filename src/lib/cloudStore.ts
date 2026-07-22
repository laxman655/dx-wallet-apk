// Dubai Exchange Cloud Store - All API functions use sessionStorage for tokens
// NO localStorage usage - all auth data clears on tab close

const API_BASE = import.meta.env.VITE_API_URL || "https://api.g00pay.com";

// ── Session Token (sessionStorage) ────────────────────────────
const TK = "dx_session_token";
const SK = "dx_email_sent";
const RK = "dx_2fa_required";

export function setToken(t: string) { sessionStorage.setItem(TK, t); }
export function getToken(): string | null { return sessionStorage.getItem(TK); }
export function clearToken() { sessionStorage.removeItem(TK); }

export function setEmailSent(v: boolean) { sessionStorage.setItem(SK, v ? "1" : "0"); }
export function getEmailSent(): boolean { return sessionStorage.getItem(SK) === "1"; }

export function set2FARequired(v: boolean) { sessionStorage.setItem(RK, v ? "1" : "0"); }
export function get2FARequired(): boolean { return sessionStorage.getItem(RK) === "1"; }

// ── Session User (stored in memory + sessionStorage) ──────────
export function setSession(user: any) {
  sessionStorage.setItem("dx_user", JSON.stringify(user));
}
export function getSession(): any {
  const s = sessionStorage.getItem("dx_user");
  return s ? JSON.parse(s) : null;
}
export function clearSession() {
  sessionStorage.removeItem(TK);
  sessionStorage.removeItem("dx_user");
  sessionStorage.removeItem(SK);
  sessionStorage.removeItem(RK);
}

export { API_BASE };

// ── Helper with 15s timeout ──────────────────────────────────
export async function api(path: string, opts?: RequestInit) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {}),
    ...(opts?.headers as Record<string, string> || {}),
  };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, signal: ctrl.signal });
    clearTimeout(t);
    const text = await res.text();
    if (!text) {
      return { success: false, msg: "Empty response from server" };
    }
    try {
      const data = JSON.parse(text);
      return data;
    } catch {
      return { success: false, msg: "Invalid server response" };
    }
  } catch (err: any) {
    clearTimeout(t);
    console.error("[API Error]", path, err?.message || err);
    if (err?.name === "AbortError") {
      return { success: false, msg: "Request timed out. Check your internet connection." };
    }
    return { success: false, msg: err?.message || "Network error. Please try again." };
  }
}

// ═══════════════════════════════════════════════════════════════
// 1. AUTH (13 endpoints)
// ═══════════════════════════════════════════════════════════════

export async function cloudLogin(email: string, password: string) {
  return api("/api/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function cloudVerifyLoginOTP(email: string, otpCode: string) {
  return api("/api/login-verify-otp", { method: "POST", body: JSON.stringify({ email, otpCode }) });
}

export async function cloudRegister(name: string, email: string, password: string, phone?: string, user_id?: string) {
  return api("/api/register", { method: "POST", body: JSON.stringify({ name, email, password, phone, user_id }) });
}

export async function cloudSendRegistrationOTP(email: string, name: string) {
  return api("/api/send-registration-otp", { method: "POST", body: JSON.stringify({ email, name }) });
}
export async function cloudVerifyRegOTP(email: string, code: string) {
  return api("/api/verify-registration-otp", { method: "POST", body: JSON.stringify({ email, code }) });
}

export async function cloudForgotPassword(email: string) {
  return api("/api/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

export async function cloudResetPassword(email: string, otpCode: string, newPassword: string) {
  return api("/api/reset-password", { method: "POST", body: JSON.stringify({ email, otpCode, newPassword }) });
}

export async function cloudVerify2FA(userId: number, code: string) {
  return api("/api/verify-otp", { method: "POST", body: JSON.stringify({ userId, code }) });
}

export async function cloudResendOTP(email: string, purpose: string) {
  return api("/api/resend-otp", { method: "POST", body: JSON.stringify({ email, purpose }) });
}

export async function cloudSendActionOTP(action: "exchange" | "send" | "deposit" | "withdraw") {
  return api("/api/action-otp/send", { method: "POST", body: JSON.stringify({ action }) });
}
export async function cloudSendActionEmailOTP(action: "exchange" | "send" | "deposit" | "withdraw") {
  return api("/api/action-otp/send-email", { method: "POST", body: JSON.stringify({ action }) });
}
export async function cloudVerifyActionOTP(action: string, code: string) {
  return api("/api/action-otp/verify", { method: "POST", body: JSON.stringify({ action, code }) });
}
export async function cloudCheckActionToken(token: string, action: string) {
  return api("/api/action-otp/check", { method: "POST", body: JSON.stringify({ token, action }) });
}

export async function cloudLogout() {
  const r = await api("/api/logout", { method: "POST" });
  clearSession();
  return r;
}

export async function cloudRefreshToken() {
  return api("/api/refresh", { method: "POST" });
}

// ═══════════════════════════════════════════════════════════════
// 2. USER PROFILE / SETTINGS (8 endpoints)
// ═══════════════════════════════════════════════════════════════

export async function cloudGetUser() {
  return api("/api/user");
}

export async function cloudUpdateProfile(data: { name?: string; phone?: string; country?: string }) {
  const { name, phone, country } = data;
  return api("/api/user", { method: "PUT", body: JSON.stringify({ name, phone, country }) });
}

export async function cloudChangePassword(currentPassword: string, newPassword: string) {
  return api("/api/user/password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) });
}

export async function cloudEnable2FA(method: "email" | "sms" | "authenticator") {
  return api("/api/user/sms-settings", { method: "PUT", body: JSON.stringify({ phoneNumber: method }) });
}

export async function cloudDisable2FA(_code: string) {
  return api("/api/user/sms-settings", { method: "PUT", body: JSON.stringify({ phoneNumber: "" }) });
}

export async function cloudVerify2FASetup(code: string) {
  return api("/api/verify-mobile-otp", { method: "POST", body: JSON.stringify({ mobile_number: "", otp: code }) });
}

export async function cloudSetTransactionPin(pin: string) {
  return api("/api/user/pin", { method: "PUT", body: JSON.stringify({ pin }) });
}

export async function cloudRemoveTransactionPin() {
  return api("/api/user/pin", { method: "DELETE" });
}

export async function cloudVerifyTransactionPin(pin: string) {
  return api("/api/user/pin", { method: "GET" }).then((r: any) => {
    if (!r.success) throw new Error(r.msg || "PIN check failed");
    return { success: r.pinSet };
  });
}

export async function cloudRequestEmailVerification() {
  return api("/api/user/verify-email", { method: "POST" });
}

export async function cloudVerifyEmailOTP(email: string, code: string) {
  return api("/api/verify-email-otp", { method: "POST", body: JSON.stringify({ email, code }) });
}

// ═══════════════════════════════════════════════════════════════
// 3. DASHBOARD / BALANCE
// ═══════════════════════════════════════════════════════════════

export async function cloudGetDashboard() {
  const userRes = await api("/api/user");
  if (!userRes.success) return userRes;
  const bal = userRes.user?.balance || 0;
  return {
    success: true,
    balance: bal,
    wallets: [{ id: userRes.user?.id, balance: String(bal), currency: userRes.user?.currency || "USDT" }],
    user: userRes.user,
  };
}

// ═══════════════════════════════════════════════════════════════
// 4. DEPOSITS (2 endpoints)
// ═══════════════════════════════════════════════════════════════

export async function cloudCreateDeposit(amount: number, currency: string = "USDT") {
  return api("/api/deposits", { method: "POST", body: JSON.stringify({ amount, currency }) });
}

export async function cloudGetDeposits() {
  return api("/api/deposits");
}

// ═══════════════════════════════════════════════════════════════
// 5. WITHDRAWALS (2 endpoints)
// ═══════════════════════════════════════════════════════════════

export async function cloudCreateWithdrawal(amount: number, currency: string, bankAccount: string) {
  return api("/api/withdrawals", { method: "POST", body: JSON.stringify({ amount, currency, bankAccount }) });
}

export async function cloudGetWithdrawals() {
  return api("/api/withdrawals");
}

// ═══════════════════════════════════════════════════════════════
// 6. EXCHANGE / SEND / CONVERT (4 endpoints)
// ═══════════════════════════════════════════════════════════════

export async function cloudSendMoney(recipientEmail: string, amount: number, currency: string, description?: string) {
  return api("/api/send", { method: "POST", body: JSON.stringify({ recipientEmail, amount, currency, description }) });
}

export async function cloudConvertCurrency(from: string, to: string, amount: number) {
  return api("/api/exchange", { method: "POST", body: JSON.stringify({ fromCurrency: from, toCurrency: to, amount }) });
}

export async function cloudGetExchangeRates() {
  return api("/api/exchange");
}

export async function cloudGetTransactions() {
  return api("/api/transactions");
}

// ═══════════════════════════════════════════════════════════════
// 7. KYC (4 endpoints)
// ═══════════════════════════════════════════════════════════════

export async function cloudGetKYCStatus() {
  return api("/api/user/kyc");
}

export async function cloudGetKYCDocuments() {
  return api("/api/user/kyc/documents");
}

export async function cloudSubmitKYC(data: { fullName: string; dob: string; nationality: string; idType: string; idNumber: string; idFront: string; idBack: string; selfie: string; address: string; city: string; country: string }) {
  await api("/api/user", { method: "PUT", body: JSON.stringify({ name: data.fullName }) });
  return api("/api/user/kyc/upload", {
    method: "POST",
    body: JSON.stringify({
      documentType: data.idType,
      documentNumber: data.idNumber,
      frontImage: data.idFront,
      backImage: data.idBack || "",
      selfie: data.selfie || "",
    }),
  });
}

// ═══════════════════════════════════════════════════════════════
// 8. TRON BLOCKCHAIN (5 endpoints)
// ═══════════════════════════════════════════════════════════════

export async function cloudGetTRONAddress() {
  return api("/api/wallet/address");
}

export async function cloudCreateTRONWallet() {
  return api("/api/wallet/create", { method: "POST" });
}

export async function cloudGetTRONBalance() {
  return api("/api/wallet/balance");
}

export async function cloudGetTRONLedger() {
  return api("/api/wallet/ledger");
}

export async function cloudDepositTRON(txHash: string) {
  return api("/api/wallet/deposit/monitor", { method: "POST", body: JSON.stringify({ txHash }) });
}

export async function cloudWithdrawTRON(toAddress: string, amount: number, currency: string = "USDT") {
  return api("/api/wallet/withdraw", { method: "POST", body: JSON.stringify({ toAddress, amount, currency }) });
}

export async function cloudTransferInternal(recipientEmail: string, amount: number, currency: string = "USDT") {
  return api("/api/wallet/transfer/internal", { method: "POST", body: JSON.stringify({ recipientEmail, amount, currency }) });
}

export async function cloudGetDepositHistoryTRON() {
  return api("/api/wallet/deposit/history");
}

// ═══════════════════════════════════════════════════════════════
// 9. BUY / SELL CRYPTO (4 endpoints)
// ═══════════════════════════════════════════════════════════════

export async function cloudBuyCrypto(amount: number, cryptoCurrency: string = "USDT", fiatCurrency: string = "AED", paymentMethod: string = "card") {
  return api("/api/buy-crypto", { method: "POST", body: JSON.stringify({ amount, cryptoCurrency, fiatCurrency, paymentMethod }) });
}

export async function cloudSellCrypto(amount: number, cryptoCurrency: string = "USDT", fiatCurrency: string = "AED") {
  return api("/api/sell-crypto", { method: "POST", body: JSON.stringify({ amount, cryptoCurrency, fiatCurrency }) });
}

// ═══════════════════════════════════════════════════════════════
// 10. ADMIN PANEL (All matching backend endpoints EXACTLY)
// ═══════════════════════════════════════════════════════════════

export async function cloudAdminStats() {
  return api("/api/admin/stats");
}

export async function cloudAdminUsers() {
  return api("/api/admin/users");
}

export async function cloudAdminWallets() {
  return api("/api/admin/wallets");
}

export async function cloudAdminDeposits() {
  return api("/api/admin/deposits");
}

export async function cloudAdminWithdrawals() {
  return api("/api/admin/withdrawals");
}

export async function cloudAdminPendingDeposits() {
  return api("/api/admin/deposits/pending");
}

export async function cloudAdminPendingWithdrawals() {
  return api("/api/admin/withdrawals/pending");
}

export async function cloudAdminWalletBalances() {
  return api("/api/admin/wallet-balances");
}

export async function cloudAdminApproveDeposit(depositId: number) {
  return api("/api/deposits/approve", { method: "PUT", body: JSON.stringify({ depositId }) });
}

export async function cloudAdminRejectDeposit(depositId: number) {
  return api("/api/deposits/reject", { method: "PUT", body: JSON.stringify({ depositId }) });
}

export async function cloudAdminApproveBankDeposit(depositId: number) {
  return api("/api/admin/bank-deposits/approve", { method: "PUT", body: JSON.stringify({ depositId }) });
}

export async function cloudAdminRejectBankDeposit(depositId: number) {
  return api("/api/admin/bank-deposits/reject", { method: "PUT", body: JSON.stringify({ depositId }) });
}

export async function cloudAdminGetBankDepositSlipUrl(depositId: number): Promise<string> {
  const token = getToken();
  return `${API_BASE}/api/admin/bank-deposits/${depositId}/slip` + (token ? `?token=${encodeURIComponent(token)}` : "");
}

export async function cloudAdminApproveWithdrawal(withdrawalId: number) {
  return api("/api/admin/withdrawals/approve", { method: "POST", body: JSON.stringify({ withdrawalId }) });
}

export async function cloudAdminRejectWithdrawal(withdrawalId: number, reason?: string) {
  return api("/api/admin/withdrawals/reject", { method: "POST", body: JSON.stringify({ withdrawalId, reason }) });
}

export async function cloudAdminFreezeUser(userId: number) {
  return api("/api/admin/user/freeze", { method: "PUT", body: JSON.stringify({ userId, freeze: true }) });
}

export async function cloudAdminUnfreezeUser(userId: number) {
  return api("/api/admin/user/freeze", { method: "PUT", body: JSON.stringify({ userId, freeze: false }) });
}

export async function cloudAdminGetKYC() {
  return api("/api/admin/kyc");
}

export async function cloudAdminApproveKYC(userId: number) {
  return api("/api/admin/kyc/approve", { method: "PUT", body: JSON.stringify({ userId }) });
}

export async function cloudAdminRejectKYC(userId: number) {
  return api("/api/admin/kyc/reject", { method: "PUT", body: JSON.stringify({ userId }) });
}

export async function cloudAdminAddMoney(userId: number, amount: number) {
  return api("/api/admin/add-money", { method: "PUT", body: JSON.stringify({ userId, amount }) });
}

export async function cloudAdminDeductMoney(userId: number, amount: number) {
  return api("/api/admin/deduct-money", { method: "PUT", body: JSON.stringify({ userId, amount }) });
}

export async function cloudAdminSetBalance(userId: number, balance: number) {
  return api("/api/admin/set-balance", { method: "PUT", body: JSON.stringify({ userId, balance }) });
}

export async function cloudAdminResetPassword(userId: number, newPassword: string) {
  return api("/api/admin/reset-password", { method: "PUT", body: JSON.stringify({ userId, newPassword }) });
}

export async function cloudAdminDeleteUser(userId: number) {
  return api("/api/admin/delete-user", { method: "POST", body: JSON.stringify({ userId }) });
}

export async function cloudAdminAuditLogs() {
  return api("/api/admin/audit-log");
}

// ═══════════════════════════════════════════════════════════════
// 10b. BANK MANAGEMENT (Admin)
// ═══════════════════════════════════════════════════════════════

export async function cloudAdminGetBanks() {
  return api("/api/admin/bank-details");
}

export async function cloudAdminAddBank(data: {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban?: string;
  swiftCode?: string;
  branch?: string;
  country?: string;
}) {
  return api("/api/bank-details", {
    method: "POST",
    body: JSON.stringify({
      bank_name: data.bankName,
      account_name: data.accountName,
      account_number: data.accountNumber,
      iban: data.iban,
      swift_code: data.swiftCode,
      branch: data.branch,
      country: data.country,
    }),
  });
}

export async function cloudAdminUpdateBank(data: {
  id: number;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  iban?: string;
  swiftCode?: string;
  branch?: string;
  country?: string;
  isActive?: boolean;
}) {
  return api("/api/admin/bank-details", {
    method: "PUT",
    body: JSON.stringify({
      id: data.id,
      bank_name: data.bankName,
      account_name: data.accountName,
      account_number: data.accountNumber,
      iban: data.iban,
      swift_code: data.swiftCode,
      branch: data.branch,
      country: data.country,
      is_active: data.isActive,
    }),
  });
}

export async function cloudAdminDeleteBank(id: number) {
  return api("/api/admin/bank-details", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

// ═══════════════════════════════════════════════════════════════
// 11. EMAIL / SMS / NOTIFICATIONS (5 endpoints)
// ═══════════════════════════════════════════════════════════════

export async function cloudTestEmail(email: string) {
  return api("/api/test-email", { method: "POST", body: JSON.stringify({ email }) });
}

export async function cloudGetEmailStatus() {
  return api("/api/email/status");
}

export async function cloudSendMobileOTP(mobile_number: string) {
  return api("/api/send-mobile-otp", { method: "POST", body: JSON.stringify({ mobile_number }) });
}

export async function cloudVerifyMobileOTP(mobile_number: string, otp: string) {
  return api("/api/verify-mobile-otp", { method: "POST", body: JSON.stringify({ mobile_number, otp }) });
}

// ═══════════════════════════════════════════════════════════════
// 12. HEALTH / FEATURES / VERSION / STUBS
// ═══════════════════════════════════════════════════════════════

export async function cloudHealth() {
  return api("/api/health");
}

export async function cloudFeatures() {
  return api("/api/features");
}

export async function cloudVersion() {
  return api("/api/v");
}

// ═══════════════════════════════════════════════════════════════
// 14. ADDITIONAL ENDPOINTS (User Profile, Transactions, etc.)
// ═══════════════════════════════════════════════════════════════

export async function cloudGetUserProfile() {
  return api("/api/user");
}

export async function cloudUpdateUserSettings(data: any) {
  return api("/api/user/settings", { method: "PUT", body: JSON.stringify(data) });
}

export async function cloudSetBankDetails(bankName: string, accountNumber: string, swiftCode: string) {
  return api("/api/user/bank-details", { method: "POST", body: JSON.stringify({ bankName, accountNumber, swiftCode }) });
}

export async function cloudExchangeCurrency(fromCurrency: string, toCurrency: string, amount: number) {
  return api("/api/exchange", { method: "POST", body: JSON.stringify({ fromCurrency, toCurrency, amount }) });
}

export async function cloudWithdrawCrypto(toAddress: string, amount: number, currency: string = "USDT") {
  return api("/api/wallet/withdraw", { method: "POST", body: JSON.stringify({ toAddress, amount, currency }) });
}

export async function cloudGetTransferFee() {
  return api("/api/wallet/transfer/fee");
}

export async function cloudMonitorDeposit(txHash: string) {
  return api("/api/wallet/deposit/monitor", { method: "POST", body: JSON.stringify({ txHash }) });
}

export async function cloudGetWalletDepositHistory() {
  return api("/api/wallet/deposit/history");
}

export async function cloudGetWalletWithdrawHistory() {
  return api("/api/wallet/withdraw/history");
}

export async function cloudVerifyTronDeposit(txHash: string) {
  return api("/api/tron/verify-deposit", { method: "POST", body: JSON.stringify({ txHash }) });
}

export async function cloudLoginWithPhone(phone: string) {
  return api("/api/login-phone", { method: "POST", body: JSON.stringify({ phone }) });
}

export async function cloudRequestOTP(email: string, purpose: string) {
  return api("/api/login-request-otp", { method: "POST", body: JSON.stringify({ email, purpose }) });
}

export async function cloudGetEmailLogs() {
  return api("/api/email/logs");
}

export async function cloudGetEmailLimits() {
  return api("/api/email/sending-limits");
}
