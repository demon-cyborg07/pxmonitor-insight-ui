
import React, { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { analyzeComponentData } from "@/services/gemini-service";

interface ComponentExplanationProps {
  componentName: string;
  data?: Record<string, any>;
  chart?: React.ReactNode;
  className?: string;
}

const ComponentExplanation = ({ 
  componentName, 
  data,
  chart, 
  className 
}: ComponentExplanationProps) => {
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // Prepare data snapshot for analysis
      const dataSnapshot = {
        componentName,
        timestamp: new Date().toISOString(),
        metrics: data || {},
      };

      // Call Gemini API service for analysis
      const result = await analyzeComponentData(dataSnapshot);
      setExplanation(result);
      setSheetOpen(true);
      setLoading(false);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Unable to analyze component data with Gemini AI.",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full opacity-70 hover:opacity-100 hover:bg-accent/30 ${className}`}
          >
            <Bot className="h-4 w-4" />
            <span className="sr-only">Analyze {componentName}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 backdrop-blur-md bg-card/95 border-accent/30 shadow-lg shadow-accent/20"
          sideOffset={5}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm gradient-text">AI Analysis</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Get a detailed explanation of this component and its current data.
              </p>
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  Analyzing...
                </>
              ) : "Analyze Now"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Sheet for displaying detailed analysis */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] backdrop-blur-md bg-card/95">
          <SheetHeader>
            <SheetTitle className="gradient-text">{componentName} Analysis</SheetTitle>
            <SheetDescription>
              AI-powered explanation of what this component represents
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Display chart if provided */}
            {chart && (
              <div className="p-4 border rounded-md bg-background/50">
                {chart}
              </div>
            )}
            
            {/* Analysis text */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-indigo-500 animate-spin" />
                  <span className="ml-3 text-muted-foreground">Generating analysis...</span>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">
                    {explanation.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="text-sm leading-relaxed mb-4 text-foreground/90">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ComponentExplanation;
