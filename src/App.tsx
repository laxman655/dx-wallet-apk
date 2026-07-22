import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import { ActionOtpProvider } from "./providers/ActionOtpProvider";
import HomePage from "./sections/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import KYC from "./pages/KYC";
import Settings from "./pages/Settings";
import History from "./pages/History";
import TronWallet from "./pages/TronWallet";
import BuySellCrypto from "./pages/BuySellCrypto";
import Profile from "./pages/Profile";
import ExchangePage from "./pages/ExchangePage";
import SendPage from "./pages/SendPage";
import DepositPage from "./pages/DepositPage";
import WithdrawPage from "./pages/WithdrawPage";
import PlansPage from "./pages/PlansPage";
import UpgradePaymentPage from "./pages/UpgradePaymentPage";
import Converter from "./pages/Converter";
import "./App.css";

function App() {
  return (
    <ActionOtpProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<History />} />
          <Route path="/tron-wallet" element={<TronWallet />} />
          <Route path="/buy-sell-crypto" element={<BuySellCrypto />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/send" element={<SendPage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/upgrade-payment" element={<UpgradePaymentPage />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </ActionOtpProvider>
  );
}

export default App;
