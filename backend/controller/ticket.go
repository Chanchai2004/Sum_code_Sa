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

// GetTicketsById รับข้อมูลตั๋วตาม ID โดยใช้ SQL ดิบ
func GetTicketsById(c *gin.Context) { 
	memberID := c.Param("id")

	log.Println("Received Member ID:", memberID)

	// สร้างโครงสร้างที่จะเก็บผลลัพธ์
	type BookingResponse struct {
        TicketID int    `json:"ticketId"`
        Movie    string `json:"movie"`
        Date     string `json:"date"`
        Seats    string `json:"seats"`
        Theater  string `json:"theater"`
    }

	var results []BookingResponse

	// ใช้ SQL ดิบเพื่อดึงข้อมูล โดยเพิ่มเงื่อนไข WHERE b.status = 'Booked'
	err := config.DB().Raw(`
	SELECT  
	    b.ticket_id AS TicketID,
    	m.movie_name AS Movie,
    	s.showdate AS Date,
    	GROUP_CONCAT(se.seat_no, ', ') AS Seats,
    	t.theater_name AS Theater
	FROM bookings b
	JOIN show_times s ON b.show_time_id = s.id
	JOIN movies m ON s.movie_id = m.id
	JOIN seats se ON b.seat_id = se.id
	JOIN theaters t ON se.theater_id = t.id
	JOIN tickets tk ON b.ticket_id = tk.id  -- เข้าร่วมกับตาราง tickets
	WHERE b.member_id = ? AND tk.status = 'Booked'  -- เพิ่มเงื่อนไขให้แสดงเฉพาะที่ status เป็น Booked
	GROUP BY b.ticket_id, s.showdate, t.theater_name
	ORDER BY b.ticket_id DESC;

	`, memberID).Scan(&results).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bookings not found"})
		return
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

// UpdateTicketStatus อัปเดตสถานะของตั๋วตาม ticket ID
func UpdateTicketStatus(c *gin.Context) {
	ticketID := c.Param("id")
	var ticket entity.Ticket

	// ค้นหาตั๋วตาม ticket ID
	if err := config.DB().First(&ticket, ticketID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}

	// Binding ข้อมูลจาก request body เพื่ออัปเดต status
	var input struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// อัปเดต status ของตั๋ว
	ticket.Status = input.Status
	if err := config.DB().Save(&ticket).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ticket status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket status updated", "data": ticket})
}
