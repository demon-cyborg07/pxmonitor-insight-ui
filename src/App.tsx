
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if there's a saved preference
    const savedSettings = localStorage.getItem('pxmonitor-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        const darkModeSetting = settings
          .find((group: any) => group.id === "general")
          ?.settings.find((setting: any) => setting.id === "theme")?.value;
        return darkModeSetting ?? true; // Default to dark mode if not found
      } catch (error) {
        return true; // Default to dark mode on error
      }
    }
    return true; // Default to dark mode
  });

  // Apply theme based on settings
  useEffect(() => {
    // Add event listener for settings updates
    const handleSettingsUpdate = (event: any) => {
      const { darkMode } = event.detail;
      setIsDarkMode(darkMode);
      
      if (darkMode) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    // Initial theme application
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }

    // Add Montserrat font to improve typography as requested
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, [isDarkMode]);

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
