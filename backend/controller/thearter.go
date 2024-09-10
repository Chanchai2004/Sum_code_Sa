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
