import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button } from 'antd';
import './navbar.css';
import MerjeLogo from "../../assets/Merjelogo.png";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('isLogin') === 'true');
  const email = localStorage.getItem('memberEmail'); 

  const handleLogout = () => {
    const email = localStorage.getItem('email'); 
    console.log(`email: ${email} is logout`);

    localStorage.removeItem('isLogin');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('email'); 

    navigate('/login');
  };
  
  const handleLoginClick = () => {
    if (isLoggedIn) {
      handleLogout(); 
    } else {
      navigate('/login'); 
    }
  };

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLogin') === 'true');
  }, []);

  return (
    <Header className="header">
      <div className="logoContainer">
      <img src={MerjeLogo} alt="MERJE Logo" className="logo" />{" "}
      {/* แสดงรูปภาพ */}
      </div>
      <div className="menu">
        <span className="link" onClick={() => navigate('/home')}>Home</span>
        <span className="link" onClick={() => navigate('/myticket')}>MyTicket</span>
        <span className="link" onClick={() => navigate('/news')}>MERJE news</span>
        <span className="link" onClick={() => navigate('/reward')}>Reward</span>
        <Button type="primary" className="button" onClick={handleLoginClick}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </div>
    </Header>
  );
};

export default Navbar;
