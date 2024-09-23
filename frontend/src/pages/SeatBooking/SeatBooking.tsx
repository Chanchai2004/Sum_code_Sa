import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SeatMap from '../../components/SeatMap/SeatMap';
import Navbar from '../../components/navbar/navbar';
import { ReleaseSeats } from '../../services/https/index';

const SeatBooking: React.FC = () => {
  const location = useLocation();
  const { showtimeID, TheaterID } = location.state || {};

  console.log("Showtime ID:", showtimeID);
  console.log("Theater ID:", TheaterID);

  // สร้าง state เพื่อบังคับให้ SeatMap รีเฟรชใหม่
  const [refreshKey, setRefreshKey] = useState(0);

  // ใช้ useEffect เพื่อเรียกฟังก์ชัน ReleaseSeats เมื่อ component ถูกโหลด
  useEffect(() => {
    const releaseSeats = async () => {
      const result = await ReleaseSeats(); // ส่ง showtimeID, TheaterID ไปเพื่อปล่อยที่นั่ง
      if (result) {
        console.log("Seats released successfully.");
        // เมื่อปล่อยที่นั่งสำเร็จ ทำการรีเฟรช SeatMap โดยเพิ่มค่า refreshKey
        setRefreshKey(prevKey => prevKey + 1);
      } else {
        console.error("Failed to release seats.");
      }
    };

    releaseSeats(); // เรียกฟังก์ชันปล่อยที่นั่ง
  }, [showtimeID, TheaterID]); // ทำงานเมื่อ showtimeID หรือ TheaterID เปลี่ยนแปลง

  return (
    <div style={{ backgroundColor: 'black', padding: '0 20px' }}>
      {/* ส่ง key ไปที่ SeatMap เพื่อบังคับให้ component ทำการรีเฟรชใหม่ */}
      <SeatMap key={refreshKey} />
    </div>
  );
};

export default SeatBooking;