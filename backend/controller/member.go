package controller

import (
	"net/http"
	"fmt"
	"strconv"
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

func CheckAdminPassword(c *gin.Context) {
	var input struct {
		AdminID  uint   `json:"id"`  // รับ adminID มาด้วย โดยใช้ json key "id"
		Password string `json:"password"`
	}

	// ตรวจสอบว่า request body ถูกต้องหรือไม่
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var admin entity.Member
	db := config.DB()

	// ค้นหา admin ในฐานข้อมูลตาม adminID ที่ส่งมา
	if err := db.Where("id = ? AND role = ?", input.AdminID, "admin").First(&admin).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Admin not found"})
		return
	}

	// ใช้ฟังก์ชันจาก config เพื่อตรวจสอบรหัสผ่าน
	if config.CheckPasswordHash([]byte(input.Password), []byte(admin.Password)) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Invalid password"})
	}
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
		UserName:   member.UserName,  // ตั้งค่าฟิลด์ UserName
		FirstName:  member.FirstName, // ตั้งค่าฟิลด์ FirstName
		LastName:   member.LastName,  // ตั้งค่าฟิลด์ LastName
		Email:      member.Email,     // ตั้งค่าฟิลด์ Email
		Password:   hashedPassword,
		GenderID:   member.GenderID,
		Gender:     gender,           // โยงความสัมพันธ์กับ Entity Gender
		TotalPoint: member.TotalPoint,
		Role:       member.Role,      // เพิ่มฟิลด์ Role ที่ผู้ใช้กรอก
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
	var member entity.Member
	db := config.DB()

	// แปลง id จาก string เป็น uint
	adminID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// ดึงข้อมูลของ user ที่ต้องการลบ
	if err := db.First(&member, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// ตรวจสอบว่าเป็น admin หรือไม่
	if member.Role == "admin" {
		// นับจำนวน admin ที่เหลืออยู่ในระบบ
		var adminCount int64
		if err := db.Model(&entity.Member{}).Where("role = ?", "admin").Count(&adminCount).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking admin count"})
			return
		}

		// ถ้ามี admin เพียง 1 คน ห้ามลบ
		if adminCount <= 1 {
			c.JSON(http.StatusForbidden, gin.H{"error": "Cannot delete the last admin"})
			return
		}

		// กรณี admin ต้องให้กรอกรหัสผ่าน
		var input struct {
			Password string `json:"password"`
		}

		// bind ข้อมูลที่กรอกมาจาก frontend
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		// ตรวจสอบรหัสผ่าน admin
		if !config.CheckPasswordHash([]byte(input.Password), []byte(member.Password)) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid admin password"})
			return
		}
	}

	// ลบ user
	if tx := db.Delete(&member).Error; tx != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}



// PATCH /members/:id
func UpdateMember(c *gin.Context) {
	var member entity.Member

	MemberID := c.Param("id")

	db := config.DB()
	result := db.First(&member, MemberID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	// Bind JSON ที่ส่งมาใน request body
	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกการอัปเดตข้อมูล
	result = db.Save(&member)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
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


