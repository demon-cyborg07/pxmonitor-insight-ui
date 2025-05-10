
import { useState } from "react";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ExplanationPopover from "@/components/ui/explanation-popover";

interface NetworkIssue {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  status: "detected" | "fixing" | "fixed";
  solution: string;
  metrics?: {
    before: number;
    after?: number;
    unit: string;
    label: string;
  }[];
}

const Diagnosis = () => {
  const [issues, setIssues] = useState<NetworkIssue[]>([
    {
      id: "dns-1",
      title: "Slow DNS Resolution",
      description: "Websites are loading slowly due to DNS resolution delays.",
      severity: "high",
      status: "detected",
      solution: "Switch to faster DNS servers and clear DNS cache.",
      metrics: [
        {
          label: "DNS Delay",
          before: 120,
          unit: "ms"
        },
        {
          label: "Website Loading",
          before: 3.8,
          unit: "s"
        }
      ]
    },
    {
      id: "wifi-1",
      title: "Wi-Fi Interference",
      description: "Signal interference detected from nearby networks on the same channel.",
      severity: "medium",
      status: "detected",
      solution: "Change Wi-Fi channel to reduce interference.",
      metrics: [
        {
          label: "Signal Strength",
          before: 58,
          unit: "%"
        },
        {
          label: "Packet Loss",
          before: 4.2,
          unit: "%"
        }
      ]
    }
  ]);

  const handleFixIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return { ...issue, status: "fixing" };
      }
      return issue;
    }));

    // Simulate fixing after delay
    setTimeout(() => {
      setIssues(prev => prev.map(issue => {
        if (issue.id === issueId) {
          const updatedMetrics = issue.metrics?.map(metric => ({
            ...metric,
            after: issue.id === "dns-1" 
              ? (metric.label === "DNS Delay" ? 28 : 1.2) // DNS improvements
              : (metric.label === "Signal Strength" ? 89 : 0.8) // Wi-Fi improvements
          }));

          return {
            ...issue,
            status: "fixed",
            metrics: updatedMetrics
          };
        }
        return issue;
      }));
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "detected":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "fixing":
        return <Loader2 className="h-5 w-5 text-neonBlue animate-spin" />;
      case "fixed":
        return <CheckCircle className="h-5 w-5 text-limeGreen" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Network Diagnosis</h1>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {issues.filter(i => i.status === "detected").length} issues detected
          </div>
          <ExplanationPopover 
            componentName="Network Issues" 
            metrics={{ 
              issueCount: issues.length,
              detectedCount: issues.filter(i => i.status === "detected").length,
              fixedCount: issues.filter(i => i.status === "fixed").length
            }}
          />
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="network-card flex flex-col items-center p-8">
          <CheckCircle className="h-16 w-16 text-limeGreen mb-4" />
          <h2 className="text-xl font-medium">All Systems Operational</h2>
          <p className="text-muted-foreground mt-2">No network issues detected</p>
        </div>
      ) : (
        <div className="space-y-6">
          {issues.map((issue) => (
            <div key={issue.id} className="network-card overflow-hidden">
              <div className="flex justify-between items-start p-4 border-b border-border">
                <div className="flex gap-3 items-center">
                  {getStatusIcon(issue.status)}
                  <div>
                    <h3 className="font-medium text-lg">{issue.title}</h3>
                    <p className="text-muted-foreground text-sm">{issue.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn("text-xs px-2 py-1 rounded-full border", getSeverityStyles(issue.severity))}>
                    {issue.severity} priority
                  </span>
                  
                  {issue.status === "detected" && (
                    <button 
                      className="glow-button py-1 px-4 text-sm"
                      onClick={() => handleFixIssue(issue.id)}
                    >
                      Fix Now
                    </button>
                  )}
                </div>
              </div>
              
              {/* Comparison section */}
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium mb-3">Solution: {issue.solution}</h4>
                  <ExplanationPopover 
                    componentName={issue.title} 
                    metrics={{ 
                      severity: issue.severity,
                      status: issue.status,
                      metrics: issue.metrics
                    }}
                    className="relative -top-2"
                  />
                </div>
                
                {issue.metrics && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {issue.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-muted/10 p-3 rounded-lg border border-border">
                        <h5 className="text-xs text-muted-foreground mb-2">{metric.label}</h5>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-coralRed font-medium font-fira-code">
                              {metric.before}{metric.unit}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">Before</span>
                          </div>
                          
                          {issue.status === "fixed" && metric.after && (
                            <>
                              <div className="text-muted-foreground">→</div>
                              <div>
                                <span className="text-limeGreen font-medium font-fira-code">
                                  {metric.after}{metric.unit}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">After</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Diagnosis;
