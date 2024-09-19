import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetMovies } from '../../services/https';
import { MoviesInterface } from '../../interfaces/IMovie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieList.css';
import Navbar from '../../components/navbar/navbar';
import Button from 'react-bootstrap/Button';
import MultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CardShowPoster from './components/cardposter';
import Carousel from './components/carousel';
import ProgressBar from 'react-bootstrap/ProgressBar';

const MovieList: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MoviesInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hovered, setHovered] = useState<boolean>(false);

  // Fetch movie data from API
  const fetchMovies = async () => {
    try {
      const response = await GetMovies();
      if (response) {
        setMovies(response);
      } else {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลภาพยนตร์');
      }
      setLoading(false);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลภาพยนตร์');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0 && !hovered) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            // Reset progress and move to the next image
            setActiveIndex((prevIndex) => (prevIndex + 1) % movies.length);
            return 0;
          }
          return prevProgress + 1; // Increment progress by 1% every 100ms
        });
      }, 100); // Every 100 milliseconds

      return () => clearInterval(interval); // Clear interval when the component unmounts
    }
  }, [movies.length, hovered]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>{error}</p>;

  // Removed the unnecessary wrapper function for navigation
  return (
    <div>
      <Navbar />
      <div className='movielist'>
      <div className="ccontainer mt-5">
        <div className="row">
          {/* Carousel with movie details */}
          <div
            className="col-md-12"
            onMouseEnter={() => setHovered(true)}  // Stop auto-slide when hovering
            onMouseLeave={() => setHovered(false)} // Resume auto-slide when not hovering
          >
            {movies.length > 0 && (
             
                
                <div className="movie-details">
                   {/* ฝังวิดีโอ YouTube */}
  <iframe
    width="100%"
    height="300"
    src="https://www.youtube.com/embed/mG-1yvxbWec"
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>

                </div>
            )}
            <ProgressBar now={progress} style={{ height: '5px', marginTop: '10px' }} /> {/* Progress bar */}
          </div>
        </div>

        {/* Action Category */}
        <h2 className="mt-5">Action</h2>
        <MultiCarousel responsive={responsive} infinite={true}>
          {movies.map((movie) => (
            <CardShowPoster key={movie.ID} movieID={movie.ID} />
          ))}
        </MultiCarousel>

        {/* Drama Category */}
        <h2 className="mt-5">Drama</h2>
        <MultiCarousel responsive={responsive} infinite={true}>
          {movies.map((movie) => (
            <CardShowPoster key={movie.ID} movieID={movie.ID} />
          ))}
        </MultiCarousel>
      </div>
    </div>
    </div>
  );
};

export default MovieList;
