package controller

import (
    "time"
	"net/http"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
	"github.com/gin-gonic/gin"
	
)

// POST /rewards สร้าง Reward ใหม่
func CreateReward(c *gin.Context) {
	var reward entity.Reward

	// Bind ข้อมูลจาก JSON request body มาเป็น Reward struct
	if err := c.ShouldBindJSON(&reward); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า MemberID มีค่าและอยู่ในฐานข้อมูลหรือไม่
	db := config.DB()
	var member entity.Member
	if reward.MemberID != nil && db.First(&member, *reward.MemberID).Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Member ID"})
		return
	}

	// ตั้งค่าเวลาแลกรางวัล
	reward.Reward_time = time.Now()

	// สร้าง Reward ใหม่ในฐานข้อมูล
	if err := db.Create(&reward).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create reward"})
		return
	}

	// ส่งข้อมูลรางวัลที่สร้างกลับไปยัง frontend
	c.JSON(http.StatusCreated, gin.H{"data": reward})
}



// GET /rewards/:id รับข้อมูล Reward ตาม ID
func GetReward(c *gin.Context) {
	id := c.Param("id")
	var reward entity.Reward

	db := config.DB()
	if err := db.First(&reward, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reward not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reward})
}

// GET /rewards รับข้อมูล Reward ทั้งหมด
func ListRewards(c *gin.Context) {
	var rewards []entity.Reward

	db := config.DB()
	if err := db.Find(&rewards).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rewards"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rewards})
}

// DELETE /rewards/:id ลบ Reward ตาม ID
func DeleteReward(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Exec("DELETE FROM rewards WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reward not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reward deleted successfully"})
}

// PATCH /rewards/:id อัปเดตข้อมูล 
func UpdateReward(c *gin.Context) {
	var reward entity.Reward
	id := c.Param("id")

	db := config.DB()

	// ค้นหา Reward ในฐานข้อมูล
	if err := db.First(&reward, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reward not found"})
		return
	}

	// Bind ข้อมูลที่ต้องการอัปเดตจาก request body
	if err := c.ShouldBindJSON(&reward); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า MemberID และ PaymentID มีอยู่ในฐานข้อมูลหรือไม่ (ถ้ามีการอัปเดต)
	var member entity.Member
	if reward.MemberID != nil && db.First(&member, *reward.MemberID).Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Member ID"})
		return
	}

	

	// บันทึกการเปลี่ยนแปลงในฐานข้อมูล
	if err := db.Save(&reward).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update reward"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reward})
}



