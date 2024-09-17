package config

import (
	"fmt"
	"time"

	"github.com/tanapon395/sa-67-example/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {

	// AutoMigrate สำหรับทุก entity
	err := db.AutoMigrate(
		&entity.Gender{},
		&entity.Member{},
		&entity.Movie{},
		&entity.Theater{},
		&entity.ShowTimes{},
		&entity.Seat{},     // สร้างหลัง Theater เพราะมี foreign key เชื่อมโยง
		&entity.Booking{},  // สร้างหลังจากที่ Member และ Movie ถูกสร้างแล้ว
		&entity.BookSeat{}, // สร้างหลังจาก Seat และ Booking
		&entity.Payment{},
		&entity.Ticket{}, // สร้างหลังจาก BookSeat และ Booking
		&entity.Reward{},
		&entity.CodeReward{},
	)
	if err != nil {
		fmt.Println("Error in AutoMigrate:", err)
	} else {
		fmt.Println("AutoMigrate completed successfully.")
	}

	// สร้างข้อมูลเพศ
	GenderMale := entity.Gender{Name: "Male"}
	GenderFemale := entity.Gender{Name: "Female"}

	db.FirstOrCreate(&GenderMale, &entity.Gender{Name: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Name: "Female"})

	// สร้างข้อมูลสมาชิกคนที่หนึ่ง (sa@gmail.com)
	hashedPassword, _ := HashPassword("123456")
	Member1 := &entity.Member{
		UserName:   "sa1",
		FirstName:  "Software1",
		LastName:   "Analysis1",
		Email:      "sa@gmail.com",
		Password:   hashedPassword,
		GenderID:   GenderMale.ID,
		TotalPoint: 10,
		Role:       "customer",
	}
	db.FirstOrCreate(Member1, &entity.Member{
		Email: "sa@gmail.com",
	})

	// สร้างข้อมูลสมาชิกคนที่สอง (sa2@gmail.com)
	hashedPassword2, _ := HashPassword("123456")
	Member2 := &entity.Member{
		UserName:   "sa2",
		FirstName:  "Software2",
		LastName:   "Analysis2",
		Email:      "sa2@gmail.com",
		Password:   hashedPassword2,
		GenderID:   GenderMale.ID,
		TotalPoint: 5,
		Role:       "customer",
	}
	db.FirstOrCreate(Member2, &entity.Member{
		Email: "sa2@gmail.com",
	})

	hashedPassword3, _ := HashPassword("123456") // แฮชรหัสผ่านใหม่ที่ต้องการ
	Member3 := &entity.Member{
		UserName:   "sa3",
		FirstName:  "Software3",
		LastName:   "Analysis3",
		Email:      "sa3@gmail.com",
		Password:   hashedPassword3, // บันทึกรหัสผ่านที่แฮชแล้ว
		GenderID:   GenderMale.ID,
		TotalPoint: 8,
		Role:       "customer",
	}
	db.FirstOrCreate(Member3, &entity.Member{
		Email: "sa3@gmail.com",
	})

	// สร้างข้อมูลภาพยนตร์ 3 เรื่อง
	movies := []entity.Movie{
		{MovieName: "Inception", MovieDuration: 120},
		{MovieName: "The Dark Knight", MovieDuration: 152},
		{MovieName: "Interstellar", MovieDuration: 169},
	}

	for i := range movies {
		if err := db.FirstOrCreate(&movies[i], entity.Movie{MovieName: movies[i].MovieName}).Error; err != nil {
			fmt.Printf("Error creating movie: %s\n", err)
		}
	}

	// สร้างข้อมูลโรงหนัง 3 โรง
	theaters := []entity.Theater{
		{TheaterName: "Theater 1"},
		{TheaterName: "Theater 2"},
		{TheaterName: "Theater 3"},
	}

	for i := range theaters {
		if err := db.FirstOrCreate(&theaters[i], entity.Theater{TheaterName: theaters[i].TheaterName}).Error; err != nil {
			fmt.Printf("Error creating theater: %s\n", err)
		}
	}

	// สร้างที่นั่งสำหรับแต่ละโรงหนัง
	seatNumbers := []string{}
	for row := 'A'; row <= 'H'; row++ {
		for num := 1; num <= 20; num++ {
			seatNumber := fmt.Sprintf("%c%d", row, num)
			seatNumbers = append(seatNumbers, seatNumber)
		}
	}

	for _, theater := range theaters {
		for _, seatNo := range seatNumbers {
			seat := entity.Seat{
				SeatNo:    seatNo,
				Status:    "Available",
				Price:     200,
				TheaterID: &theater.ID,
			}
			if err := db.FirstOrCreate(&seat, &entity.Seat{SeatNo: seatNo, TheaterID: &theater.ID}).Error; err != nil {
				fmt.Printf("Error creating seat: %s\n", err)
				fmt.Println(err)
			}
		}
	}

	// สร้างข้อมูลการฉายภาพยนตร์
	showTimes := []entity.ShowTimes{
		{Showdate: time.Date(2024, 10, 28, 12, 0, 0, 0, time.UTC), MovieID: movies[0].ID, TheaterID: theaters[0].ID},
		{Showdate: time.Date(2024, 10, 28, 14, 0, 0, 0, time.UTC), MovieID: movies[0].ID, TheaterID: theaters[0].ID},
		{Showdate: time.Date(2024, 10, 29, 12, 0, 0, 0, time.UTC), MovieID: movies[2].ID, TheaterID: theaters[2].ID},
	}

	for i := range showTimes {
		if err := db.FirstOrCreate(&showTimes[i], entity.ShowTimes{Showdate: showTimes[i].Showdate, MovieID: showTimes[i].MovieID, TheaterID: showTimes[i].TheaterID}).Error; err != nil {
			fmt.Printf("Error creating showtime: %s\n", err)
		}
	}

	// สร้าง tickets สำหรับสมาชิกที่สอง (Member2) ในทั้งสองรอบการฉาย
	tickets := []entity.Ticket{
		{Point: 10, Status: "Booked", MemberID: Member2.ID},
		{Point: 15, Status: "Booked", MemberID: Member2.ID},
	}

	for i := range tickets {
		if err := db.Create(&tickets[i]).Error; err != nil {
			fmt.Printf("Error creating ticket: %s\n", err)
		}
	}

	// สร้าง payments และเชื่อมโยง ticket_id ที่ถูกต้องสำหรับสมาชิกที่สอง
	now := time.Now()

	payments := []entity.Payment{
		{TotalPrice: 600, Status: "Paid", PaymentTime: now, MemberID: Member2.ID, TicketID: tickets[0].ID},
		{TotalPrice: 900, Status: "Paid", PaymentTime: now, MemberID: Member2.ID, TicketID: tickets[1].ID},
	}

	for i := range payments {
		if err := db.Create(&payments[i]).Error; err != nil {
			fmt.Printf("Error creating payment: %s\n", err)
		} else {
			fmt.Printf("Payment %d created with ID: %d\n", i+1, payments[i].ID)
		}
	}

	// สร้างการจอง (Booking) และ BookSeat สำหรับสมาชิกที่สอง (Member2) ทั้งสองรอบ
	seatNumbersForBooking := []string{"A1", "A2", "A3"} // เลือกที่นั่งที่ต้องการจองในรอบแรก
	for _, seatNo := range seatNumbersForBooking {
		// ค้นหาที่นั่งในโรงภาพยนตร์ที่ถูกต้อง
		var seat entity.Seat
		if err := db.Where("seat_no = ? AND theater_id = ? AND id NOT IN (SELECT seat_id FROM bookings WHERE show_time_id = ?)", seatNo, theaters[0].ID, showTimes[0].ID).First(&seat).Error; err != nil {
			fmt.Printf("Error finding seat: %s\n", err)
			continue
		}

		// สร้างการจองสำหรับ ShowTime ที่ 1
		booking := entity.Booking{
			MemberID:    Member2.ID,
			ShowTimeID:  showTimes[0].ID, // เชื่อมโยงกับ ShowTime ที่ 1
			SeatID:      seat.ID,
			TicketID:    tickets[0].ID, // เชื่อมโยงกับ Ticket ที่ 1
			BookingTime: time.Now(),
			Status:      "confirmed",
		}

		if err := db.Create(&booking).Error; err != nil {
			fmt.Printf("Error creating booking: %s\n", err)
		}

		// เพิ่ม BookSeat สำหรับการจองในรอบแรก
		bookSeat := entity.BookSeat{
			SeatID:    seat.ID,
			BookingID: booking.ID,
		}

		if err := db.Create(&bookSeat).Error; err != nil {
			fmt.Printf("Error creating book seat: %s\n", err)
			continue
		}

		// อัปเดตสถานะที่นั่งหลังจากการจอง
		db.Model(&seat).Update("Status", "Booked")
	}

	// สร้างการจอง (Booking) และ BookSeat สำหรับสมาชิกที่สอง (Member2) ในรอบที่สอง
	seatNumbersForBookingRound2 := []string{"A1", "A2"} // เลือกที่นั่งที่ต้องการจองในรอบที่สอง
	for _, seatNo := range seatNumbersForBookingRound2 {
		// ค้นหาที่นั่งในโรงภาพยนตร์ที่ถูกต้องและไม่ได้ถูกจองใน ShowTime นี้
		var seat entity.Seat
		if err := db.Where("seat_no = ? AND theater_id = ? AND id NOT IN (SELECT seat_id FROM bookings WHERE show_time_id = ?)", seatNo, theaters[0].ID, showTimes[1].ID).First(&seat).Error; err != nil {
			fmt.Printf("Error finding seat: %s\n", err)
			continue
		}

		// สร้างการจองสำหรับ ShowTime ที่ 2
		bookingRound2 := entity.Booking{
			MemberID:    Member2.ID,
			ShowTimeID:  showTimes[1].ID, // เชื่อมโยงกับ ShowTime ที่ 2
			SeatID:      seat.ID,
			TicketID:    tickets[1].ID, // เชื่อมโยงกับ Ticket ที่ 2
			BookingTime: time.Now(),
			Status:      "confirmed",
		}

		if err := db.Create(&bookingRound2).Error; err != nil {
			fmt.Printf("Error creating booking for round 2: %s\n", err)
		}

		// เพิ่ม BookSeat สำหรับการจองในรอบที่สอง
		bookSeatRound2 := entity.BookSeat{
			SeatID:    seat.ID,
			BookingID: bookingRound2.ID,
		}

		if err := db.Create(&bookSeatRound2).Error; err != nil {
			fmt.Printf("Error creating book seat for round 2: %s\n", err)
			continue
		}

		// อัปเดตสถานะที่นั่งหลังจากการจอง
		db.Model(&seat).Update("Status", "Booked")
	}

	fmt.Println("Database setup complete")
}
