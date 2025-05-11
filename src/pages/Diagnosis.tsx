
import { useState } from "react";
import { CheckCircle, AlertTriangle, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ComponentExplanation from "@/components/ui/component-explanation";

interface ScriptResult {
  status: "idle" | "running" | "completed";
  metrics?: {
    before: number;
    after?: number;
    unit: string;
    label: string;
  }[];
}

interface NetworkScript {
  id: string;
  name: string;
  fileName: string;
  description: string;
  severity: "high" | "medium" | "low";
  metrics: {
    label: string;
    before: number;
    unit: string;
  }[];
}

const Diagnosis = () => {
  const { toast } = useToast();
  const [scriptResults, setScriptResults] = useState<Record<string, ScriptResult>>({
    "dns-cache": { status: "idle" },
    "network-ip": { status: "idle" },
    "bandwidth": { status: "idle" },
    "dns-server": { status: "idle" },
    "wifi": { status: "idle" },
    "congestion": { status: "idle" },
    "powerful": { status: "idle" },
  });

  // Network scripts data
  const networkScripts: NetworkScript[] = [
    {
      id: "dns-cache",
      name: "DNS Cache Flush",
      fileName: "Flush-DnsCache.ps1",
      description: "Clears the DNS resolver cache to resolve connectivity issues and refresh DNS records.",
      severity: "medium",
      metrics: [
        { label: "DNS Response Time", before: 120, unit: "ms" },
        { label: "Name Resolution Success", before: 84, unit: "%" }
      ]
    },
    {
      id: "network-ip",
      name: "Network IP Reset",
      fileName: "Reset-NetworkIP.ps1",
      description: "Resets IP configuration to resolve address conflicts and connectivity problems.",
      severity: "high",
      metrics: [
        { label: "IP Conflicts", before: 3, unit: "conflicts" },
        { label: "Connection Stability", before: 67, unit: "%" }
      ]
    },
    {
      id: "bandwidth",
      name: "Bandwidth Optimization",
      fileName: "Optimize-Bandwidth.ps1",
      description: "Adjusts TCP parameters for improved bandwidth utilization and faster data transfers.",
      severity: "medium",
      metrics: [
        { label: "Download Speed", before: 45.8, unit: "Mbps" },
        { label: "Upload Speed", before: 12.4, unit: "Mbps" }
      ]
    },
    {
      id: "dns-server",
      name: "DNS Server Switch",
      fileName: "Switch-DnsServer.ps1",
      description: "Changes DNS server settings to improve speed and reliability of internet connections.",
      severity: "low",
      metrics: [
        { label: "DNS Reliability", before: 79, unit: "%" },
        { label: "Query Speed", before: 95, unit: "ms" }
      ]
    },
    {
      id: "wifi",
      name: "WiFi Reconnection",
      fileName: "Reconnect-WiFi.ps1",
      description: "Disconnects and reconnects WiFi to resolve signal or authentication issues.",
      severity: "high",
      metrics: [
        { label: "Signal Strength", before: 58, unit: "%" },
        { label: "Packet Loss", before: 4.2, unit: "%" }
      ]
    },
    {
      id: "congestion",
      name: "Network Congestion Relief",
      fileName: "Clear-NetworkCongestion.ps1",
      description: "Alleviates network congestion by resetting adapters and clearing network cache.",
      severity: "medium",
      metrics: [
        { label: "Network Latency", before: 168, unit: "ms" },
        { label: "Bandwidth Utilization", before: 87, unit: "%" }
      ]
    },
    {
      id: "powerful",
      name: "Powerful Connection",
      fileName: "Maintain-PowerfulConnection.ps1",
      description: "Enables high-performance mode for network connections to optimize speed and stability.",
      severity: "low",
      metrics: [
        { label: "Connection Power", before: 72, unit: "%" },
        { label: "Stability Index", before: 6.8, unit: "/10" }
      ]
    }
  ];

  // Run script function
  const runScript = (scriptId: string, fileName: string) => {
    // Set status to running
    setScriptResults(prev => ({
      ...prev,
      [scriptId]: { 
        ...prev[scriptId],
        status: "running" 
      }
    }));

    // Toast notification
    toast({
      title: "Running Script",
      description: `Executing ${fileName}...`,
    });

    // Simulate script execution with a delay
    setTimeout(() => {
      // Get the script data
      const script = networkScripts.find(s => s.id === scriptId);
      
      if (script) {
        // Generate improved metrics based on the script
        const improvedMetrics = script.metrics.map(metric => {
          let improvement: number;
          
          switch (metric.label) {
            case "DNS Response Time":
            case "Network Latency":
            case "Query Speed":
            case "Packet Loss":
            case "IP Conflicts":
              // Lower is better
              improvement = metric.before * (0.3 + Math.random() * 0.4);
              return {
                ...metric,
                after: Number((metric.before - improvement).toFixed(1))
              };
            default:
              // Higher is better
              improvement = (100 - metric.before) * (0.4 + Math.random() * 0.5);
              return {
                ...metric,
                after: Number(Math.min(99.9, (metric.before + improvement)).toFixed(1))
              };
          }
        });

        // Update status to completed with metrics
        setScriptResults(prev => ({
          ...prev,
          [scriptId]: {
            status: "completed",
            metrics: improvedMetrics
          }
        }));

        // Success notification
        toast({
          title: "Script Executed Successfully",
          description: `${fileName} completed with improvements.`,
        });
      }
    }, 3000);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-coralRed/15 text-coralRed border-coralRed";
      case "medium":
        return "bg-yellow-400/15 text-yellow-400 border-yellow-400";
      case "low":
        return "bg-blue-400/15 text-blue-400 border-blue-400";
      default:
        return "bg-gray-400/15 text-gray-400 border-gray-400";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Network Diagnosis & Repair</h1>
        <ComponentExplanation 
          componentName="Network Diagnosis" 
          data={{ 
            scriptCount: networkScripts.length,
            completedCount: Object.values(scriptResults).filter(r => r.status === "completed").length,
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networkScripts.map((script) => {
          const result = scriptResults[script.id] || { status: "idle" };
          
          return (
            <Card key={script.id} className="network-card overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{script.name}</CardTitle>
                  <span className={cn("text-xs px-2 py-1 rounded-full border", getSeverityStyles(script.severity))}>
                    {script.severity} priority
                  </span>
                </div>
                <CardDescription className="mt-1.5">{script.description}</CardDescription>
              </CardHeader>

              <CardContent>
                {/* Script metrics */}
                <div className="space-y-6">
                  {script.metrics.map((metric, idx) => {
                    const updatedMetric = result.metrics?.[idx];
                    
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-semibold font-mono",
                              updatedMetric?.after !== undefined ? "text-coralRed" : ""
                            )}>
                              {metric.before}{metric.unit}
                            </span>
                            
                            {updatedMetric?.after !== undefined && (
                              <>
                                <span className="text-muted-foreground">→</span>
                                <span className="font-semibold font-mono text-limeGreen">
                                  {updatedMetric.after}{metric.unit}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <Progress 
                          value={updatedMetric?.after !== undefined 
                            ? (metric.label.includes("Time") || metric.label.includes("Latency") || metric.label.includes("Loss") || metric.label.includes("Conflicts")
                              ? (100 - (updatedMetric.after / metric.before * 100)) // Lower is better
                              : (updatedMetric.after / 100 * 100)) // Higher is better
                            : 0
                          } 
                          className={cn(
                            "h-2", 
                            updatedMetric?.after !== undefined ? "bg-muted/30" : "bg-muted/10"
                          )}
                        />
                      </div>
                    );
                  })}
                  
                  {/* Action button */}
                  <Button 
                    onClick={() => runScript(script.id, script.fileName)}
                    disabled={result.status === "running"}
                    className={cn(
                      "w-full mt-4",
                      result.status === "completed" ? "bg-limeGreen hover:bg-limeGreen/90 text-white" : ""
                    )}
                  >
                    {result.status === "running" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : result.status === "completed" ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Fixed
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Run Diagnosis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Diagnosis;
