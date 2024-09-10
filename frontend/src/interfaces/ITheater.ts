export interface TheatersInterface {
    ID?: number; // ใช้เป็น optional เพราะมันอาจยังไม่ได้รับค่าจนกว่าจะถูกสร้างในฐานข้อมูล
    TheaterName: string; // เป็นฟิลด์ที่จำเป็น เพราะในโครงสร้าง Theater ของคุณไม่ได้ระบุว่าเป็น optional
    CreatedAt?: Date; // ฟิลด์นี้จะมีอยู่ใน gorm.Model ดังนั้นคุณอาจต้องการเก็บข้อมูลนี้ไว้
    UpdatedAt?: Date; // ฟิลด์นี้จะมีอยู่ใน gorm.Model เช่นกัน
    DeletedAt?: Date | null; // ฟิลด์นี้ใช้สำหรับ soft delete, อาจเป็น null ได้
  }
  