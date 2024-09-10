import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { Select, DatePicker, TimePicker, message, Modal } from 'antd';
import moment, { Moment } from 'moment';

const { Option } = Select;

interface ShowTimeInterface {
  ID?: number;
  startTime: number;
  endTime: number;
  theater: string;
  movieTitle?: string;
}

interface MovieInterface {
  ID: number;
  MovieName: string;
}

interface TheaterInterface {
  ID: number;
  TheaterName: string;
}

const theaters = [
  'Theater 1', 'Theater 2', 'Theater 3', 'Theater 4', 
  'Theater 5', 'Theater 6', 'Theater 7', 'Theater 8', 
  'Theater 9', 'Theater 10'
];
const showtimes = Array.from({ length: 14 }, (_, i) => 9 + i);

const colors = [
  '#FF4500', '#FFA500', '#FFD700', '#FFFF00', 
  '#ADFF2F', '#00FF00', '#20B2AA', '#0000FF', '#8A2BE2', 
  '#EE82EE', '#C71585'
];

const ShowtimeManagement: React.FC = () => {
  const [schedule, setSchedule] = useState<ShowTimeInterface[]>([]);
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({});
  const [movies, setMovies] = useState<MovieInterface[]>([]);
  const [theaters, setTheaters] = useState<TheaterInterface[]>([]);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [selectedTime, setSelectedTime] = useState<Moment | null>(null);
  const [selectedMovieID, setSelectedMovieID] = useState<number | undefined>(undefined);
  const [selectedTheaterID, setSelectedTheaterID] = useState<number | undefined>(undefined);
  const [reload, setReload] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(null);
  const isManualUpdate = useRef(false);

  useEffect(() => {
    if (!isManualUpdate.current && selectedDate) {
      fetch('http://localhost:8000/api/showtimes')
        .then(response => response.json())
        .then(data => {
          const transformedSchedule: ShowTimeInterface[] = data.flatMap((item: any) => {
            const showdate = moment(item.Showdate);
  
            if (selectedDate && showdate.format('YYYY-MM-DD') !== selectedDate.format('YYYY-MM-DD')) {
              return [];
            }
  
            const startTime = showdate.hours();
            const durationInMinutes = Math.ceil(item.Movie.MovieDuration / 60 / 1e9);
            const endTime = Math.min(startTime + Math.ceil(durationInMinutes / 60), 22);
            const theater = item.Theater.TheaterName;
            const movieTitle = item.Movie.MovieName;
  
            return [{
              ID: item.ID,
              startTime,
              endTime,
              theater,
              movieTitle,
            }];
          });
  
          setSchedule(transformedSchedule);
  
          const newColorMap: { [key: string]: string } = {};
          let colorIndex = 0;
          transformedSchedule.forEach(showtime => {
            if (showtime.movieTitle && !newColorMap[showtime.movieTitle]) {
              newColorMap[showtime.movieTitle] = colors[colorIndex % colors.length];
              colorIndex++;
            }
          });
          setColorMap(newColorMap);
        })
        .catch(error => {
          console.error('Error fetching showtimes:', error);
        });
    }
  }, [reload, selectedDate]);

  useEffect(() => {
    fetch('http://localhost:8000/api/movies')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => console.error('Error fetching movies:', error));

    fetch('http://localhost:8000/api/theaters')
      .then((response) => response.json())
      .then((data) => {
        setTheaters(data);
      })
      .catch((error) => console.error('Error fetching theaters:', error));
  }, []);

  const disabledHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 9 || i > 22) {
        hours.push(i);
      }
    }
    return hours;
  };

  const disabledMinutes = (selectedHour: number) => {
    if (selectedHour === 8 || selectedHour === 22) {
      return Array.from({ length: 60 }, (_, i) => i);
    }
    return [];
  };

  const handleDateChange = (date: Moment | null) => {
    if (!isManualUpdate.current) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (time: Moment | null) => {
    if (!isManualUpdate.current) {
      setSelectedTime(time);
    }
  };

  const handleAddShowTime = () => {
    if (!selectedDate || !selectedTime || !selectedMovieID || !selectedTheaterID) {
      message.error('Please select all fields');
      return;
    }

    const combinedDateTime = moment(selectedDate)
      .set({
        date: selectedDate.date(),
        hour: selectedTime?.hour() || 0,
        minute: selectedTime?.minute() || 0,
        second: 0,
        millisecond: 0,
      });

    const newShowTimeStart = combinedDateTime.hours();
    const movieDuration = movies.find(movie => movie.ID === selectedMovieID)?.MovieDuration || 0;
    const durationInHours = Math.ceil(movieDuration / 60 / 1e9);
    const newShowTimeEnd = Math.min(newShowTimeStart + Math.ceil(durationInHours / 60), 22);

    const isConflict = schedule.some(showtime => {
      if (showtime.theater === theaters.find(theater => theater.ID === selectedTheaterID)?.TheaterName) {
        const existingStart = showtime.startTime;
        const existingEnd = showtime.endTime;
        return (newShowTimeStart < existingEnd && newShowTimeEnd > existingStart);
      }
      return false;
    });

    if (isConflict) {
      message.error('There is a conflict with another showtime in the same theater.');
      return;
    }

    const newShowTime = {
      Showdate: combinedDateTime.toISOString(),
      MovieID: selectedMovieID,
      TheaterID: selectedTheaterID,
    };

    fetch('http://localhost:8000/api/showtimes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newShowTime),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.error || 'Error creating showtime');
          });
        }
        return response.json();
      })
      .then((data) => {
        message.success('ShowTime created successfully');
        setReload(!reload);
      })
      .catch((error) => {
        message.error('Error creating showtime');
        console.error('Error creating showtime:', error);
      });
  };

  const handleUpdateShowTime = () => {
    if (!selectedDate || !selectedTime || !selectedMovieID || !selectedTheaterID || !selectedShowtimeId) {
      message.error('Please select all fields');
      return;
    }
  
    const combinedDateTime = moment(selectedDate)
      .set({
        date: selectedDate.date(),
        hour: selectedTime?.hour() || 0,
        minute: selectedTime?.minute() || 0,
        second: 0,
        millisecond: 0,
      });
  
    const formattedDateTime = combinedDateTime.format('YYYY-MM-DDTHH:mm:ssZ');
  
    const updateShowTime = {
      Showdate: formattedDateTime,
      MovieID: selectedMovieID,
      TheaterID: selectedTheaterID,
    };
  
    console.log("Update Showtime Data:", JSON.stringify(updateShowTime));
  
    fetch(`http://localhost:8000/api/showtimes/${selectedShowtimeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateShowTime),
    })
      .then(async (response) => {
        const responseBody = await response.text();
        console.log("Response Body:", responseBody);
  
        if (!response.ok) {
          try {
            const errorData = JSON.parse(responseBody);
            throw new Error(errorData.error || 'Error updating showtime');
          } catch (e) {
            throw new Error('Unexpected error format received from the server');
          }
        }
  
        return JSON.parse(responseBody);
      })
      .then((data) => {
        message.success('ShowTime updated successfully');
        setReload(!reload);
        setPopupVisible(false); // ปิด popup เมื่ออัปเดตเสร็จสิ้น
      })
      .catch((error) => {
        message.error(`Error updating showtime: ${error.message}`);
        console.error('Error updating showtime:', error);
      });
  };

  const handleDeleteShowTime = () => {
    if (!selectedShowtimeId) {
      message.error('Please select a showtime to delete');
      return;
    }
  
    const isConfirmed = window.confirm('แน่ใจว่าต้องการลบข้อมูลนี้ใช่ไหม?');
    
    if (!isConfirmed) {
      return;
    }
  
    fetch(`http://localhost:8000/api/showtimes/${selectedShowtimeId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.error || 'Error deleting showtime');
          });
        }
        return response.json();
      })
      .then(() => {
        message.success('ShowTime deleted successfully');
        setReload(!reload);
        setPopupVisible(false); // ปิด popup เมื่อทำการลบเสร็จ
      })
      .catch((error) => {
        message.error(`Error deleting showtime: ${error}`);
        console.error('Error deleting showtime:', error);
      });
  };

  const handleClick = (showtime: ShowTimeInterface) => {
    isManualUpdate.current = true;
  
    setSelectedTime(moment({ hour: showtime.startTime, minute: 0 }));
    setSelectedMovieID(movies.find(movie => movie.MovieName === showtime.movieTitle)?.ID);
    setSelectedTheaterID(theaters.find(theater => theater.TheaterName === showtime.theater)?.ID);
    
    const foundShowtime = schedule.find(s => 
        s.startTime === showtime.startTime && 
        s.theater === showtime.theater &&
        s.movieTitle === showtime.movieTitle
    );

    console.log("Selected Showtime ID:", foundShowtime?.ID);
    console.log("Date:", selectedDate?.format('YYYY-MM-DD'));
    console.log("Time:", showtime.startTime + ":00");
    console.log("Movie:", showtime.movieTitle);
    console.log("Theater:", showtime.theater);
    
    setSelectedShowtimeId(foundShowtime?.ID || null);
  
    setTimeout(() => {
      isManualUpdate.current = false;
    }, 0);
  
    setPopupVisible(true); // แสดง popup update
  };

  return (
    <div>
      {/* Header Section */}
      <div className="header">
        <div className="header-item">
          <label>Date:</label>
          <DatePicker 
            value={selectedDate} 
            onChange={handleDateChange} 
            allowClear={false} 
          />
        </div>
        <div className="header-item">
          <label>Time:</label>
          <TimePicker
            value={selectedTime} 
            format="HH:mm"
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            onChange={handleTimeChange}
            allowClear={false} 
          />
        </div>
        <div className="header-item search-movie-container">
          <label>Movie:</label>
          <Select
            value={selectedMovieID} 
            showSearch
            className="movie-select"
            allowClear
            placeholder="Select a Movie"
            style={{ width: 200 }}
            optionFilterProp="children"
            onChange={(value) => setSelectedMovieID(value as number)}
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
        <div className="header-item search-theater-container">
          <label>Theater:</label>
          <Select
            value={selectedTheaterID}
            showSearch
            className="theater-select"
            allowClear
            placeholder="Select a Theater"
            style={{ width: 200 }}
            optionFilterProp="children"
            onChange={(value) => setSelectedTheaterID(value as number)}
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {theaters.map((theater) => (
              <Option key={theater.ID} value={theater.ID}>
                {theater.TheaterName}
              </Option>
            ))}
          </Select>
        </div>
        <div className="header-item">
          <button className="add-btn" onClick={handleAddShowTime}>
            Add
          </button>
        </div>
      </div>

      {/* Showtime Table Section */}
      <table>
  <thead>
    <tr>
      <th>Theater / Time</th>
      {showtimes.map((time) => (
        <th key={time}>{time}:00</th>
      ))}
    </tr>
  </thead>
  <tbody>
    {theaters.map((theater) => (
      <tr key={theater.ID}>
        <td>{theater.TheaterName}</td>
        {showtimes.map((time) => {
          const showtime = schedule.find(
            (s) => s.startTime === time && s.theater === theater.TheaterName
          );
          if (showtime && time === showtime.startTime) {
            const colSpan = showtime.endTime - showtime.startTime;
            return (
              <td 
                key={time} 
                colSpan={colSpan}
                className="showtime-cell"
                style={{ 
                  backgroundColor: colorMap[showtime.movieTitle!],
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => handleClick(showtime)}
              >
                {showtime.movieTitle}
              </td>
            );
          } else if (showtime && time < showtime.endTime && time > showtime.startTime) {
            return null;
          } else if (!schedule.some(s => s.startTime <= time && s.endTime > time && s.theater === theater.TheaterName)) {
            return <td key={time}></td>;
          }
        })}
      </tr>
    ))}
  </tbody>
</table>


      {/* Popup สำหรับการอัปเดตและลบ */}
      <Modal
  title="Update Showtime"
  visible={popupVisible}
  onCancel={() => setPopupVisible(false)} 
  footer={null} 
  className="modal-content" // เพิ่ม className ที่นี่
>
  <div className="header-item">
    <label>Date:</label>
    <DatePicker 
      value={selectedDate} 
      onChange={handleDateChange} 
      allowClear={false} 
    />
  </div>
  <div className="header-item">
    <label>Time:</label>
    <TimePicker
      value={selectedTime}
      format="HH:mm"
      disabledHours={disabledHours}
      disabledMinutes={disabledMinutes}
      onChange={handleTimeChange}
      allowClear={false}
    />
  </div>
  <div className="header-item search-movie-container">
    <label>Movie:</label>
    <Select
      value={selectedMovieID}
      showSearch
      className="movie-select"
      allowClear
      placeholder="Select a Movie"
      style={{ width: 200 }}
      optionFilterProp="children"
      onChange={(value) => setSelectedMovieID(value as number)}
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
  <div className="header-item search-theater-container">
    <label>Theater:</label>
    <Select
      value={selectedTheaterID}
      showSearch
      className="theater-select"
      allowClear
      placeholder="Select a Theater"
      style={{ width: 200 }}
      optionFilterProp="children"
      onChange={(value) => setSelectedTheaterID(value as number)}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {theaters.map((theater) => (
        <Option key={theater.ID} value={theater.ID}>
          {theater.TheaterName}
        </Option>
      ))}
    </Select>
  </div>
  <div className="header-item button-group">
    <button className="update-btn" onClick={handleUpdateShowTime}>
      Update
    </button>
    <button className="delete-btn" onClick={handleDeleteShowTime}>
      Delete
    </button>
  </div>
</Modal>

    </div>
  );
};

export default ShowtimeManagement;
