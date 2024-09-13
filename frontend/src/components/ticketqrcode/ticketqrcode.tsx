import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // ใช้ named import จาก qrcode.react

const TicketQRCode: React.FC = () => {
  const text = "8"; // ใส่ข้อความที่ต้องการสร้าง QR Code

  return (
    <div style={styles.qrContainer}>
      <QRCodeCanvas value={text} size={150} level={"H"} includeMargin={true} />
    </div>
  );
};

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
