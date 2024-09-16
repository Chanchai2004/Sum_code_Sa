import React from 'react';
import { useLocation } from 'react-router-dom';
import SeatMap from '../../components/SeatMap/SeatMap';
import Navbar from '../../components/navbar/navbar';

const SeatBooking: React.FC = () => {
  const location = useLocation();
  const { showtimeID, TheaterID } = location.state || {};

  console.log("Showtime ID:", showtimeID);
  console.log("Theater ID:", TheaterID);

  return (
    <div style={{ backgroundColor: 'black', padding: '0 20px' }}>
      <Navbar/>
      <SeatMap />
    </div>
  );
};

export default SeatBooking;
