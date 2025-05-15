
import { PerformanceAlert } from "@/components/ui/performance-alert";

interface NetworkAnalysisProps {
  metrics: {
    latency: number;
    jitter: number;
    packetLoss: number;
    bandwidth: number;
    healthScore: number;
  };
}

const NetworkAnalysis = ({ metrics }: NetworkAnalysisProps) => {
  // Determine critical metrics
  const criticalMetrics = [];
  
  if (metrics.latency > 100) {
    criticalMetrics.push({
      name: "High Latency",
      value: `${metrics.latency}ms`,
      suggestion: "Consider switching to a wired connection or moving closer to your router."
    });
  }
  
  if (metrics.jitter > 20) {
    criticalMetrics.push({
      name: "Network Jitter",
      value: `${metrics.jitter}ms`,
      suggestion: "Jitter may indicate network congestion. Try closing bandwidth-heavy applications."
    });
  }
  
  if (metrics.packetLoss > 3) {
    criticalMetrics.push({
      name: "Packet Loss",
      value: `${metrics.packetLoss}%`,
      suggestion: "Check your physical connections or try a different network cable."
    });
  }
  
  if (metrics.bandwidth < 50) {
    criticalMetrics.push({
      name: "Low Bandwidth",
      value: `${metrics.bandwidth}Mbps`,
      suggestion: "Your connection may be overloaded or throttled. Try limiting concurrent downloads."
    });
  }
  
  // Calculate overall health
  let healthStatus = "Excellent";
  let suggestion = "Your network is performing optimally.";
  let variant: "success" | "warning" | "destructive" | "info" = "success";
  
  if (metrics.healthScore < 50) {
    healthStatus = "Poor";
    suggestion = "Your network is experiencing significant issues.";
    variant = "destructive";
  } else if (metrics.healthScore < 70) {
    healthStatus = "Fair";
    suggestion = "Your network has some minor issues that could be improved.";
    variant = "warning";
  } else if (metrics.healthScore < 85) {
    healthStatus = "Good";
    suggestion = "Your network is performing well with room for improvement.";
    variant = "info";
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Network Analysis</h2>
      
      <div className="mb-4">
        <PerformanceAlert
          variant={variant}
          title={`Network Health: ${healthStatus}`}
          description={suggestion}
          actionText={metrics.healthScore < 70 ? "Optimize Now" : undefined}
          onAction={metrics.healthScore < 70 ? () => console.log("Optimization triggered") : undefined}
        />
      </div>
      
      {criticalMetrics.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="text-lg font-medium">Potential Issues Detected</h3>
          
          {criticalMetrics.map((metric, index) => (
            <div 
              key={index} 
              className="bg-card rounded-lg p-3 border border-border"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{metric.name}</span>
                <span className="text-coralRed font-fira-code">{metric.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{metric.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkAnalysis;
