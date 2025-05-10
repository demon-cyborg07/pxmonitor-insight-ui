
// Find the original MetricCard component and add the explanation feature
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import ExplanationPopover from "../ui/explanation-popover";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  status: "success" | "warning" | "danger";
  className?: string;
}

const MetricCard = ({ title, value, unit, icon, status, className }: MetricCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 shadow-sm bg-card",
        status === "success" ? "shadow-green-900/20" : 
        status === "warning" ? "shadow-yellow-900/20" : 
        "shadow-red-900/20",
        className
      )}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-1.5 rounded-full",
            status === "success" ? "bg-green-500/10 text-green-500" : 
            status === "warning" ? "bg-yellow-500/10 text-yellow-500" : 
            "bg-red-500/10 text-red-500"
          )}>
            {icon}
          </div>
          <div className="font-medium text-sm">{title}</div>
        </div>
        <ExplanationPopover 
          componentName={title} 
          metrics={{ value, unit, status }}
        />
      </div>
      <div className="flex items-baseline mt-3">
        <div className={cn(
          "text-2xl font-bold metric-value",
          status === "success" ? "text-green-500" : 
          status === "warning" ? "text-yellow-500" : 
          "text-red-500"
        )}>
          {value}
        </div>
        <div className="text-sm ml-1.5 text-muted-foreground">{unit}</div>
      </div>
    </div>
  );
};

export default MetricCard;
