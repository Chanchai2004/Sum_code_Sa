import { MoviesInterface } from './IMovie';
import { TheatersInterface } from './ITheater';


export interface ShowTimesInterface {
    ID?: number;
    Showdate: Date; // ใช้ Date เพราะ field นี้จัดการเวลา
    MovieID?: number; // เป็น optional เนื่องจากอาจจะยังไม่ได้กำหนด
    Movie?: MoviesInterface; // เชื่อมต่อกับ Movie
    TheaterID?: number; // เป็น optional เนื่องจากอาจจะยังไม่ได้กำหนด
    Theater?: TheatersInterface; // เชื่อมต่อกับ Theater
    //Tickets?: TicketsInterface[]; // Array ของ Tickets ซึ่งเชื่อมต่อกับ ShowTimes
  }
  