
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Diagnosis from "./pages/Diagnosis";
import SystemMode from "./pages/SystemMode";
import SmartInsights from "./pages/SmartInsights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Add Montserrat font to improve typography as requested
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/welcome" element={<Welcome />} />
            
            {/* Layout wrapped routes */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
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
};

export default App;
