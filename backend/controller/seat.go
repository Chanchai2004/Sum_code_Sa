package controller

import (
	"strconv"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

func GetBookedSeats(c *gin.Context) {
    showtimeID := c.Param("showtimeID")

    var bookings []entity.Booking
    if err := config.DB().
        Where("show_time_id = ?", showtimeID).
        Find(&bookings).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No booked seats found"})
        return
    }

    // เอาเฉพาะ seat_id จาก booking และแปลงเป็น string
    var bookedSeats []string
    for _, booking := range bookings {
        bookedSeats = append(bookedSeats, strconv.Itoa(int(booking.SeatID))) // แปลง uint เป็น string
    }

    c.JSON(http.StatusOK, gin.H{"data": bookedSeats})
}

func ListSeats(c *gin.Context) {
	var seats []entity.Seat
	db := config.DB()

	// ดึงข้อมูลที่นั่งทั้งหมด
	if err := db.Preload("Theater").Find(&seats).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, seats)
}

// GET /seat/:id
func GetSeat(c *gin.Context) {
	ID := c.Param("id")
	var seat entity.Seat

	db := config.DB()
	// ดึงข้อมูลที่นั่งที่มี ID ตรงกับที่ระบุ
	if err := db.Preload("Theater").First(&seat, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, seat)
}

// POST /seats
func CreateSeat(c *gin.Context) {
	var seat entity.Seat
	if err := c.ShouldBindJSON(&seat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	// ตรวจสอบว่ามีโรงหนังที่ระบุไว้หรือไม่
	var theater entity.Theater
	if err := db.First(&theater, seat.TheaterID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "theater not found"})
		return
	}

	// สร้างข้อมูลที่นั่งใหม่
	if err := db.Create(&seat).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": seat})
}

// PATCH /seats/:id
func UpdateSeat(c *gin.Context) {
	var seat entity.Seat
	ID := c.Param("id")

	db := config.DB()
	// ค้นหาที่นั่งตาม ID
	if err := db.First(&seat, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "seat not found"})
		return
	}

	// ทำการ bind ข้อมูลที่ได้รับจาก client ไปยังตัวแปร seat
	if err := c.ShouldBindJSON(&seat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// อัปเดตข้อมูลที่นั่ง
	if err := db.Save(&seat).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /seats/:id
func DeleteSeat(c *gin.Context) {
	ID := c.Param("id")

	db := config.DB()
	if tx := db.Delete(&entity.Seat{}, ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Seat ID not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
