
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-15 pointer-events-none z-0"></div>
      
      {/* Glow effects */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-neonBlue/20 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 z-10">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
