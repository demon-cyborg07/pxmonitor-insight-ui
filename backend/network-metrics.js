
/**
 * Network Metrics Generator
 * 
 * This module implements the functionality from the provided Python code,
 * adapted to Node.js. It provides functions for collecting and analyzing
 * network packet data, calculating metrics, and identifying applications.
 */

// Mock implementation of the identify_top_applications function
function identifyTopApplications(data, topN = 5) {
  if (!data || data.length === 0) {
    return [];
  }
  
  // Port to application mapping
  const portMap = {
    80: "HTTP",
    443: "HTTPS",
    53: "DNS",
    22: "SSH",
    21: "FTP",
    25: "SMTP",
    110: "POP3",
    143: "IMAP",
    3389: "RDP",
    1194: "OpenVPN",
    3306: "MySQL",
    5432: "PostgreSQL",
    27017: "MongoDB",
    6379: "Redis",
    8080: "HTTP-Alt",
    8443: "HTTPS-Alt",
  };

  // Group data by application
  const applications = {};
  data.forEach(packet => {
    const srcPort = packet.tcp_src_port;
    const dstPort = packet.tcp_dst_port;
    
    let appName = "Unknown";
    if (portMap[srcPort]) {
      appName = portMap[srcPort];
    } else if (portMap[dstPort]) {
      appName = portMap[dstPort];
    } else if (dstPort > 1024 && dstPort < 49151) {
      appName = `App-Port-${dstPort}`;
    }
    
    if (!applications[appName]) {
      applications[appName] = 0;
    }
    applications[appName] += packet.frameLen;
  });
  
  // Convert to array and sort
  const appArray = Object.entries(applications).map(([application, frameLen]) => ({
    application,
    'frame.len': frameLen
  }));
  
  // Sort and return top N
  return appArray
    .sort((a, b) => b['frame.len'] - a['frame.len'])
    .slice(0, topN);
}

// Mock implementation of the calculate_metrics function
function calculateNetworkMetrics(data) {
  if (!data || data.length === 0) {
    return {
      timestamp: Date.now() / 1000,
      latency: 0,
      jitter: 0,
      bandwidth: 0,
      packet_loss: 0,
      dns_delay: 0,
      health_score: 50,
      stability: "Stable",
      congestion_level: "Low",
      packet_count: 0,
      protocol_counts: {},
      packet_sizes: [],
      top_apps: []
    };
  }
  
  // Calculate metrics
  const latency = calculateAverage(data.filter(p => p.ack_rtt).map(p => p.ack_rtt * 1000));
  const jitter = calculateStdDev(data.filter(p => p.time_delta).map(p => p.time_delta * 1000));
  const totalBytes = data.reduce((sum, p) => sum + p.frameLen, 0);
  
  const times = data.map(p => p.time);
  const timeSpan = Math.max(...times) - Math.min(...times);
  const bandwidth = timeSpan > 0 ? (totalBytes * 8) / (timeSpan * 1000000) : 0;
  
  const retransmissions = data.filter(p => p.retransmission).length;
  const packet_loss = data.length > 0 ? (retransmissions / data.length) * 100 : 0;
  
  const dnsPackets = data.filter(p => p.protocol === "DNS");
  const dns_delay = calculateAverage(dnsPackets.map(p => p.time_delta * 1000));
  
  const avgWindow = calculateAverage(data.filter(p => p.window_size).map(p => p.window_size));
  
  // Determine congestion level
  let congestion_level = "Low";
  if (!(avgWindow > 8000 && bandwidth > 5)) {
    congestion_level = (avgWindow > 4000 || bandwidth > 2) ? "Moderate" : "High";
  }
  
  // Determine stability
  let stability = "Stable";
  if (!(jitter < 10 && packet_loss < 1)) {
    stability = (jitter < 30 && packet_loss < 5) ? "Unstable" : "Very Unstable";
  }
  
  // Calculate health score
  const latencyScore = Math.max(0, 100 - (latency / 2)) * 0.3;
  const jitterScore = Math.max(0, 100 - (jitter * 2)) * 0.2;
  const packetLossScore = Math.max(0, 100 - (packet_loss * 10)) * 0.25;
  const bandwidthScore = Math.min(100, bandwidth * 10) * 0.15;
  const dnsScore = Math.max(0, 100 - (dns_delay * 2)) * 0.1;
  
  let health_score = Math.round(latencyScore + jitterScore + packetLossScore + bandwidthScore + dnsScore);
  health_score = Math.max(1, Math.min(100, health_score));
  
  // Count protocols
  const protocol_counts = {};
  data.forEach(p => {
    const protocol = p.protocol || "Unknown";
    protocol_counts[protocol] = (protocol_counts[protocol] || 0) + 1;
  });
  
  return {
    timestamp: Date.now() / 1000,
    latency,
    jitter,
    bandwidth,
    packet_loss,
    dns_delay,
    health_score,
    stability,
    congestion_level,
    packet_count: data.length,
    protocol_counts,
    packet_sizes: data.map(p => p.frameLen),
    top_apps: identifyTopApplications(data)
  };
}

// Helper functions for statistics
function calculateAverage(array) {
  if (!array || array.length === 0) return 0;
  return array.reduce((a, b) => a + b, 0) / array.length;
}

function calculateStdDev(array) {
  if (!array || array.length <= 1) return 0;
  const avg = calculateAverage(array);
  const squareDiffs = array.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  const avgSquareDiff = calculateAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

module.exports = {
  identifyTopApplications,
  calculateNetworkMetrics
};
