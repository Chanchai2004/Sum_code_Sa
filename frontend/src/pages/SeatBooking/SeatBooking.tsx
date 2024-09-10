import React from 'react';
import { useLocation } from 'react-router-dom';
import SeatMap from '../../components/SeatMap/SeatMap';
import Navbar from '../../components/navbar/navbar';

const SeatBooking: React.FC = () => {
  const location = useLocation();
  const { showtimeID, movieID, theaterID } = location.state || {};

  console.log("Showtime ID:", showtimeID);
  console.log("Movie ID:", movieID);
  console.log("Theater ID:", theaterID);

  return (
    <div style={{ backgroundColor: 'black', padding: '0 20px' }}>
      <Navbar/>
      <SeatMap />
    </div>
  );
};

export default SeatBooking;
