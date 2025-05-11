
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ExplanationPopover from '../ui/explanation-popover';
import ComponentExplanation from '../ui/component-explanation';

interface ProtocolData {
  name: string;
  value: number;
}

interface ProtocolDistributionProps {
  data: ProtocolData[];
  className?: string;
}

const ProtocolDistribution = ({ data, className }: ProtocolDistributionProps) => {
  // Colors for the chart segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/90 backdrop-blur-sm border border-accent/20 shadow-lg shadow-accent/10 px-3 py-2 rounded-md">
          <p className="text-sm font-medium">{`${data.name}`}</p>
          <p className="text-xs text-muted-foreground">{`${data.value} packets`}</p>
        </div>
      );
    }

    return null;
  };

  // Calculate total to get percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Prepare data for the chart to include percentages
  const chartData = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  return (
    <Card className={`network-card overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg font-montserrat">Protocol Distribution</CardTitle>
            <CardDescription>Network traffic by protocol type</CardDescription>
          </div>
          <div className="flex space-x-1">
            <ExplanationPopover 
              componentName="Protocol Distribution" 
              metrics={{
                protocolCount: data.length,
                topProtocol: data[0]?.name,
                totalPackets: total
              }}
            />
            <ComponentExplanation 
              componentName="Protocol Distribution" 
              data={{
                protocols: data,
                total: total,
                topProtocol: data[0]?.name,
                topValue: data[0]?.value,
                topPercentage: ((data[0]?.value / total) * 100).toFixed(1)
              }}
              chart={
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        dataKey="value"
                        strokeWidth={1}
                        stroke="#1a1f2c"
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            className="drop-shadow-md"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                strokeWidth={2}
                stroke="#1a1f2c"
                paddingAngle={2}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                labelLine={{ stroke: '#8884d8', strokeWidth: 1 }}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="drop-shadow-md"
                    style={{ filter: `drop-shadow(0px 0px 6px ${COLORS[index % COLORS.length]}80)` }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProtocolDistribution;
