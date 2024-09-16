export interface MoviesInterface {
  ID?: number;            // รหัสหนัง (optional)
  MovieName: string;       // ชื่อหนัง
  MovieDuration: number;   // ระยะเวลาของหนังเป็นหน่วยนาที (number)
  MovieType?: string;      // ประเภทหนัง (optional)
  Director?: string;       // ชื่อผู้กำกับ (optional)
  Actor?: string;          // ชื่อนักแสดง (optional)
  Synopsis?: string;       // เรื่องย่อของหนัง (optional)
  ReleaseDate?: string;      // วันที่ฉาย (optional)
  Poster?: File | Blob;  // สามารถเป็นไฟล์หรือ URL ได้ (ขึ้นอยู่กับการใช้งานใน frontend/backend)
}
