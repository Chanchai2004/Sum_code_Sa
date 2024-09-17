import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetMovies, DeleteMovieByID } from '../../../services/https';  // เพิ่ม DeleteMovieByID
import { MoviesInterface } from '../../../interfaces/IMovie';
import { Table, Button, message, Popconfirm } from 'antd';  // เพิ่ม Popconfirm สำหรับการยืนยันการลบ

const MovieTable: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MoviesInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      const response = await GetMovies();
      if (response) {
        setMovies(response);
      } else {
        setError('Failed to fetch movie data.');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movie data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  

  const handleCreateMovie = () => {
    navigate('/movies/create');  // Navigate to Create Movie page
  };

  const handleEditMovie = (movieID: string) => {
    navigate('/movies/edit', { state: { movieID } }); // ส่ง movieID ผ่าน state
  };
  
  // ฟังก์ชันลบข้อมูลภาพยนตร์
  const handleDeleteMovie = async (movieID: string) => {
    try {
      await DeleteMovieByID(movieID);  // เรียก API ลบภาพยนตร์
      message.success('Movie deleted successfully');
      fetchMovies();  // อัปเดตตารางหลังจากลบข้อมูล
    } catch (error) {
      message.error('Failed to delete movie');
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      key: 'index',
      render: (text: string, record: MoviesInterface, index: number) => index + 1,
    },
    {
      title: 'ชื่อ',
      dataIndex: 'MovieName',
      key: 'MovieName',
    },
    // Additional columns...
    {
      title: 'จัดการข้อมูล',
      key: 'action',
      render: (text: string, record: MoviesInterface) => (
        <span>
          <Button onClick={() => handleEditMovie(record.ID)}>แก้ไขข้อมูล</Button>          
          {/* ปุ่มลบพร้อมยืนยันการลบ */}
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบ?"
            onConfirm={() => handleDeleteMovie(record.ID)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button danger>ลบ</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>เพิ่มข้อมูลหนัง</h1>

      {/* Create button navigates to the Create Movie page */}
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleCreateMovie}>
        + สร้างข้อมูล
      </Button>

      <Table columns={columns} dataSource={movies} rowKey={(record) => record.ID} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default MovieTable;
