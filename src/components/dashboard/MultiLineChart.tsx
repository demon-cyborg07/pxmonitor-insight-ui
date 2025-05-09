
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TimeSeriesData {
  timestamp: number;
  [key: string]: number | string;
}

interface MultiLineChartProps {
  data: TimeSeriesData[];
  lines: { id: string; color: string; name: string }[];
  title: string;
  description: string;
  yAxisLabel?: string;
  className?: string;
  height?: number;
}

const MultiLineChart = ({ 
  data, 
  lines, 
  title, 
  description, 
  yAxisLabel, 
  className, 
  height = 300 
}: MultiLineChartProps) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Card className={`network-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-montserrat">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                {lines.map(line => (
                  <linearGradient key={line.id} id={`gradient${line.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime} 
                stroke="#E0E0E0" 
                fontSize={12} 
                tickMargin={10} 
              />
              <YAxis 
                stroke="#E0E0E0" 
                fontSize={12} 
                label={yAxisLabel && { 
                  value: yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { textAnchor: 'middle', fill: '#E0E0E0', fontSize: 12 } 
                }} 
              />
              <CartesianGrid stroke="#333" strokeDasharray="3 3" />
              <Tooltip
                labelFormatter={formatTime}
                contentStyle={{
                  backgroundColor: 'rgba(26, 31, 44, 0.9)',
                  borderColor: '#9b87f5',
                  boxShadow: '0 0 15px rgba(149, 76, 233, 0.3)'
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                formatter={(value) => <span className="text-xs font-medium text-softWhite">{value}</span>} 
              />
              {lines.map(line => (
                <Area
                  key={line.id}
                  type="monotone"
                  dataKey={line.id}
                  name={line.name}
                  stroke={line.color}
                  fillOpacity={1}
                  fill={`url(#gradient${line.id})`}
                  dot={{ stroke: line.color, strokeWidth: 2, fill: '#111', r: 4 }}
                  activeDot={{ stroke: line.color, strokeWidth: 2, fill: '#fff', r: 6, strokeOpacity: 0.8 }}
                  style={{ filter: `drop-shadow(0px 0px 4px ${line.color})` }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiLineChart;
