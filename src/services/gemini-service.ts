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

/**
 * Analyze component data and provide detailed explanation
 * @param dataSnapshot - The component data snapshot to analyze
 * @returns A promise with detailed analysis text
 */
export const analyzeComponentData = async (dataSnapshot: {
  componentName: string;
  timestamp: string;
  metrics: Record<string, any>;
  statistics?: Record<string, any>;
}): Promise<string> => {
  try {
    // In a production environment, this would be a real API call to the Gemini API
    console.log("Analyzing component data:", dataSnapshot);
    
    // Simulate API latency with longer processing time for detailed analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate mock detailed analysis with enhanced statistical data if available
    return getDetailedComponentAnalysis(dataSnapshot);
  } catch (error) {
    console.error("Error analyzing component data:", error);
    throw new Error(`Failed to analyze ${dataSnapshot.componentName} data`);
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
    "Network Analysis": "Network Analysis uses artificial intelligence to evaluate your connection metrics and provide personalized recommendations. It can identify problems you might not notice and suggest specific actions to improve performance.",
    "Network Issues": "Network Issues shows detected problems affecting your connection quality. Each issue is analyzed by severity and impact on your online experience, with actionable recommendations to resolve them.",
    "Slow DNS Resolution": "Slow DNS Resolution occurs when your device takes too long to translate website addresses to IP addresses. This causes delays when initially loading websites and can significantly impact browsing experience.",
    "Wi-Fi Interference": "Wi-Fi Interference happens when other networks or electronic devices disrupt your wireless signal. This can reduce signal strength, increase latency, and cause intermittent disconnections, particularly in congested areas."
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

// Helper function to get detailed component analysis
const getDetailedComponentAnalysis = (dataSnapshot: {
  componentName: string;
  timestamp: string;
  metrics: Record<string, any>;
  statistics?: Record<string, any>;
}): string => {
  const { componentName, metrics, statistics } = dataSnapshot;
  
  // Log the received statistical data for debugging in development
  console.log("Received statistics for analysis:", statistics);
  
  // Use a more sophisticated analysis if statistics are provided
  const hasDetailedStats = statistics && Object.keys(statistics).length > 0;
  
  const analysisResponses: Record<string, string> = {
    "Network Health": 
      `# Network Health Score Explained\n
      The Network Health Score you're seeing (${metrics.score || 'N/A'}) combines multiple metrics into a single value that represents the overall quality of your network connection.\n
      ## How It's Calculated\n
      Your score is calculated from these weighted factors:
      • Latency (30%): How quickly data travels between devices
      • Packet Loss (25%): Percentage of data that fails to reach its destination
      • Jitter (20%): Variation in latency over time
      • Bandwidth (15%): Available data transfer capacity
      • DNS Resolution (10%): Speed of domain name lookups\n
      ## What Your Score Means\n
      • 80-100: Excellent - Perfect for video calls, gaming, and all online activities
      • 60-79: Good - Suitable for most activities with occasional minor issues
      • 40-59: Fair - Basic browsing works but may experience issues with video or gaming
      • Below 40: Poor - Connection issues are likely affecting most online activities\n
      The gauge visualization shows where your score falls within this spectrum, with green representing excellent performance and red indicating poor performance.`,
      
    "Network Latency & Baseline":
      `# Network Latency Explained\n
      This chart shows your connection's response time (latency) compared to an ideal baseline.\n
      ## What You're Seeing\n
      • The red line shows your actual latency measured in milliseconds (ms)
      • The green line shows the target baseline (ideal performance)\n
      ## Why This Matters\n
      Latency is the delay between sending and receiving data. Think of it like the time between turning on a light switch and the light actually turning on.\n
      Lower latency means:
      • Faster webpage loading
      • More responsive video calls
      • Better online gaming experience
      • Smoother streaming\n
      ## Current Performance\n
      Your latency has been averaging around ${metrics.latency?.average || 'N/A'} ms recently.
      ${(metrics.latency?.average > 100) ? 'This is higher than ideal and may be causing noticeable delays.' : 
      (metrics.latency?.average > 50) ? 'This is acceptable for most uses but could be improved.' : 
      'This is excellent performance suitable for all online activities.'}\n
      The closer your red line stays to the green baseline, the better your experience will be.`,
      
    "Bandwidth Trend":
      `# Bandwidth Explained\n
      This chart tracks your actual data transfer rate compared to your target threshold.\n
      ## What You're Seeing\n
      • The blue line shows your actual bandwidth in Megabits per second (Mbps)
      • The purple line shows your target bandwidth\n
      ## Why This Matters\n
      Bandwidth is like the width of a water pipe - wider pipes allow more water to flow. Similarly, higher bandwidth allows more data to transfer at once.\n
      Higher bandwidth means:
      • Faster downloads and uploads
      • Support for multiple simultaneous users
      • Higher quality video streaming
      • Less congestion when multiple devices are active\n
      ## Current Performance\n
      Your bandwidth has been averaging around ${metrics.bandwidth?.average || 'N/A'} Mbps recently.
      ${(metrics.bandwidth?.average < 50) ? 'This is lower than recommended for high-definition streaming and may cause buffering.' : 
      (metrics.bandwidth?.average < 100) ? 'This is sufficient for most households with moderate internet usage.' : 
      'This is excellent performance suitable for heavy internet usage across multiple devices.'}\n
      The closer your blue line stays to or exceeds the purple target line, the better your experience will be.`,
      
    "Connection Quality":
      `# Connection Quality Explained\n
      This chart combines jitter and packet loss - two critical factors that affect real-time applications.\n
      ## What You're Seeing\n
      • The pink line shows jitter (variation in latency) measured in milliseconds (ms)
      • The red line shows packet loss percentage multiplied to fit the same scale\n
      ## Why This Matters\n
      Think of your network connection like a delivery service:
      • Jitter is like inconsistent delivery times - packages arriving at unpredictable intervals
      • Packet loss is like packages never arriving at all\n
      Low jitter and packet loss mean:
      • Smoother video calls without freezing
      • Consistent gaming experience without jumps
      • Clear VoIP calls without dropouts
      • Reliable streaming without buffering\n
      ## Current Performance\n
      Your connection is showing ${metrics.jitter?.average || 'N/A'} ms of jitter and ${metrics.packetLoss?.average || 'N/A'}% packet loss.
      ${(metrics.jitter?.average > 20 || metrics.packetLoss?.average > 2) ? 'These values indicate unstable connection quality that could be causing noticeable issues with real-time applications.' : 
      (metrics.jitter?.average > 10 || metrics.packetLoss?.average > 1) ? 'These values indicate acceptable but not ideal connection quality.' : 
      'These values indicate excellent connection quality suitable for all applications.'}\n
      Lower values on both lines indicate a more stable and reliable connection.`,
      
    "Protocol Distribution":
      `# Protocol Distribution Explained\n
      This chart shows the breakdown of different types of network traffic in your connection.\n
      ## What You're Seeing\n
      Each segment represents a different network protocol (communication method) and its relative volume on your network.\n
      ## Why This Matters\n
      Understanding your protocol distribution helps identify:
      • What types of activities are consuming your bandwidth
      • Potential security concerns from unusual traffic patterns
      • Opportunities to optimize network performance\n
      ## Common Protocols\n
      • HTTPS: Secure web browsing and most internet services
      • DNS: Domain name lookups that convert website names to IP addresses
      • SSH: Secure remote access to systems
      • SMTP: Email sending
      • FTP: File transfers\n
      ## Current Traffic Pattern\n
      Your network shows predominantly ${Object.keys(metrics)[0] || 'N/A'} traffic, which is ${
        Object.keys(metrics)[0] === 'HTTPS' ? 'typical for normal web browsing and online services.' :
        Object.keys(metrics)[0] === 'DNS' ? 'unusually high and might indicate DNS configuration issues.' :
        Object.keys(metrics)[0] === 'SSH' ? 'typical for development work or server administration.' :
        'showing an unusual pattern that might warrant investigation.'
      }\n
      A healthy network typically shows a mix of protocols with HTTPS being dominant for most home and office environments.`,
      
    "Top Applications":
      `# Top Applications Explained\n
      This chart shows which applications are consuming the most bandwidth on your network.\n
      ## What You're Seeing\n
      Each bar represents a different application and its relative bandwidth consumption in kilobytes.\n
      ## Why This Matters\n
      Knowing which applications use the most bandwidth helps:
      • Identify what might be slowing down your network
      • Manage data usage for metered connections
      • Prioritize important applications when bandwidth is limited
      • Spot unexpected or unusual bandwidth consumption\n
      ## Current Usage Pattern\n
      ${metrics[0]?.name || 'The top application'} is currently using the most bandwidth on your network.
      ${metrics[1]?.name ? `This is followed by ${metrics[1]?.name}.` : ''}\n
      ${(metrics[0]?.value > 80000) ? 'This high bandwidth consumption might impact other applications if your total available bandwidth is limited.' : 
      'The current distribution appears to be within normal ranges for typical usage.'}\n
      Monitoring this chart over time can help you establish what's normal for your environment and quickly identify unusual patterns that might indicate problems.`
  };
  
  // Return the matching detailed analysis or a generic one with enhanced stats information
  const baseAnalysis = analysisResponses[componentName] || 
    `# ${componentName} Analysis\n
    This component helps you monitor and understand a specific aspect of your network performance.\n
    The current data shows typical patterns for this metric, with values within expected ranges.\n
    Monitoring changes in this visualization over time will help you identify trends or issues that might require attention.\n
    Regular analysis of this data, combined with other metrics on your dashboard, provides a comprehensive picture of your overall network health and performance.`;
  
  // Add additional insights based on the statistical data if available
  if (hasDetailedStats) {
    return baseAnalysis + "\n\n## Additional Insights Based on Statistical Analysis\n" +
      "The current metrics show patterns that suggest your network is experiencing typical load conditions. " +
      "The variability in your metrics indicates normal network behavior with occasional fluctuations that are within expected ranges. " +
      "Continue monitoring these patterns to establish baseline performance for your specific environment.";
  }
  
  return baseAnalysis;
};

export default {
  getComponentExplanation,
  analyzeNetworkMetrics,
  analyzeComponentData
};
