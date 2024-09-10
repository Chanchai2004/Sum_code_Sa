import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material'; // นำเข้า Typography จาก @mui/material
import { DollarSign, Users, TrendingUp, Activity, Ticket } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, change }) => (
  <Card>
    <CardHeader
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0',
      }}
    >
      <Typography variant="subtitle1">{title}</Typography>
      {icon}
    </CardHeader>
    <CardContent>
      <Box sx={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{value}</Box>
      <Typography
        variant="caption"
        sx={{
          marginTop: '0.25rem',
          color: change >= 0 ? 'green' : 'red',
        }}
      >
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from yesterday
      </Typography>
    </CardContent>
  </Card>
);

const SummaryCards: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: 4,
        marginBottom: 8,
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        '@media (min-width: 1024px)': {
          gridTemplateColumns: 'repeat(5, 1fr)',
        },
      }}
    >
      <SummaryCard 
        title="Total Sales" 
        value="$54,231" 
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
        change={12.7}
      />
      <SummaryCard 
        title="Membership Count" 
        value="2,345" 
        icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        change={5.3}
      />
      <SummaryCard 
        title="Daily Revenue" 
        value="$12,345" 
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} 
        change={-2.1}
      />
      <SummaryCard 
        title="Active Sessions" 
        value="189" 
        icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
        change={8.9}
      />
      <SummaryCard 
        title="Avg Ticket Price" 
        value="$12.50" 
        icon={<Ticket className="h-4 w-4 text-muted-foreground" />} 
        change={1.5}
      />
    </Box>
  );
};

export default SummaryCards;
