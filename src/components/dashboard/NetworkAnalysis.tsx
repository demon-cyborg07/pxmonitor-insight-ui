
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ComponentExplanation from "@/components/ui/component-explanation";
import { AlertTriangle, ShieldCheck, Info } from "lucide-react";

interface NetworkIssue {
  id: string;
  name: string;
  severity: "low" | "medium" | "high";
  description: string;
}

interface NetworkAnalysisProps {
  metrics: {
    latency: number;
    jitter: number;
    packetLoss: number;
    bandwidth: number;
    dnsDelay: number;
    healthScore: number;
    stability: "stable" | "unstable" | "critical";
    congestion: "stable" | "unstable" | "critical";
  };
}

const NetworkAnalysis = ({ metrics }: NetworkAnalysisProps) => {
  // Determine issues based on metrics
  const generateIssues = (): NetworkIssue[] => {
    const issues: NetworkIssue[] = [];
    
    if (metrics.latency > 100) {
      issues.push({
        id: "high-latency",
        name: "High Network Latency",
        severity: metrics.latency > 150 ? "high" : "medium",
        description: `Your latency of ${metrics.latency}ms is higher than recommended for interactive applications.`
      });
    }
    
    if (metrics.packetLoss > 2) {
      issues.push({
        id: "packet-loss",
        name: "Significant Packet Loss",
        severity: metrics.packetLoss > 5 ? "high" : "medium",
        description: `Packet loss of ${metrics.packetLoss}% may cause connection issues and reduced performance.`
      });
    }
    
    if (metrics.jitter > 20) {
      issues.push({
        id: "high-jitter",
        name: "Connection Instability",
        severity: metrics.jitter > 40 ? "high" : "medium",
        description: `Jitter of ${metrics.jitter}ms indicates an unstable connection that may affect real-time applications.`
      });
    }
    
    if (metrics.dnsDelay > 70) {
      issues.push({
        id: "dns-delay",
        name: "Slow DNS Resolution",
        severity: "medium",
        description: `DNS delay of ${metrics.dnsDelay}ms might cause delays when accessing new websites.`
      });
    }
    
    if (metrics.bandwidth < 50) {
      issues.push({
        id: "low-bandwidth",
        name: "Limited Bandwidth",
        severity: metrics.bandwidth < 20 ? "high" : "medium",
        description: `Available bandwidth of ${metrics.bandwidth}Mbps may be insufficient for high-quality streaming or large downloads.`
      });
    }
    
    return issues;
  };
  
  const issues = generateIssues();
  
  // Handle fixing an issue
  const handleFixIssue = (issueId: string) => {
    console.log(`Fixing issue: ${issueId}`);
    // In a real app, this would trigger a network optimization process
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "low":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <Card className="bg-card/95 backdrop-blur-sm border-indigo-900/40 shadow-lg shadow-indigo-500/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="font-montserrat flex items-center gap-2">
            Network Analysis
            <ComponentExplanation 
              componentName="Network Analysis" 
              data={metrics}
              className="ml-2" 
            />
          </CardTitle>
          <CardDescription>
            AI-powered insights about your network conditions
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {issues.length > 0 ? (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div 
                key={issue.id}
                className="flex items-start justify-between p-3 rounded-lg border border-accent/30 bg-background/40"
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(issue.severity)}
                  <div>
                    <h4 className="text-sm font-medium">{issue.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{issue.description}</p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleFixIssue(issue.id)}
                  variant="outline" 
                  className="text-xs bg-accent/30 hover:bg-accent/50"
                >
                  Fix
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-6 flex-col gap-2">
            <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
            <h4 className="text-sm font-medium">Your network is healthy</h4>
            <p className="text-xs text-muted-foreground text-center">
              No significant issues detected with your current network configuration.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkAnalysis;
