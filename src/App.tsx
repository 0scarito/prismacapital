import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Investments from "./pages/Investments";
import Partners from "./pages/Partners";
import Security from "./pages/Security";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PrivateEquity from "./pages/PrivateEquity";
import VentureCapital from "./pages/VentureCapital";
import RealEstate from "./pages/RealEstate";
import Commodities from "./pages/Commodities";
import Etfs from "./pages/Etfs";
import Crypto from "./pages/Crypto";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import LegalNotices from "./pages/LegalNotices";
import RiskDisclosure from "./pages/RiskDisclosure";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookieSettings from "./pages/CookieSettings";
import HelpCenter from "./pages/HelpCenter";
import ContactSupport from "./pages/ContactSupport";
import DiciDocumentation from "./pages/DiciDocumentation";
import EsgReports from "./pages/EsgReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/investments/private-equity" element={<PrivateEquity />} />
              <Route path="/investments/venture-capital" element={<VentureCapital />} />
              <Route path="/investments/real-estate" element={<RealEstate />} />
              <Route path="/investments/commodities" element={<Commodities />} />
              <Route path="/investments/etfs" element={<Etfs />} />
              <Route path="/investments/crypto" element={<Crypto />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/security" element={<Security />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/legal-notices" element={<LegalNotices />} />
              <Route path="/risk-disclosure" element={<RiskDisclosure />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-settings" element={<CookieSettings />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/contact-support" element={<ContactSupport />} />
              <Route path="/dici-documentation" element={<DiciDocumentation />} />
              <Route path="/esg-reports" element={<EsgReports />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
