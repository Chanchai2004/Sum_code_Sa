package entity

import (
	"gorm.io/gorm"
)

type Theater struct {
	gorm.Model
	TheaterName string `gorm:"not null"` // ฟิลด์สำหรับชื่อโรงหนัง
	TypeSeat    string // ประเภทของที่นั่ง (ถ้ามี)
	ShowTimes   []ShowTimes `gorm:"foreignKey:TheaterID"`
	Seats       []Seat      `gorm:"foreignKey:TheaterID"`
}
