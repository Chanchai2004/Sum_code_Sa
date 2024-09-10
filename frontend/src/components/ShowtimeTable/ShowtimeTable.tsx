import React, { useState, useEffect } from 'react';
import './ShowtimeTable.css';
import moment, { Moment } from 'moment';

interface ShowTimeInterface {
  startTime: number;
  endTime: number;
  theater: string;
  movieTitle?: string;
}

const theaters = [
  'Theater 1', 'Theater 2', 'Theater 3', 'Theater 4', 
  'Theater 5', 'Theater 6', 'Theater 7', 'Theater 8', 
  'Theater 9', 'Theater 10'
];
const showtimes = Array.from({ length: 14 }, (_, i) => 9 + i); // เวลาตั้งแต่ 9:00 ถึง 22:00

const colors = [
  '#FF0000', '#FF4500', '#FFA500', '#FFD700', '#FFFF00', 
  '#ADFF2F', '#00FF00', '#20B2AA', '#0000FF', '#8A2BE2', 
  '#EE82EE', '#C71585'
];

interface ShowtimeTableProps {
  reload: boolean;
  selectedDate: Moment | null;
}

const ShowtimeTable: React.FC<ShowtimeTableProps> = ({ reload, selectedDate }) => {
  const [schedule, setSchedule] = useState<ShowTimeInterface[]>([]);
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
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
  }, [reload, selectedDate]);

  const handleClick = (showtime: ShowTimeInterface) => {
    if (selectedDate) {
      const date = selectedDate.format('YYYY-MM-DD');
      console.log('Selected Date:', date); // ตรวจสอบ selectedDate
      console.log(`Date: ${date}, Movie: ${showtime.movieTitle}, Theater: ${showtime.theater}, Start Time: ${showtime.startTime}:00, End Time: ${showtime.endTime}:00`);
    } else {
      console.log('Selected Date is null'); // ตรวจสอบกรณีที่ selectedDate เป็น null
      console.log(`Movie: ${showtime.movieTitle}, Theater: ${showtime.theater}, Start Time: ${showtime.startTime}:00, End Time: ${showtime.endTime}:00`);
    }
  };

  return (
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
          <tr key={theater}>
            <td>{theater}</td>
            {showtimes.map((time) => {
              const showtime = schedule.find(
                (s) => s.startTime === time && s.theater === theater
              );
              if (showtime && time === showtime.startTime) {
                const colSpan = showtime.endTime - showtime.startTime;
                return (
                  <td 
                    key={time} 
                    colSpan={colSpan}
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
              } else if (!schedule.some(s => s.startTime <= time && s.endTime > time && s.theater === theater)) {
                return <td key={time}></td>;
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShowtimeTable;
