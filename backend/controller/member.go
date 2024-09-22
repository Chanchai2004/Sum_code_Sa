package controller

import (
	"net/http"
	"fmt"
	// "strconv"
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


// POST /Member
func CreateMember(c *gin.Context) {
	var member entity.Member

	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	hashedPassword, _ := config.HashPassword(member.Password)

	u := entity.Member{
		UserName: member.UserName,
		FirstName:  member.FirstName,
		LastName:   member.LastName,
		Email:      member.Email,
		Password:   hashedPassword,
		TotalPoint: member.TotalPoint,
		Role:      "user",
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