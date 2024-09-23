import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Members from './pages/Member/Member';
import Analytics from './pages/Analytics/Analytics';
import Login from './pages/Login/login';
import Movie from './pages/Movie/Movie';
//import Home from './pages/Home/home';
import MyTicket from './pages/MyTicket/myticket';
import SeatBooking from './pages/SeatBooking/SeatBooking'; // เพิ่มการอิมพอร์ต SeatBooking
import PaymentDetail from './pages/paymentdetails/paymentdetail';
import ScanPayment from './pages/scanpayment/scanpayment';
import Ticket from './pages/ticket/ticket';
import MovieList from './pages/MovieList/MovieList';
import ShowtimeManagement from './pages/Showtime/Showtime';
import MovieBooking from './pages/MovieBooking/MovieBooking';
import Reward from './pages/Reward/Reward';
import HistoryPage from './pages/History/History';
import Table from './pages/ticketstatus/ticketstatus';
import QrScanner from './pages/Qrscanner/QrScanner';
import Signup from './pages/Signup/signup';
import CheckCodeReward from './pages/Checkcodereward/checkcode';
import MovieTable from './pages/Movie/MovieTable/movietable';
import MovieEdit from './pages/Movie/MovieEdit/movieedit';


const App: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('isLogin') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const isStaff = localStorage.getItem('isStaff') === 'true';

    useEffect(() => {
        if (isLoggedIn) {
            // กรณีที่ผู้ใช้งานเป็น Admin
            if (isAdmin) {
                if (!['/movie', '/showtimes', '/members', '/analytics', '/movies/create', '/movies/edit'].includes(location.pathname)) {
                    navigate('/movie');
                }
            } 
            // กรณีที่ผู้ใช้งานเป็น Staff
            else if (isStaff) {
                if (!['/scanner', '/ticketstatus', '/checkcode'].includes(location.pathname)) {
                    navigate('/scanner');
                }
            } 
            // กรณีที่ผู้ใช้งานเป็น User ทั่วไป (ไม่ใช่ Admin หรือ Staff)
            else if (!['/home', '/myticket', '/seatbooking', '/moviebooking', '/reward', '/history','/paymentdetail','/scanpayment','/ticket'].includes(location.pathname)) {
                navigate('/home');
            }
        } 
        // กรณีที่ผู้ใช้งานยังไม่ได้ล็อกอิน
        else {
            if (!['/login', '/Signup'].includes(location.pathname)) {
                navigate('/login');  // ถ้าไม่ใช่หน้าล็อกอินหรือสมัครสมาชิก ให้ไปที่หน้าล็อกอิน
            }
        }
    }, [isLoggedIn, isAdmin, isStaff, navigate, location.pathname]);
    
    return (
        <div className="app">
            {isLoggedIn && isAdmin && <Sidebar />}
            <div className="main-content">
                <Routes>
                    
                    <Route path="/login" element={<Login />} />
                    
                    {/* เส้นทางสำหรับผู้ใช้ Admin */}
                    <Route path="/movie" element={isLoggedIn && isAdmin ? <MovieTable /> : <Navigate to="/login" />} />
                    <Route path="/movies/edit" element={isLoggedIn && isAdmin ? <MovieEdit /> : <Navigate to="/login" />} />
                    <Route path="/movies/create" element={isLoggedIn && isAdmin ? <Movie /> : <Navigate to="/login" />} />
                    <Route path="/showtimes" element={isLoggedIn && isAdmin ? <ShowtimeManagement /> : <Navigate to="/login" />} />
                    <Route path="/members" element={isLoggedIn && isAdmin ? <Members /> : <Navigate to="/login" />} />
                    <Route path="/analytics" element={isLoggedIn && isAdmin ? <Analytics /> : <Navigate to="/login" />} />

                    {/* เส้นทางสำหรับผู้ใช้ที่ไม่ใช่ Admin */}
                    <Route path="/home" element={isLoggedIn && !isAdmin ? <MovieList /> : <Navigate to="/login" />} />
                    <Route path="/myticket" element={isLoggedIn && !isAdmin ? <MyTicket /> : <Navigate to="/login" />} />
                    <Route path="/seatbooking" element={isLoggedIn && !isAdmin ? <SeatBooking /> : <Navigate to="/login" />}/>
                    <Route path="/moviebooking" element={isLoggedIn && !isAdmin ? <MovieBooking /> : <Navigate to="/login" />} />

                    {/* เส้นทางสำหรับการชำระเงิน */}
                    <Route path="/paymentdetail" element={isLoggedIn && !isAdmin ? <PaymentDetail /> : <Navigate to="/login" />} />
                    <Route path="/scanpayment" element={isLoggedIn && !isAdmin ? <ScanPayment /> : <Navigate to="/login" />} />
                    <Route path="/ticket" element={isLoggedIn && !isAdmin ? <Ticket /> : <Navigate to="/login" />} />

                     {/* เส้นทางสำหรับการเเลกรางวัล */}
                    <Route path="/reward" element={isLoggedIn && !isAdmin ? <Reward /> : <Navigate to="/login" />} />
                    <Route path="/history" element={isLoggedIn && !isAdmin ? <HistoryPage /> : <Navigate to="/login" />} />
                  
                  {/*เส้นทางสำหรับสตาฟ*/ }
                  <Route path="/scanner" element={isLoggedIn && isStaff ? <QrScanner /> : <Navigate to="/login"/>} />
                    <Route path="/ticketstatus" element={isLoggedIn && isStaff ? <Table /> : <Navigate to="/login"/>} />
                    <Route path="/checkcode" element={isLoggedIn && isStaff ? <CheckCodeReward /> : <Navigate to="/login"/>} />

                    <Route path="/Signup" element={<Signup />} />

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
