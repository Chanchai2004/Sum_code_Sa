import React, { useState } from 'react';
import './Header.css'; // ใช้ CSS เดียวกับ Header

interface HeaderMemberProps {
  onSearch: (searchTerm: string) => void;
  children?: React.ReactNode; // เพิ่มการรองรับ children
}

const HeaderMember: React.FC<HeaderMemberProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // ส่งคำค้นหากลับไปยังคอมโพเนนต์แม่เพื่อกรองข้อมูล
  };

  return (
    <div className="header"> {/* ใช้คลาส .header เหมือนกับ Header.tsx */}
      <div className="header-item">
        <label>Search Member:</label>
        <input
          type="text"
          placeholder="Enter member name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="header-item">
        <button className="add-btn">Add Member</button>
        <button className="delete-btn">Delete Member</button>
        <button className="edit-btn">Edit Member</button>
      </div>
      
    </div>
  );
};

export default HeaderMember;
