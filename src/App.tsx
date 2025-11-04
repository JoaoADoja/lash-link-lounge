import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Servicos from "./pages/Servicos";
import Contato from "./pages/Contato";
import Agendamento from "./pages/Agendamento";
import Auth from "./pages/Auth";
import MeusAgendamentos from "./pages/MeusAgendamentos";
import AdminAgendamentos from "./pages/AdminAgendamentos";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/agendamento" element={<Agendamento />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
            <Route path="/admin-agendamentos" element={<AdminAgendamentos />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
