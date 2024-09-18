package controller

import (
	"log"
	"net/http"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
	"math/rand"
	"github.com/gin-gonic/gin"
)

// CreateCodeReward เป็นฟังก์ชันสำหรับบันทึกโค้ดแลกเปลี่ยน (CodeReward)
// CreateCodeReward เป็นฟังก์ชันสำหรับบันทึกโค้ดแลกเปลี่ยน (CodeReward)
func CreateCodeReward(c *gin.Context) {
	db := config.DB()

	// สร้างตัวแปรสำหรับรับข้อมูลจาก JSON
	var codeReward entity.CodeReward

	// ตรวจสอบการรับข้อมูล JSON และแปลงเป็น struct ของ CodeReward
	if err := c.ShouldBindJSON(&codeReward); err != nil {
		log.Println("JSON Binding Error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	// ตรวจสอบว่ามีโค้ดแลกเปลี่ยนสำหรับรางวัลนี้อยู่แล้วหรือไม่
	var existingCodeReward entity.CodeReward
	if err := db.Where("reward_id = ?", codeReward.RewardID).First(&existingCodeReward).Error; err == nil {
		// ถ้ามีโค้ดสำหรับรางวัลนี้อยู่แล้ว ให้แจ้งกลับ
		c.JSON(http.StatusConflict, gin.H{"error": "Code already generated for this reward"})
		return
	}

	// ตรวจสอบว่ามี Reward ที่สัมพันธ์กันหรือไม่
	var reward entity.Reward
	if err := db.Where("id = ?", codeReward.RewardID).First(&reward).Error; err != nil {
		log.Println("Reward Not Found:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Reward not found"})
		return
	}

	// ใช้โค้ดที่ถูกส่งมาจาก frontend แทนการสร้างโค้ดสุ่ม
	codeReward.Status = true
	codeReward.RewardID = reward.ID

	// บันทึก CodeReward ลงในฐานข้อมูล
	if err := db.Create(&codeReward).Error; err != nil {
		log.Println("Database Save Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save code reward"})
		return
	}

	// ตรวจสอบว่าโค้ดแลกเปลี่ยนถูกบันทึกสำเร็จแล้ว
	log.Printf("CodeReward saved successfully: %+v\n", codeReward)

	// ส่งข้อมูลตอบกลับพร้อมข้อมูลที่บันทึกสำเร็จ
	c.JSON(http.StatusCreated, gin.H{
		"message":      "Code reward created successfully",
		"reward_code":  codeReward.RewardCode,  // ส่งค่า reward_code กลับไปให้ Frontend
		"data":         codeReward,  // ส่งข้อมูลทั้งหมดของโค้ดที่บันทึกกลับไป
	})
}

// ฟังก์ชันสำหรับสร้างโค้ดสุ่ม
func generateRandomCode(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}
	return string(result)
}

// GetCodeReward เป็นฟังก์ชันสำหรับดึงข้อมูลโค้ดแลกเปลี่ยน (CodeReward) ตาม reward_id
func GetCodeReward(c *gin.Context) {
	db := config.DB()

	// ดึง reward_id จาก query parameter
	rewardID := c.Query("reward_id")
	if rewardID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reward ID is required"})
		return
	}

	// ตรวจสอบว่ามีโค้ดแลกเปลี่ยนสำหรับรางวัลนี้หรือไม่
	var codeReward entity.CodeReward
	if err := db.Where("reward_id = ?", rewardID).First(&codeReward).Error; err != nil {
		log.Println("Error fetching code reward:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Code reward not found"})
		return
	}

	// ส่งข้อมูลโค้ดแลกเปลี่ยนกลับไป
	c.JSON(http.StatusOK, gin.H{
		"reward_code": codeReward.RewardCode,
		"reward_id":   codeReward.RewardID,
		"status":      codeReward.Status,
	})
}

