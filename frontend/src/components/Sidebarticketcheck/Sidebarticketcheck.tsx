import React from 'react';
import './Sidebarticketcheck.css';
import { Link, useNavigate } from 'react-router-dom';

const Sidebarticketcheck: React.FC = () => {
    const navigate = useNavigate(); // Call useNavigate within the component

    const handleLogout = () => {
        const email = localStorage.getItem('email'); // Get email from Local Storage
        console.log(`email: ${email} is logged out`);

        // Clear relevant data from Local Storage
        localStorage.removeItem('isLogin');
        localStorage.removeItem('isStaff');
        localStorage.removeItem('email');

        // Navigate to login page
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <Link to="/ticketstatus" className="sidebar-item">🎫<br />Ticket Status</Link>
            <Link to="/scanner" className="sidebar-item">📷<br />Scanner</Link>
            {/* Use a button for logout, as it needs an onClick handler */}
            <button className="sidebar-item logout-button" onClick={handleLogout}>🔓<br />Logout</button>
        </aside>
    );
};

export default Sidebarticketcheck;
