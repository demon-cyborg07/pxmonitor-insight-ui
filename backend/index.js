
/**
 * PXMonitor Backend Service
 * 
 * This is the main entry point for the backend service that handles
 * network monitoring, data processing, and system operations.
 */

const generateMockMetrics = () => {
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
  let stability = "stable";
  if (healthScore < 50) stability = "critical";
  else if (healthScore < 70) stability = "unstable";
  
  let congestion = "stable";
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
const generateChartData = (count, baseValue, volatility) => {
  const now = Date.now();
  return Array.from({ length: count }).map((_, index) => ({
    timestamp: now - (count - index) * 1000, // 1 second apart
    value: baseValue + (Math.random() - 0.5) * volatility
  }));
};

// Example of how data would be collected from the system
// In a real implementation, this would use system APIs or native modules
const collectSystemNetworkData = () => {
  // This would be replaced with actual system calls
  return generateMockMetrics();
};

// Export the functions that would be used by the frontend
module.exports = {
  generateMockMetrics,
  generateChartData,
  collectSystemNetworkData
};
