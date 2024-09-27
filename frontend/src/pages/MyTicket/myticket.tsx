import React, { useEffect, useState } from 'react';
import { Table, message, Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { TagOutlined, SearchOutlined, CalendarOutlined } from '@ant-design/icons'; // นำเข้าไอคอนที่จำเป็น
import './myticket.css';
import Navbar from '../../components/navbar/navbar';
import { GetTicketById } from '../../services/https/index';

const MyTicket: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [searchMovie, setSearchMovie] = useState<string>(''); // เก็บข้อมูลการค้นหาจากชื่อหนัง
  const [searchDate, setSearchDate] = useState<string>(''); // เก็บข้อมูลการค้นหาจากวันที่
  const navigate = useNavigate();

  useEffect(() => {
    const memberID = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    if (!memberID || !token) {
      message.error('Please log in first');
      navigate('/login');
      return;
    }

    const fetchTickets = async () => {
      try {
        const data = await GetTicketById(Number(memberID));
        if (data && Array.isArray(data)) {
          setTickets(data);
        } else if (data) {
          setTickets([data]);
        } else {
          throw new Error('Data is not valid');
        }
      } catch (error) {
        console.error('no ticket');
      }
    };

    fetchTickets();
  }, [navigate]);

  const groupByDate = (tickets: any[]) => {
    return tickets.reduce((groupedTickets: any, ticket: any) => {
      const date = new Date(ticket.date).toLocaleDateString();
      if (!groupedTickets[date]) {
        groupedTickets[date] = [];
      }
      groupedTickets[date].push(ticket);
      return groupedTickets;
    }, {});
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    // ฟอร์แมตวันที่ในรูปแบบ YYYY-MM-DD
    const dateFormatted = date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // ฟอร์แมตเวลาในรูปแบบ HH:MM
    const timeFormatted = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // ปิดการแสดงผลแบบ 12 ชั่วโมง (AM/PM)
    });

    return `${dateFormatted} ${timeFormatted}`;
  };

  const handleViewDetails = (ticketId: number, selectseat: string) => {
    const seatsArray = selectseat.split(', ');
    navigate('/ticket', { state: { ticketID: ticketId, selectedSeats: seatsArray } });
    console.log("Mt ticket ส่ง : ",{ state: { ticketID: ticketId, selectedSeats: seatsArray } })
  };

  const columns = [
    {
      title: 'Movie',
      dataIndex: 'movie',
      key: 'movie',
      width: 200,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      width: 190,
    },
    {
      title: 'Theater',
      dataIndex: 'theater',
      key: 'theater',
      width: 140,
    },
    {
      title: 'Ticket',
      key: 'ticket',
      width: 100,
      render: (text: any, record: any) => (
        <Button type="link" icon={<TagOutlined />} onClick={() => handleViewDetails(record.ticketId, record.seats)}>
          View Ticket
        </Button>
      ),
    },
  ];

  const groupedTickets = groupByDate(tickets);

  const filteredTickets = Object.keys(groupedTickets)
    .filter((date) => date.includes(searchDate)) // กรองตามวันที่
    .reduce((acc: any, date: string) => {
      const filteredMovies = groupedTickets[date].filter((ticket: any) =>
        ticket.movie.toLowerCase().includes(searchMovie.toLowerCase())
      );
      if (filteredMovies.length > 0) {
        acc[date] = filteredMovies;
      }
      return acc;
    }, {});

  return (
    <div className="ticket-container">
      <Navbar />
      <h1 className="ticket-title custom-ticket-title">MY TICKET HISTORY</h1>

      {/* ช่องค้นหาและจัดเรียงให้อยู่ในบรรทัดเดียวกัน */}
      <div className="search-container">
        <Input
          placeholder="Search by movie name"
          prefix={<SearchOutlined />}
          value={searchMovie}
          onChange={(e) => setSearchMovie(e.target.value)}
          style={{ width: '300px', marginRight: '10px' }} // กำหนดความกว้างให้ยาวขึ้น
        />
        <Input
          placeholder="Search by date (DD/MM/YYYY)"
          prefix={<CalendarOutlined />}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          style={{ width: '300px' }} // กำหนดความกว้างให้ยาวขึ้น
        />
      </div>


      {Object.keys(filteredTickets).map((date) => (
        <div key={date} style={{ marginBottom: '40px' }}>
          <h2>{date}</h2>
          <Table
            dataSource={filteredTickets[date]}
            columns={columns}
            pagination={false}
            bordered
            className="ticket-table"
            rowClassName={(record, index) => (index % 2 === 0 ? 'row-light' : 'row-dark')}
          />
        </div>
      ))}
    </div>
  );
};

export default MyTicket;