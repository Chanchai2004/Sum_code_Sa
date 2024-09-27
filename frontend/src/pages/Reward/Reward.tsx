import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import './Reward.css';
import RewardPopup from '../Popup/RewardPopup';
import { CreateReward, GetMemberById, UpdateMember } from '../../services/https/index'; 
import { RewardInterface } from "../../interfaces/IReward";
import { message } from "antd";


const Reward: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardInterface | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userPoints, setUserPoints] = useState<number>(0);
  const [messageApi] = message.useMessage();
  
  const navigate = useNavigate();

  const getUserProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      messageApi.open({
        type: "error",
        content: "No token found.",
      });
      return;
    }

    const memberID = localStorage.getItem('id');
    if (!memberID) {
      messageApi.open({
        type: "error",
        content: "No memberID found.",
      });
      return;
    }

    try {
      const data = await GetMemberById(Number(memberID));
      if (!data) {
        messageApi.open({
          type: "error",
          content: "Failed to fetch member data",
        });
        return;
      }
      const userName = data.UserName ? data.UserName : "Name data not available";
      const points = Number(data.TotalPoint);
      setUserName(userName);
      setUserPoints(points || 0);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message || 'An unknown error occurred',
      });
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  // ฟังก์ชันจัดการคลิกที่รูปภาพ
  const handleImageClick = (reward: RewardInterface) => {
    // เปิด Popup
    setSelectedReward(reward);
    setIsPopupOpen(true);
  };

  const getRewardImage = (reward: RewardInterface) => {
    return reward.imageUrl;
  };

  // ปิด Popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedReward(null);
  };

  // ยืนยันการแลกรางวัล
  const handleConfirmReward = async () => {
    if (selectedReward) {
      // ตรวจสอบว่าผู้ใช้มีคะแนนเพียงพอหรือไม่
      if (userPoints < selectedReward.Points!) {
        messageApi.open({
          type: "error",
          content: 'You do not have enough points to redeem this reward!',
        });
        return;
      }

      const updatedPoints = userPoints - selectedReward.Points!;
      setUserPoints(updatedPoints);
      setRewards(prevRewards =>
        prevRewards.map(reward =>
          reward.RewardName === selectedReward.RewardName ? { ...reward, Status: true } : reward
        )
      );

      try {
        const memberID = localStorage.getItem("id");
        if (!memberID) {
          messageApi.open({
            type: "error",
            content: "No member ID found.",
          });
          return;
        }

        const rewardData = { ...selectedReward, Status: true, member_id: Number(memberID) };
        await CreateReward(rewardData);

        const memberData = { ID: Number(memberID), TotalPoint: updatedPoints };
        await UpdateMember(memberData);

        messageApi.open({
          type: "success",
          content: 'Reward redeemed successfully and points updated!',
          duration: 5,
        });

        setIsPopupOpen(false);
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "An error occurred while redeeming the reward.",
        });
      }
    }
  };

  const goToHistory = () => {
    navigate('/history', { state: { userPoints, userName } });
  };

  const [rewards, setRewards] = useState<RewardInterface[]>([
    {
      ID:1,
      imageUrl: "popcorn.png",
      RewardName: "1 BOX POPCORN M",
      Points: 2,
      Status: false, 
      Discount: 0,
      Reward_time: new Date() ,
      Describtion:"POPCORN M 1 BOX AND 1  DRINK (16 Oz)",
      Type:"reward",
      
      
    },
    {
      ID:2,
      imageUrl: "discountnew.png",
      RewardName: "DISCOUNT 50 BATH", 
      Points: 4,
      Status: false, 
      Discount: 50,
      Reward_time: new Date()  ,
      Describtion:"DISCOUNT 50 BATH",
      Type:"discount",
      
      
    },
    {
      ID: 3,
      imageUrl: "combosetmnew.png",
      RewardName: "1 COMBO SET L ",
      Points: 6,
      Status: false, 
      Discount: 0,
      Reward_time:new Date() ,
      Describtion:"COMBO SET L 1 BOX AND 1 DRINK (16 Oz)",
      Type:"reward",
      
      
    },
    {
      ID: 4,
      imageUrl: "discountnew.png",
      RewardName: "DISCOUNT 100 BATH",
      Points: 9,
      Status: false,
      Discount: 100,
      Reward_time:new Date(), 
      Describtion:"DISCOUNT 100 BATH",
      Type:"discount",
      
    },
    {
      ID: 5,
      imageUrl: "supersizesetA.PNG",
      RewardName: "1 SUPERSIZE SET A",
      Points: 12,
      Status: false, 
      Discount: 0,
      Reward_time:new Date() ,
      Describtion:"SUPERSIZE SET A 1 BOX SIZE XL AND 1 DRINK (16 Oz)",
      Type:"reward",
     
      
    },
    {
      ID: 6,
      imageUrl: "freeticket.png",
      RewardName: "TICKETZILLA",
      Points: 15,
      Status: false,
      Discount: 100,
      Reward_time:new Date(), 
      Describtion:"1 FREE MOVIE TICKET FOR A NORMAL SEAT",
      Type:"discount",
     
      
    },
    {
      ID: 7,
      imageUrl: "supersizesetc.png",
      RewardName: "1 SUPERSIZE SET C",
      Points: 18,
      Status: false, 
      Discount: 0,
      Reward_time:new Date() ,
      Describtion:"SUPERSIZE SET C 2 BOX SIZE XL AND 3 DRINK (16 Oz)",
      Type:"reward",
      
    },
    {
      ID: 8,
      imageUrl: "gift.PNG",
      RewardName: "GIFT",
      Points: 21,
      Status: false,
      Discount: 0,
      Reward_time:new Date(), 
      Describtion:"SPECIAL GIFT",
      Type:"reward",
     
      
    },
    {
      ID: 9,
      imageUrl: "2 normalseat.png",
      RewardName: "2 NORMAL SEATS",
      Points: 26,
      Status: false,
      Discount: 200,
      Reward_time:new Date() , 
      Describtion:"2 NORMAL SEATS",
      Type:"discount",
      
    },
    {
      ID: 10,
      imageUrl: "2superseta.png",
      RewardName: "2 SUPERSIZE SET A ",
      Points: 32,
      Status: false,
      Discount: 0,
      Reward_time:new Date() , 
      Describtion:"SUPERSIZE SET A: 2 SETS. EACH SET INCLUDES 1 BOX SIZE XL OF POPCORN AND 1 DRINK (16 Oz).",
      Type:"reward",
      
    },
    {
      ID: 11,
      imageUrl: "2 premuim seat.png",
      RewardName: "2 PERMUIM SEATS ",
      Points: 38,
      Status: false,
      Discount: 300,
      Reward_time:new Date() , 
      Describtion:"2 PERMUIM SEATS",
      Type:"discount",
      
    },
    {
      ID: 12,
      imageUrl: "supersizesetbbb.png",
      RewardName: "2 SUPERSIZE SET B",
      Points: 45,
      Status: false,
      Discount: 0,
      Reward_time:new Date() , 
      Describtion:"SUPERSIZE SET B 2 SETS. EACH SET INCLUDES 2 BOX SIZE XL+L OF POPCORN AND 2 DRINK (16 Oz).",
      Type:"reward",
      
    },
    {
      ID: 13,
      imageUrl: "gift.PNG",
      RewardName: "SPECIAL GIFT",
      Points: 50,
      Status: false, 
      Discount: 0,
      Reward_time:new Date() ,
      Describtion:"SPECIAL GIFT",
      Type:"reward",
      
    },
    {
      ID: 14,
      imageUrl: "3 premuim seats.png",
      RewardName: "3 PREMUIM SEATS ",
      Points: 60,
      Status: false, 
      Discount: 450,
      Reward_time:new Date(),
      Describtion:"3 PREMUIM SEATS ",
      Type:"discount",
     
    },
    {
      ID: 15,
      imageUrl: "1 DIRECTOR PACKAGE .png",
      RewardName: "1 PACKAGE OF 5 MOVIES",
      Points: 70,
      Status: false,
      Discount: 900,
      Reward_time:new Date() , 
      Describtion:"1 PACKAGE OF 5 MOVIES",
      Type:"discount",
      
    },
    {
      ID: 16,
      imageUrl: "4 premuim seats.png",
      RewardName: " 4 PREMUIM SEATS",
      Points: 80,
      Status: false,
      Discount: 600,
      Reward_time:new Date() , 
      Describtion:"4 PREMUIM SEATS",
      Type:"discount",
     
    },
    {
      ID: 17,
      imageUrl: "4supersizesetc.png",
      RewardName: "4 SUPERSIZE SET C",
      Points: 90,
      Status: false,
      Discount: 0,
      Reward_time:new Date(),
      Describtion:"SUPERSIZE SET C 4 SETS. EACH SET INCLUDES 2 BOX SIZE XL OF POPCORN AND 3 DRINK (16 Oz).", 
      Type:"reward",
      
    },
    {
      ID: 18,
      imageUrl: "5premuimseat.png",
      RewardName: "5 PREMUIM SEATS ",
      Points: 100,
      Status: false, 
      Discount: 750,
      Reward_time:new Date(),
      Describtion:"5 PREMUIM SEATS ",
      Type:"discount",
      
    },
  ]);



  return (
    
    <div className="reward">
      <Navbar />
      <div className="reward-page-container">
        <img 
          src="Group start.png"
          alt="Center Image"
          className="center-image"
        />
  
        <div className="my-points-container">
          <h2>My points</h2>
          <div className="points-content">
            <div className="profile-section">
              <img 
                src="account_circle.png"
                alt="Profile"
                className="profile-image"
              />
              <p>{userName}</p>
            </div>
            <div className="divider"></div>
            <div className="points-section">
              <img 
                src="เหรียญ.PNG"
                alt="Star"
                className="points-icon"
              />
              <div className="balance">
                <h2>{userPoints}</h2>
              </div>
              <p>Your Balance</p>
              <p className="description">Earn more points, redeem exciting gifts and enjoy your tbh experience</p>
              <Link to="/history">
                <button className="history-button" onClick={goToHistory}>HISTORY</button>
              </Link>
            </div>
          </div>
        </div>
  
        {/* Popcorn Boxes */}
        {rewards.map((reward, index) => (
          <img
            key={index}
            src={reward.imageUrl}
            alt={reward.RewardName}
            className={`popcorn-box popcorn-box-${index + 1}`}
            onClick={() => handleImageClick(reward)}
          />
        ))}
  
        {/* Popcorn Labels */}
        {rewards.map((reward, index) => (
          <div key={index} className={`popcorn-label popcorn-label-${index + 1}`}>
            {reward.RewardName}
          </div>
        ))}
  
        {/* Points */}
        <img src="2 point.png" alt="point 2" className="points points-2" />
        <img src="4 point.png" alt="point 4" className="points points-4" />
        <img src="6 point.png" alt="point 6" className="points points-6" />
        <img src="9 point.png" alt="point 9" className="points points-9" />
        <img src="12 point.png" alt="point 12" className="points points-12" />
        <img src="15 point.png" alt="point 15" className="points points-15" />
        <img src="18 point.png" alt="point 18" className="points points-18" />
        <img src="21 point.png" alt="point 21" className="points points-21" />
        <img src="32 point.png" alt="point 26" className="points points-26" />
        <img src="32 points.png" alt="point 32" className="points points-32" />
        <img src="38 point.png" alt="point 38" className="points points-38" />
        <img src="45 point.png" alt="point 45" className="points points-45" />
        <img src="50 point.png" alt="point 50" className="points points-50" />
        <img src="60 point.png" alt="point 60" className="points points-60" />
        <img src="70 point.png" alt="point 70" className="points points-70" />
        <img src="80 point.png" alt="point 80" className="points points-80" />
        <img src="90 point.png" alt="point 90" className="points points-90" />
        <img src="100 point.png" alt="point 100" className="points points-100" />
  
        {/* Stars */}
        <img src="star-1.svg" alt="star" className="star star-1" />
        <img src="star-2.svg" alt="star" className="star star-2" />
        <img src="star-4.svg" alt="star" className="star star-3" />
        <img src="star-5.svg" alt="star" className="star star-4" />
        <img src="star-6.svg" alt="star" className="star star-5" />
        <img src="star-7.svg" alt="star" className="star star-6" />
        <img src="star-12.svg" alt="star" className="star star-7" />
        <img src="star-7.svg" alt="star" className="star star-8" />
        <img src="star-5.svg" alt="star" className="star star-9" />
        <img src="star-2.svg" alt="star" className="star star-10" />
        <img src="star-7.svg" alt="star" className="star star-11" />
        <img src="star-4.svg" alt="star" className="star star-12" />
        <img src="star-6.svg" alt="star" className="star star-13" />
        <img src="star-4.svg" alt="star" className="star star-14" />
        <img src="star-7.svg" alt="star" className="star star-15" />
        <img src="star-12.svg" alt="star" className="star star-16" />
        <img src="star-2.svg" alt="star" className="star star-17" />
        <img src="star-7.svg" alt="star" className="star star-18" />
        <img src="star-4.svg" alt="star" className="star star-19" />
        <img src="star-6.svg" alt="star" className="star star-20" />
        <img src="star-6.svg" alt="star" className="star star-21" />
        <img src="star-7.svg" alt="star" className="star star-22" />
        <img src="star-12.svg" alt="star" className="star star-23" />
        <img src="star-2.svg" alt="star" className="star star-24" />
        <img src="star-4.svg" alt="star" className="star star-25" />
        <img src="star-5.svg" alt="star" className="star star-26" />
        <img src="star-6.svg" alt="star" className="star star-27" />
        <img src="star-12.svg" alt="star" className="star star-28" />
        <img src="star-8.svg" alt="star" className="star star-29" />
        <img src="star-7.svg" alt="star" className="star star-30" />
        <img src="star-1.svg" alt="star" className="star star-31" />
        <img src="star-2.svg" alt="star" className="star star-32" />
        <img src="star-4.svg" alt="star" className="star star-33" />
        <img src="star-12.svg" alt="star" className="star star-34" />
        <img src="star-6.svg" alt="star" className="star star-35" />
        <img src="star-7.svg" alt="star" className="star star-36" />
        <img src="star-8.svg" alt="star" className="star star-37" />
        <img src="star-7.svg" alt="star" className="star star-38" />
        <img src="star-12.svg" alt="star" className="star star-39" />
        <img src="star-13.svg" alt="star" className="star star-40" />
        <img src="star-17.svg" alt="star" className="star star-41" />
        <img src="star-37.svg" alt="star" className="star star-42" />
        <img src="star-12.svg" alt="star" className="star star-43" />
        <img src="star-2.svg" alt="star" className="star star-44" />
        <img src="star-40.svg" alt="star" className="star star-45" />
        <img src="star-12.svg" alt="star" className="star star-46" />
        <img src="star-40.svg" alt="star" className="star star-47" />
        <img src="star-12.svg" alt="star" className="star star-48" />
  
        <div className="rewards-container">
          {rewards.map((reward, index) => (
            <div key={index}>
              <img
                src={getRewardImage(reward)}
                alt={reward.RewardName}
                className={`popcorn-box popcorn-box-${index + 1}`}
                onClick={() => handleImageClick(reward)}
              />
              <div className={`popcorn-label popcorn-label-${index + 1}`}>
                {reward.RewardName}
              </div>
            </div>
          ))}
        </div>
  
        {isPopupOpen && selectedReward && (
          <RewardPopup
            onClose={handleClosePopup}
            onConfirm={handleConfirmReward}
            reward={selectedReward}
            userPoints={userPoints}
          />
        )}
      </div>
    </div>
  );
} 
export default Reward;
