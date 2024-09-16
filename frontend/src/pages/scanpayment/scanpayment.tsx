import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.tsx";
import Poster from "../../assets/poster.jpg";
import IconDate from "../../assets/icondate.png";
import Icontime from "../../assets/icontime.png";
import Iconlo from "../../assets/iconlo.png";
import Iconsound from "../../assets/iconsound.png";
import Iconsub from "../../assets/iconsub.png";
import Iconcoin from "../../assets/iconcoin.png";
import Iconchair from "../../assets/iconchair.png";
import BGPromptPay from "../../assets/bg-qrcode.jpg";
import PromptPayQRCode from "../../components/promptpayqrcode/promptpayqrcode.tsx";

const ScanPayment: React.FC = () => {
  const [showtimeID, setShowtimeID] = useState<number | null>(null);
  const [movieName, setMovieName] = useState<string>("");
  const [seatNo, setSeatNo] = useState<string[]>([]); // สำหรับข้อมูลที่นั่ง
  const [totalPrice, setTotalPrice] = useState<number>(0); // สำหรับข้อมูลราคาทั้งหมด
  const [ticketID, setTicketID] = useState<number | null>(null); // สำหรับ TicketID
  const [theaterID, setTheaterID] = useState<number | null>(null);
  const [Showdate, setShowdate] = useState<string>(""); // กำหนด state สำหรับ Showdate
  const [showTime, setShowTime] = useState<string>(""); // เก็บค่าเวลา

  useEffect(() => {
    // Fetch ข้อมูลจาก localStorage หรือ API
    localStorage.setItem("showtimeID", "1");
    localStorage.setItem("ticketID", "1");
    const storedShowtimeID = localStorage.getItem("showtimeID");
    const storedTheaterID = localStorage.getItem("theaterID");
    const storedSeatNo = JSON.parse(localStorage.getItem("seatNo") || "[]");
    const storedTotalPrice = localStorage.getItem("totalPrice");

    if (storedShowtimeID) {setShowtimeID(parseInt(storedShowtimeID));}
    if (storedTheaterID) { setTheaterID(parseInt(storedTheaterID)); }
    if (storedSeatNo) {setSeatNo(storedSeatNo);}
    if (storedTotalPrice) {setTotalPrice(parseFloat(storedTotalPrice));}

    // Fetch ชื่อภาพยนตร์และ Showdate จาก ShowTimeID
    if (showtimeID) { fetchMovieDetailsByShowtimeID(showtimeID);}}, [showtimeID]);

  // ฟังก์ชันดึงข้อมูลชื่อภาพยนตร์และ Showdate จาก ShowTimeID
  const fetchMovieDetailsByShowtimeID = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/showtimes/${id}`);
      const data = await response.json();
  
      console.log("Response Data:", data); // ตรวจสอบโครงสร้างข้อมูล
  
      if (response.ok) {
        if (data.Movie && data.Movie.MovieName) {
          setMovieName(data.Movie.MovieName); // แสดงชื่อภาพยนตร์จาก Movie.MovieName
  
          // แยกวันที่และเวลาออกจาก Showdate
          const ShowdateObj = new Date(data.Showdate);
          setShowdate(ShowdateObj.toLocaleDateString()); // แปลงวันที่
          setShowTime(ShowdateObj.toLocaleTimeString()); // แปลงเวลา
  
          setTheaterID(data.Theater.TheaterName); // แสดงชื่อโรงภาพยนตร์จาก Theater.TheaterName
        } else {
          console.error('Movie data not found in the response.');
        }
      } else {
        console.error('Error fetching movie details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };
  
  // ฟังก์ชันเพื่อดึงข้อมูลการจองที่นั่งและราคาจาก TicketID
const fetchSeatAndPriceByTicketID = async (id: number) => {
  try {
    // ดึงข้อมูลการจอง (Booking) จาก TicketID
    const bookingResponse = await fetch(`http://localhost:8000/api/bookings/${id}`);
    const bookingData = await bookingResponse.json();

    console.log("Booking Data:", bookingData);

    if (bookingResponse.ok) {
      setSeatNo(bookingData.seats || []); // ตั้งค่าที่นั่ง
    } else {
      console.error('Error fetching booking details:', bookingResponse.statusText);
    }

    // ดึงข้อมูลราคาทั้งหมด (TotalPrice) จาก TicketID
    const ticketResponse = await fetch(`http://localhost:8000/api/tickets/${id}`);
    const ticketData = await ticketResponse.json();

    console.log("Ticket Data:", ticketData);

    if (ticketResponse.ok) {
      setTotalPrice(ticketData.totalPrice || 0); // ตั้งค่าราคาทั้งหมด
    } else {
      console.error('Error fetching ticket details:', ticketResponse.statusText);
    }

  } catch (error) {
    console.error('Error fetching details:', error);
  }
};

useEffect(() => {
  // ดึง TicketID จาก localStorage
  const storedTicketID = localStorage.getItem("ticketID");

  if (storedTicketID) {
    const ticketID = parseInt(storedTicketID);
    setTicketID(ticketID);

    // ดึงข้อมูลที่นั่งและราคาตาม TicketID
    fetchSeatAndPriceByTicketID(ticketID);
  }
}, []);

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [files, setFiles] = useState<File | null>(null);
  const [slipOkData, setSlipOkData] = useState<any | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State สำหรับแสดงป็อปอัพ

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!files) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("files", files);

    try {
      const res = await fetch("https://api.slipok.com/api/line/apikey/27555", {
        method: "POST",
        headers: {
          "x-authorization": "SLIPOKM0Z75J5", // ใส่คีย์หรือ Token ที่ต้องการ
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to send a request");
      }

      const data = await res.json();
      setSlipOkData(data.data);
      console.log("Slipok data: ", data);

      if (data.data.success) {
        setShowSuccessPopup(true); // แสดงป็อปอัพเมื่อสำเร็จ
      } else {
        console.error("Slip validation failed");
      }
    } catch (error) {
      console.log("Error during fetching data: ", error);
    }
  };

  const handleOkClick = () => {
    setShowSuccessPopup(false); // ปิดป็อปอัพ
    navigate("/ticket"); // โยงไปหน้า Ticket
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {/* Content ด้านบน */}
        <div style={styles.content}>
          <p>
            <img src={Poster} alt="Inside Out 2" style={styles.poster} />
          </p>
          <div style={styles.details}>
            <h1 style={styles.title}>{movieName}</h1>
            <div style={styles.info}>
              <p>
                <img src={IconDate} alt="date" style={styles.icon} /> {Showdate || "Loading..."}
              </p>
              <p>
                <img src={Icontime} alt="time" style={styles.icon} /> {showTime || "Loading..."}
              </p>
              <p>
                <img src={Iconlo} alt="location" style={styles.icon} /> Merje
                Cineplex
              </p>
              <h2>{theaterID} </h2>
              <div style={styles.languages}>
                <p>
                  <img src={Iconsound} alt="sound" style={styles.icon} /> TH{" "}
                </p>
                <p>
                  <img src={Iconsub} alt="subtitle" style={styles.icon} /> ENG{" "}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content สำหรับ Select Seat และ Total */}
        <div style={styles.selectSeatContent}>
          <div style={styles.item}>
            <h3 style={styles.label}>Select Seat</h3>
            <div style={styles.innerContent}>
              <img src={Iconchair} alt="seat" style={styles.icon} />
              <span style={styles.text}>{seatNo.length > 0 ? seatNo.join(", ") : "No seats selected"} </span>
            </div>
          </div>
          <div style={styles.item}>
            <h3 style={styles.label}>Total</h3>
            <div style={styles.innerContent}>
              <img src={Iconcoin} alt="total" style={styles.icon} />
              <span style={styles.text}> {totalPrice} THB</span>
            </div>
          </div>
        </div>


        {/* Content สำหรับ PromptPay QR Code */}
        <div style={styles.paymentContent}>
          <div style={styles.timeLeft}>
            <p>Time left to purchase</p>
            <div style={styles.timer}>{formatTime(timeLeft)}</div>
          </div>
          <img
            src={BGPromptPay}
            alt="PromptPay QR Code"
            style={styles.bgqrCode}
          />

          {/* แสดง PromptPay QR Code */}
          <div style={styles.qrCodeContent}>
            <div style={styles.qrCodeOverlay}>
              <PromptPayQRCode phoneNumber="0967360797" amount={10} />{" "}
            </div>
          </div>

          {/* ปุ่ม Upload Slip และ Cancel */}
          <div style={styles.buttonGroup}>
            <label htmlFor="file-upload" style={styles.button}>
              Upload Slip
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={styles.fileInput} // ซ่อน input จริงๆ และใช้ label ในการแสดงผลแทน
            />
            <button
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={() => setFiles(null)}
            >
              Cancel
            </button>
          </div>

          {/* Display uploaded slip */}
          {files && (
            <div style={styles.screenshotContainer}>
              <img
                src={URL.createObjectURL(files)}
                alt="SCB Slip"
                style={styles.screenshot}
              />
            </div>
          )}

          {/* Confirm Button */}
          <div style={styles.paymentButtonWrapper}>
            <button style={styles.button} onClick={handleSubmit}>
              Confirm
            </button>
          </div>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div style={styles.popupOverlay}>
            <div style={styles.popup}>
              <p style={styles.popupMessage}>Payment Successful!</p>
              <button style={styles.popupButton} onClick={handleOkClick}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    width: "1520px",
    height: "100%", // Full height of the screen
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    paddingTop: "80px", // Adjust this based on your navbar height
    boxSizing: "border-box" as "border-box",
  },
  content: {
    display: "flex",
    backgroundColor: "#FFC700",
    padding: "20px",
    borderRadius: "20px",
    width: "70%",
    height: "auto",
    margin: "20px auto", // เพิ่ม margin ให้ห่างจาก content อื่น
    boxSizing: "border-box" as "border-box",
    justifyContent: "space-between", // จัดวาง content ให้ห่างกันในแนวนอน
  },
  selectSeatContent: {
    display: "flex",
    justifyContent: "space-between", // จัดวาง content ให้อยู่ห่างกันในแนวนอน
    alignItems: "center",
    backgroundColor: "#FFC700",
    padding: "20px",
    paddingLeft: "200px", // เพิ่ม padding ด้านซ้าย
    paddingRight: "200px", // เพิ่ม padding ด้านขวา
    borderRadius: "20px",
    width: "70%",
    height: "auto",
    margin: "20px auto", // เพิ่ม margin เพื่อเว้นขอบด้านบนและล่าง
    boxSizing: "border-box" as "border-box",
  },
  innerContent: {
    display: "flex",
    justifyContent: "flex-start", // Align items to the start (left)
    alignItems: "center", // Align items center vertically
    width: "100%",
  },
  poster: {
    width: "250px",
    height: "auto",
    marginRight: "20px",
    borderRadius: "10px",
    paddingLeft: "20%",
  },
  details: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "space-between",
    color: "#000",
    width: "100%",
    paddingLeft: "20%",
  },
  title: {
    fontSize: "30px",
    fontWeight: "bold" as "bold",
    paddingTop: "5%",
  },
  info: {
    fontSize: "20px",
    fontWeight: "bold" as "bold",
  },
  languages: {
    display: "flex",
    gap: "10px",
  },
  icon: {
    width: "25px", // Adjust size as needed
    marginRight: "8px",
    verticalAlign: "middle",
  },
  item: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
  },
  label: {
    fontSize: "20px",
    color: "#000",
    marginBottom: "10px",
    textAlign: "center" as "center", // จัดข้อความให้อยู่ตรงกลาง
  },
  text: {
    fontSize: "24px",
    fontWeight: "bold" as "bold",
    color: "#000",
  },
  paymentContent: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    backgroundColor: "#FFC700",
    padding: "30px",
    borderRadius: "20px",
    width: "70%",
    height: "auto",
    margin: "20px auto", // เพิ่ม margin เพื่อเว้นขอบด้านบนและล่าง
    boxSizing: "border-box" as "border-box",
    position: "relative" as "relative",
  },
  paymentSection: {
    display: "flex",
    flexDirection: "column" as "column", // Stack elements vertically
    alignItems: "center",
    width: "100%",
    position: "relative" as "relative",
  },
  bgqrCode: {
    width: "350px",
    height: "auto",
    borderRadius: "10px",
    marginTop: "70px", // ลดระยะห่างด้านบน
    marginBottom: "-50px", // ลดระยะห่างด้านล่าง
  },
  timeLeft: {
    position: "absolute" as "absolute",
    top: "10px",
    right: "10px",
    padding: "5px 10px",
    borderRadius: "10px",
    backgroundColor: "#FFC700",
    border: "2px solid #000", // Add border to the timer
    color: "#000",
    fontWeight: "bold" as "bold",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
  },
  timer: {
    fontSize: "30px",
    fontWeight: "bold" as "bold",
    marginTop: "-10px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px", // ลดระยะห่างระหว่างปุ่ม
    marginTop: "-20px", // ลดระยะห่างจาก QR Code
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center" as "center",
    display: "inline-block",
    marginBottom: "10px",
    minWidth: "120px", // กำหนดขนาดขั้นต่ำของปุ่ม
  },
  cancelButton: {
    backgroundColor: "#fff",
    color: "#000",
  },
  fileInput: {
    display: "none", // ซ่อน input ไฟล์
  },
  screenshotContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px", // เพิ่มระยะห่างจากปุ่ม Confirm
  },
  screenshot: {
    width: "300px",
    height: "auto",
    borderRadius: "10px",
  },
  paymentButtonWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px", // เพิ่มระยะห่างระหว่างสลิปและปุ่ม Confirm
  },
  qrCodeContent: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    backgroundColor: "#FFC700",
    padding: "30px",
    borderRadius: "20px",
    width: "70%",
    height: "auto",
    margin: "20px auto",
    boxSizing: "border-box" as "border-box",
    position: "relative" as "relative",
  },
  qrCodeOverlay: {
    position: "absolute" as "absolute",
    top: "-180px", // ปรับตามที่ต้องการ
    left: "50%", // ปรับตามที่ต้องการ
    transform: "translate(-50%, -50%)", // เพื่อให้ QR Code อยู่ตรงกลางภาพ
    width: "220px",
    height: "auto",
  },
  popupOverlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center" as "center",
  },
  popupMessage: {
    fontSize: "20px",
    marginBottom: "20px",
  },
  popupButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ScanPayment;
