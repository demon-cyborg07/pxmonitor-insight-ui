
import React from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProtocolData {
  name: string;
  value: number;
}

interface ProtocolDistributionProps {
  data: ProtocolData[];
  className?: string;
}

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF', '#8B5CF6'];

const ProtocolDistribution = ({ data, className }: ProtocolDistributionProps) => {
  return (
    <Card className={`network-card overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-montserrat">Protocol Distribution</CardTitle>
        <CardDescription>Traffic breakdown by protocol type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                className="drop-shadow-xl"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="stroke-none hover:opacity-80 transition-opacity"
                    style={{ filter: 'drop-shadow(0px 0px 8px rgba(149, 76, 233, 0.5))' }}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} packets`, 'Count']} 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 31, 44, 0.9)',
                  borderColor: '#9b87f5',
                  boxShadow: '0 0 15px rgba(149, 76, 233, 0.3)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                formatter={(value) => <span className="text-xs text-softWhite">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProtocolDistribution;
