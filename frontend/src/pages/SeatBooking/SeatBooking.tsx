import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SeatMap from '../../components/SeatMap/SeatMap';
import Navbar from '../../components/navbar/navbar';
import { ReleaseSeats } from '../../services/https/index';

const SeatBooking: React.FC = () => {
  const location = useLocation();
  const { showtimeID, TheaterID } = location.state || {};

  console.log("Showtime ID:", showtimeID);
  console.log("Theater ID:", TheaterID);

  // ใช้ useEffect เพื่อเรียกฟังก์ชัน ReleaseSeats เมื่อ component ถูกโหลด
  useEffect(() => {
    const releaseSeats = async () => {
      const result = await ReleaseSeats();
      if (result) {
        console.log("Seats released successfully.");
      } else {
        console.error("Failed to release seats.");
      }
    };

    releaseSeats(); // เรียกฟังก์ชันปล่อยที่นั่ง
  }, []); // ทำงานเมื่อ component ถูก mount

  return (
    <div style={{ backgroundColor: 'black', padding: '0 20px' }}>
      <Navbar/>
      <SeatMap />
    </div>
  );
};

export default SeatBooking;