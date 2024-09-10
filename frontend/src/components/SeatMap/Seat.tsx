import React from 'react';

interface SeatProps {
  seat: string;
  isBooked: boolean;
  isSelected: boolean;
  onSelect: (seat: string) => void;
}

const Seat: React.FC<SeatProps> = ({ seat, isBooked, isSelected, onSelect }) => {
  const seatClass = `seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`;

  return (
    <div className={seatClass} onClick={() => !isBooked && onSelect(seat)}>
      {seat}
    </div>
  );
};

export default Seat;
