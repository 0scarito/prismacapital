import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Investments from "./pages/Investments";
import Partners from "./pages/Partners";
import Security from "./pages/Security";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import Courses from "./pages/Courses";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Default routes (English) */}
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
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/legal-notices" element={<LegalNotices />} />
              <Route path="/risk-disclosure" element={<RiskDisclosure />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-settings" element={<CookieSettings />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/contact-support" element={<ContactSupport />} />
              <Route path="/dici-documentation" element={<DiciDocumentation />} />
              <Route path="/esg-reports" element={<EsgReports />} />
              <Route path="/courses" element={<Courses />} />
              
              {/* Language-prefixed routes */}
              <Route path="/fr" element={<Index />} />
              <Route path="/fr/how-it-works" element={<HowItWorks />} />
              <Route path="/fr/investments" element={<Investments />} />
              <Route path="/fr/investments/private-equity" element={<PrivateEquity />} />
              <Route path="/fr/investments/venture-capital" element={<VentureCapital />} />
              <Route path="/fr/investments/real-estate" element={<RealEstate />} />
              <Route path="/fr/investments/commodities" element={<Commodities />} />
              <Route path="/fr/investments/etfs" element={<Etfs />} />
              <Route path="/fr/investments/crypto" element={<Crypto />} />
              <Route path="/fr/partners" element={<Partners />} />
              <Route path="/fr/security" element={<Security />} />
              <Route path="/fr/faq" element={<FAQ />} />
              <Route path="/fr/payment" element={<Payment />} />
              <Route path="/fr/auth" element={<Auth />} />
              <Route path="/fr/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/fr/legal-notices" element={<LegalNotices />} />
              <Route path="/fr/risk-disclosure" element={<RiskDisclosure />} />
              <Route path="/fr/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/fr/cookie-settings" element={<CookieSettings />} />
              <Route path="/fr/help-center" element={<HelpCenter />} />
              <Route path="/fr/contact-support" element={<ContactSupport />} />
              <Route path="/fr/dici-documentation" element={<DiciDocumentation />} />
              <Route path="/fr/esg-reports" element={<EsgReports />} />
              <Route path="/fr/courses" element={<Courses />} />
              
              <Route path="/en" element={<Index />} />
              <Route path="/en/how-it-works" element={<HowItWorks />} />
              <Route path="/en/investments" element={<Investments />} />
              <Route path="/en/investments/private-equity" element={<PrivateEquity />} />
              <Route path="/en/investments/venture-capital" element={<VentureCapital />} />
              <Route path="/en/investments/real-estate" element={<RealEstate />} />
              <Route path="/en/investments/commodities" element={<Commodities />} />
              <Route path="/en/investments/etfs" element={<Etfs />} />
              <Route path="/en/investments/crypto" element={<Crypto />} />
              <Route path="/en/partners" element={<Partners />} />
              <Route path="/en/security" element={<Security />} />
              <Route path="/en/faq" element={<FAQ />} />
              <Route path="/en/payment" element={<Payment />} />
              <Route path="/en/auth" element={<Auth />} />
              <Route path="/en/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/en/legal-notices" element={<LegalNotices />} />
              <Route path="/en/risk-disclosure" element={<RiskDisclosure />} />
              <Route path="/en/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/en/cookie-settings" element={<CookieSettings />} />
              <Route path="/en/help-center" element={<HelpCenter />} />
              <Route path="/en/contact-support" element={<ContactSupport />} />
              <Route path="/en/dici-documentation" element={<DiciDocumentation />} />
              <Route path="/en/esg-reports" element={<EsgReports />} />
              <Route path="/en/courses" element={<Courses />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
