import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { Button, Card } from 'antd';
import { ClockCircleOutlined, UserOutlined, StarOutlined, EnvironmentOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import './MovieBooking.css';
import { GetShowtimes, GetMovieById, GetShowtimeById } from '../../services/https/index'; // Import API calls
import { MoviesInterface } from '../../interfaces/IMovie'; // Import movie interface
import { ShowTimesInterface } from '../../interfaces/IShowtime'; // Import showtimes interface

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="slick-prev-arrow" onClick={onClick}>
      {'<'}
    </div>
  );
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="slick-next-arrow" onClick={onClick}>
      {'>'}
    </div>
  );
};

const MovieBooking: React.FC = () => {
  const location = useLocation(); 
  const navigate = useNavigate(); // use navigate inside component
  const { movieID } = location.state || {}; // Extract movieID from location.state
  
  const [selectedDate, setSelectedDate] = useState<number | null>(0);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [filteredTimes, setFilteredTimes] = useState<string[]>([]);
  const [movie, setMovie] = useState<MoviesInterface | null>(null); // State for movie details
  const [moviePoster, setMoviePoster] = useState<string | null>(null);
  const [movieDuration, setMovieDuration] = useState<string>('');
  const [director, setDirector] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [movieType, setMovieType] = useState<string>('');
  const [synopsis, setSynopsis] = useState<string>('No synopsis available');

  // Fetch movie data from API using movieID
  const fetchMovieData = async () => {
    try {
      if (movieID) {
        const movieData: MoviesInterface = await GetMovieById(movieID); // Fetch the movie by ID
        if (movieData) {
          const posterUrl = `http://localhost:8000/api/movie/${movieData.ID}/poster`;
          setMoviePoster(posterUrl);
  
          const durationInMinutes = movieData.MovieDuration;
          const hours = Math.floor(durationInMinutes / 60);
          const minutes = durationInMinutes % 60;
          setMovieDuration(`${hours} hr ${minutes} min`);
  
          setDirector(movieData.Director || 'Unknown Director');
          setMovieType(movieData.MovieType || 'Unknown Genre');
          setRating(Math.floor(Math.random() * (10 - 6 + 1)) + 6); // Random rating between 6 and 10
          setSynopsis(movieData.Synopsis || 'No synopsis available');
          setMovie(movieData); // Set the movie details
        }
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  useEffect(() => {
    fetchMovieData(); // Fetch movie data when the component mounts or movieID changes
  }, [movieID]);

  // Fetch showtimes from the API
  useEffect(() => {
    if (movieID) {
      GetShowtimes()
        .then((data) => {
          setShowtimes(data); // Set showtimes data
        })
        .catch((error) => {
          console.error('Error fetching showtimes:', error);
        });
    }
  }, [movieID]);

  // Filter showtimes by date and movie
  useEffect(() => {
    if (showtimes.length > 0 && movie) {
      const selectedMomentDate = moment().add(selectedDate || 0, 'days').format('YYYY-MM-DD');
      const filtered = showtimes
        .filter((showtime) => {
          const showdate = moment(showtime.Showdate).format('YYYY-MM-DD');
          return showtime.Movie.MovieName === movie.MovieName && showdate === selectedMomentDate;
        })
        .map((showtime) => moment(showtime.Showdate).format('HH:mm'));

      setFilteredTimes(filtered);
    }
  }, [showtimes, selectedDate, movie]);

  // Generate array of dates (today + 10 days)
  const dates = Array.from({ length: 10 }, (_, index) => moment().add(index, 'days'));

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (!movieID) {
    return <div>No movie selected.</div>;
  }

  const navigatetoSeatBooking = async (time: string) => {
    try {
      const selectedDateFormatted = moment().add(selectedDate || 0, 'days').format('YYYY-MM-DD');
      const showtime = showtimes.find((st) => moment(st.Showdate).format('YYYY-MM-DD') === selectedDateFormatted && moment(st.Showdate).format('HH:mm') === time);
      
      if (showtime) {
        const showtimeID = showtime.ID;
        const TheaterID = showtime.TheaterID;
        navigate('/seatbooking', { state: { showtimeID, TheaterID } });
        
      } else {
        console.error('Showtime not found');
      }
    } catch (error) {
      console.error('Error navigating to seat booking:', error);
    }
  };

  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">MERJE</h1>
        <div className="space-x-4">
          <Button type="link">Home</Button>
          <Button type="link">MyTicket</Button>
          <Button type="link">MERJE news</Button>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Movie Poster */}
        <Card style={{ padding: '0', margin: '0', display: 'flex', justifyContent: 'center' }}>
          {moviePoster ? (
            <img
              src={moviePoster}
              alt="Movie Poster"
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '70vh', 
                aspectRatio: '2 / 3', 
                objectFit: 'cover',
                margin: '20px',
                padding: '0',
              }}
            />
          ) : (
            <p>No Poster Available</p>
          )}
        </Card>

        {/* Movie Information */}
        <div>
          <h2 className="text-3xl font-bold mb-4">{movie?.MovieName || 'No Movie Selected'}</h2>
          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded">{movieType}</span>
            <span className="flex items-center">
              <ClockCircleOutlined className="w-4 h-4 mr-1" /> {movieDuration}
            </span>
            <span className="flex items-center">
              <UserOutlined className="w-4 h-4 mr-1" /> {director}
            </span>
            <span className="flex items-center">
              <StarOutlined className="w-4 h-4 mr-1" /> {rating}
            </span>
          </div>

          {/* Date Slider */}
          <div className="date-slider mb-4">
            <Slider {...settings}>
              {dates.map((date, index) => (
                <Card
                  key={index}
                  className={`date-card ${selectedDate === index ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(index)} // Change selected date
                >
                  <div className="date-text">{date.format('DD')}</div>
                  <div className="date-month">{date.format('MMM').toUpperCase()}</div>
                </Card>
              ))}
            </Slider>
          </div>

          {/* Showtimes */}
          <Card className="mb-4">
            <Card.Meta title="Round" />
            <div className="grid grid-cols-3 gap-2 mt-4">
              {filteredTimes.length > 0
                ? filteredTimes.map((time) => (
                    <Button key={time} type="default" onClick={() => navigatetoSeatBooking(time)}>
                      {time} 
                    </Button>
                  ))
                : <p>No showtimes available</p>}
            </div>
          </Card>

          {/* Location */}
          <Card style={{ marginBottom: '10px' }}>
            <Card.Meta title="Location" />
            <div className="flex items-center mt-4">
              <EnvironmentOutlined className="w-4 h-4 mr-2" />
              <span>The Mall Korat</span>
            </div>
          </Card>

          {/* Synopsis */}
          <Card>
            <Card.Meta title="Synopsis" />
            <p className="mt-4">{synopsis}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MovieBooking;
