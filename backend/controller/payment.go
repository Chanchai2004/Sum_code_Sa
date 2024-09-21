package controller

import (
	"net/http"
	"io"
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

	// ตรวจสอบว่า rewardID ถูกส่งมาหรือไม่
	if payment.RewardID != nil {
		var reward entity.Reward
		if err := db.First(&reward, payment.RewardID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Reward not found"})
			return
		}
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

func GetPaymentByTicketID(c *gin.Context) {
    ticketID := c.Param("ticketid")
    var payment entity.Payment

    db := config.DB()
    // ดึงข้อมูลการชำระเงินที่มี TicketID ตรงกับที่ระบุ
    if err := db.Preload("Member").Preload("Ticket").Where("ticket_id = ?", ticketID).First(&payment).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
        return
    }
    c.JSON(http.StatusOK, payment)
}

// PATCH /payments/status/:ticketID
func UpdatePaymentStatusByTicketID(c *gin.Context) {
    ticketID := c.Param("ticketID")
    var payment entity.Payment

    db := config.DB()

    // ค้นหาการชำระเงินที่มี TicketID ตรงกับที่ระบุ
    if err := db.Where("ticket_id = ?", ticketID).First(&payment).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
        return
    }

    // Bind ข้อมูลสถานะใหม่ที่ได้รับจาก client
    var updateData struct {
        Status string `json:"status"`
    }
    if err := c.ShouldBindJSON(&updateData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
        return
    }

    // อัปเดตสถานะของการชำระเงิน
    payment.Status = updateData.Status
    if err := db.Save(&payment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment status"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Payment status updated successfully"})
}

// PATCH /payments/status/:ticketID
func UpdatePaymentSlipByTicketID(c *gin.Context) {
	// รับ ticketID จาก form-data
	ticketID := c.PostForm("ticketID")
	if ticketID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ticket ID is required"})
		return
	}

	var payment entity.Payment
	db := config.DB()

	// ค้นหาการชำระเงินที่มี TicketID ตรงกับที่ระบุ
	if err := db.Where("ticket_id = ?", ticketID).First(&payment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	// รับไฟล์ slip จาก request
	file, _, err := c.Request.FormFile("Slip")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No slip file provided"})
		return
	}
	defer file.Close()

	// อ่านข้อมูล slip เป็น byte
	slipData, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read slip data"})
		return
	}

	// อัปเดตข้อมูล slip ในตาราง payment
	payment.Slip = slipData

	// รับข้อมูลสถานะใหม่ที่ได้รับจาก client ผ่าน form-data
	status := c.PostForm("status")
	if status == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status is required"})
		return
	}

	// อัปเดตสถานะของการชำระเงิน
	payment.Status = status

	// บันทึกการอัปเดตข้อมูลการชำระเงินในฐานข้อมูล
	if err := db.Save(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment status"})
		return
	}

	// อัปเดตคะแนนให้กับสมาชิกตาม point ของ ticket
	var ticket entity.Ticket
	if err := db.Where("id = ?", ticketID).First(&ticket).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}

	var member entity.Member
	if err := db.Where("id = ?", payment.MemberID).First(&member).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
		return
	}

	// เพิ่มคะแนนให้กับสมาชิก
	member.TotalPoint += ticket.Point
	if err := db.Save(&member).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update member points"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment status, slip, and member points updated successfully"})
}
