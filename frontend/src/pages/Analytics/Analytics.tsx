import React, { useState } from 'react';
import BestSellingMovies from '../../components/Analytics/BestSellingMovies';
import SalesGrowth from '../../components/Analytics/SalesGrowth';
import MembershipStatistics from '../../components/Analytics/MembershipStatistics';
import AdditionalStats from '../../components/Analytics/AdditionalStats';
import SummaryCards from '../../components/Analytics/SummaryCards';
import DateRangePicker from '../../components/Analytics/DateRangePicker';
import { DateRange } from 'react-day-picker';
import './Analytics.css'; // นำเข้าไฟล์ CSS ของคุณ

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Cinema Analytics Dashboard</h1>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
      </div>
      <SummaryCards />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        <BestSellingMovies />
        <SalesGrowth />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mt-8">
        <MembershipStatistics />
        <AdditionalStats />
      </div>
    </div>
  );
};

export default Analytics;
