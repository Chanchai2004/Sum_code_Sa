package controller

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

func CreateShowTime(c *gin.Context) {
	var showtime entity.ShowTimes
	if err := c.ShouldBindJSON(&showtime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Create(&showtime).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Preload("Movie").Preload("Theater").First(&showtime, showtime.ID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, showtime)
}

func GetShowTime(c *gin.Context) {
	var showtime entity.ShowTimes
	id := c.Param("id")

	if err := config.DB().Preload("Movie").Preload("Theater").Where("id = ?", id).First(&showtime).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ShowTime not found"})
		return
	}

	c.JSON(http.StatusOK, showtime)
}


func ListShowTimes(c *gin.Context) {
	var showtimes []entity.ShowTimes

	if err := config.DB().
		Preload("Movie").
		Preload("Theater").
		Find(&showtimes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, showtimes)
}

func UpdateShowTime(c *gin.Context) {
	var showtime entity.ShowTimes
	id := c.Param("id")

	// ตรวจสอบว่ามีรายการที่ต้องการอัปเดตอยู่ในฐานข้อมูลหรือไม่
	if err := config.DB().Where("id = ?", id).First(&showtime).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ShowTime not found"})
		return
	}

	if err := c.ShouldBindJSON(&showtime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Save(&showtime).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่าอัปเดตสำเร็จและโหลดข้อมูลที่เกี่ยวข้อง (เช่น Movie, Theater)
	if err := config.DB().Preload("Movie").Preload("Theater").First(&showtime, showtime.ID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่อัปเดตแล้วกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, showtime)
}


func DeleteShowTime(c *gin.Context) {
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).Delete(&entity.ShowTimes{}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ShowTime deleted"})
}


func DeleteShowTimeByDetails(c *gin.Context) {
	var showtime entity.ShowTimes
	if err := c.ShouldBindJSON(&showtime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Where("movie_id = ? AND theater_id = ? AND Showdate = ?", showtime.MovieID, showtime.TheaterID, showtime.Showdate).Delete(&showtime).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ShowTime deleted"})
}

func GetTimeByShowtime(c *gin.Context) { 
	var showtime entity.ShowTimes
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).First(&showtime).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Showtime not found"})
		return
	}

	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load location"})
		return
	}

	showtimeLocal := showtime.Showdate.In(location)

	showtimeFormatted := showtimeLocal.Format("15:04")

	c.JSON(http.StatusOK, gin.H{"showtime": showtimeFormatted})
}