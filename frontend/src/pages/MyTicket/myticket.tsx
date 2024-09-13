import React, { useEffect, useState } from 'react';
import { Table, message, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { YoutubeOutlined } from '@ant-design/icons'; // นำเข้าไอคอน YouTube
import './myticket.css';
import Navbar from '../../components/navbar/navbar';
import { GetTicketById } from '../../services/https/index';

const MyTicket: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const memberID = localStorage.getItem('memberID');
    const token = localStorage.getItem('token');

    console.log("Using Member ID:", memberID);

    if (!memberID || !token) {
      message.error('Please log in first');
      navigate('/login');
      return;
    }

    const fetchTickets = async () => {
      try {
        const data = await GetTicketById(Number(memberID));
        console.log("Tickets data:", data);
        if (data && Array.isArray(data)) {
          setTickets(data);
        } else if (data) {
          setTickets([data]);
        } else {
          throw new Error("Data is not valid");
        }
      } catch (error) {
        console.error('no ticket');
     
      }
    };

    fetchTickets();
  }, [navigate]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const columns = [
    {
      title: 'Movie',
      dataIndex: 'movie',
      key: 'movie',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => formatDateTime(text),
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
    },
    {
      title: 'Theater',
      dataIndex: 'theater',
      key: 'theater',
    },
    {
      title: 'Ticket',
      key: 'ticket',
      render: () => (
        <Button
          type="link"
          icon={<YoutubeOutlined />} // ใช้ไอคอน YouTube
          onClick={() => window.open('https://www.youtube.com', '_blank')} // ลิ้งค์ไปยัง YouTube
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="ticket-container">
      <Navbar />
      <h1 className="ticket-title">My Ticket History</h1>
      <Table
        dataSource={tickets}
        columns={columns}
        pagination={false}
        bordered
        className="ticket-table"
        rowClassName={(record, index) => (index % 2 === 0 ? 'row-light' : 'row-dark')}
      />
    </div>
  );
};

export default MyTicket;
