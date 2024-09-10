package entity

import (
   "time"
   "gorm.io/gorm"
)

type ShowTimes struct {
	gorm.Model
	ShowDate  time.Time // เปลี่ยนเป็น time.Time
	MovieID   uint
	TheaterID uint

	Movie   Movie   `gorm:"foreignKey:MovieID"`
	Theater Theater `gorm:"foreignKey:TheaterID"`

	// ความสัมพันธ์กับ Booking
	Bookings []Booking `gorm:"foreignKey:ShowTimeID"`
}
