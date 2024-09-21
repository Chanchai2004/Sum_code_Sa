import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // ใช้ named import จาก qrcode.react

// อินเตอร์เฟสที่กำหนด props ที่จะถูกส่งเข้ามาในคอมโพเนนต์
interface TicketQRCodeProps {
  ticketID: string; // รับค่า ticketID เป็น prop
}

const TicketQRCode: React.FC<TicketQRCodeProps> = ({ ticketID }) => {
  // แปลงค่า ticketID ให้เป็น string เพื่อความแน่ใจว่าค่าที่ส่งไปเป็น string แน่นอน
  const ticketIDString = String(ticketID);

  // แสดงค่า ticketIDString ใน console เพื่อการตรวจสอบ
  console.log("Received in QR-CODE :", ticketIDString);

  // ใช้ ticketIDString แทนที่ text เพื่อสร้าง QR code
  return (
    <div style={styles.qrContainer}>
      <QRCodeCanvas
        value={ticketIDString}  // ใช้ ticketIDString แทน text
        size={150}
        level={"H"}
        marginSize={4}
      />
    </div>
  );
};

// สไตล์ที่ใช้ในคอมโพเนนต์
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "10px",
  },
  qrContainer: {
    marginTop: "20px",
  },
};

export default TicketQRCode;
