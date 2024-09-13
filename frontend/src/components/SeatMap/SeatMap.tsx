import React, { useState, useEffect } from 'react';
import { Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import Seat from './Seat';
import './SeatMap.css';
import { bookSeats } from '../../services/https';

const { Option } = Select;

// ฟังก์ชันสร้าง seatMap อัตโนมัติจากโครงสร้างที่นั่ง โดยคำนวณ seatIndex จาก theaterID
const generateSeatMap = (seats: string[][], theaterID: number) => {
  const seatMap: { [key: number]: string } = {};
  let seatIndex = (theaterID - 1) * 160 + 1; // คำนวณ seatID เริ่มต้นตามโรงหนัง (โรงที่ 1 เริ่มที่ 1, โรงที่ 2 เริ่มที่ 161, โรงที่ 3 เริ่มที่ 321)

  seats.forEach(row => {
    row.forEach(seat => {
      seatMap[seatIndex] = seat;
      seatIndex++;
    });
  });

  return seatMap;
};

// ข้อมูลที่นั่ง (เรียงลำดับที่ต้องการ)
const seats = [
  ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A19', 'A20'],
  ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20'],
  ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
  ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19', 'D20'],
  ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E19', 'E20'],
  ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20'],
  ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17', 'G18', 'G19', 'G20'],
  ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18', 'H19', 'H20'],
];

const SeatMap: React.FC = () => {
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [memberID, setMemberID] = useState<number | null>(null);
  const [showtimeID, setShowtimeID] = useState<number>(1);
  const [theaterID, setTheaterID] = useState<number>(1);

  const navigate = useNavigate(); // ใช้ navigate เพื่อนำทางไปหน้าอื่น

  // ดึงข้อมูลจาก localStorage
  useEffect(() => {
    const storedMemberID = localStorage.getItem('memberID');
    const storedShowtimeID = localStorage.getItem('showtimeID');
    const storedTheaterID = localStorage.getItem('theaterID');

    if (storedMemberID) setMemberID(Number(storedMemberID));
    if (storedShowtimeID) setShowtimeID(Number(storedShowtimeID));
    if (storedTheaterID) setTheaterID(Number(storedTheaterID));
  }, []);

  // สร้าง seatMap โดยใช้ theaterID เพื่อกำหนด seatID ให้ถูกต้อง
  const seatMap = generateSeatMap(seats, theaterID);

  // ดึงข้อมูลที่นั่งที่ถูกจองจาก API
  const fetchBookedSeats = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/booked-seats/${showtimeID}`);
      const seatsData = await response.json();

      if (response.ok && seatsData.data) {
        // แปลง SeatID เป็นชื่อที่นั่ง
        const bookedSeatsArray = seatsData.data.map((seatID: number) => seatMap[seatID]);
        setBookedSeats(bookedSeatsArray); // อัปเดตสถานะที่นั่งที่ถูกจอง
      } else {
        console.log('No bookings found for this showtime.');
        setBookedSeats([]); // ตั้งค่าเป็นที่นั่งว่าง
      }
    } catch (error) {
      console.error('Error fetching booked seats:', error);
    }
  };

  useEffect(() => {
    fetchBookedSeats();
  }, [showtimeID, theaterID]);

  const onSelectSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(prev => prev.filter(s => s !== seat));
    } else {
      if (selectedSeats.length >= 5) {
        message.error('You can select up to 5 seats per booking');
      } else {
        setSelectedSeats(prev => [...prev, seat]);
      }
    }
  };

  const totalPrice = selectedSeats.reduce((total, seat) => {
    const rowLetter = seat.charAt(0);
    if (['G', 'H'].includes(rowLetter)) {
      return total + 150;
    } else {
      return total + 100;
    }
  }, 0);

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      message.error('Please select the seat');
      return;
    }
  
    if (selectedSeats.length > 5) {
      message.error('You can select up to 5 seats per booking');
      return;
    }
  
    if (!memberID) {
      message.error('Member ID not found');
      return;
    }
  
    const result = await bookSeats(showtimeID, theaterID, memberID, selectedSeats);
  
    if (result.success) {
      message.success(result.message);
      setSelectedSeats([]);
  
      // ดึง ticketID จาก result ที่ได้รับจาก backend
      const ticketID = result.ticketID;
  
      // ส่ง ticketID พร้อมกับข้อมูลอื่น ๆ ไปยังหน้า Payment
      console.log("Navigating to Payment with data: ", {
        totalPrice,
        selectedSeats,
        ticketID,  // เพิ่ม ticketID ที่ได้รับจาก backend
      });
  
      // นำทางไปยังหน้า Payment พร้อมส่งข้อมูลไปด้วย
      navigate('/payment', { state: { totalPrice, selectedSeats, ticketID } });
    } else {
      message.error(result.message);
    }
  };
  

  return (
    <div className='seat-container'>
      <div className="container">
        <div style={{ textAlign: 'left', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', marginLeft: 200, marginRight: 200, display: 'flex' }}>
          <div>
            <h2 style={{ margin: 0 }}>SELECT TIME HERE!</h2>
            <div style={{ padding: 6 }}>
              <Select
                value={showtimeID}
                style={{ width: 120, height: 40 }}
                onChange={(value) => setShowtimeID(value)}
              >
                <Option value={1}>12:00 AM</Option>
                <Option value={2}>14:00 PM</Option>
                <Option value={3}>12:00 PM (Theater 3)</Option>
              </Select>
            </div>
            <div style={{ padding: 6 }}>
              <Select
                value={theaterID}
                style={{ width: 120, height: 40 }}
                onChange={(value) => setTheaterID(value)}
              >
                <Option value={1}>Theater 1</Option>
                <Option value={2}>Theater 2</Option>
                <Option value={3}>Theater 3</Option>
              </Select>
            </div>
          </div>
          <div style={{ textAlign: 'left', marginLeft: 'auto', alignItems: 'flex-end', display: 'flex' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: '#1A2C50', marginRight: '5px', borderRadius: '3px' }}></div>
              <p style={{ margin: 0, marginRight: '10px' }}>Booked</p>
              <div style={{ width: '15px', height: '15px', backgroundColor: 'white', marginRight: '5px', borderRadius: '3px', border: '1px solid black' }}></div>
              <p style={{ margin: 0, marginRight: '10px' }}>Available</p>
              <div style={{ width: '15px', height: '15px', backgroundColor: '#007bff', marginRight: '5px', borderRadius: '3px' }}></div>
              <p style={{ margin: 0 }}>Selected</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            {seats.map((row, rowIndex) => (
              <div key={rowIndex} className={`seat-row ${rowIndex >= 6 ? 'yellow-border' : ''}`}>
                {row.map(seat => (
                  <Seat
                    key={seat}
                    seat={seat}
                    isBooked={bookedSeats.includes(seat)}
                    isSelected={selectedSeats.includes(seat)}
                    onSelect={() => onSelectSeat(seat)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="beforesummary">
          <h2 style={{ color: 'black', fontFamily: 'Arial', fontWeight: 'bold', fontSize: '18px' }}>
            MERJE CINIPLEX
          </h2>
        </div>

        <div className="summary">
          <div className="summary-content" style={{ alignContent: 'center' }}>
            <div style={{ flex: 1 }}>
              <h3>Total</h3>
              <h3 style={{ fontSize: '27px', color: '#FFD700' }}>Rp. {totalPrice.toLocaleString()}</h3>
            </div>
            <div style={{ flex: 2 }}>
              <h3>Seat</h3>
              <h3 style={{ fontSize: '27px', color: '#FFD700' }}>: {selectedSeats.join(', ')}</h3>
            </div>
            <div style={{ flex: 2, textAlign: 'center' }}>
              <Button type="default" style={{ marginRight: '20px', width: '180px', height: '40px' }}>BACK TO</Button>
              <Button type="primary" style={{ width: '180px', height: '40px', backgroundColor: '#FFD700', border: '2px solid #FFD700', color: 'black' }} onClick={handleConfirmBooking}>CONFIRM</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SeatMap;
