import React, { useState } from 'react';
import { Button, Input, Form } from 'antd'; 
import './checkcode.css'; // Import ไฟล์ CSS
import Header from '../../components/Headerticketcheck/Headerticketcheck';
import Sidebar from '../../components/Sidebarticketcheck/Sidebarticketcheck';
import { getRewardCode,updateRewardCodeStatus }from '../../services/https/index'; // Import ฟังก์ชันจาก service

const CheckCodeReward: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);

    const handleCheckCode = async () => {
        try {
            // ตรวจสอบว่ารหัส reward ถูกต้องหรือไม่
            const data = await getRewardCode(code);
    
            console.log("Response from API:", data); // ตรวจสอบข้อมูลที่ได้จาก API
            
            if (data && data.status === true) {
                setMessage(`รหัสถูกต้องและสามารถใช้งานได้: ${data.reward_name}`);
    
                // อัปเดตสถานะว่าโค้ดนี้ถูกใช้งานแล้ว
                await updateRewardCodeStatus(code, false); // อัปเดตสถานะโค้ดนี้ให้ถูกใช้งานแล้ว
                console.log("Reward code status updated to 'used'");
            } else if (data && data.status === false) {
                setMessage('รหัสนี้ถูกใช้ไปแล้ว');
            } else {
                setMessage('รหัสไม่ถูกต้องหรือไม่พบ');
            }
        } catch (error) {
            setMessage('เกิดข้อผิดพลาดในการตรวจสอบรหัส');
            console.error('Error checking reward code:', error);
        }
    };
    
    
    
    
    return (
        <div className="containeropern">
            <Sidebar /> 
            <Header />
            <div className="checkcode-box">
                <h2>ตรวจสอบรหัสรางวัล</h2>
                <Form onFinish={handleCheckCode}>
                    <Form.Item>
                        <Input
                            placeholder="กรอกรหัสรางวัลที่นี่"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="input"
                        />
                    </Form.Item>
                    <Form.Item>
                    <Button type="primary" onClick={handleCheckCode} className="button">
                        ตรวจสอบ
                    </Button>

                    </Form.Item>
                </Form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default CheckCodeReward;
