import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navbar/navbar';
import './home.css';

interface Showtime {
  ID: number;
  ShowDate: string;
  MovieID: number;
  TheaterID: number;
  Movie?: {
    MovieName: string;
  };
  Theater?: {
    TheaterName: string;
  };
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/showtimes');
        console.log("Fetched showtimes data:", response.data?.data);  // ตรวจสอบข้อมูลที่ดึงมาจาก API
        setShowtimes(response.data?.data); // เข้าถึงข้อมูลใน `data` ที่อยู่ภายใน response
        setLoading(false);
      } catch (error) {
        console.error('Error fetching showtimes:', error);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, []);

  const goToBooking = (showtime: Showtime) => {
    console.log("Navigating to SeatBooking with:");
    navigate(`/seatbooking`, {
      state: {
        showtimeID: showtime.ID,
        movieID: showtime.MovieID,
        theaterID: showtime.TheaterID
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <Navbar />
      <h1 className="home-title">WELCOME TO MERJE CINIPLEX</h1>
      <div className="movie-buttons">
        {showtimes.length > 0 ? (
          showtimes.map((showtime) => (
            <Button
              key={showtime.ID}
              type="primary"
              size="large"
              onClick={() => goToBooking(showtime)}
              className="home-button"
            >
              {`Movie Title: ${showtime.Movie?.MovieName || "Unknown Movie"}`} {/* แสดงชื่อหนัง */}
            </Button>
          ))
        ) : (
          <div>No showtimes available</div>
        )}
      </div>
    </div>
  );
};

export default Home;
