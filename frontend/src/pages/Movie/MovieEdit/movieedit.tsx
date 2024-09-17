import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  message,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import type { UploadFile } from "antd/es/upload/interface";
import moment from "moment";
import { GetMovieById, UpdateMovie } from "../../../services/https/index"; // Import GetMovieById, UpdateMovie
import { MoviesInterface } from "../../../interfaces/IMovie";
import { useLocation, useNavigate } from "react-router-dom"; // เปลี่ยนมาใช้ useLocation

const { Option } = Select;

function MovieEdit() {
  const [form] = Form.useForm();
  const location = useLocation();  // ใช้ useLocation เพื่อรับ movieID
  const { movieID } = location.state || {};  // รับ movieID จาก state
  const [fileList, setFileList] = useState<UploadFile[]>([]);  // ไฟล์โปสเตอร์
  const [movies, setMovies] = useState<MoviesInterface | null>(null); // เก็บรายละเอียดของหนังที่ดึงมา

  // ฟังก์ชันสำหรับดึงข้อมูลหนังจาก API
  const getMovieById = async (id: number) => {
    try {
      const res = await GetMovieById(id);
      if (res) {
        setMovies(res);
        form.setFieldsValue({
          MovieName: res.MovieName,
          MovieDuration: res.MovieDuration,
          MovieType: res.MovieType,
          Director: res.Director,
          Actor: res.Actor,
          Synopsis: res.Synopsis,
          ReleaseDate: res.ReleaseDate ? moment(res.ReleaseDate) : null,
        });
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      message.error("Error fetching movie details.");
    }
  };

  // ตรวจสอบ movieID จาก state และดึงข้อมูลหนัง
  useEffect(() => {
    if (movieID) {
      console.log(`Editing movie with ID: ${movieID}`);
      getMovieById(Number(movieID)); // ดึงข้อมูลหนังตาม movieID
    } else {
      console.error("Movie ID is missing");
    }
  }, [movieID]);

  const onFinish = async (values: MoviesInterface) => {
    try {
      const formData = new FormData();
      
      // เพิ่มข้อมูลลงใน FormData
      formData.append("movieName", values.MovieName);
      formData.append("movieDuration", values.MovieDuration.toString());
      formData.append("movieType", values.MovieType || "");
      formData.append("director", values.Director || "");
      formData.append("actor", values.Actor || "");
      formData.append("synopsis", values.Synopsis || "");

      // แปลงวันที่จาก DatePicker เป็นรูปแบบ YYYY-MM-DD
      if (values.ReleaseDate) {
        const formattedDate = values.ReleaseDate.format("YYYY-MM-DD");
        formData.append("releaseDate", formattedDate);
      }

      // ตรวจสอบว่ามีโปสเตอร์ถูกเลือกหรือไม่
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("poster", fileList[0].originFileObj as Blob);
      }

      // Log ข้อมูล FormData เพื่อดูว่าอะไรจะถูกส่งไปบ้าง
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // ตรวจสอบว่า movieID ถูกต้องก่อนส่งข้อมูล
      if (movieID !== null) {
        const response = await UpdateMovie(Number(movieID), formData);  // ส่ง movieID และ FormData

        if (response) {
          message.success("Movie updated successfully!");
        } else {
          message.error("Failed to update movie.");
        }
      } else {
        console.error("Movie ID is null. Cannot update movie.");
        message.error("Failed to update movie. Movie ID is missing.");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      message.error("Error updating movie.");
    }
  };

  const onUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);  // อัปเดตไฟล์ที่เลือก
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const imgWindow = window.open(src);
    imgWindow?.document.write(`<img src="${src}" />`);
  };

  return (
    <Card style={{ margin: "20px" }}>
      <h2>Movie Information</h2>
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Movie Name"
              name="MovieName"
              rules={[{ required: true, message: "Please enter the movie name!" }]}
            >
              <Input placeholder="Enter movie name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Duration (minutes)"
              name="MovieDuration"
              rules={[{ required: true, message: "Please enter the movie duration!" }]}
            >
              <InputNumber min={1} placeholder="Enter movie duration in minutes" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Movie Type"
              name="MovieType"
              rules={[{ required: true, message: "Please select the movie type!" }]}
            >
              <Select placeholder="Select movie type">
                <Option value="Action">Action</Option>
                <Option value="Drama">Drama</Option>
                <Option value="Comedy">Comedy</Option>
                <Option value="Horror">Horror</Option>
                <Option value="Sci-Fi">Sci-Fi</Option>
                <Option value="Romantic">Romantic</Option>
                <Option value="Thriller">Thriller</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Director"
              name="Director"
              rules={[{ required: true, message: "Please enter the director's name!" }]}
            >
              <Input placeholder="Enter director's name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Main Actor"
              name="Actor"
              rules={[{ required: true, message: "Please enter the main actor's name!" }]}
            >
              <Input placeholder="Enter main actor's name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Release Date"
              name="ReleaseDate"
              rules={[{ required: true, message: "Please select the release date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              label="Synopsis"
              name="Synopsis"
              rules={[{ required: true, message: "Please enter the movie synopsis!" }]}
            >
              <Input.TextArea rows={4} placeholder="Enter movie synopsis" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item label="Poster" name="Poster">
              <ImgCrop rotate>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onUploadChange}
                  onPreview={onPreview}
                  beforeUpload={() => false} // ปิดการอัปโหลดอัตโนมัติ
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload Poster</div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end">
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Movie
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default MovieEdit;
