import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, Typography as CardTitle } from '@mui/material';

const data = [
  { name: 'Action', value: 400 },
  { name: 'Comedy', value: 300 },
  { name: 'Drama', value: 300 },
  { name: 'Sci-Fi', value: 200 },
  { name: 'Horror', value: 150 },
  { name: 'Romance', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdditionalStats: React.FC = () => {
  return (
    <Card>
      <CardHeader title={<CardTitle>Revenue by Genre</CardTitle>} />
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdditionalStats;
