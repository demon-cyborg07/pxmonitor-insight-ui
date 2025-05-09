
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  status?: "success" | "warning" | "danger" | "neutral";
  trend?: "up" | "down" | "stable";
  className?: string;
}

const MetricCard = ({
  title,
  value,
  unit,
  icon,
  status = "neutral",
  trend,
  className,
}: MetricCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-limeGreen";
      case "warning":
        return "text-yellow-400";
      case "danger":
        return "text-coralRed";
      default:
        return "text-neonBlue";
    }
  };

  const getTrendIcon = () => {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "→";
  };

  return (
    <div className={cn("metric-card flex flex-col", className)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={cn("p-1 rounded-full", status === "neutral" ? "text-neonBlue" : getStatusColor())}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-auto">
        <div className="flex items-baseline">
          <span className={cn("text-2xl font-bold metric-value", getStatusColor())}>
            {value}
            <span className="text-base ml-1">{unit}</span>
          </span>
        </div>
        {trend && (
          <div className={cn("text-sm font-medium", getStatusColor())}>
            {getTrendIcon()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
