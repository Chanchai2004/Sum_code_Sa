package controller

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// GET /payments
func ListPayments(c *gin.Context) {
	var payments []entity.Payment
	db := config.DB()

	// ดึงข้อมูลการชำระเงินทั้งหมด
	if err := db.Preload("Member").Preload("Ticket").Find(&payments).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payments)
}

// GET /payment/:id
func GetPayment(c *gin.Context) {
	ID := c.Param("id")
	var payment entity.Payment

	db := config.DB()
	// ดึงข้อมูลการชำระเงินที่มี ID ตรงกับที่ระบุ
	if err := db.Preload("Member").Preload("Ticket").First(&payment, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payment)
}

// POST /payments
func CreatePayment(c *gin.Context) {
	var payment entity.Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	// ตรวจสอบว่ามี Member และ Ticket ที่ระบุไว้หรือไม่
	var member entity.Member
	if err := db.First(&member, payment.MemberID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
		return
	}
	var ticket entity.Ticket
	if err := db.First(&ticket, payment.TicketID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}

	// สร้างข้อมูลการชำระเงินใหม่
	payment.PaymentTime = time.Now()
	if err := db.Create(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": payment})
}

// PATCH /payments/:id
func UpdatePayment(c *gin.Context) {
	var payment entity.Payment
	ID := c.Param("id")

	db := config.DB()
	// ค้นหาการชำระเงินตาม ID
	if err := db.First(&payment, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "payment not found"})
		return
	}

	// ทำการ bind ข้อมูลที่ได้รับจาก client ไปยังตัวแปร payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// อัปเดตข้อมูลการชำระเงิน
	if err := db.Save(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /payments/:id
func DeletePayment(c *gin.Context) {
	ID := c.Param("id")

	db := config.DB()
	if tx := db.Delete(&entity.Payment{}, ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payment ID not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
