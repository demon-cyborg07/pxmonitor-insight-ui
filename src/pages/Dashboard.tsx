
import { useState, useEffect } from "react";
import NetworkHealthGauge from "@/components/dashboard/NetworkHealthGauge";
import MetricCard from "@/components/dashboard/MetricCard";
import StatusCard from "@/components/dashboard/StatusCard";
import LiveChart from "@/components/dashboard/LiveChart";
import AlertBanner from "@/components/dashboard/AlertBanner";
import { Clock, Wifi, FileTerminal, Database, Globe, Activity } from "lucide-react";

interface MetricsData {
  latency: number;
  jitter: number;
  packetLoss: number;
  bandwidth: number;
  dnsDelay: number;
  healthScore: number;
  stability: "stable" | "unstable" | "critical";
  congestion: "stable" | "unstable" | "critical";
}

// Mock data function to simulate network metrics
const generateMockMetrics = (): MetricsData => {
  // Random score between 30 and 95
  const healthScore = Math.floor(Math.random() * 65) + 30;
  
  // Generate related metrics that make sense based on health score
  const scoreQuality = healthScore / 100;
  
  // Better score means lower latency/jitter/packet loss and higher bandwidth
  const latency = Math.round((1 - scoreQuality) * 150 + 10);
  const jitter = Math.round((1 - scoreQuality) * 50 + 1);
  const packetLoss = Math.round((1 - scoreQuality) * 10 * 10) / 10;
  const bandwidth = Math.round(scoreQuality * 900 + 50) / 10;
  const dnsDelay = Math.round((1 - scoreQuality) * 100 + 5);
  
  // Determine stability and congestion based on scores
  let stability: "stable" | "unstable" | "critical" = "stable";
  if (healthScore < 50) stability = "critical";
  else if (healthScore < 70) stability = "unstable";
  
  let congestion: "stable" | "unstable" | "critical" = "stable";
  if (jitter > 30 || bandwidth < 50) congestion = "critical";
  else if (jitter > 15 || bandwidth < 70) congestion = "unstable";
  
  return {
    latency,
    jitter,
    packetLoss,
    bandwidth, 
    dnsDelay,
    healthScore,
    stability,
    congestion
  };
};

// Generate mock chart data
const generateChartData = (count: number, baseValue: number, volatility: number) => {
  const now = Date.now();
  return Array.from({ length: count }).map((_, index) => ({
    timestamp: now - (count - index) * 1000, // 1 second apart
    value: baseValue + (Math.random() - 0.5) * volatility
  }));
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState<MetricsData>(generateMockMetrics());
  const [latencyData, setLatencyData] = useState(generateChartData(60, 50, 20));
  const [bandwidthData, setBandwidthData] = useState(generateChartData(60, 75, 15));
  const [showAlert, setShowAlert] = useState(metrics.healthScore < 50);
  
  useEffect(() => {
    // Update metrics every second
    const intervalId = setInterval(() => {
      const newMetrics = generateMockMetrics();
      setMetrics(newMetrics);
      
      // Update chart data
      setLatencyData(prev => {
        const newPoint = {
          timestamp: Date.now(),
          value: newMetrics.latency
        };
        return [...prev.slice(1), newPoint];
      });
      
      setBandwidthData(prev => {
        const newPoint = {
          timestamp: Date.now(),
          value: newMetrics.bandwidth * 10 // Scale for visualization
        };
        return [...prev.slice(1), newPoint];
      });
      
      // Show alert when health is poor
      setShowAlert(newMetrics.healthScore < 50);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleFixNetwork = () => {
    // Simulate fixing the network
    const improvedMetrics = {
      ...metrics,
      healthScore: Math.min(85, metrics.healthScore + 40),
      latency: Math.max(20, metrics.latency - 50),
      packetLoss: Math.max(0.2, metrics.packetLoss - 5),
      bandwidth: Math.min(95, metrics.bandwidth + 20),
      stability: "stable" as const,
      congestion: "stable" as const
    };
    setMetrics(improvedMetrics);
    setShowAlert(false);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Network Dashboard</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 text-muted-foreground text-sm">
          <Clock size={16} />
          <span>Updated just now</span>
        </div>
      </div>
      
      {/* Show alert banner when network health is poor */}
      {showAlert && (
        <AlertBanner
          message="Your network performance is degraded!"
          type="error"
          actionText="Fix Now"
          onAction={handleFixNetwork}
        />
      )}
      
      {/* Main metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <NetworkHealthGauge score={metrics.healthScore} />
        <StatusCard 
          title="Connection Stability" 
          status={metrics.stability} 
          description={
            metrics.stability === "stable" 
              ? "Your connection is reliable and stable" 
              : "Your connection is experiencing issues"
          }
        />
        <StatusCard 
          title="Network Congestion" 
          status={metrics.congestion}
          description={
            metrics.congestion === "stable" 
              ? "Network traffic is flowing smoothly" 
              : "Network traffic is congested"
          }
        />
      </div>
      
      {/* Detailed metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <MetricCard
          title="Latency"
          value={metrics.latency}
          unit="ms"
          icon={<Activity size={18} />}
          status={metrics.latency < 50 ? "success" : metrics.latency < 100 ? "warning" : "danger"}
        />
        <MetricCard
          title="Jitter"
          value={metrics.jitter}
          unit="ms"
          icon={<Activity size={18} />}
          status={metrics.jitter < 10 ? "success" : metrics.jitter < 20 ? "warning" : "danger"}
        />
        <MetricCard
          title="Packet Loss"
          value={metrics.packetLoss}
          unit="%"
          icon={<FileTerminal size={18} />}
          status={metrics.packetLoss < 1 ? "success" : metrics.packetLoss < 3 ? "warning" : "danger"}
        />
        <MetricCard
          title="DNS Delay"
          value={metrics.dnsDelay}
          unit="ms"
          icon={<Database size={18} />}
          status={metrics.dnsDelay < 30 ? "success" : metrics.dnsDelay < 70 ? "warning" : "danger"}
        />
        <MetricCard
          title="Bandwidth"
          value={metrics.bandwidth}
          unit="Mbps"
          icon={<Wifi size={18} />}
          status={metrics.bandwidth > 80 ? "success" : metrics.bandwidth > 40 ? "warning" : "danger"}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveChart
          title="Latency Trend"
          data={latencyData}
          yAxisLabel="Latency (ms)"
          color="#F87171"
          height={250}
        />
        <LiveChart
          title="Bandwidth Trend"
          data={bandwidthData}
          yAxisLabel="Bandwidth (Mbps)"
          color="#22C55E"
          height={250}
        />
      </div>
    </div>
  );
};

export default Dashboard;
