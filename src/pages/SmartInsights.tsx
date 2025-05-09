
import { useState } from "react";
import LiveChart from "@/components/dashboard/LiveChart";
import { cn } from "@/lib/utils";
import { Brain, Search, AlertTriangle } from "lucide-react";

interface DataPoint {
  timestamp: number;
  value: number;
}

// Generate mock prediction data
const generatePredictionData = (): { actual: DataPoint[], predicted: DataPoint[] } => {
  const now = Date.now();
  const actual: DataPoint[] = [];
  const predicted: DataPoint[] = [];
  
  // Generate 60 seconds of past data
  for (let i = 0; i < 60; i++) {
    const time = now - (60 - i) * 1000;
    const baseValue = 50 + Math.sin(i / 10) * 10;
    const noise = (Math.random() - 0.5) * 15;
    
    actual.push({
      timestamp: time,
      value: baseValue + noise
    });
  }
  
  // Generate 30 seconds of future prediction
  const lastActualValue = actual[actual.length - 1].value;
  for (let i = 0; i < 30; i++) {
    const time = now + i * 1000;
    const baseValue = 50 + Math.sin((i + 60) / 10) * 10;
    const noise = (Math.random() - 0.5) * 5; // Less noise in predictions
    
    predicted.push({
      timestamp: time,
      value: baseValue + noise
    });
  }
  
  return { actual, predicted };
};

// Generate mock anomaly data
const generateAnomalyData = () => {
  return [
    {
      time: "14:32:15",
      description: "Sudden latency spike detected",
      type: "warning",
      value: "145ms"
    },
    {
      time: "14:25:08",
      description: "Unusual DNS resolution pattern",
      type: "info",
      value: "12 requests/sec"
    },
    {
      time: "13:58:41",
      description: "Bandwidth usage anomaly",
      type: "warning",
      value: "95% utilization"
    }
  ];
};

const SmartInsights = () => {
  const [predictionData, setPredictionData] = useState(generatePredictionData());
  const [anomalies, setAnomalies] = useState(generateAnomalyData());
  const [networkState, setNetworkState] = useState({
    state: "normal", // "normal", "anomaly", "critical"
    confidence: 87
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyzeNetwork = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const newPredictionData = generatePredictionData();
      setPredictionData(newPredictionData);
      
      // Randomly change network state for demo purposes
      const states = ["normal", "anomaly", "critical"];
      const randomState = states[Math.floor(Math.random() * states.length)];
      setNetworkState({
        state: randomState,
        confidence: 70 + Math.floor(Math.random() * 25)
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };
  
  const getNetworkStateDisplay = () => {
    switch (networkState.state) {
      case "normal":
        return {
          label: "Normal",
          color: "text-limeGreen",
          shadow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
          description: "Your network is functioning within normal parameters."
        };
      case "anomaly":
        return {
          label: "Anomaly Detected",
          color: "text-yellow-400",
          shadow: "shadow-[0_0_15px_rgba(250,204,21,0.3)]",
          description: "Unusual patterns detected in your network activity."
        };
      case "critical":
        return {
          label: "Critical",
          color: "text-coralRed",
          shadow: "shadow-[0_0_15px_rgba(248,113,113,0.3)]",
          description: "Your network is experiencing critical issues."
        };
    }
  };
  
  const stateDisplay = getNetworkStateDisplay();
  
  // Combine actual and predicted data for chart
  const combinedData = [...predictionData.actual, ...predictionData.predicted];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Smart Insights</h1>
          <p className="text-muted-foreground">AI-powered network analysis and predictions</p>
        </div>
        <button 
          className="glow-button flex items-center gap-2"
          onClick={handleAnalyzeNetwork}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search size={18} />
              <span>Check My Network</span>
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <div className="network-card">
            <h2 className="text-lg font-medium mb-4">Latency Prediction (LSTM Model)</h2>
            
            <div className="relative">
              {/* Chart */}
              <div className="mb-4" style={{ height: '300px' }}>
                <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <g className="grid-lines">
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                      <line
                        key={i}
                        x1="50"
                        y1={20 + ratio * (300 - 50)}
                        x2="980"
                        y2={20 + ratio * (300 - 50)}
                        stroke="#6B7280"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        opacity="0.3"
                      />
                    ))}
                  </g>
                  
                  {/* Vertical line separating past and future */}
                  <line 
                    x1="680" 
                    y1="20" 
                    x2="680" 
                    y2="270" 
                    stroke="#6B7280" 
                    strokeWidth="1"
                    strokeDasharray="5,5" 
                  />
                  <text x="680" y="290" fill="#6B7280" fontSize="12" textAnchor="middle">Now</text>
                  
                  {/* Actual data line */}
                  <path
                    d={predictionData.actual.map((pt, i) => {
                      const x = 50 + (i / 59) * 630;
                      const y = 270 - ((pt.value - 0) / 100) * 250;
                      return i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
                    }).join("")}
                    stroke="#00B7EB"
                    strokeWidth="2"
                    fill="none"
                  />
                  
                  {/* Prediction data line */}
                  <path
                    d={predictionData.predicted.map((pt, i) => {
                      const x = 680 + (i / 29) * 300;
                      const y = 270 - ((pt.value - 0) / 100) * 250;
                      return i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
                    }).join("")}
                    stroke="#A855F7"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                  />
                  
                  {/* Legend */}
                  <g transform="translate(50, 20)">
                    <line x1="0" y1="0" x2="20" y2="0" stroke="#00B7EB" strokeWidth="2" />
                    <text x="25" y="5" fill="#F5F6F5" fontSize="12">Actual</text>
                    
                    <line x1="100" y1="0" x2="120" y2="0" stroke="#A855F7" strokeWidth="2" strokeDasharray="5,5" />
                    <text x="125" y="5" fill="#F5F6F5" fontSize="12">Predicted</text>
                  </g>
                </svg>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                The chart shows actual latency data (left) and AI-predicted future latency (right)
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="network-card mb-6">
            <h2 className="text-lg font-medium mb-4">Network State</h2>
            
            <div className="flex flex-col items-center py-4">
              <div 
                className={cn(
                  "text-2xl font-bold py-2 px-6 rounded-full border mb-4",
                  stateDisplay.color,
                  stateDisplay.shadow,
                  `border-${stateDisplay.color}`
                )}
              >
                {stateDisplay.label}
              </div>
              <p className="text-sm text-muted-foreground text-center mb-2">{stateDisplay.description}</p>
              <div className="flex items-center gap-1 text-sm">
                <Brain size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-fira-code">{networkState.confidence}%</span>
              </div>
            </div>
          </div>
          
          <div className="network-card">
            <h2 className="text-lg font-medium mb-4">Anomaly Detection</h2>
            
            <div className="space-y-3">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="p-3 bg-muted/10 rounded-md border border-muted">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className={anomaly.type === "warning" ? "text-yellow-400" : "text-neonBlue"} />
                    <div className="flex-1">
                      <p className="text-sm">{anomaly.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-fira-code text-muted-foreground">{anomaly.time}</span>
                        <span className="text-xs font-fira-code">{anomaly.value}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;
