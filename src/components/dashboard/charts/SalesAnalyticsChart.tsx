import React from 'react';
import { Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { month: 'Jan', sales: 45000, orders: 320 },
  { month: 'Feb', sales: 52000, orders: 380 },
  { month: 'Mar', sales: 48000, orders: 350 },
  { month: 'Apr', sales: 61000, orders: 420 },
  { month: 'May', sales: 55000, orders: 390 },
  { month: 'Jun', sales: 67000, orders: 480 },
  { month: 'Jul', sales: 71000, orders: 510 },
  { month: 'Aug', sales: 65000, orders: 460 },
  { month: 'Sep', sales: 73000, orders: 520 },
  { month: 'Oct', sales: 78000, orders: 560 },
  { month: 'Nov', sales: 82000, orders: 590 },
  { month: 'Dec', sales: 84126, orders: 612 },
];

export const SalesAnalyticsChart: React.FC = () => {
  return (
    <Box sx={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(31, 31, 31, 0.95)',
              border: '1px solid rgba(245, 197, 66, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            formatter={(value: any, name: string) => [
              name === 'sales' ? `$${value.toLocaleString()}` : value,
              name === 'sales' ? 'Sales' : 'Orders'
            ]}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#f5c542"
            strokeWidth={3}
            dot={{ fill: '#f5c542', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#f5c542', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};