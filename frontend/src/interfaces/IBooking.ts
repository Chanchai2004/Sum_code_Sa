// IBooking.ts
export interface IBooking {
    id: number;           // ID ของการจอง
    showTimeID: number;    // ID ของรอบฉายหนัง
    theaterID: number;     // ID ของโรงภาพยนตร์
    seatID: number;        // ID ของที่นั่งที่จอง
    memberID: number;      // ID ของสมาชิกที่จอง
    ticketID: number;      // ID ของตั๋ว
    bookingTime: string;   // เวลาที่ทำการจอง
    status: string;        // สถานะการจอง (เช่น "confirmed", "pending")
  }
  
  // Interface สำหรับการจองที่นั่งใหม่
  export interface INewBooking {
    showTimeID: number;    // ID ของรอบฉายหนังที่เลือก
    theaterID: number;     // ID ของโรงภาพยนตร์ที่เลือก
    seatIDs: number[];     // รายการของที่นั่งที่จอง (มีได้หลายที่นั่ง)
    memberID: number;      // ID ของสมาชิกที่ทำการจอง
  }
  
  // Interface สำหรับการยืนยันการจอง
  export interface IBookingResponse {
    success: boolean;      // ผลลัพธ์การจอง
    message: string;       // ข
  }