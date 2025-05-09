
import { cn } from "@/lib/utils";

interface NetworkHealthGaugeProps {
  score: number;
  className?: string;
}

const NetworkHealthGauge = ({ score, className }: NetworkHealthGaugeProps) => {
  // Map the score (0-100) to the angle (0-180 degrees)
  const angle = (score / 100) * 180;
  
  // Determine color based on score
  let color = "text-coralRed";
  if (score > 70) color = "text-limeGreen";
  else if (score > 30) color = "text-yellow-400";
  
  // Determine label based on score
  let label = "Poor";
  if (score > 70) label = "Excellent";
  else if (score > 50) label = "Good";
  else if (score > 30) label = "Fair";

  // Calculate the SVG path for the colored progress arc
  const calculateArc = (value: number) => {
    const radius = 80;
    const startAngle = -90; // Start from top center (in degrees)
    const endAngle = startAngle + (value / 100) * 180; // Up to 180 degrees maximum
    
    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Calculate start and end points
    const startX = 100 + radius * Math.cos(startRad);
    const startY = 100 + radius * Math.sin(startRad);
    const endX = 100 + radius * Math.cos(endRad);
    const endY = 100 + radius * Math.sin(endRad);
    
    // Flag for arc drawing (1 for arcs greater than 180 degrees)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    // Create arc path
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // Generate paths for each segment
  const poorPath = calculateArc(30);
  const fairPath = calculateArc(70);
  const goodPath = calculateArc(100);
  
  // Determine active segment color
  const getSegmentColor = (threshold: number) => {
    if (score <= threshold) return "stroke-current opacity-20";
    return "stroke-current";
  };
  
  return (
    <div className={cn("network-card flex flex-col items-center", className)}>
      <h3 className="text-lg font-medium font-montserrat mb-2">Network Health</h3>
      
      <div className="relative w-full max-w-[220px] h-[120px]">
        {/* Gauge background - hollow semisphere */}
        <svg className="absolute inset-0" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          {/* Track background */}
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            strokeWidth="10" 
            className="stroke-muted/30"
            strokeLinecap="round"
          />
          
          {/* Poor segment (0-30%) - always red */}
          <path 
            d={poorPath} 
            fill="none" 
            strokeWidth="10" 
            className={cn("text-coralRed", getSegmentColor(30))}
            strokeLinecap="round"
          />
          
          {/* Fair segment (30-70%) - always yellow */}
          <path 
            d={fairPath} 
            fill="none" 
            strokeWidth="10" 
            className={cn("text-yellow-400", getSegmentColor(70))}
            strokeLinecap="round"
          />
          
          {/* Good segment (70-100%) - always green */}
          <path 
            d={goodPath} 
            fill="none" 
            strokeWidth="10" 
            className={cn("text-limeGreen", getSegmentColor(100))}
            strokeLinecap="round"
          />
          
          {/* Gauge needle */}
          <line 
            x1="100" y1="100" 
            x2={100 + 80 * Math.cos((angle - 90) * Math.PI / 180)} 
            y2={100 + 80 * Math.sin((angle - 90) * Math.PI / 180)} 
            strokeWidth="2" 
            className="stroke-white" 
            strokeLinecap="round"
          />
          
          {/* Needle center point */}
          <circle cx="100" cy="100" r="4" className="fill-white" />
        </svg>
      </div>
      
      {/* Score display */}
      <div className="mt-8 text-center">
        <h4 className={`${color} text-3xl font-bold font-montserrat metric-value`}>{score}</h4>
        <p className={`${color} font-medium font-montserrat`}>{label}</p>
      </div>
    </div>
  );
};

export default NetworkHealthGauge;
