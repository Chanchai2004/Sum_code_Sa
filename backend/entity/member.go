package entity

import (
	

	"gorm.io/gorm"
)

type Member struct {
	gorm.Model
	UserName   string
	FirstName  string
	LastName   string
	Email      string
	Password   string
	TotalPoint int
	Role       string

	// ความสัมพันธ์กับ Ticket
	Tickets []Ticket `gorm:"foreignKey:MemberID"`
	// One-to-Many Relationship
	Rewards    []Reward  `gorm:"foreignKey:MemberID" json:"rewards"`  // ความสัมพันธ์ One-to-Many กับ Reward
}
