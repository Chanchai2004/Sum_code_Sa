package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// CreateShowTime godoc
// @Summary Create ShowTime
// @Description Create a new showtime
// @Tags ShowTime
// @Accept json
// @Produce json
// @Param showtime body entity.ShowTimes true "ShowTime"
// @Success 200 {object} entity.ShowTimes
// @Failure 400 {object} gin.H
// @Router /showtimes [post]
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

	c.JSON(http.StatusOK, showtime)
}

// GetShowTime godoc
// @Summary Get ShowTime by ID
// @Description Get a showtime by ID
// @Tags ShowTime
// @Accept json
// @Produce json
// @Param id path uint true "ShowTime ID"
// @Success 200 {object} entity.ShowTimes
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /showtimes/{id} [get]
func GetShowTime(c *gin.Context) {
	var showtime entity.ShowTimes
	id := c.Param("id")

	if err := config.DB().Preload("Movie").Preload("Theater").Where("id = ?", id).First(&showtime).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ShowTime not found"})
		return
	}

	c.JSON(http.StatusOK, showtime)
}

// ListShowTimes godoc
// @Summary List all ShowTimes
// @Description Get all showtimes
// @Tags ShowTime
// @Accept json
// @Produce json
// @Success 200 {array} entity.ShowTimes
// @Router /showtimes [get]
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

// UpdateShowTime godoc
// @Summary Update ShowTime
// @Description Update a showtime by ID
// @Tags ShowTime
// @Accept json
// @Produce json
// @Param id path uint true "ShowTime ID"
// @Param showtime body entity.ShowTimes true "ShowTime"
// @Success 200 {object} entity.ShowTimes
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /showtimes/{id} [patch]
func UpdateShowTime(c *gin.Context) {
	var showtime entity.ShowTimes
	id := c.Param("id")

	// ตรวจสอบว่ามีรายการที่ต้องการอัปเดตอยู่ในฐานข้อมูลหรือไม่
	if err := config.DB().Where("id = ?", id).First(&showtime).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ShowTime not found"})
		return
	}

	// ตรวจสอบว่าข้อมูลที่ส่งมาถูกต้องหรือไม่
	if err := c.ShouldBindJSON(&showtime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ทำการอัปเดตรายการในฐานข้อมูล
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

// DeleteShowTime godoc
// @Summary Delete ShowTime
// @Description Delete a showtime by ID
// @Tags ShowTime
// @Accept json
// @Produce json
// @Param id path uint true "ShowTime ID"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /showtimes/{id} [delete]
func DeleteShowTime(c *gin.Context) {
	id := c.Param("id")

	if err := config.DB().Where("id = ?", id).Delete(&entity.ShowTimes{}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ShowTime deleted"})
}

// DeleteShowTimeByDetails godoc
// @Summary Delete ShowTime by details
// @Description Delete a showtime by MovieID, TheaterID, and Showdate
// @Tags ShowTime
// @Accept json
// @Produce json
// @Param showtime body entity.ShowTimes true "ShowTime"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /showtimes [delete]
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
