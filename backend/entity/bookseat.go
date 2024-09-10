package entity

import (
	"gorm.io/gorm"
)

type BookSeat struct {
	gorm.Model
	SeatID uint `gorm:"not null"` // เชื่อมโยงกับที่นั่ง
	Seat   Seat `gorm:"foreignKey:SeatID"`

	BookingID uint    `gorm:"not null"` // เชื่อมโยงกับการจอง
	Booking   Booking `gorm:"foreignKey:BookingID"`
}
