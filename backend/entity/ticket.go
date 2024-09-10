package entity

import "gorm.io/gorm"

type Ticket struct {
    gorm.Model
    Point      int
    Status     string
    MemberID   uint

    Member     Member  `gorm:"foreignKey:MemberID"`

    // ความสัมพันธ์กับ Booking และ BookSeat
    Bookings   []Booking  `gorm:"foreignKey:TicketID"`
}

