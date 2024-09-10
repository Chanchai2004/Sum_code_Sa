import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Typography as CardTitle } from '@mui/material'; // ใช้ Material-UI สำหรับการ์ดและหัวเรื่อง

const data = [
  { name: 'Jan', newSignUps: 4000, cancellations: 2400, activeMembers: 2400 },
  { name: 'Feb', newSignUps: 3000, cancellations: 1398, activeMembers: 2210 },
  { name: 'Mar', newSignUps: 2000, cancellations: 1800, activeMembers: 2290 },
  { name: 'Apr', newSignUps: 2780, cancellations: 1908, activeMembers: 3000 },
  { name: 'May', newSignUps: 1890, cancellations: 1800, activeMembers: 3181 },
  { name: 'Jun', newSignUps: 2390, cancellations: 1800, activeMembers: 3500 },
  { name: 'Jul', newSignUps: 3490, cancellations: 2300, activeMembers: 4100 },
  { name: 'Aug', newSignUps: 3200, cancellations: 2100, activeMembers: 4500 },
  { name: 'Sep', newSignUps: 3500, cancellations: 2000, activeMembers: 5000 },
  { name: 'Oct', newSignUps: 3800, cancellations: 2200, activeMembers: 5500 },
  { name: 'Nov', newSignUps: 4000, cancellations: 2300, activeMembers: 6000 },
  { name: 'Dec', newSignUps: 4200, cancellations: 2400, activeMembers: 6500 },
];

const MembershipStatistics: React.FC = () => {
  return (
    <Card>
      <CardHeader title={<CardTitle>Membership Statistics</CardTitle>} />
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="newSignUps" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="cancellations" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            <Area type="monotone" dataKey="activeMembers" stroke="#ffc658" fill="#ffc658" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MembershipStatistics;
