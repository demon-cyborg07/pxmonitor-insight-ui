
import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExplanationPopover from "../ui/explanation-popover";
import ComponentExplanation from "../ui/component-explanation";

interface AppData {
  name: string;
  value: number;
}

interface TopApplicationsChartProps {
  data: AppData[];
  className?: string;
}

const TopApplicationsChart = ({ data, className }: TopApplicationsChartProps) => {
  // Colorful palette for the bars - using the same colors as Protocol Distribution
  const COLORS = ['#9b87f5', '#D946EF', '#F97316', '#0EA5E9', '#8B5CF6', '#7E69AB'];
  
  return (
    <Card className={`network-card overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg font-montserrat">Top Applications</CardTitle>
            <CardDescription>Applications using the most bandwidth</CardDescription>
          </div>
          <div className="flex space-x-1">
            <ExplanationPopover 
              componentName="Top Applications" 
              metrics={{ 
                appCount: data.length,
                topApp: data[0]?.name,
                topValue: data[0]?.value
              }}
            />
            <ComponentExplanation 
              componentName="Top Applications" 
              data={data}
              chart={
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={data} 
                      layout="vertical"
                      margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                    >
                      <XAxis 
                        type="number" 
                        stroke="#E0E0E0" 
                        fontSize={10}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="#E0E0E0" 
                        fontSize={10} 
                        width={60}
                      />
                      {data.map((entry, index) => (
                        <Bar 
                          key={`bar-${index}`} 
                          dataKey="value" 
                          stackId="a" 
                          data={[entry]} 
                          fill={COLORS[index % COLORS.length]} 
                          name={entry.name}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[270px]">
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
                  borderColor: '#000000',
                  boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)'
                }}
              />
              {data.map((entry, index) => (
                <Bar 
                  key={`bar-${index}`} 
                  dataKey="value" 
                  stackId="a" 
                  data={[entry]} 
                  fill={COLORS[index % COLORS.length]} 
                  name={entry.name}
                  radius={[0, 4, 4, 0]}
                  className="cursor-pointer"
                  style={{
                    filter: `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]}80)`
                  }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopApplicationsChart;
