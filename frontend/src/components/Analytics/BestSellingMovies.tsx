import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Typography as CardTitle } from '@mui/material';

const data = [
  { name: 'Movie 1', sales: 4000 },
  { name: 'Movie 2', sales: 3000 },
  { name: 'Movie 3', sales: 2000 },
  { name: 'Movie 4', sales: 2780 },
  { name: 'Movie 5', sales: 1890 },
  { name: 'Movie 6', sales: 2390 },
  { name: 'Movie 7', sales: 3490 },
  { name: 'Movie 8', sales: 3200 },
  { name: 'Movie 9', sales: 2800 },
  { name: 'Movie 10', sales: 2100 },
];

const BestSellingMovies: React.FC = () => {
  return (
    <Card>
      <CardHeader title={<CardTitle>Top 10 Best-Selling Movies</CardTitle>} />
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BestSellingMovies;
