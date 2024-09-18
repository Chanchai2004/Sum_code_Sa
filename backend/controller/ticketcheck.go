package controller

import (
	"net/http"
	"strconv"
	"time"
	"gorm.io/gorm"

	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

// CreateTicketCheck - ฟังก์ชันสำหรับสร้าง ticket check
func CreateTicketCheck(c *gin.Context) {
	ticketIDStr := c.Param("ticket_id")
	ticketID, err := strconv.Atoi(ticketIDStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ticket ID"})
		return
	}

	// Check if the ticket ID exists
    var ticket entity.Ticket
    if err := config.DB().First(&ticket, ticketID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"status": false, "error": "Ticket not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": false, "error": err.Error()})
		}
		return
	}

	var existingTicketCheck entity.TicketCheck
	if err := config.DB().Where("ticket_id = ?", ticketID).First(&existingTicketCheck).Error; err == nil {
		// If no error, it means a record already exists
		c.JSON(http.StatusConflict, gin.H{"status": false, "error": "Ticket check already exists for this ticket ID"})
		return
	} else if err != gorm.ErrRecordNotFound {
		// If there is an error other than "record not found", handle it
		c.JSON(http.StatusInternalServerError, gin.H{"status": false, "error": err.Error()})
		return
	}

	// สร้างข้อมูล ticket check
	ticketCheck := entity.TicketCheck{
		TicketID:  uint(ticketID),
		TimeStamp: time.Now(),
		Status:    "Checked",
	}
	
	

	// บันทึกข้อมูลลงในฐานข้อมูล
	if err := config.DB().Create(&ticketCheck).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลกลับไปยัง client
	c.JSON(http.StatusOK, gin.H{"success": true, "data": ticketCheck})
}

func GetTicketChecks(c *gin.Context) {
	var ticketChecks []entity.TicketCheck

	if err := config.DB().Preload("Ticket").Find(&ticketChecks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ticketChecks})
}

