package entity

import "gorm.io/gorm"

type Seat struct {
   gorm.Model
   Price     int
   Status    string
   SeatNo    string

   //FK
   TheaterID *uint
   Theater  Theater `gorm:"foreignKey:TheaterID"`


}
