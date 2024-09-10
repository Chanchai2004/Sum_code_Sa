package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// GetShowtimes รับข้อมูลทั้งหมดของการแสดง
func ListShowTimes(c *gin.Context) {
	var showtimes []entity.ShowTimes

	// ดึงข้อมูลทั้งหมดจากฐานข้อมูล
	if err := config.DB().Preload("Movie").Preload("Theater").Find(&showtimes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": showtimes})
}

// CreateShowtime สร้างข้อมูลการแสดงใหม่
func CreateShowTime(c *gin.Context) {
	var showtime entity.ShowTimes
	var movie entity.Movie
	var theater entity.Theater

	// Binding ข้อมูลจาก request body
	if err := c.ShouldBindJSON(&showtime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า Movie มีอยู่ในระบบหรือไม่
	if err := config.DB().Where("id = ?", showtime.MovieID).First(&movie).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Movie not found"})
		return
	}

	// ตรวจสอบว่า Theater มีอยู่ในระบบหรือไม่
	if err := config.DB().Where("id = ?", showtime.TheaterID).First(&theater).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Theater not found"})
		return
	}

	// บันทึกข้อมูลการฉายภาพยนตร์
	if err := config.DB().Create(&showtime).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": showtime})
}

// GetShowtimeByID รับข้อมูลการแสดงตาม ID
func GetShowTime(c *gin.Context) {
	var showtime entity.ShowTimes
	id := c.Param("id")

	// ค้นหาข้อมูลการแสดงตาม ID
	if err := config.DB().Preload("Movie").Preload("Theater").Where("id = ?", id).First(&showtime).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Showtime not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": showtime})
}

// UpdateShowTime อัปเดตข้อมูลการแสดง
func UpdateShowTime(c *gin.Context) {
	var showtime entity.ShowTimes
	id := c.Param("id")

	// ค้นหาข้อมูลการแสดงตาม ID
	if err := config.DB().Where("id = ?", id).First(&showtime).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Showtime not found"})
		return
	}

	// Binding ข้อมูลจาก request body
	if err := c.ShouldBindJSON(&showtime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูลการแสดง
	if err := config.DB().Save(&showtime).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": showtime})
}

// DeleteShowTime ลบข้อมูลการแสดงตาม ID
func DeleteShowTime(c *gin.Context) {
	id := c.Param("id")

	// ลบข้อมูลการแสดง
	if err := config.DB().Where("id = ?", id).Delete(&entity.ShowTimes{}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Showtime deleted"})
}

// DeleteShowTimeByDetails ลบข้อมูลการแสดงโดยใช้รายละเอียดอื่นๆ
func DeleteShowTimeByDetails(c *gin.Context) {
	var showtime entity.ShowTimes

	// Binding ข้อมูลจาก request body
	if err := c.ShouldBindJSON(&showtime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ลบข้อมูลการแสดงโดยใช้รายละเอียด
	if err := config.DB().Where("movie_id = ? AND theater_id = ?", showtime.MovieID, showtime.TheaterID).Delete(&showtime).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Showtime deleted"})
}
