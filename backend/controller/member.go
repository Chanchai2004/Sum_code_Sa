package controller

import (
	"net/http"
	"fmt"
	
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// POST /signin
func Signin(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	db := config.DB()
	var member entity.Member

	// ตรวจสอบว่ามีสมาชิกที่มีอีเมลนี้หรือไม่
	if err := db.Where("email = ?", loginData.Email).First(&member).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
		return
	}

	// ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
	if !config.CheckPasswordHash([]byte(loginData.Password), []byte(member.Password)) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":    member.ID,
		"email": member.Email,
	})
}

// POST /Member
func CreateMember(c *gin.Context) {
	var member entity.Member

	// bind เข้าตัวแปร member
	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ค้นหา gender ด้วย id
	var gender entity.Gender
	db.First(&gender, member.GenderID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
		return
	}

	// เข้ารหัสลับรหัสผ่านที่ผู้ใช้กรอกก่อนบันทึกลงฐานข้อมูล
	hashedPassword, _ := config.HashPassword(member.Password)

	// สร้าง Member
	u := entity.Member{
		FirstName:  member.FirstName,
		LastName:   member.LastName,
		Email:      member.Email,
		Password:   hashedPassword,
		GenderID:   member.GenderID,
		Gender:     gender,
		TotalPoint: member.TotalPoint,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}

// GET /Member/:id
func GetMember(c *gin.Context) {
	ID := c.Param("id")
	var member entity.Member

	db := config.DB()
	results := db.Preload("Gender").First(&member, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if member.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, member)
}

// GET /Members
func ListMembers(c *gin.Context) {
	var members []entity.Member

	db := config.DB()
	results := db.Preload("Gender").Find(&members)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, members)
}

// DELETE /members/:id
func DeleteMember(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM members WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /members/:id
func UpdateMember(c *gin.Context) {
    var member entity.Member

    // ดึงค่า MemberID จาก URL parameter
    MemberID := c.Param("id")

    // ตรวจสอบว่ามีสมาชิกที่มี ID นี้อยู่ในระบบหรือไม่
    db := config.DB()
    result := db.First(&member, MemberID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Member ID not found"})
        return
    }

    // อ่านข้อมูลจาก JSON และอัปเดตเฉพาะฟิลด์ที่จำเป็น
    var input struct {
        TotalPoint int `json:"TotalPoint"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    // ใช้ db.Model() เพื่ออัปเดตเฉพาะฟิลด์ TotalPoint
    result = db.Model(&member).Updates(map[string]interface{}{
        "TotalPoint": input.TotalPoint,
    })
    
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update member"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Update successful"})
}
func GetRewardsByMemberID(c *gin.Context) {
    memberID := c.Param("member_id")

    // Validate memberID
    if memberID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Member ID is required"})
        return
    }

    // Fetch rewards from the database พร้อมกับ Preload ข้อมูล Member
    var rewards []entity.Reward
    result := config.DB().Preload("Member").Where("member_id = ?", memberID).Find(&rewards)
    
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rewards"})
        return
    }

    // Logging the fetched rewards for debugging
    fmt.Printf("Fetched Rewards: %+v\n", rewards)

    // Logging member information
    for _, reward := range rewards {
        fmt.Printf("Member Information for Reward %d: %+v\n", reward.ID, reward.Member)
    }

    c.JSON(http.StatusOK, rewards)


}


