
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
  
  return (
    <div className={cn("network-card flex flex-col items-center", className)}>
      <h3 className="text-lg font-medium mb-2">Network Health</h3>
      
      <div className="relative w-full max-w-[220px] h-[120px]">
        {/* Gauge background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="w-full h-full bg-muted/30 rounded-tl-full rounded-tr-full" 
               style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)' }}>
          </div>
        </div>
        
        {/* Gauge segments */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute bottom-0 left-0 w-full h-full flex justify-center origin-bottom">
            {/* Red segment (0-30%) */}
            <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-coralRed/70 to-coralRed/30 rounded-tl-full rounded-tr-full"
                 style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 70%, 0 70%)' }}>
            </div>
            {/* Yellow segment (30-70%) */}
            <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-yellow-400/70 to-yellow-400/30 rounded-tl-full rounded-tr-full"
                 style={{ clipPath: 'polygon(0 70%, 100% 70%, 100% 30%, 0 30%)' }}>
            </div>
            {/* Green segment (70-100%) */}
            <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-limeGreen/70 to-limeGreen/30 rounded-tl-full rounded-tr-full"
                 style={{ clipPath: 'polygon(0 30%, 100% 30%, 100% 0, 0 0)' }}>
            </div>
          </div>
        </div>
        
        {/* Gauge needle */}
        <div className="absolute bottom-0 left-1/2 w-1 h-[100px] -ml-[2px] origin-bottom bg-white"
             style={{ transform: `rotate(${angle - 90}deg)` }}>
          <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-white"></div>
        </div>
        
        {/* Gauge center */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 -ml-2 -mb-2 rounded-full bg-muted border-2 border-white"></div>
      </div>
      
      {/* Score display */}
      <div className="mt-8 text-center">
        <h4 className={`${color} text-3xl font-bold metric-value`}>{score}</h4>
        <p className={`${color} font-medium`}>{label}</p>
      </div>
    </div>
  );
};

export default NetworkHealthGauge;
