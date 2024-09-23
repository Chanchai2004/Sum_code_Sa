import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { GetTicketcheck  } from "../../services/https/index"; // แก้ไข path ให้ถูกต้องตามที่เก็บไฟล์นี้
import "./ticketstatus.css"; 
import Header from '../../components/Headerticketcheck/Headerticketcheck';
import Sidebar from '../../components/Sidebarticketcheck/Sidebarticketcheck';

const columns = [
    {
      title: 'CheckinID',
      dataIndex: 'ID',
      key: 'ID',
      width: '20%',
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
    const [groupedData, setGroupedData] = useState({}); // สำหรับเก็บข้อมูลที่จัดกลุ่ม

    const fetchData = async () => {
      const result = await GetTicketcheck();
      console.log(result);

      if (result) {
        setData(result);
        groupDataByDate(result); // เรียกใช้ฟังก์ชันจัดกลุ่มข้อมูล
      } else {
        message.error('Failed to load data.');
      }
    };

    const groupDataByDate = (data) => {
      const grouped = data.reduce((acc, item) => {
        const date = new Date(item.TimeStamp).toLocaleDateString(); // แปลง timestamp เป็นวันที่
        if (!acc[date]) {
          acc[date] = []; // สร้างอาเรย์ใหม่ถ้ายังไม่มี
        }
        acc[date].push(item);
        return acc;
      }, {});
      setGroupedData(grouped);
    };

    useEffect(() => {
      fetchData(); // เรียกใช้ fetchData เมื่อ component ถูก mount
    }, []);

    return (
      <div className='ticketstatus'>
        <div className="body">
          <div className="main-content">
            <div className="ticketchecktable-container">
              <Sidebar /> 
              <Header />
              {Object.keys(groupedData).map(date => (
                <div key={date}>
                  <h3>{date}</h3> {/* แสดงวันที่ */}
                  <Table
                    columns={columns}
                    dataSource={groupedData[date]} // ใช้ข้อมูลที่จัดกลุ่ม
                    rowKey="ID"
                    bordered // แสดงขอบรอบตาราง
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
};

export default TicketCheckTable;