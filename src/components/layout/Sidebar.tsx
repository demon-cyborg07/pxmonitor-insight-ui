
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ScanSearch, 
  Zap, 
  Brain, 
  Settings, 
  FileDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Diagnosis", path: "/diagnosis", icon: <ScanSearch size={20} /> },
    { name: "System Mode", path: "/system-mode", icon: <Zap size={20} /> },
    { name: "Smart Insights", path: "/smart-insights", icon: <Brain size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={cn(
        "h-screen bg-darkNavy border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-[250px]"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-border flex justify-between items-center">
          {!collapsed && (
            <span className="text-neonBlue font-bold text-xl">PXMonitor</span>
          )}
          <button 
            className="p-1 rounded-md hover:bg-muted/50 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="text-softWhite" /> : <ChevronLeft className="text-softWhite" />}
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "sidebar-link",
                    location.pathname === item.path ? "active" : "",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  <span className="text-current">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Export Button */}
        <div className="p-4 border-t border-border">
          <button 
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 rounded-md border border-neonBlue/60 text-neonBlue transition-colors hover:bg-neonBlue/10",
              collapsed ? "justify-center" : ""
            )}
          >
            <FileDown size={20} />
            {!collapsed && <span>Export Data</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
