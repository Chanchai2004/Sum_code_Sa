package entity

import (
	"time"
	"gorm.io/gorm"
)

type Reward struct {
	gorm.Model
	RewardName  string    `json:"RewardName"`   // ชื่อของรางวัล
	Discount    int       `json:"discount"`      // ส่วนลด
	Rewardcode      string    `json:"rewardcode"`        // รายละเอียดของรางวัล
	Status      bool    `json:"status"`        // สถานะของรางวัล เช่น available หรือ redeemed
	Points      int       `json:"points"`        // จำนวนคะแนนที่ใช้แลกรางวัล (เปลี่ยนจาก string เป็น int)
	Reward_time  time.Time `json:"reward_time"`   // เวลาในการแลกรางวัล
	Describtion string	`json:"Describtion"` 
	Type	string	`json:"type"` 
	ExpirationDate time.Time `json:"expiration_date"` // วันที่สิ้นสุดการแลกรางวัล
	
	// Foreign Key (FK)
	MemberID  *uint    `json:"member_id"`        // FK ไปยัง Member
	Member    Member   `gorm:"foreignKey:MemberID"`  // ความสัมพันธ์กับ Member

	// Relationship with CodeReward (One-to-Many)
    CodeRewards    []CodeReward  `gorm:"foreignKey:RewardID"`  // ความสัมพันธ์แบบ One-to-Many กับ CodeReward
}

	

