import { useState, useEffect } from "react";
import NetworkHealthGauge from "@/components/dashboard/NetworkHealthGauge";
import MetricCard from "@/components/dashboard/MetricCard";
import StatusCard from "@/components/dashboard/StatusCard";
import AlertBanner from "@/components/dashboard/AlertBanner";
import ProtocolDistribution from "@/components/dashboard/ProtocolDistribution";
import MultiLineChart from "@/components/dashboard/MultiLineChart";
import NetworkAnalysis from "@/components/dashboard/NetworkAnalysis";
import { Clock, Wifi, FileTerminal, Database, Activity } from "lucide-react";

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

// Updated interfaces for chart data types
interface LatencyDataPoint {
  timestamp: number;
  latency: number;
  baseline: number;
}

interface BandwidthDataPoint {
  timestamp: number;
  bandwidth: number;
  target: number;
}

interface JitterDataPoint {
  timestamp: number;
  jitter: number;
  packetLoss: number;
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

// Generate mock latency chart data
const generateLatencyChartData = (count: number) => {
  const now = Date.now();
  return Array.from({ length: count }).map((_, index) => {
    const baseLatency = 50;
    return {
      timestamp: now - (count - index) * 1000, // 1 second apart
      latency: baseLatency + (Math.random() - 0.5) * 20,
      baseline: 50
    };
  });
};

// Generate mock bandwidth chart data
const generateBandwidthChartData = (count: number) => {
  const now = Date.now();
  return Array.from({ length: count }).map((_, index) => {
    const baseBandwidth = 75;
    return {
      timestamp: now - (count - index) * 1000, // 1 second apart
      bandwidth: baseBandwidth + (Math.random() - 0.5) * 15,
      target: 90
    };
  });
};

// Generate mock jitter chart data
const generateJitterChartData = (count: number) => {
  const now = Date.now();
  return Array.from({ length: count }).map((_, index) => {
    const baseJitter = 15;
    return {
      timestamp: now - (count - index) * 1000, // 1 second apart
      jitter: baseJitter + (Math.random() - 0.5) * 10,
      packetLoss: (Math.random() - 0.5) * 10 * 3 // Scale for visualization
    };
  });
};

// Mock protocol distribution data
const generateProtocolData = () => {
  return [
    { name: "HTTPS", value: Math.floor(Math.random() * 400 + 300) },
    { name: "DNS", value: Math.floor(Math.random() * 200 + 100) },
    { name: "SSH", value: Math.floor(Math.random() * 100 + 50) },
    { name: "SMTP", value: Math.floor(Math.random() * 80 + 20) },
    { name: "FTP", value: Math.floor(Math.random() * 50 + 10) },
    { name: "Other", value: Math.floor(Math.random() * 100 + 50) }
  ];
};

// Mock top applications data
const generateTopAppsData = () => {
  return [
    { name: "Chrome", value: Math.floor(Math.random() * 50000 + 80000) },
    { name: "Zoom", value: Math.floor(Math.random() * 30000 + 40000) },
    { name: "Slack", value: Math.floor(Math.random() * 20000 + 30000) },
    { name: "Spotify", value: Math.floor(Math.random() * 10000 + 20000) },
    { name: "VS Code", value: Math.floor(Math.random() * 8000 + 10000) }
  ];
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState<MetricsData>(generateMockMetrics());
  const [latencyData, setLatencyData] = useState<LatencyDataPoint[]>(generateLatencyChartData(60));
  const [bandwidthData, setBandwidthData] = useState<BandwidthDataPoint[]>(generateBandwidthChartData(60));
  const [jitterData, setJitterData] = useState<JitterDataPoint[]>(generateJitterChartData(60));
  const [protocolData, setProtocolData] = useState(generateProtocolData());
  const [topAppsData, setTopAppsData] = useState(generateTopAppsData());
  const [showAlert, setShowAlert] = useState(metrics.healthScore < 50);
  const [showNotifications, setShowNotifications] = useState(true);
  
  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pxmonitor-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        const notificationsSetting = parsedSettings
          .find((group: any) => group.id === "general")
          ?.settings.find((setting: any) => setting.id === "notifications")?.value;
        
        if (notificationsSetting !== undefined) {
          setShowNotifications(notificationsSetting);
        }
      } catch (error) {
        console.error("Error loading notification settings:", error);
      }
    }
  }, []);
  
  // Listen for settings updates
  useEffect(() => {
    const handleSettingsUpdate = (event: any) => {
      if (event.detail?.showNotifications !== undefined) {
        setShowNotifications(event.detail.showNotifications);
      }
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);
  
  useEffect(() => {
    // Update metrics every second
    const intervalId = setInterval(() => {
      const newMetrics = generateMockMetrics();
      setMetrics(newMetrics);
      
      // Update time series charts data
      const now = Date.now();
      
      setLatencyData(prev => {
        const newPoint = {
          timestamp: now,
          latency: newMetrics.latency,
          baseline: 50
        };
        return [...prev.slice(1), newPoint];
      });
      
      setBandwidthData(prev => {
        const newPoint = {
          timestamp: now,
          bandwidth: newMetrics.bandwidth,
          target: 90
        };
        return [...prev.slice(1), newPoint];
      });
      
      setJitterData(prev => {
        const newPoint = {
          timestamp: now,
          jitter: newMetrics.jitter,
          packetLoss: newMetrics.packetLoss * 3 // Scale for visualization
        };
        return [...prev.slice(1), newPoint];
      });
      
      // Occasionally update protocol and app data
      if (Math.random() > 0.8) {
        setProtocolData(generateProtocolData());
        setTopAppsData(generateTopAppsData());
      }
      
      // Show alert when health is poor - but only if notifications are enabled
      setShowAlert(newMetrics.healthScore < 50 && showNotifications);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [showNotifications]);
  
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
    <div className="grid-bg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-montserrat">Network Dashboard</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 text-muted-foreground text-sm">
          <Clock size={16} />
          <span>Updated just now</span>
        </div>
      </div>
      
      {/* Alert banner for poor network health */}
      {showAlert && (
        <AlertBanner
          message="Your network performance is degraded!"
          type="error"
          actionText="Fix Now"
          onAction={handleFixNetwork}
          className="mb-6 max-w-4xl"
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
      
      {/* Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MultiLineChart
          title="Network Latency & Baseline"
          description="Real-time latency compared to target baseline"
          data={latencyData.map(d => ({ 
            timestamp: d.timestamp, 
            latency: d.latency, 
            baseline: d.baseline 
          }))}
          lines={[
            { id: 'latency', name: 'Latency (ms)', color: '#F87171' },
            { id: 'baseline', name: 'Target', color: '#22C55E' }
          ]}
          yAxisLabel="ms"
          height={250}
        />
        <MultiLineChart
          title="Bandwidth Trend"
          description="Bandwidth usage over time with target threshold"
          data={bandwidthData.map(d => ({ 
            timestamp: d.timestamp, 
            bandwidth: d.bandwidth,
            target: d.target
          }))}
          lines={[
            { id: 'bandwidth', name: 'Bandwidth (Mbps)', color: '#00B7EB' },
            { id: 'target', name: 'Target', color: '#8B5CF6' }
          ]}
          yAxisLabel="Mbps"
          height={250}
        />
      </div>
      
      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProtocolDistribution data={protocolData} />
        <MultiLineChart
          title="Connection Quality"
          description="Jitter and packet loss affecting quality"
          data={jitterData.map(d => ({ 
            timestamp: d.timestamp, 
            jitter: d.jitter,
            packetLoss: d.packetLoss 
          }))}
          lines={[
            { id: 'jitter', name: 'Jitter (ms)', color: '#F06292' },
            { id: 'packetLoss', name: 'Packet Loss (%)', color: '#EF5350' }
          ]}
          yAxisLabel="Value"
          height={250}
        />
      </div>
      
      {/* Network Analysis */}
      <div className="mb-6">
        <NetworkAnalysis metrics={metrics} />
      </div>
    </div>
  );
};

export default Dashboard;
