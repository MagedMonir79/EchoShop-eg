import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  description?: string;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendType = "neutral",
  description,
  loading = false
}: StatsCardProps) {
  const trendColor = 
    trendType === "positive" ? "text-green-500" :
    trendType === "negative" ? "text-red-500" :
    "text-gray-500";

  const trendIcon = 
    trendType === "positive" ? <ArrowUp className="h-4 w-4" /> : 
    trendType === "negative" ? <ArrowDown className="h-4 w-4" /> : 
    null;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="h-4 w-1/3 bg-muted rounded animate-pulse"></div>
            <div className="h-8 w-1/2 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            
            {trend && (
              <div className="flex items-center mt-1">
                <span className={`flex items-center text-sm ${trendColor}`}>
                  {trendIcon}
                  {trend}
                </span>
                {description && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {icon && (
            <div className="bg-primary/10 p-2 rounded-full">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}