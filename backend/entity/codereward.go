package entity
import (
    
    "gorm.io/gorm"
)

type CodeReward struct {
    gorm.Model
    RewardCode    string    `json:"reward_code"`  // โค้ดที่สร้างสำหรับรางวัล
    Status        bool      `json:"status"`       // สถานะของโค้ด (ใช้แล้วหรือยังใช้งานได้)
    
    // Foreign Key (FK)
    RewardID      uint      `json:"reward_id"`    // FK ไปยัง Reward
    Reward        Reward    `gorm:"foreignKey:RewardID"` // ความสัมพันธ์กับตาราง Reward
}
