import React from "react";
import Navbar from "../../components/navbar/navbar";
import Poster from "../../assets/poster.jpg";
import ticket from "../../assets/ticket.png";
import TicketQRCode from "../../components/ticketqrcode/ticketqrcode"; // นำเข้า TicketQRCode

const Ticket: React.FC = () => {
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Purchase Complete</h1>
        <p style={styles.subtitle}>Show this ticket at cinema hall entrance</p>
        <div style={styles.ticketContainer}>
          <img src={ticket} alt="Ticket" style={styles.ticket} />
          <img src={Poster} alt="Poster" style={styles.poster} />
          <div style={styles.detailsContainer}>
            <div>
              <p style={styles.movieName}>INSIDE OUT2</p>
            </div>
            <div>
              <p style={styles.language}>TH</p>
              <p style={styles.sub}>ENG</p>
            </div>
            <div>
              <p style={styles.cinemaName}>Merje Cineplex</p>
              <p style={styles.theater}>1</p>
              <p style={styles.seatNumber}>D7, D8</p>
              <p style={styles.date}>25 Dec 2024</p>
              <p style={styles.time}>20.00</p>
              <p style={styles.price}>800 THB</p>
            </div>
            <div style={styles.qrCodeContainer}>
              <TicketQRCode /> {/* ใช้คอมโพเนนต์ TicketQRCode */}
            </div>
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button style={styles.button}>My Ticket</button>
          <button style={styles.button}>Home</button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    width: "1536px",
    height: "800px", // Full height of the screen
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    paddingTop: "60px", // Adjust this based on your navbar height
    boxSizing: "border-box" as "border-box",
  },
  title: {
    color: "#FFC700",
    fontSize: "36px",
    fontWeight: "bold" as "bold",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#FFC700",
    fontSize: "20px",
    marginBottom: "-30px",
  },
  ticketContainer: {
    display: "flex",
    flexDirection: "row" as "row", // ใช้ Flexbox ในการจัด layout
    alignItems: "center", // จัดให้อยู่ตรงกลางในแนวตั้ง
    justifyContent: "space-between", // กระจายพื้นที่เท่าๆ กัน
    width: "80%",
    maxWidth: "800px",
    marginBottom: "50px",
    position: "relative" as "relative",
  },
  ticket: {
    width: "100%",
    borderRadius: "20px",
  },
  poster: {
    position: "absolute" as "absolute",
    top: "92px", // ปรับตามที่คุณต้องการ
    left: "70px", // ปรับตามที่คุณต้องการ
    width: "180px",
    height: "auto",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column" as "column", // ใช้ Flexbox ในการจัด layout
    position: "absolute" as "absolute",
    top: "70px", // ปรับตามที่คุณต้องการ
    left: "300px", // ปรับตามที่คุณต้องการ
    color: "#ffc700",
    fontSize: "16px",
    fontWeight: "bold",
  },
  movieName: {
    fontSize: "18px",
    color: "#ffc700",
    textAlign: "left" as "left", // จัดข้อความชิดซ้าย
  },
  language: {
    fontSize: "14px",
    color: "#ffc700",
    textAlign: "left" as "left", // จัดข้อความชิดขวา
    marginTop: "-18px",
    marginLeft: "18px", // เพิ่มระยะห่างจากขอบขวา
  },
  sub: {
    fontSize: "14px",
    color: "#ffc700",
    textAlign: "left" as "left", // จัดข้อความชิดขวา
    marginTop: "-36px",
    marginLeft: "85px", // เพิ่มระยะห่างจากขอบขวา
  },
  cinemaName: {
    fontSize: "18px",
    color: "#ffc700",
    textAlign: "left" as "left", // จัดข้อความชิดซ้าย
    marginTop: "10px",
    marginLeft: "20px", // เพิ่มระยะห่างจากขอบซ้าย
  },
  theater: {
    fontSize: "16px",
    color: "#ffc700",
    marginTop: "35px",
    marginRight: "20px",
  },
  seatNumber: {
    fontSize: "16px",
    color: "#ffc700",
    textAlign: "right" as "right", // จัดข้อความชิดขวา
    marginTop: "-45px",
    marginRight: "-35px",
  },
  date: {
    fontSize: "16px",
    color: "#ffc700",
    textAlign: "left" as "left", // จัดข้อความชิดซ้าย
    marginTop: "30px",
  },
  time: {
    fontSize: "16px",
    color: "#ffc700",
    textAlign: "right" as "right", // จัดข้อความชิดขวา
    marginTop: "-40px",
    marginRight: "-30px", // เพิ่มระยะห่างจากขอบขวา
  },
  price: {
    fontSize: "18px",
    color: "#ffc700",
    textAlign: "left" as "left", // จัดข้อความตรงกลาง
    marginTop: "30px",
  },
  qrCodeContainer: {
    position: "absolute" as "absolute",
    top: "80px",
    left: "280px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "200px", // เพิ่มช่องว่างระหว่างปุ่ม
    marginTop: "-50px", // ขยับปุ่มขึ้นมา
    marginBottom: "50px",
  },
  button: {
    backgroundColor: "#FFC700",
    color: "#000",
    padding: "10px 20px",
    fontSize: "20px",
    fontWeight: "bold" as "bold",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    width: "150px", // กำหนดความกว้างให้เท่ากัน
    height: "50px", // กำหนดความสูงให้เท่ากัน
    textAlign: "center" as "center",
  },
};

export default Ticket;
