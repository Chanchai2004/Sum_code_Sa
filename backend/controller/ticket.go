package controller

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// ListTickets รับข้อมูลตั๋วทั้งหมด
func ListTickets(c *gin.Context) {
	var tickets []entity.Ticket

	// ดึงข้อมูลตั๋วทั้งหมดจากฐานข้อมูล
	if err := config.DB().Preload("Member").Preload("Payment").Find(&tickets).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tickets)
}

// GetTicketsById รับข้อมูลตั๋วตาม ID
func GetTicketsById(c *gin.Context) {
	memberID := c.Param("id")

	log.Println("Received Member ID:", memberID)

	db := config.DB()
	var bookings []entity.Booking
	if err := db.Preload("ShowTime.Movie").
		Preload("ShowTime.Theater").
		Preload("Seat"). // Preload ที่สัมพันธ์กับที่นั่ง
		Where("member_id = ?", memberID).
		Order("created_at desc").
		Find(&bookings).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bookings not found"})
		return
	}

	// สร้างโครงสร้างที่จะเก็บผลลัพธ์
	type BookingResponse struct {
		Movie   string   `json:"movie"`
		Date    string   `json:"date"`
		Seats   string   `json:"seats"`
		Theater string   `json:"theater"`
	}

	// แผนที่สำหรับจัดกลุ่มที่นั่งตาม ticket_id
	bookingMap := make(map[uint]BookingResponse)

	// ลูปเพื่อจัดกลุ่มที่นั่งตาม ticket_id
	for _, booking := range bookings {
		ticketID := booking.TicketID
		showTime := booking.ShowTime
		seatNo := booking.Seat.SeatNo

		// หาก ticket_id ยังไม่มีในแผนที่ ให้สร้างใหม่
		if _, exists := bookingMap[ticketID]; !exists {
			bookingMap[ticketID] = BookingResponse{
				Movie:   showTime.Movie.MovieName,
				Date:    showTime.ShowDate.String(),
				Seats:   seatNo,
				Theater: showTime.Theater.TheaterName,
			}
		} else {
			// ถ้ามีอยู่แล้ว ให้เพิ่มที่นั่งเข้าไป
			existingBooking := bookingMap[ticketID]
			existingBooking.Seats += ", " + seatNo
			bookingMap[ticketID] = existingBooking
		}
	}

	// แปลงผลลัพธ์จากแผนที่เป็น slice
	var results []BookingResponse
	for _, value := range bookingMap {
		results = append(results, value)
	}

	log.Println("Fetched bookings:", results)
	c.JSON(http.StatusOK, results)
}


// CreateTicket สร้างตั๋วใหม่
func CreateTicket(c *gin.Context) {
	var ticket entity.Ticket

	// Binding ข้อมูลจาก request body
	if err := c.ShouldBindJSON(&ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อมูลตั๋วใหม่
	if err := config.DB().Create(&ticket).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Ticket created", "data": ticket})
}

// UpdateTicket อัปเดตข้อมูลตั๋ว
func UpdateTicket(c *gin.Context) {
	ID := c.Param("id")
	var ticket entity.Ticket

	// ค้นหาตั๋วตาม ID
	if err := config.DB().First(&ticket, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}

	// Binding ข้อมูลจาก request body
	if err := c.ShouldBindJSON(&ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูลตั๋ว
	if err := config.DB().Save(&ticket).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket updated", "data": ticket})
}

// DeleteTicket ลบข้อมูลตั๋ว
func DeleteTicket(c *gin.Context) {
	ID := c.Param("id")

	// ลบข้อมูลตั๋วตาม ID
	if err := config.DB().Where("id = ?", ID).Delete(&entity.Ticket{}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket deleted"})
}
