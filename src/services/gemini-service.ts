
/**
 * Gemini API Service
 * 
 * This module provides a client-side interface to interact with the backend
 * Gemini API service for explaining network components and providing insights.
 */

// Types for the API responses
interface ExplanationResponse {
  text: string;
  success: boolean;
}

/**
 * Get an explanation for a network component
 * @param componentName - The name of the component to explain
 * @returns A promise with the explanation text
 */
export const getComponentExplanation = async (componentName: string): Promise<string> => {
  try {
    // In a production environment, this would be a real API call
    // For now, we'll simulate with mock data
    console.log(`Getting explanation for: ${componentName}`);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a mock explanation
    return getMockExplanation(componentName);
  } catch (error) {
    console.error("Error getting component explanation:", error);
    throw new Error(`Failed to get explanation for ${componentName}`);
  }
};

/**
 * Analyze network metrics and provide insights
 * @param metrics - The network metrics to analyze
 * @returns A promise with analysis text
 */
export const analyzeNetworkMetrics = async (metrics: Record<string, any>): Promise<string> => {
  try {
    // In a production environment, this would be a real API call
    // For now, we'll simulate with mock data
    console.log("Analyzing metrics:", metrics);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on metrics
    return getMockAnalysis(metrics);
  } catch (error) {
    console.error("Error analyzing network metrics:", error);
    throw new Error("Failed to analyze network metrics");
  }
};

// Helper function to get mock explanations
const getMockExplanation = (component: string): string => {
  const explanations: Record<string, string> = {
    "Network Health": "Network Health Score combines multiple metrics into a single score from 0-100. Higher is better. It weighs latency (30%), jitter (20%), packet loss (25%), bandwidth (15%), and DNS delay (10%) to give you a quick overview of your connection quality.",
    "Connection Stability": "Connection Stability monitors the consistency of your network performance over time. A stable connection maintains similar response times and low error rates, while unstable connections show frequent fluctuations that can disrupt online activities.",
    "Network Congestion": "Network Congestion measures how crowded your connection pathway is. Like traffic on a highway, high congestion occurs when too many data packets compete for limited bandwidth, causing slowdowns and increased latency.",
    "Latency": "Latency is the time it takes for data to travel from your device to its destination and back, measured in milliseconds (ms). Lower values mean faster response times. Latency affects everything from webpage loading to online gaming performance.",
    "Jitter": "Jitter represents the variation in latency over time. While some latency is unavoidable, consistent latency (low jitter) provides a smoother experience. High jitter causes unpredictable delays that particularly affect real-time applications like video conferencing.",
    "Packet Loss": "Packet Loss occurs when data packets fail to reach their destination. Even small percentages can noticeably impact performance. Causes include network congestion, hardware problems, or wireless interference.",
    "DNS Delay": "DNS Delay measures how long your device takes to convert website names (like example.com) into IP addresses computers can use. Fast DNS resolution ensures websites load quickly when you first visit them.",
    "Bandwidth": "Bandwidth is your connection's maximum data transfer capacity. Higher bandwidth allows faster downloads, higher quality streaming, and supports multiple simultaneous users. Actual speeds may vary based on network conditions and server limitations.",
    "Protocol Distribution": "Protocol Distribution shows which types of network traffic are flowing through your connection. This helps identify what services are most active and can reveal unusual patterns that might indicate performance issues or security concerns.",
    "Top Applications": "This chart shows which applications are consuming the most bandwidth on your network. Identifying bandwidth-intensive applications helps you understand what's affecting your network performance and manage your resources effectively.",
    "Network Latency": "This chart tracks your connection's response time compared to an optimal baseline. Consistent values near the baseline indicate good performance, while spikes or sustained high values may indicate network issues.",
    "Bandwidth Trend": "Bandwidth Trend tracks your actual data transfer rate compared to your target threshold. This helps identify when your connection is underperforming and whether the issue is persistent or temporary.",
    "Connection Quality": "Connection Quality combines jitter and packet loss metrics to show overall reliability. These factors particularly affect real-time applications like video calls or online gaming, where consistent data delivery is critical.",
    "Network Analysis": "Network Analysis uses artificial intelligence to evaluate your connection metrics and provide personalized recommendations. It can identify problems you might not notice and suggest specific actions to improve performance."
  };
  
  return explanations[component] || `${component} is an important network monitoring component that helps visualize connection performance metrics in an intuitive way.`;
};

// Helper function to get mock analysis
const getMockAnalysis = (metrics: Record<string, any>): string => {
  // Create a contextual analysis based on the provided metrics
  const healthScore = metrics.healthScore || 0;
  const latency = metrics.latency || 0;
  const jitter = metrics.jitter || 0;
  const packetLoss = metrics.packetLoss || 0;
  
  let analysis = "";
  
  if (healthScore > 70) {
    analysis += "Your network is performing well overall. ";
  } else if (healthScore > 50) {
    analysis += "Your network performance is acceptable but could be improved. ";
  } else {
    analysis += "Your network is experiencing significant performance issues. ";
  }
  
  if (latency > 100) {
    analysis += "High latency suggests distance to servers or network congestion. Consider using closer servers or reducing network load. ";
  }
  
  if (jitter > 20) {
    analysis += "Elevated jitter indicates inconsistent connection quality. Check for wireless interference or competing network traffic. ";
  }
  
  if (packetLoss > 2) {
    analysis += "Packet loss above 2% may cause disconnections and poor application performance. Verify your physical connection or contact your ISP. ";
  }
  
  analysis += "\n\nRecommendations:\n";
  
  if (metrics.bandwidth < 50) {
    analysis += "• Close background applications consuming bandwidth\n";
  }
  
  if (metrics.dnsDelay > 50) {
    analysis += "• Switch to a faster DNS provider (e.g., 1.1.1.1 or 8.8.8.8)\n";
  }
  
  if (metrics.congestion !== "stable") {
    analysis += "• Schedule bandwidth-intensive activities during off-peak hours\n";
  }
  
  analysis += "• Regularly restart your router to clear its cache\n";
  analysis += "• Keep your networking equipment firmware updated";
  
  return analysis;
};

export default {
  getComponentExplanation,
  analyzeNetworkMetrics
};
