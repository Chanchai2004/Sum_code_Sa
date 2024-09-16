import React, { useState, useEffect } from "react";
import { Carousel as AntCarousel, Row, Col, Button, Card } from "antd"; // ใช้ Ant Design Carousel, Grid, Button และ Card
import { ClockCircleOutlined, UserOutlined, CalendarOutlined, VideoCameraOutlined } from "@ant-design/icons"; // Icons จาก Ant Design
import { GetMovieById } from "../../../services/https/index"; // ฟังก์ชัน GetMovieById
import { MoviesInterface } from "../../../interfaces/IMovie"; // Interface สำหรับข้อมูลหนัง

import { Typography } from "antd"; // สำหรับ Typography ของ Ant Design

const { Title, Paragraph } = Typography;

interface CarouselProps {
  movieID: number;
}

const Carousel: React.FC<CarouselProps> = ({ movieID }) => {
  const [movie, setMovie] = useState<MoviesInterface | null>(null);

  // เรียกใช้ฟังก์ชัน GetMovieById เมื่อ movieID เปลี่ยน
  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = await GetMovieById(movieID);
      if (movieData) {
        setMovie(movieData); // ตั้งค่า movie state
        console.log("Movie ID:", movieData.ID); // ตรวจสอบค่า movie.ID เมื่อข้อมูลถูกดึงมา
      }
    };

    fetchMovie();
  }, [movieID]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="carousel-container" style={{ padding: "20px" }}>
      {/* ใช้ Ant Design Carousel */}
      <AntCarousel autoplay effect="fade">
        <div>
          <Card style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <Row gutter={[16, 16]} align="top">
              {/* ส่วนซ้าย: แสดงรายละเอียดหนัง */}
              <Col xs={24} md={12}>
                <div style={{ paddingRight: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
                  <div>
                    <Title level={2}>{movie.MovieName}</Title>
                    <Paragraph>
                      <ClockCircleOutlined style={{ marginRight: '8px' }} />
                      <strong>Duration:</strong> {movie.MovieDuration} minutes
                    </Paragraph>
                    {movie.MovieType && (
                      <Paragraph>
                        <VideoCameraOutlined style={{ marginRight: '8px' }} />
                        <strong>Type:</strong> {movie.MovieType}
                      </Paragraph>
                    )}
                    {movie.Director && (
                      <Paragraph>
                        <UserOutlined style={{ marginRight: '8px' }} />
                        <strong>Director:</strong> {movie.Director}
                      </Paragraph>
                    )}
                    {movie.Actor && (
                      <Paragraph>
                        <UserOutlined style={{ marginRight: '8px' }} />
                        <strong>Actors:</strong> {movie.Actor}
                      </Paragraph>
                    )}
                    {movie.ReleaseDate && (
                      <Paragraph>
                        <CalendarOutlined style={{ marginRight: '8px' }} />
                        <strong>Release Date:</strong> {new Date(movie.ReleaseDate).toLocaleDateString()}
                      </Paragraph>
                    )}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <Paragraph>{movie.Synopsis}</Paragraph>
                  </div>

                  {/* ปุ่มจองตั๋ว */}
                  <div style={{ marginTop: "auto", textAlign: "center", width: "100%" }}>
                    <Button
                      type="primary"
                      onClick={() => console.log(`Book ticket for movie ID: ${movie.ID}`)}
                      block // ทำให้ปุ่มยาวเต็มความกว้าง
                      size="large"
                    >
                      จองตั๋ว
                    </Button>
                  </div>
                </div>
              </Col>

              {/* ส่วนขวา: แสดงภาพ */}
              <Col xs={24} md={12}>
                <img
                  src={`http://localhost:8000/api/movie/${movie.ID}/poster`}
                  alt={movie.MovieName}
                  style={{ width: "100%", maxHeight: "750px", objectFit: "cover", borderRadius: "15px" }}
                />
              </Col>
            </Row>
          </Card>
        </div>
      </AntCarousel>
    </div>
  );
};

export default Carousel;
