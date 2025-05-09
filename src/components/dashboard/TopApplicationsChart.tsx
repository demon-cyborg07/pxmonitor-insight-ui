
import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AppData {
  name: string;
  value: number;
}

interface TopApplicationsChartProps {
  data: AppData[];
  className?: string;
}

const TopApplicationsChart = ({ data, className }: TopApplicationsChartProps) => {
  return (
    <Card className={`network-card overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-montserrat">Top Applications</CardTitle>
        <CardDescription>Applications using the most bandwidth</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                stroke="#E0E0E0" 
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#E0E0E0" 
                fontSize={12} 
                width={100}
              />
              <Tooltip
                formatter={(value: number) => [`${(value / 1000).toFixed(1)}k bytes`, 'Usage']}
                contentStyle={{
                  backgroundColor: 'rgba(26, 31, 44, 0.9)',
                  borderColor: '#9b87f5',
                  boxShadow: '0 0 15px rgba(149, 76, 233, 0.3)'
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
                className="cursor-pointer"
              >
                {data.map((entry, index) => (
                  <rect 
                    key={`rect-${index}`}
                    fill={`url(#barGradient${index})`}
                    className="drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0px 0px 6px rgba(0, 183, 235, 0.3))' }}
                  />
                ))}
              </Bar>
              <defs>
                {data.map((entry, index) => (
                  <linearGradient 
                    key={`gradient-${index}`}
                    id={`barGradient${index}`} 
                    x1="0" y1="0" x2="1" y2="0"
                  >
                    <stop offset="0%" stopColor="#00B7EB" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#9b87f5" />
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopApplicationsChart;
