import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const productCategoryData = [
  { name: 'Electronics', value: 35, color: '#f5c542' },
  { name: 'Clothing', value: 25, color: '#10b981' },
  { name: 'Books', value: 20, color: '#3b82f6' },
  { name: 'Home & Garden', value: 12, color: '#8b5cf6' },
  { name: 'Sports', value: 8, color: '#f97316' },
];

export const ProductCategoriesChart: React.FC = () => {
  return (
    <>
      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={productCategoryData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {productCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(245, 197, 66, 0.3)',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [`${value}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box className="space-y-2 mt-4">
        {productCategoryData.map((category, index) => (
          <Box key={index} className="flex items-center justify-between">
            <Box className="flex items-center space-x-2">
              <Box
                className="w-3 h-3 rounded-full"
                sx={{ backgroundColor: category.color }}
              />
              <Typography variant="body2" className="text-gray-300">
                {category.name}
              </Typography>
            </Box>
            <Typography variant="body2" className="text-white font-medium">
              {category.value}%
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
};