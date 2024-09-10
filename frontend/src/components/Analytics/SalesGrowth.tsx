import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Typography as CardTitle } from '@mui/material'; // ใช้ Material-UI สำหรับการ์ดและหัวเรื่อง

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4780 },
  { name: 'May', sales: 5890 },
  { name: 'Jun', sales: 6390 },
  { name: 'Jul', sales: 7490 },
  { name: 'Aug', sales: 8000 },
  { name: 'Sep', sales: 7800 },
  { name: 'Oct', sales: 8500 },
  { name: 'Nov', sales: 9000 },
  { name: 'Dec', sales: 9500 },
];

const SalesGrowth: React.FC = () => {
  return (
    <Card>
      <CardHeader title={<CardTitle>Sales Growth</CardTitle>} />
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesGrowth;
