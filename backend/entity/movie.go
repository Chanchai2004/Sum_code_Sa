package entity

import (
	"time"

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
	ReleaseDate   time.Time  // เปลี่ยนจาก string เป็น time.Time
	Poster        string

	// ความสัมพันธ์กับ ShowTimes
	Showtimes []ShowTimes `gorm:"foreignKey:MovieID"`
}
