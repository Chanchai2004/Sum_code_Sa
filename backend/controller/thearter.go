package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/entity"
	"github.com/tanapon395/sa-67-example/config"
)

func ListTheaters(c *gin.Context) {
	var theaters []entity.Theater
	config.DB().Find(&theaters)
	c.JSON(http.StatusOK, theaters)
}

func GetTheaterByID(c *gin.Context) {
    var theater entity.Theater
    theaterID := c.Param("id") // ดึงค่า TheaterID จาก URL param

    if err := config.DB().Where("id = ?", theaterID).First(&theater).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Theater not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "theater_name": theater.TheaterName,
    })
}