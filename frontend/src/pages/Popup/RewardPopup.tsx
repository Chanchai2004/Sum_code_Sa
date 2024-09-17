import React, { useState } from 'react';
import './RewardPopup.css';
import { RewardInterface  } from "../../interfaces/IReward";  // Import RewardInterface

interface RewardPopupProps {
  onClose: () => void;
  onConfirm: () => void;
  reward: RewardInterface; // ใช้ RewardInterface ที่นำเข้า
  userPoints: number; // รับค่า userPoints
}

const RewardPopup: React.FC<RewardPopupProps> = ({ onClose, onConfirm, reward, userPoints }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const closePopup = () => {
    setIsOpen(false);
    onClose();
  };

  const confirmReward = () => {
    if (userPoints >= reward.Points!) { // เปลี่ยนเป็น Points ตาม RewardInterface
      setIsOpen(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onConfirm();
      }, 2000);
    } else {
      alert('You do not have enough points to redeem this reward.');
      setIsOpen(false);
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="popup-overlay">
          <div className="reward-container">
            <div className="reward-icon">
              <img src="logo.PNG" alt="Reward Icon" />
            </div>
            <div className="reward-points">{reward.Points} POINTS</div> {/* เปลี่ยนเป็น Points */}
            <div className="reward-image">
              <img src={reward.imageUrl} alt="Reward" />
            </div>
            <div className="reward-description">{reward.RewardName}</div> {/* เปลี่ยนเป็น RewardName */}
            <button className="button confirm-btn" onClick={confirmReward}>
              CONFIRM
            </button>
            <button className="button cancel-btn" onClick={closePopup}>
              CANCEL
            </button>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="success-popup">
          <p>Succeed!</p>
        </div>
      )}
    </>
  );
};

export default RewardPopup;
