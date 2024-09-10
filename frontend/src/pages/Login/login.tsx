import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        console.log("Form submitted with values:", values);
    
        try {
            const response = await axios.post('http://localhost:8000/api/signin', {
                email: values.username,
                password: values.password
            });
    
            console.log("API response:", response);
    
            if (response.status === 200) {
                console.log("Login successful. Response data:", response.data);
    
                // ตรวจสอบว่า memberID และ token มีอยู่หรือไม่
                const { email, memberID = 1, token = 'dummy-token' } = response.data;  // ใช้ค่า default เพื่อทดสอบ
                if (memberID && token) {
                    console.log("Storing memberID and token in localStorage...");
    
                    // ตั้งค่า Local Storage
                    message.success('Login successful');
                    localStorage.setItem('isLogin', 'true');
                    localStorage.setItem('email', email); 
                    // หลังจากล็อกอินสำเร็จ
                    localStorage.setItem('memberID', response.data.id);  // ตรวจสอบว่าค่า id นี้ถูกต้อง

                    localStorage.setItem('token', token); 
    
                    console.log("Checking if the user is an admin...");
                    if (email === 'sa@gmail.com' && values.password === '123456') {
                        localStorage.setItem('isAdmin', 'true');
                        console.log("User is admin, navigating to dashboard...");
                        navigate('/dashboard');
                    } else {
                        localStorage.setItem('isAdmin', 'false');
                        console.log("User is not an admin, navigating to home...");
                        navigate('/home');
                    }
                } else {
                    console.error("Invalid login response: memberID or token is missing");
                    message.error('Invalid login response');
                }
            }
        } catch (err: any) {
            console.error("Login failed. Error details:", err);
            message.error('Login failed. Please check your username and password.');
        }
    };
    

    return (
        <div className="login-container">
            <div className="login-formContainer">
                <h1 className="login-title">MERJE CINIPLEX</h1>
                <Form
                    name="login"
                    onFinish={onFinish}
                    className="login-form"
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        label={<span className="login-label">Username</span>}
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username' }]}
                    >
                        <Input placeholder="Username" className="login-input" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="login-label">Password</span>}
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password placeholder="Password" className="login-input" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" className="login-rememberMe">
                        <Checkbox className="login-checkbox">Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button">
                            Login
                        </Button>
                    </Form.Item>

                    <Form.Item className="login-registerContainer">
                        <span className="login-registerText">Don't have an account?</span>
                        <Button type="default" className="login-registerButton" onClick={() => navigate('/signup')}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
