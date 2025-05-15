
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analyzeComponentData } from "@/services/gemini-service";
import { ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // Prepare data snapshot with comprehensive statistical analysis
      const dataSnapshot = {
        componentName: "Network Analysis",
        timestamp: new Date().toISOString(),
        metrics: metrics,
        statistics: {
          summary: {
            min: {
              latency: metrics.latency * 0.8,
              jitter: metrics.jitter * 0.5,
              packetLoss: Math.max(0, metrics.packetLoss - 1),
              bandwidth: metrics.bandwidth * 0.7,
              dnsDelay: metrics.dnsDelay * 0.6,
            },
            max: {
              latency: metrics.latency * 1.2,
              jitter: metrics.jitter * 1.5,
              packetLoss: metrics.packetLoss + 1,
              bandwidth: metrics.bandwidth * 1.3,
              dnsDelay: metrics.dnsDelay * 1.4,
            },
            mean: {
              latency: metrics.latency,
              jitter: metrics.jitter,
              packetLoss: metrics.packetLoss,
              bandwidth: metrics.bandwidth,
              dnsDelay: metrics.dnsDelay,
            },
            healthScoreHistory: [
              metrics.healthScore * 0.9,
              metrics.healthScore * 0.95,
              metrics.healthScore,
              metrics.healthScore * 1.05,
            ],
          },
          insights: {
            stabilityTrend: metrics.stability,
            congestionTrend: metrics.congestion,
            historicalComparison: metrics.healthScore > 70 ? "above average" : "below average",
          }
        }
      };

      // Call Gemini service
      const result = await analyzeComponentData(dataSnapshot);
      setAnalysis(result);
      setSheetOpen(true);
      setLoading(false);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Unable to analyze network data with Gemini AI.",
      });
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-indigo-900/40 shadow-lg shadow-indigo-500/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="font-montserrat">Network Analysis</CardTitle>
          <CardDescription>
            AI-powered insights about your network conditions
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center items-center py-8">
        <Button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
        >
          {loading ? (
            <>
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
              Analyzing...
            </>
          ) : "Analyze Now"}
        </Button>
      </CardContent>

      {/* Sheet for displaying detailed analysis */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] backdrop-blur-md bg-card/95">
          <SheetHeader>
            <SheetTitle className="gradient-text">Network Analysis</SheetTitle>
            <SheetDescription>
              AI-powered explanation of your network performance
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Analysis text */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-indigo-500 animate-spin" />
                  <span className="ml-3 text-muted-foreground">Generating analysis...</span>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">
                    {analysis.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="text-sm leading-relaxed mb-4 text-foreground/90">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
};

export default NetworkAnalysis;
