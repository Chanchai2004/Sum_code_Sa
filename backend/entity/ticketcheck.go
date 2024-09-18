package entity

import (
	"time"

	"gorm.io/gorm"
)

type TicketCheck struct {
	gorm.Model
	TicketID  uint `gorm:"uniqueIndex , notnull"` // Use uniqueIndex to enforce uniqueness
	TimeStamp time.Time
	Status    string

	Ticket Ticket `gorm:"foreignKey:TicketID; references:ID"` // กำหนดความสัมพันธ์ Foreign Key
}
