import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Members from './pages/Member/Member';
import Showtime from './pages/Showtime/Showtime';
import Analytics from './pages/Analytics/Analytics';
import Login from './pages/Login/login';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/home';
import MyTicket from './pages/MyTicket/myticket';
import SeatBooking from './pages/SeatBooking/SeatBooking'; // เพิ่มการอิมพอร์ต SeatBooking

const App: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('isLogin') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    useEffect(() => {
        if (isLoggedIn) {
            if (isAdmin && !['/dashboard', '/showtimes', '/members', '/analytics'].includes(location.pathname)) {
                navigate('/dashboard');
            }
            if (!isAdmin && !['/home', '/myticket', '/seatbooking'].includes(location.pathname)) { // เพิ่ม '/seatbooking' ในการตรวจสอบ
                navigate('/home');
            }
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, isAdmin, navigate, location.pathname]);

    return (
        <div className="app">
            {isLoggedIn && isAdmin && <Sidebar />}
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Navigate to={isLoggedIn ? (isAdmin ? "/dashboard" : "/home") : "/login"} />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* เส้นทางสำหรับผู้ใช้ Admin */}
                    <Route path="/dashboard" element={isLoggedIn && isAdmin ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/showtimes" element={isLoggedIn && isAdmin ? <Showtime /> : <Navigate to="/login" />} />
                    <Route path="/members" element={isLoggedIn && isAdmin ? <Members /> : <Navigate to="/login" />} />
                    <Route path="/analytics" element={isLoggedIn && isAdmin ? <Analytics /> : <Navigate to="/login" />} />

                    {/* เส้นทางสำหรับผู้ใช้ที่ไม่ใช่ Admin */}
                    <Route path="/home" element={isLoggedIn && !isAdmin ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/myticket" element={isLoggedIn && !isAdmin ? <MyTicket /> : <Navigate to="/login" />} />
                    <Route path="/seatbooking" element={isLoggedIn && !isAdmin ? <SeatBooking /> : <Navigate to="/login" />} />

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
