package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

var jwtKey = []byte("your_secret_key")

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

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

	if err := db.Where("email = ?", loginData.Email).First(&member).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
		return
	}

	if !config.CheckPasswordHash([]byte(loginData.Password), []byte(member.Password)) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email: loginData.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":    member.ID,
		"email": member.Email,
		"role":  member.Role,
		"token": tokenString,
	})
}

func CheckAdminPassword(c *gin.Context) {
	var input struct {
		AdminID  uint   `json:"id"` // รับ adminID มาด้วย โดยใช้ json key "id"
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

	// ตรวจสอบข้อมูลที่ส่งมาว่ามีรูปแบบถูกต้องหรือไม่
	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()


	var existingMember entity.Member
	if err := db.Where("user_name = ?", member.UserName).First(&existingMember).Error; err == nil {

		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	// ตรวจสอบว่ามี email 
	if err := db.Where("email = ?", member.Email).First(&existingMember).Error; err == nil {

		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	hashedPassword, _ := config.HashPassword(member.Password)

	if member.Role == "" {
		member.Role = "user" // ตั้งค่า Role เป็น "user" ถ้าไม่ถูกส่งมา
	}

	u := entity.Member{
		UserName:   member.UserName,
		FirstName:  member.FirstName,
		LastName:   member.LastName,
		Email:      member.Email,
		Password:   hashedPassword,
		TotalPoint: member.TotalPoint,
		Role:       member.Role,
	}

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
	results := db.First(&member, ID)
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
	results := db.Find(&members)
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

	if err := db.First(&member, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if member.Role == "admin" {
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

		var input struct {
			Password string `json:"password"`
		}

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

	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&member)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// PATCH /members/:id
func UpdateMemberReward(c *gin.Context) {
	var member entity.Member

	MemberID := c.Param("id")

	db := config.DB()
	result := db.First(&member, MemberID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Member ID not found"})
		return
	}

	var input struct {
		TotalPoint int `json:"TotalPoint"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

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

	if memberID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Member ID is required"})
		return
	}

	var rewards []entity.Reward
	result := config.DB().Preload("Member").Where("member_id = ?", memberID).Find(&rewards)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rewards"})
		return
	}

	fmt.Printf("Fetched Rewards: %+v\n", rewards)

	for _, reward := range rewards {
		fmt.Printf("Member Information for Reward %d: %+v\n", reward.ID, reward.Member)
	}

	c.JSON(http.StatusOK, rewards)
}
