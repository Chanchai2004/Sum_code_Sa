package entity

import (
	

	"gorm.io/gorm"
)

type Movie struct {
	gorm.Model
	MovieName     string
	MovieType     string
	MovieDuration int
	Director      string
	Actor         string
	Synopsis      string
	ReleaseDate   string  // เปลี่ยนจาก string เป็น time.Time
	Poster        []byte        `gorm:"type:blob"`                  // เก็บภาพโปสเตอร์เป็น blob

	// ความสัมพันธ์กับ ShowTimes
	Showtimes []ShowTimes `gorm:"foreignKey:MovieID"`
}
