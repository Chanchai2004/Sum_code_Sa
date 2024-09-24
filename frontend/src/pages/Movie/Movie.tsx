import React, { useState } from "react";
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
import { CreateMovie } from "../../services/https/index"; // นำเข้า CreateMovie
import "./Movie.css";

const { Option } = Select;

interface MovieInterface {
  MovieName: string;
  MovieDuration: number;
  MovieType: string;
  Director: string;
  Actor: string;
  Synopsis: string;
  ReleaseDate: string;
  Poster: string | null;
}

const Movie: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);  // ไฟล์โปสเตอร์

  const onFinish = async (values: MovieInterface) => {
    const formData = new FormData();

    // เพิ่มข้อมูลลงใน FormData
    formData.append("movieName", values.MovieName);
    formData.append("movieDuration", values.MovieDuration.toString());  // ระยะเวลาเป็น string
    formData.append("movieType", values.MovieType);
    formData.append("director", values.Director);
    formData.append("actor", values.Actor);
    formData.append("synopsis", values.Synopsis);

    // แปลงวันที่จาก DatePicker เป็นรูปแบบ YYYY-MM-DD
    if (values.ReleaseDate) {
      const formattedDate = values.ReleaseDate.format("YYYY-MM-DD");  // แปลงเป็น YYYY-MM-DD
      formData.append("releaseDate", formattedDate);
    }

    // ตรวจสอบว่าโปสเตอร์ถูกเลือกและถูกส่งไปใน FormData
    if (fileList.length > 0) {
      formData.append("poster", fileList[0].originFileObj as Blob);  // ต้องเป็นไฟล์
    }

    // พิมพ์ข้อมูลที่อยู่ใน formData ออกมา
    console.log(formData);

    console.log("FormData being sent:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      let response = await CreateMovie(formData);  // ส่งไป backend
      if (response.status) {
        message.success("Movie added successfully!");
      } else {
        message.error("Failed to add movie!");
        console.error("Failed to add movie!", response.message);
      }
    } catch (error) {
      console.error("Error uploading movie:", error);
    }
  };

  // จับการเปลี่ยนแปลงไฟล์โปสเตอร์
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
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const beforeCrop = (file: UploadFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage;
  };

  return (
    <div className="movie">
      <div className="app">
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
                <Option value="War">War</Option>
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
              <ImgCrop
                rotate
                quality={1}
                aspect={2 / 3} // ตั้งค่าอัตราส่วน 2:3 เพื่อให้ครอปเป็นขนาด 600x900
                modalTitle="Crop your image"
                modalWidth={600} // ขนาด modal เพื่อการครอป
                modalOk="Crop"  // ปุ่ม OK
                modalCancel="Cancel" // ปุ่ม Cancel
                cropperProps={{
                  style: { width: 600, height: 900 } // บังคับให้ครอปเหลือ 600x900
                }}
              >
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
                Add Movie
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
    </div>
    </div>
  );
};

export default Movie;
