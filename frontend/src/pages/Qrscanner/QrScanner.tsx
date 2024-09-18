import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Form, Input, Button, message } from "antd"; // Import Ant Design components
import { PlusOutlined } from "@ant-design/icons"; // Import the icon
import "./QrScanner.css"; // Import the CSS file
import { Checkin } from '../../services/https/index'; // Import the service that calls the backend
import Header from '../../components/Headerticketcheck/Headerticketcheck';
import Sidebar from '../../components/Sidebarticketcheck/Sidebarticketcheck';

const QrScanner: React.FC = () => {
  const [data, setData] = useState<string | null>(null);
  const [form] = Form.useForm(); // Create a form instance

  const handleSubmit = async () => {
    if (Number(data)) {
      try {
        // ส่ง ticket_id ไปยัง backend ผ่าน Checkin function
        const response = await Checkin(Number(data));
        // const u = await Checkduplication(Number(data));
        
        if (response.status && response.message === "complete") {
          message.success("Data submitted successfully!");
          form.resetFields(); // Clear the form after successful submission
          setData(null);
        } else if (response.message === "failed") {
          message.error("Already used!");
          form.resetFields();
          setData(null);
        } else if (response.message === "Ticket not found") {
          // Condition when the ticket ID is not found in the backend
          message.error("Ticket not found !!");
          form.resetFields();
          setData(null);
        } else {
          message.error("Unexpected error occurred.");
          form.resetFields();
          setData(null);
        }
      } catch (error) {
        message.error("Error occurred while submitting data.");
      }
    } else {
      message.error("No data to submit.");
    }
  };

  return ( 
    
    <div className="ticketcheckcontainer">
      <Sidebar /> 
      <Header />
      <div className="scannerContainer">
        <br></br>
      <div className="ticketcheck">
        <h1>QR Code Scanner</h1>
      </div>
        <QrReader
          onResult={(result: any, error: any) => {
            
        if (result) {
            const text = result?.text || result.getText?.() || "";
              if (text) {
                setData(text);
                form.setFieldsValue({ ticketID: text }); // Ensure field name matches
                console.log(text); // Print the text instead of data for clarity
              } else {
                console.error("no data");
              }
          }
            if (error) {
              console.error(error);
            }
          }}
          constraints={{ facingMode: "environment" }}
          className="qrReader"
        />

        {/* Ant Design Form */}
        <Form form={form} layout="vertical">
          <div className="ticketcheckinput-button-container">
            <Form.Item
              label="Ticket ID"
              name="ticketID"
              rules={[
                {
                  required: true,
                  message: "Please Enter Ticket ID",
                },
              ]}
              style={{ flex: 1 }}
            >
             <Input
  placeholder="Please Enter Ticket ID"
  allowClear
  value={data || ""}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(e.target.value)} // ระบุชนิดของ e ที่นี่
/>

            </Form.Item>

            <Button
              type="primary"
              onClick={handleSubmit}
              icon={<PlusOutlined />}
              style={{ marginLeft: "10px" }}
            >
              Enter
            </Button>
          </div>
        </Form>
      </div>
    </div>
    
  );
};

export default QrScanner;
