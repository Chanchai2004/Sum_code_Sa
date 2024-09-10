package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/controller"
)

const PORT = "8000"

func main() {

	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	// เปลี่ยนเส้นทางของกลุ่ม route ให้มี prefix เป็น /api
	router := r.Group("api")
	{
		// Booking Routes
		router.GET("/booked-seats/:showtimeID", controller.GetBookedSeats)
		router.POST("/book-seats", controller.BookSeats) // เพิ่มเส้นทางสำหรับการจองที่นั่ง

		// Member Routes
		router.GET("/members", controller.ListMembers)
		router.GET("/member/:id", controller.GetMember)
		router.POST("/members", controller.CreateMember)
		router.PATCH("/members", controller.UpdateMember)
		router.DELETE("/members/:id", controller.DeleteMember)

		// Movie Routes
		router.GET("/movies", controller.ListMovies)         // แสดงรายการหนังทั้งหมด
		router.GET("/movie/:id", controller.GetMovie)        // แสดงรายละเอียดหนังโดยใช้ ID
		router.POST("/movies", controller.CreateMovie)       // เพิ่มหนังใหม่
		router.PATCH("/movies/:id", controller.UpdateMovie)  // อัปเดตข้อมูลหนัง
		router.DELETE("/movies/:id", controller.DeleteMovie) // ลบหนังโดยใช้ ID

		// Theater Routes
		router.GET("/theaters", controller.ListTheaters)

		// Showtime Routes
		router.POST("/showtimes", controller.CreateShowTime)
		router.GET("/showtimes/:id", controller.GetShowTime)
		router.GET("/showtimes", controller.ListShowTimes)
		router.PATCH("/showtimes/:id", controller.UpdateShowTime)
		router.DELETE("/showtimes/:id", controller.DeleteShowTime)
		router.DELETE("/showtimes", controller.DeleteShowTimeByDetails) // เพิ่มเส้นทางสำหรับการลบโดยใช้รายละเอียด

		// Seat Routes
		router.GET("/seats", controller.ListSeats)
		router.GET("/seat/:id", controller.GetSeat)
		router.POST("/seats", controller.CreateSeat)
		router.PATCH("/seats/:id", controller.UpdateSeat)
		router.DELETE("/seats/:id", controller.DeleteSeat)

		// Ticket Routes
		router.GET("/tickets", controller.ListTickets)
		router.GET("/tickets/:id", controller.GetTicketsById)
		router.POST("/tickets", controller.CreateTicket)
		router.PATCH("/ticket/:id", controller.UpdateTicket)
		router.DELETE("/tickets/:id", controller.DeleteTicket)

		// Payment Routes
		router.GET("/payments", controller.ListPayments)
		router.GET("/payment/:id", controller.GetPayment)
		router.POST("/payments", controller.CreatePayment)
		router.PATCH("/payments/:id", controller.UpdatePayment)
		router.DELETE("/payments/:id", controller.DeletePayment)

		// เส้นทางสำหรับการเข้าสู่ระบบ
		router.POST("/signin", controller.Signin)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server
	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
