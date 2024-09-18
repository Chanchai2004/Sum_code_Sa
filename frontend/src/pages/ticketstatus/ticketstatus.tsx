import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { GetTicketcheck } from "../../services/https/index"; // แก้ไข path ให้ถูกต้องตามที่เก็บไฟล์นี้
import "./ticketstatus.css"; 
import Header from '../../components/Headerticketcheck/Headerticketcheck';
import Sidebar from '../../components/Sidebarticketcheck/Sidebarticketcheck';

const columns = [
    {
      title: 'CheckinID',
      dataIndex: 'ID',
      key: 'ID',
      width: '20%', // กำหนดความกว้างให้แต่ละคอลัมน์
    },
    {
      title: 'TicketID',
      dataIndex: 'TicketID',
      key: 'TicketID',
      width: '30%',
    },
    {
      title: 'Time_stamp',
      dataIndex: 'TimeStamp',
      key: 'TimeStamp',
      width: '30%',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: '20%',
    },
  ];
  
  const TicketCheckTable: React.FC = () => {
    const [data, setData] = useState([]);
  
    const fetchData = async () => {
      const result = await GetTicketcheck();
      console.log(result)
  
      if (result) {
        setData(result); // ตั้งค่า state data ที่จะนำมาแสดงในตาราง
      } else {
        message.error('Failed to load data.');
      }
    };
  
    useEffect(() => {
      fetchData(); // เรียกใช้ fetchData เมื่อ component ถูก mount
    }, []);
  
    return (
      <div className="ticketchecktable-container">
        <Sidebar /> 
        <Header />
        <Table
          columns={columns}
          dataSource={data}
          rowKey="ID"
          bordered // แสดงขอบรอบตาราง
        />
      </div>
    );
  };

export default TicketCheckTable;
