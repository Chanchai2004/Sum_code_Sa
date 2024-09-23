import React, { useState, useEffect } from 'react'; 
import { Button, Select, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom'; 
import Seat from './Seat';
import './SeatMap.css';
import { bookSeats } from '../../services/https';
import { GetTheaterById } from "../../services/https";
import { GetTimeByShowtime } from '../../services/https';

const { Option } = Select;

const generateSeatMap = (seats: string[][], theaterID: number) => {
  const seatMap: { [key: number]: string } = {};
  let seatIndex = (theaterID - 1) * 160 + 1;

  seats.forEach(row => {
    row.forEach(seat => {
      seatMap[seatIndex] = seat;
      seatIndex++;
    });
  });

  return seatMap;
};

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
  const [theaterName, setTheaterName] = useState<string>('');  
  const [showtimeTime, setShowtimeTime] = useState<string>('');  // เพิ่ม state สำหรับเวลา showtime

  const navigate = useNavigate(); 
  const location = useLocation();
  const { movieID, showtimeID, TheaterID } = location.state || {}; 

  useEffect(() => {
    const storedMemberID = localStorage.getItem('id');
    if (storedMemberID) setMemberID(Number(storedMemberID));
  }, []);

  const seatMap = generateSeatMap(seats, TheaterID);

  const fetchBookedSeats = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/booked-seats/${showtimeID}`);
      const seatsData = await response.json();
      if (response.ok && seatsData.data) {
        const bookedSeatsArray = seatsData.data.map((seatID: number) => seatMap[seatID]);
        setBookedSeats(bookedSeatsArray);
      } else {
        console.log('No bookings found for this showtime.');
        setBookedSeats([]);
      }
    } catch (error) {
      console.error('Error fetching booked seats:', error);
    }
  };

  // ฟังก์ชันดึงชื่อโรงหนังจาก TheaterID โดยใช้ GetTheaterById จาก service
  const fetchTheaterName = async (TheaterID: number) => {
    try {
      const theaterData = await GetTheaterById(TheaterID);
      if (theaterData) {
        setTheaterName(theaterData.theater_name);
      } else {
        console.log('Theater not found');
        setTheaterName('Unknown');
      }
    } catch (error) {
      console.error('Error fetching theater name:', error);
    }
  };

  // ฟังก์ชันดึงเวลาของ showtime โดยใช้ GetTimeByShowtime จาก service
  const fetchShowtimeTime = async (showtimeID: number) => {
    try {
      const time = await GetTimeByShowtime(showtimeID);
      if (time) {
        setShowtimeTime(time);  // ตั้งค่า showtimeTime ตามข้อมูลที่ได้จาก service
      } else {
        console.log('Showtime time not found');
        setShowtimeTime('Unknown');
      }
    } catch (error) {
      console.error('Error fetching showtime time:', error);
    }
  };

  useEffect(() => {
    fetchBookedSeats();
    if (TheaterID) {
      fetchTheaterName(TheaterID); 
    }
    if (showtimeID) {
      fetchShowtimeTime(showtimeID);  // เรียกฟังก์ชันเมื่อมี showtimeID
    }
  }, [showtimeID, TheaterID]);

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
    return total + (['G', 'H'].includes(rowLetter) ? 150 : 100);
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

    const result = await bookSeats(showtimeID, TheaterID, memberID, selectedSeats);
    if (result.success) {
      message.success(result.message);
      setSelectedSeats([]);
      const ticketID = result.ticketID;
      navigate('/paymentdetail', { state: { totalPrice, selectedSeats, ticketID, showtimeID } });
    } else {
      message.error(result.message);
    }
  };

  const handleBackTo = async () => {
    navigate('/moviebooking', { state: { movieID } });
  }

  return (
    <div className='seat'>
    <div className="seat-container">
      <div className="theater-time-container">
        <div className="info-box">
          <h3>{theaterName || 'Unknown'}</h3> {/* แสดงชื่อโรงหนัง */}
        </div>
        <div className="info-box">
        <h3>{showtimeTime || 'Unknown'}</h3> {/* แสดงเวลา showtime */}
        </div>
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-color booked"></div>
          <span>booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>select</span>
        </div>
      </div>

      <div className="SeatMapcontainer">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            {seats.map((row, rowIndex) => {
              const leftSeats = row.slice(0, 10);
              const rightSeats = row.slice(10, 20);
              return (
                <div key={rowIndex} className={`seat-row ${rowIndex >= 6 ? 'yellow-border' : ''}`}>
                  <div className="seat-row-left">
                    {leftSeats.map((seat) => (
                      <Seat
                        key={seat}
                        seat={seat}
                        isBooked={bookedSeats.includes(seat)}
                        isSelected={selectedSeats.includes(seat)}
                        onSelect={() => onSelectSeat(seat)}
                      />
                    ))}
                  </div>
                  <div style={{ width: '50px' }} />
                  <div className="seat-row-right">
                    {rightSeats.map((seat) => (
                      <Seat
                        key={seat}
                        seat={seat}
                        isBooked={bookedSeats.includes(seat)}
                        isSelected={selectedSeats.includes(seat)}
                        onSelect={() => onSelectSeat(seat)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
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
              <Button type="default" style={{ marginRight: '20px', width: '180px', height: '40px' }} onClick={handleBackTo}>BACK TO</Button>
              <Button type="primary" style={{ width: '180px', height: '40px', backgroundColor: '#FFD700', border: '2px solid #FFD700', color: 'black' }} onClick={handleConfirmBooking}>CONFIRM</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SeatMap;