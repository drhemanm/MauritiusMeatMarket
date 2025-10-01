/**
 * Sales Chart Component
 * 
 * Bar chart displaying monthly sales data (online vs offline).
 * Uses Recharts library for beautiful visualizations.
 * 
 * @module components/dashboard/SalesChart
 */

'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui';
import { SalesData } from '@/types';
import { formatCurrency } from '@/lib/utils';

/**
 * Sales Chart props
 */
interface SalesChartProps {
  /** Sales data array */
  data: SalesData[];
  
  /** Chart height in pixels */
  height?: number;
}

/**
 * Custom tooltip component
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Sales Chart Component
 */
export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  height = 300,
}) => {
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Total Sales</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Monthly sales breakdown
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-600" />
              <span className="text-gray-600">Online sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning-500" />
              <span className="text-gray-600">Offline sales</span>
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
            <Bar
              dataKey="onlineSales"
              fill="#4F46E5"
              radius={[8, 8, 0, 0]}
              name="Online sales"
            />
            <Bar
              dataKey="offlineSales"
              fill="#F59E0B"
              radius={[8, 8, 0, 0]}
              name="Offline sales"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};
