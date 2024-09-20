import React, { useEffect, useState, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GetMovies } from '../../services/https';
import { MoviesInterface } from '../../interfaces/IMovie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieList.css';
import Navbar from '../../components/navbar/navbar';
import MultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CardShowPoster from './components/cardposter';
import Footer from './components/footer';
import { Select } from 'antd'; // Import Ant Design Select component
import video from '../../assets/Mufasa_ The Lion King  (1).mp4';
import video2 from '../../assets/SaveTube.App-Captain America _Avengers Assemble_ Scene - Portal Scene - Avengers _ Endgame (2019) Scene (online-video-cutter.com).mp4';

const { Option } = Select;

const MovieList: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MoviesInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string>(video);
  const [selectedMovieID, setSelectedMovieID] = useState<number | null>(null); // State to hold the selected movie ID
  const [searchResults, setSearchResults] = useState<MoviesInterface | null>(null); // State to hold the search result

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

  const handleScroll = () => {
    if (containerRef.current && videoRef.current) {
      const videoElement = videoRef.current;
      const videoRect = videoElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
  
      const isVisible = 
        videoRect.top >= 0 && 
        videoRect.bottom <= windowHeight;
  
      if (isVisible && videoElement.paused) {
        videoElement.play(); // Start playing the video if it is visible and paused
      } else if (!isVisible && !videoElement.paused) {
        videoElement.pause(); // Pause the video if it is not visible and playing
      }
    }
  };

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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleVideoEnd = () => {
    setCurrentVideo(video2);
    if (videoRef.current) {
      videoRef.current.load(); // Reload the video element with the new source
      videoRef.current.play(); // Start playing the new video automatically
    }
  };


  const handleMovieChange = (value: number) => {
    setSelectedMovieID(value);
    const selectedMovie = movies.find((movie) => movie.ID === value);
    setSearchResults(selectedMovie || null);
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className='imgcontentner'></div>
      <div className='movielist' ref={containerRef}>
        <div className="ccontainer">
          <div className="row">
            <div className="col-md-12">
              <div className="movie-details">
                <div className="video-container">
                  <h2>Next Month's Movies</h2>
                  <div className="video-card">
                    <video
                      ref={videoRef}
                      autoPlay
                      controls
                      onEnded={handleVideoEnd}
                      key={currentVideo} // Force re-render when video source changes
                    >
                      <source src={currentVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Movie */}
          <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <label style={{ color: '#FFD700', fontWeight: 'bold', marginRight: '10px' }}><h2 className="mt-5" style={{ color: '#FFD700' }}>Search</h2></label>
            <Select
  value={selectedMovieID || undefined}
  showSearch
  allowClear
  placeholder="Select a Movie"
  style={{ 
    width: '80%', // ปรับขนาดความกว้างของช่องกรอกข้อมูล เพิ่มจาก '100%' เป็น '80%' 
    height: '60px',
    maxWidth: '800px', // หรือปรับเพิ่ม maxWidth ตามที่ต้องการ
    borderRadius: '20px', 
    padding: '10px',  
    boxShadow: '0 0 10px rgba(102, 51, 153, 0.5)', 
    background: 'linear-gradient(145deg, #32081e, #61022b)' 
  }}
  suffixIcon={<SearchOutlined style={{ color: '#FFD700' }} />}
  onChange={handleMovieChange}
  filterOption={(input, option) =>
    option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
>
  {movies.map((movie) => (
    <Option key={movie.ID} value={movie.ID}>
      {movie.MovieName}
    </Option>
  ))}
</Select>
          </div>

          {/* Show CardPoster if a movie is selected */}
          {searchResults && (
            <div style={{ margin: '20px 0' }}>
              <h2 className="mt-5" style={{ color: '#FFD700' }}>Search Result</h2>
              <div style={{ width: '500px', margin: '0 auto' }}>
                <CardShowPoster key={searchResults.ID} movieID={searchResults.ID} />
              </div>
            </div>
          )}

          {/* Action Category */}
          <h2 className="mt-5" style={{ color: '#FFD700' }}>Trending</h2>
          <MultiCarousel responsive={responsive} infinite={true}>
            {movies.map((movie) => (
              <CardShowPoster key={movie.ID} movieID={movie.ID} />
            ))}
          </MultiCarousel>

          {/* War Category */}
          <h2 className="mt-5" style={{ color: '#FFD700' }}>War</h2>
          <MultiCarousel responsive={responsive} infinite={true}>
            {movies
              .filter((movie) => movie.MovieType === 'War')
              .map((movie) => (
                <CardShowPoster key={movie.ID} movieID={movie.ID} />
              ))}
          </MultiCarousel>

          {/* Adventure and Comedy Category */}
          <h2 className="mt-5" style={{ color: '#FFD700' }}>Adventure and Comedy</h2>
          <MultiCarousel responsive={responsive} infinite={true}>
            {movies
              .filter((movie) => movie.MovieType === 'Adventure' || movie.MovieType === 'Comedy')
              .map((movie) => (
                <CardShowPoster key={movie.ID} movieID={movie.ID} />
              ))}
          </MultiCarousel>

          {/* Action Category */}
          <h2 className="mt-5" style={{ color: '#FFD700' }}>Action</h2>
          <MultiCarousel responsive={responsive} infinite={true}>
            {movies
              .filter((movie) => movie.MovieType === 'Action')
              .map((movie) => (
                <CardShowPoster key={movie.ID} movieID={movie.ID} />
              ))}
          </MultiCarousel>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MovieList;
