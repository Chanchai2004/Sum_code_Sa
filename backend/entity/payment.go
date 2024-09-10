package entity

import (
	"time"
	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	TotalPrice  int
	Status      string
	PaymentTime time.Time // ใช้ time.Time เพื่อเก็บข้อมูลเวลาที่ถูกต้อง
	Slip        string
	MemberID    uint
	Member      Member `gorm:"foreignKey:MemberID"`

	// ความสัมพันธ์กับ Ticket
	TicketID uint   // เพิ่มฟิลด์ TicketID สำหรับเชื่อมโยง
	Ticket   Ticket `gorm:"foreignKey:TicketID"` // เชื่อมโยง TicketID กับตาราง Ticket
}
