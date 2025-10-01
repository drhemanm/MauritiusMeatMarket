/**
 * Sales Distribution Chart Component
 * 
 * Donut/Pie chart showing sales distribution.
 * Modern, clean design with custom legend.
 * 
 * @module components/dashboard/SalesDistributionChart
 */

'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui';
import { SalesDistribution } from '@/types';

/**
 * Sales Distribution Chart props
 */
interface SalesDistributionChartProps {
  /** Distribution data */
  data: SalesDistribution[];
  
  /** Chart height in pixels */
  height?: number;
}

/**
 * Custom tooltip
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">{data.value}%</p>
      </div>
    );
  }
  return null;
};

/**
 * Sales Distribution Chart Component
 */
export const SalesDistributionChart: React.FC<SalesDistributionChartProps> = ({
  data,
  height = 300,
}) => {
  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold text-gray-900">
          Sales Distribution
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Channel breakdown
        </p>
      </Card.Header>
      <Card.Body>
        <div className="flex items-center justify-between gap-8">
          {/* Chart */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
