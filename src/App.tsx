
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Diagnosis from "./pages/Diagnosis";
import SystemMode from "./pages/SystemMode";
import SmartInsights from "./pages/SmartInsights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          
          {/* Layout wrapped routes */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/diagnosis" element={<Layout><Diagnosis /></Layout>} />
          <Route path="/system-mode" element={<Layout><SystemMode /></Layout>} />
          <Route path="/smart-insights" element={<Layout><SmartInsights /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
