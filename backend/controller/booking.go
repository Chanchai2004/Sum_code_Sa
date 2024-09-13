package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// BookingRequest รับข้อมูลการจองที่นั่งจาก client
type BookingRequest struct {
	ShowtimeID uint     `json:"showtime_id" binding:"required"`
	TheaterID  uint     `json:"theater_id" binding:"required"`
	MemberID   uint     `json:"member_id" binding:"required"`
	Seats      []string `json:"seats" binding:"required"`
	TicketID   uint     `json:"ticket_id"` // เพิ่มฟิลด์ TicketID เพื่อรองรับการบันทึก ticket
}

// BookSeats ฟังก์ชันสำหรับการจองที่นั่ง
// BookSeats ฟังก์ชันสำหรับการจองที่นั่ง
func BookSeats(c *gin.Context) {
	var req BookingRequest
	db := config.DB()

	// ตรวจสอบว่าข้อมูลการจองถูกต้องหรือไม่
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหาที่นั่งที่เลือกและตรวจสอบว่าที่นั่งว่างหรือไม่
	var seats []entity.Seat
	if err := db.Where("seat_no IN ? AND theater_id = ? AND id NOT IN (SELECT seat_id FROM bookings WHERE show_time_id = ?)", req.Seats, req.TheaterID, req.ShowtimeID).Find(&seats).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch seat information"})
		return
	}

	// ตรวจสอบว่าที่นั่งทั้งหมดว่างหรือไม่
	if len(seats) != len(req.Seats) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "One or more seats are not available"})
		return
	}

	// เริ่มต้นการ transaction
	tx := db.Begin()

	// สร้างรายการ ticket โดยใช้ข้อมูลจากผู้ใช้ เช่น จำนวนที่นั่ง
	ticket := entity.Ticket{
		MemberID: req.MemberID,
		Point:    len(seats) * 5,  // สามารถกำหนดสูตรการคำนวณเองตามที่ผู้ใช้ต้องการ
		Status:   "on process",
	}
	if err := tx.Create(&ticket).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ticket"})
		return
	}

	// สร้างข้อมูลการจองและบันทึกลงฐานข้อมูล
	for _, seat := range seats {
		// สร้างรายการการจองที่นั่ง
		booking := entity.Booking{
			MemberID:    req.MemberID,
			ShowTimeID:  req.ShowtimeID,
			SeatID:      seat.ID,
			TicketID:    ticket.ID,  // เชื่อมโยงกับ ticket ที่เพิ่งสร้าง
			BookingTime: time.Now(),
			Status:      "confirmed",
		}

		if err := tx.Create(&booking).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
			return
		}

		// อัปเดตสถานะที่นั่งเป็น "Booked"
		if err := tx.Model(&seat).Update("Status", "Booked").Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update seat status"})
			return
		}

		// บันทึกข้อมูลลงในตาราง book_seats
		bookSeat := entity.BookSeat{
			SeatID:    seat.ID,
			BookingID: booking.ID,
		}
		if err := tx.Create(&bookSeat).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create book_seat"})
			return
		}
	}

	// บันทึก transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed"})
		return	
	}

	// ส่งข้อความตอบกลับเมื่อการจองเสร็จสิ้น
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Booking confirmed successfully",
		"ticketID": ticket.ID,  // ส่ง ticketID กลับไปที่ frontend
	})
	
}
