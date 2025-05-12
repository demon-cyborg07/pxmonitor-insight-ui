
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SettingsGroup {
  id: string;
  title: string;
  settings: Setting[];
}

interface Setting {
  id: string;
  name: string;
  description: string;
  type: "toggle" | "slider" | "input" | "dropdown";
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  unit?: string;
}

const Settings = () => {
  const [settingsGroups, setSettingsGroups] = useState<SettingsGroup[]>([
    {
      id: "general",
      title: "General Settings",
      settings: [
        {
          id: "theme",
          name: "Dark Mode",
          description: "Use dark theme for better visibility in low light conditions",
          type: "toggle",
          value: true
        },
        {
          id: "startup",
          name: "Start with System",
          description: "Launch PXMonitor when your computer starts",
          type: "toggle",
          value: false
        },
        {
          id: "notifications",
          name: "Show Notifications",
          description: "Display alerts when network issues are detected",
          type: "toggle",
          value: true
        }
      ]
    },
    {
      id: "network",
      title: "Network Settings",
      settings: [
        {
          id: "isp-speed",
          name: "ISP Speed",
          description: "Your internet service provider's advertised speed",
          type: "input",
          value: "100",
          unit: "Mbps"
        },
        {
          id: "interface",
          name: "Network Interface",
          description: "The network interface to monitor",
          type: "dropdown",
          value: "wifi",
          options: [
            { label: "Wi-Fi", value: "wifi" },
            { label: "Ethernet", value: "ethernet" }
          ]
        }
      ]
    },
    {
      id: "thresholds",
      title: "Alert Thresholds",
      settings: [
        {
          id: "latency",
          name: "Latency Threshold",
          description: "Alert when latency exceeds this value",
          type: "slider",
          value: 150,
          min: 50,
          max: 300,
          unit: "ms"
        },
        {
          id: "packet-loss",
          name: "Packet Loss Threshold",
          description: "Alert when packet loss exceeds this value",
          type: "slider",
          value: 3,
          min: 0,
          max: 10,
          unit: "%"
        },
        {
          id: "bandwidth",
          name: "Low Bandwidth Threshold",
          description: "Alert when bandwidth drops below this percentage of your ISP speed",
          type: "slider",
          value: 75,
          min: 10,
          max: 90,
          unit: "%"
        }
      ]
    }
  ]);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const [currentInterface, setCurrentInterface] = useState("wifi");

  useEffect(() => {
    // Apply dark mode on initial load
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const handleSettingChange = (groupId: string, settingId: string, newValue: any) => {
    setSettingsGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            settings: group.settings.map(setting => {
              if (setting.id === settingId) {
                // Handle special settings with side effects
                if (settingId === "theme") {
                  setIsDarkMode(newValue);
                  document.documentElement.classList.toggle("dark", newValue);
                }
                
                if (settingId === "notifications") {
                  setShowNotifications(newValue);
                }
                
                if (settingId === "interface") {
                  setCurrentInterface(newValue);
                  updateTSharkInterface(newValue);
                }
                
                return { ...setting, value: newValue };
              }
              return setting;
            })
          };
        }
        return group;
      })
    );
  };
  
  // Function to update TShark interface in the backend
  const updateTSharkInterface = (interfaceValue: string) => {
    console.log(`Updating TShark interface to: ${interfaceValue === "ethernet" ? "Ethernet" : "Wi-Fi"}`);
    // This would be a backend call to update the interface
    // In a real app, we'd make an API call here
  };

  const saveSettings = () => {
    // Simulate saving settings to backend/local storage
    localStorage.setItem('pxmonitor-settings', JSON.stringify(settingsGroups));
    
    // Update backend TShark interface based on current selection
    updateTSharkInterface(currentInterface);
    
    // Show a success message
    toast.success("Settings saved successfully");
  };

  const renderSetting = (group: SettingsGroup, setting: Setting) => {
    const { id, name, description, type, value, options, min, max, unit } = setting;
    
    switch (type) {
      case "toggle":
        return (
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">{name}</h4>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => handleSettingChange(group.id, id, checked)}
              className={`${value ? "bg-neonBlue" : "bg-muted"}`}
            />
          </div>
        );
        
      case "slider":
        return (
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="text-sm font-medium">{name}</h4>
              <span className="text-xs font-fira-code">
                {value}{unit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{description}</p>
            <div className="relative">
              <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => handleSettingChange(group.id, id, Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-md appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00B7EB ${(value - min!) / (max! - min!) * 100}%, #6B7280 ${(value - min!) / (max! - min!) * 100}%)`
                }}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
              </div>
            </div>
          </div>
        );
        
      case "input":
        return (
          <div>
            <h4 className="text-sm font-medium mb-1">{name}</h4>
            <p className="text-xs text-muted-foreground mb-2">{description}</p>
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => handleSettingChange(group.id, id, e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-md py-1.5 px-3 text-softWhite font-fira-code"
              />
              {unit && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
          </div>
        );
        
      case "dropdown":
        return (
          <div>
            <h4 className="text-sm font-medium mb-1">{name}</h4>
            <p className="text-xs text-muted-foreground mb-2">{description}</p>
            <RadioGroup
              value={value}
              onValueChange={(newValue) => handleSettingChange(group.id, id, newValue)}
              className="flex flex-col space-y-2"
            >
              {options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
                  <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your PXMonitor experience</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsGroups.map(group => (
          <div key={group.id} className="network-card">
            <h3 className="text-lg font-medium mb-4">{group.title}</h3>
            <div className="space-y-6">
              {group.settings.map(setting => (
                <div key={setting.id}>
                  {renderSetting(group, setting)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          className="glow-button"
          onClick={saveSettings}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
