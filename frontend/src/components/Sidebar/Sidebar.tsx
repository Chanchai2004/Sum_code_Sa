import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faFilm, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const email = localStorage.getItem('email'); // นำอีเมลจาก Local Storage มาแสดงใน console
    console.log(`email: ${email} is logout`);

    localStorage.removeItem('isLogin');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('email'); // ลบข้อมูลอีเมลออกด้วย
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/members">
            <FontAwesomeIcon icon={faUser} />
            <span>Members</span>
          </Link>
        </li>
        <li>
          <Link to="/showtimes">
            <FontAwesomeIcon icon={faClock} />
            <span>Showtimes</span>
          </Link>
        </li>
        <li>
          <Link to="/movie">
            <FontAwesomeIcon icon={faFilm} />
            <span>Movies</span>
          </Link>
        </li>
        <li className="logout" onClick={handleLogout} > {/* เรียกใช้ handleLogout เมื่อคลิก */}
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Log out</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;