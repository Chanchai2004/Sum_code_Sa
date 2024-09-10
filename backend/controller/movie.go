package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

func CreateMovie(c *gin.Context) {
	var movie entity.Movie

	// bind JSON เข้าตัวแปร movie
	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// สร้าง Movie โดยรวมฟิลด์ MovieDuration ด้วย
	u := entity.Movie{
		MovieName:     movie.MovieName,
		MovieDuration: movie.MovieDuration, // รับค่าจาก JSON ที่ถูกส่งมา
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}

// GET /Movie/:id
func GetMovie(c *gin.Context) {
	ID := c.Param("id")
	var movie entity.Movie

	db := config.DB()
	results := db.First(&movie, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if movie.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, movie)
}

// GET /Movies
func ListMovies(c *gin.Context) {
	var movies []entity.Movie

	db := config.DB()
	results := db.Find(&movies)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, movies)
}

// DELETE /Movies/:id
func DeleteMovie(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM movies WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /Movies/:id
func UpdateMovie(c *gin.Context) {
	var movie entity.Movie

	movieID := c.Param("id")

	db := config.DB()
	result := db.First(&movie, movieID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	// bind JSON เข้าตัวแปร movie ที่มีอยู่
	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// อัปเดตข้อมูลในฐานข้อมูล
	result = db.Save(&movie)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

