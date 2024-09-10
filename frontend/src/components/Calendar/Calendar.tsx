import React from 'react';
import Showtime from '../ShowtimeTable/ShowtimeTable';

const Calendar: React.FC = () => {
  return (
    <div className="calendar">
      {/* Placeholder for now, could map over data to generate */}
      <Showtime title="Godzilla 5" time="09:00" day="Wednesday" />
      <Showtime title="Karon the Killer" time="10:30" day="Thursday" />
      {/* Add more showtimes as necessary */}
    </div>
  );
};

export default Calendar;
