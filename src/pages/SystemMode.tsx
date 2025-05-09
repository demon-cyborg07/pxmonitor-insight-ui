
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  time: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
}

// Generate mock events
const generateMockEvents = (): Event[] => {
  const now = new Date();
  
  // Create 10 events over the last hour
  return Array.from({ length: 10 }).map((_, index) => {
    const minutes = index * 6; // Every 6 minutes
    const eventTime = new Date(now.getTime() - minutes * 60 * 1000);
    const timeString = eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Alternate between different event types
    const eventTypes = ["success", "info", "warning", "error"] as const;
    const type = eventTypes[index % eventTypes.length];
    
    let message = "";
    switch (type) {
      case "success":
        message = `Connection stable at ${timeString}`;
        break;
      case "info":
        message = `Network mode changed at ${timeString}`;
        break;
      case "warning":
        message = `Minor packet loss detected at ${timeString}`;
        break;
      case "error":
        message = `Connection interrupted at ${timeString}`;
        break;
    }
    
    return {
      id: `event-${index}`,
      time: timeString,
      message,
      type
    };
  }).reverse(); // Most recent first
};

const SystemMode = () => {
  const [powerMode, setPowerMode] = useState(false);
  const [events, setEvents] = useState<Event[]>(generateMockEvents());
  
  const handleTogglePowerMode = () => {
    const newMode = !powerMode;
    setPowerMode(newMode);
    
    // Add new event
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newEvent: Event = {
      id: `event-${now.getTime()}`,
      time: timeString,
      message: newMode 
        ? "Powerful Mode activated" 
        : "Powerful Mode deactivated",
      type: "info"
    };
    
    setEvents([newEvent, ...events]);
  };
  
  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "success": 
        return <span className="text-limeGreen">●</span>;
      case "warning":
        return <span className="text-yellow-400">●</span>;
      case "error":
        return <span className="text-coralRed">●</span>;
      case "info":
        return <span className="text-neonBlue">●</span>;
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Mode</h1>
        <p className="text-muted-foreground">Optimize your network for specific tasks</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="network-card">
            <h2 className="text-lg font-medium mb-4">Powerful Mode</h2>
            
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                <div 
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                    powerMode ? "bg-neonBlue text-black" : "bg-muted/30 text-muted-foreground"
                  )}
                >
                  <span className="text-2xl font-bold">{powerMode ? "ON" : "OFF"}</span>
                </div>
              </div>
              
              <button 
                className={cn(
                  "w-full py-2 rounded-md transition-colors font-medium",
                  powerMode 
                    ? "bg-neonBlue text-black hover:bg-neonBlue/80" 
                    : "bg-muted/20 text-white hover:bg-muted/30 border border-muted"
                )}
                onClick={handleTogglePowerMode}
              >
                {powerMode ? "Disable" : "Enable"}
              </button>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p>Powerful Mode prioritizes your network traffic for video calls, gaming, or streaming.</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Reduced latency for real-time applications</li>
                  <li>Increased bandwidth allocation</li>
                  <li>Prioritized DNS resolution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="network-card h-full">
            <h2 className="text-lg font-medium mb-4">Network Timeline</h2>
            
            <div className="overflow-y-auto max-h-[500px] pr-2">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                >
                  <div className="pt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{event.message}</p>
                  </div>
                  <div className="text-xs text-muted-foreground font-fira-code">
                    {event.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMode;
