
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Welcome = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  
  const handleStart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/');
    }, 800);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-darkNavy to-[#131320] p-6">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-neonBlue text-5xl font-bold mb-4 animate-[pulse-glow_2s_ease-in-out_infinite]">
            PXMonitor
          </h1>
          <p className="text-xl text-softWhite/80">
            Keep your internet fast and reliable
          </p>
        </div>
        
        <div 
          className={cn(
            "relative w-full h-16 mb-12 transition-all duration-800 ease-in-out",
            isAnimating ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neonBlue/20 to-neonBlue/5 rounded-lg border border-neonBlue/30">
            <div className="h-full w-1/3 bg-gradient-to-r from-neonBlue/0 to-neonBlue/20 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          </div>
        </div>
        
        <button 
          onClick={handleStart}
          className={cn(
            "glow-button flex items-center justify-center gap-2 mx-auto text-lg",
            "transition-all duration-300 hover:scale-105",
            isAnimating ? "scale-150 opacity-0" : "scale-100 opacity-100"
          )}
        >
          <span>Let's Get Started</span>
          <ArrowRight size={20} />
        </button>
      </div>
      
      {/* Background network lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] border border-neonBlue/30 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[400px] h-[400px] border border-neonBlue/40 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[200px] h-[200px] border border-neonBlue/50 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Random dots */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-neonBlue rounded-full" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `pulse ${2 + Math.random() * 4}s infinite alternate`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Welcome;
