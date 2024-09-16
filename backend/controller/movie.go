package controller

import (
	"net/http"
	"io"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

func CreateMovie(c *gin.Context) {
	var movie entity.Movie

	// อ่านไฟล์โปสเตอร์จาก request
	file, _, err := c.Request.FormFile("poster")
	if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
	}
	defer file.Close()

	// ใช้ io.ReadAll แทน ioutil.ReadAll
	posterData, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read poster data"})
		return
	}

	// อ่านข้อมูลอื่น ๆ ของหนังจาก form-data
	movieName := c.PostForm("movieName")
	if movieName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Movie name is required"})
		return
	}

	movieType := c.PostForm("movieType")
	director := c.PostForm("director")
	actor := c.PostForm("actor")
	synopsis := c.PostForm("synopsis")

	// รับ releaseDate เป็น string โดยตรงจาก form-data
	releaseDate := c.PostForm("releaseDate")
	if releaseDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Release date is required"})
		return
	}

	// ตรวจสอบ MovieDuration และแปลงเป็น int
	movieDurationStr := c.PostForm("movieDuration")
	movieDuration, err := strconv.Atoi(movieDurationStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie duration"})
		return
	}

	// สร้าง Movie entity และบันทึกลงฐานข้อมูล
	movie = entity.Movie{
		MovieName:    movieName,
		MovieType:    movieType,
		Director:     director,
		Actor:        actor,
		Synopsis:     synopsis,
		ReleaseDate:  releaseDate,  // ใช้ string แทน time.Time
		MovieDuration: movieDuration,
		Poster:       posterData,
	}

	db := config.DB()
	if err := db.Create(&movie).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create movie"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Movie created successfully", "data": movie})
}

// GET /Movie/:id
func GetMovie(c *gin.Context) {
	ID := c.Param("id")
	var movie entity.Movie

	db := config.DB()
	results := db.First(&movie, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
		return
	}
	c.JSON(http.StatusOK, movie)
}

// GET /Movies รับข้อมูลหนังทั้งหมด
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

// PATCH /Movies/:id อัปเดตข้อมูลหนังตาม id
func UpdateMovie(c *gin.Context) {
	var movie entity.Movie

	movieID := c.Param("id")
	db := config.DB()

	// ค้นหาหนังที่มีอยู่ในฐานข้อมูล
	if err := db.First(&movie, movieID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
		return
	}

	// ตรวจสอบว่ามีการอัปโหลดโปสเตอร์ใหม่หรือไม่
	file, _, err := c.Request.FormFile("poster")
	if err == nil { // มีการอัปโหลดไฟล์ใหม่
		defer file.Close()
		posterData, err := io.ReadAll(file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read poster data"})
			return
		}
		movie.Poster = posterData
	}

	// อ่านข้อมูลภาพยนตร์จาก form-data
	movieName := c.PostForm("movieName")
	movieType := c.PostForm("movieType")
	director := c.PostForm("director")
	actor := c.PostForm("actor")
	synopsis := c.PostForm("synopsis")

	// รับ releaseDate เป็น string โดยตรงจาก form-data
	releaseDate := c.PostForm("releaseDate")
	if releaseDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Release date is required"})
		return
	}

	// อัปเดตฟิลด์อื่น ๆ
	movie.MovieName = movieName
	movie.MovieType = movieType
	movie.Director = director
	movie.Actor = actor
	movie.Synopsis = synopsis
	movie.ReleaseDate = releaseDate  // ใช้ string แทน time.Time

	// บันทึกการอัปเดตในฐานข้อมูล
	if err := db.Save(&movie).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update movie"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Movie updated successfully", "data": movie})
}

func GetMoviePosterByID(c *gin.Context) {
    ID := c.Param("id")
    var movie entity.Movie

    db := config.DB()
    if err := db.First(&movie, ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
        return
    }

    // ตรวจสอบว่ามีข้อมูลโปสเตอร์หรือไม่
    if movie.Poster == nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Poster not found"})
        return
    }

    // ตั้งค่า Content-Type เป็น image/jpeg หรือ image/png ขึ้นอยู่กับรูปแบบไฟล์
    c.Header("Content-Type", "image/jpeg") // หรือ image/png หากไฟล์เป็น png
    c.Writer.Write(movie.Poster) // ส่งข้อมูลโปสเตอร์ไปยัง client
}

