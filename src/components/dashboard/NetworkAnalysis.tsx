
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NetworkAnalysisProps {
  metrics: {
    latency: number;
    jitter: number;
    packetLoss: number;
    bandwidth: number;
    dnsDelay: number;
    healthScore: number;
    stability: string;
    congestion: string;
  };
  className?: string;
}

const NetworkAnalysis = ({ metrics, className }: NetworkAnalysisProps) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // This function would call the backend API in a real implementation
  const getAnalysis = async () => {
    setLoading(true);
    
    try {
      // Simulating an API call to the backend
      // In a real implementation, this would be a fetch request to your backend
      setTimeout(() => {
        // Mock response for the demo
        const mockAnalysis = 
          `Based on your metrics, your network shows ${metrics.healthScore > 70 ? 'good' : metrics.healthScore > 50 ? 'moderate' : 'poor'} overall health. 
          
          ${metrics.latency > 100 ? 'High latency suggests distance to servers or congestion. Consider using a closer server or reducing network load.' : ''}
          ${metrics.jitter > 20 ? 'Jitter indicates inconsistent connection quality. Check for interference or competing traffic.' : ''}
          ${metrics.packetLoss > 2 ? 'Packet loss may cause disconnections. Check your physical connection or contact your ISP.' : ''}
          
          Recommendations:
          ${metrics.bandwidth < 50 ? '• Increase available bandwidth by closing background applications.' : ''}
          ${metrics.dnsDelay > 50 ? '• Use a faster DNS server to improve lookup times.' : ''}
          ${metrics.congestion !== "stable" ? '• Reduce network congestion by limiting high-bandwidth activities during peak times.' : ''}`;
        
        setAnalysis(mockAnalysis);
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Unable to analyze network metrics.",
      });
      setLoading(false);
    }
  };

  return (
    <Card className={cn("network-card min-h-[200px]", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-montserrat flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          AI Network Analysis
        </CardTitle>
        <CardDescription>Get AI-powered insights and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {analysis ? (
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="whitespace-pre-line text-sm">{analysis}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <Info className="h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              Click the button below to analyze your network performance
            </p>
            <Button 
              onClick={getAnalysis}
              disabled={loading}
              className="glow-button"
            >
              {loading ? "Analyzing..." : "Analyze My Network"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkAnalysis;
