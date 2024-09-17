import React, { useState, useEffect } from 'react';
import { Table, message, Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import './History.css';
import { GetRewardsByMemberID, GetMemberById, saveCodeReward, checkExistingCodeReward } from '../../services/https/index'; // Import API calls
import { RewardInterface } from '../../interfaces/IReward'; // Import Reward Interface
import { MembersInterface } from '../../interfaces/IMember'; // Import Member Interface

const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [rewards, setRewards] = useState<RewardInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalPoints, setTotalPoints] = useState<number | null>(null); // State for storing total points
    const [userName, setUserName] = useState<string | null>(null); // State for storing username
    const [memberId, setMemberId] = useState<string | null>(null); // State for storing member ID
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State for controlling Modal visibility
    const [selectedReward, setSelectedReward] = useState<RewardInterface | null>(null); // State for storing selected reward

    const handleView = async (reward: RewardInterface) => {
        // ตรวจสอบว่า type เป็น Discount หรือ Ticket หรือไม่
        if (reward.type === 'discount' || reward.type === 'ticket') {
            message.info(`Rewards of type ${reward.type} cannot be viewed in the popup.`);
            return; // ไม่ต้องแสดง Popup หากเป็นประเภท Discount หรือ Ticket
        }
    
        try {
            // ตรวจสอบว่ามีโค้ดอยู่แล้วหรือไม่
            const existingCode = await checkExistingCodeReward(reward.ID);
    
            if (existingCode && existingCode.reward_code) {
                // ถ้ามีโค้ดอยู่แล้ว ให้ใช้โค้ดนั้น
                reward.code = existingCode.reward_code;
            } else {
                // ถ้าไม่มีโค้ด ให้สร้างโค้ดใหม่
                const generatedCode = generateCode(reward);  // สร้างโค้ดแบบสุ่ม
                const savedCode = await saveCodeReward(generatedCode, reward.ID, memberId);  // ส่ง POST เพื่อบันทึกโค้ดลงในฐานข้อมูล
                reward.code = savedCode.reward_code;  // ใช้โค้ดใหม่ที่สร้างขึ้นและบันทึก
            }
    
            // ตั้งค่า reward ที่ถูกเลือกและแสดง modal
            setSelectedReward({ ...reward });
            setIsModalVisible(true); // แสดง modal เมื่อข้อมูลพร้อมแล้ว
        } catch (error) {
            console.error('Error fetching or generating reward code:', error);
            message.error('Failed to load or generate reward code');
        }
    };
    

    const handleBack = () => {
        navigate('/reward');
    };

    const generateCode = (reward: RewardInterface) => {
        console.log('Generating new code for Reward ID:', reward.ID);

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        console.log('Generated Code:', code); // แสดงโค้ดที่ถูกสร้างใหม่
        return code;
    };

    const fetchRewards = async () => {
        const memberID = localStorage.getItem('memberID');
        const token = localStorage.getItem('token');

        if (!memberID || !token) {
            message.error('Please log in first');
            navigate('/Login');
            return;
        }

        try {
            // Fetch member details and total points
            const memberData: MembersInterface = await GetMemberById(memberID);

            if (memberData) {
                setTotalPoints(memberData.TotalPoint); // Store total points in state
                setUserName(memberData.UserName); // Store username in state
                setMemberId(memberID); // Store member ID in state
            } else {
                setTotalPoints(0); // Default value if no points
                setUserName('Guest');
                setMemberId(null); // Clear member ID if no data
            }

            const rewardData = await GetRewardsByMemberID(memberID);

            if (rewardData && rewardData.length > 0) {
                const formattedRewards = rewardData.map((reward: RewardInterface) => ({
                    ...reward,
                    Reward_time: new Date(reward.Reward_time), // Convert Reward_time to Date object
                    Points: Number(reward.Points), // Ensure Points is a number
                }));

                setRewards(formattedRewards);
            } else {
                message.info('No rewards found for this member.');
            }
        } catch (error) {
            message.error('Failed to load rewards. Please try again.');
            console.error("Error fetching rewards:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    const handleCancel = () => {
        setIsModalVisible(false); // Close the modal
        setSelectedReward(null); // Clear the selected reward
    };

    const columns = [
        {
            key: 'reward_time',
            title: 'Reward Time',
            dataIndex: 'reward_time',
            render: (text: Date) => {
                const date = new Date(text);
                return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
            },
        },
        {
            key: 'RewardName',
            title: 'Reward Name',
            dataIndex: 'RewardName',
        },
        {
            key: 'Describtion',
            title: 'Description',
            dataIndex: 'Describtion',
        },
        {
            key: 'points',
            title: 'Points',
            dataIndex: 'points',
            render: (text: number) => text.toString(), // Convert Points to string for display
        },
        {
            key: 'action',
            title: 'Action',
            render: (record: RewardInterface) => (
                <div style={{ textAlign: 'center' }}>
                    {/* ตรวจสอบ type หากไม่ใช่ Ticket หรือ Discount จึงแสดงปุ่มดู */}
                    {record.type && !['ticket', 'discount'].includes(record.type.toLowerCase()) && (
                        <Button
                            type="primary"
                            onClick={() => handleView(record)} // เมื่อคลิกจะเรียกฟังก์ชัน handleView
                        >
                            ดู
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="wrapper">
            <div className="page-title">
                My History
                <button onClick={handleBack} className="back-button">
                    BACK
                </button>
            </div>
            <div className="profile-container">
                <div className="profile-picture">
                    <img src="account_circle.png" alt="Profile Icon" />
                </div>
                <div className="profile-name">
                    {userName || 'Guest'} {/* แสดงชื่อผู้ใช้ที่ได้รับจาก API */}
                </div>
                <div className="reward-icon">
                    {totalPoints !== null ? `${totalPoints} Points` : 'Loading...'} {/* แสดง TotalPoint */}
                </div>
            </div>
            <div className="history-list">
                <Table
                    dataSource={rewards}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                    rowKey="ID" // Ensure this key is unique
                    loading={loading}
                />
            </div>

            {/* Modal for viewing reward details */}
            <Modal
                key={selectedReward ? selectedReward.ID : 'modal'}
                title="Reward Details"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                        Close
                    </Button>,
                ]}
            >
                {selectedReward && (
                <div>
                    <h2>{selectedReward.RewardName}</h2>
                    <p>{selectedReward.Describtion}</p>
                    <p>Points: {selectedReward.Points}</p>

                    {/* แสดงโค้ดแลกเปลี่ยน */}
                    <p>
                        <strong>Reward Code:</strong> {selectedReward.code}
                    </p>
                </div>
                )}
            </Modal>
        </div>
    );
};

export default HistoryPage;
