package controller

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "github.com/tanapon395/sa-67-example/config"
    "github.com/tanapon395/sa-67-example/entity"
    "log"
	
)

func CheckRewardCode(c *gin.Context) {
    rewardCode := c.Param("reward_code")
    log.Println("Reward code received:", rewardCode) // ตรวจสอบค่า reward_code ที่ได้รับจาก URL

    var codeReward entity.CodeReward
    if err := config.DB().Where("reward_code = ?", rewardCode).Preload("Reward").First(&codeReward).Error; err != nil {
        log.Println("Error occurred during query:", err) // แสดง error ถ้าค้นหาไม่เจอ
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "รหัสรางวัลไม่ถูกต้อง"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถตรวจสอบรหัสรางวัลได้"})
        }
        return
    }

    // ตรวจสอบสถานะว่าถูกใช้แล้วหรือไม่
    if codeReward.Status == false {
        c.JSON(http.StatusOK, gin.H{
            "message": "รหัสนี้ถูกใช้ไปแล้ว",
            "reward_code": codeReward.RewardCode,
            "status": codeReward.Status,
        })
        return
    }

    // ถ้าพบรหัสรางวัลและยังไม่ถูกใช้
    c.JSON(http.StatusOK, gin.H{
        "message": "รหัสรางวัลถูกต้อง",
        "reward_name": codeReward.Reward.RewardName,
        "discount": codeReward.Reward.Discount,
        "reward_points": codeReward.Reward.Points,
        "description": codeReward.Reward.Describtion,
        "status": codeReward.Status,
    })
}

// UpdateCodeRewardStatus อัปเดตสถานะของ CodeReward
func UpdateCodeRewardStatus(c *gin.Context) {
    db := config.DB() // เรียกใช้งานฐานข้อมูลจาก config

    // รับค่าจาก URL (reward_code)
    rewardCode := c.Param("code")

    // ค้นหา CodeReward ที่มี reward_code ที่ได้รับมา
    var codeReward entity.CodeReward
    if err := db.Where("reward_code = ?", rewardCode).First(&codeReward).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "CodeReward not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        }
        return
    }

    // รับข้อมูลสถานะใหม่จาก body
    var input struct {
        Status bool `json:"status` // รับค่า status ที่ต้องการอัปเดต
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    // อัปเดตสถานะของ CodeReward
    codeReward.Status = input.Status

    // บันทึกการเปลี่ยนแปลงลงฐานข้อมูล
    if err := db.Save(&codeReward).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update CodeReward status"})
        return
    }

    // ส่งข้อมูล CodeReward ที่อัปเดตกลับไป
    c.JSON(http.StatusOK, gin.H{"message": "CodeReward status updated", "data": codeReward})
}