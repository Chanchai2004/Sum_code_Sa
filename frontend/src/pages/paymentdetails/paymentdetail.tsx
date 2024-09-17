import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom"; // Use `useLocation` to get the state
import Navbar from "../../components/navbar/navbar";
import Poster from "../../assets/poster.jpg";
import IconDate from "../../assets/icondate.png";
import Icontime from "../../assets/icontime.png";
import Iconlo from "../../assets/iconlo.png";
import Iconsound from "../../assets/iconsound.png";
import Iconsub from "../../assets/iconsub.png";
import Iconcoupon from "../../assets/iconcoupon.png";
import Iconcoin from "../../assets/iconcoin.png";
import Iconchair from "../../assets/iconchair.png";
import PromptPayLogo from "../../assets/promptpaylogo.png";

const PaymentDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ใช้ `useLocation` เพื่อดึง state จาก SeatMap

  // รับค่า totalPrice, selectedSeats, ticketID, และ showtimeID จาก state ที่ส่งมาจาก SeatMap
  const { totalPrice, selectedSeats, ticketID, showtimeID } = location.state || {};


  const [movieName, setMovieName] = useState<string>("");
  const [theaterID, setTheaterID] = useState<number | null>(null);
  const [showDate, setShowDate] = useState<string>(""); // กำหนด state สำหรับ ShowDate
  const [showTime, setShowTime] = useState<string>(""); // เก็บค่าเวลา


  useEffect(() => {
    // ถ้ามี showtimeID ให้ทำการ fetch ข้อมูลภาพยนตร์
    if (showtimeID) {
      fetchMovieDetailsByShowtimeID(showtimeID);
    } else {
      console.error("Showtime ID not found");
    }
  }, [showtimeID]);

  // ฟังก์ชันดึงข้อมูลชื่อภาพยนตร์และ ShowDate จาก showtimeID
  const fetchMovieDetailsByShowtimeID = async (id: number) => {
    try {
      console.log("Fetching details for Showtime ID:", id);
      const response = await fetch(`http://localhost:8000/api/showtimes/${id}`);
      const responseData = await response.json();

      if (response.ok) {
        console.log("Ticket ID:", ticketID, "Showtime ID:", showtimeID, "Selected Seats:", selectedSeats, "Total Price:", totalPrice);
        const data = responseData.data;
        if (data.Movie && data.Movie.MovieName) {
          setMovieName(data.Movie.MovieName);
          const showDateObj = new Date(data.ShowDate);
          setShowDate(showDateObj.toLocaleDateString());
          setShowTime(showDateObj.toLocaleTimeString());
          setTheaterID(data.Theater?.TheaterName || "Unknown Theater");
        } else {
          console.error("Movie data not found in the response.");
        }
      } else {
        console.error("Error fetching movie details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const [selectedCoupon, setSelectedCoupon] = useState("");

  const handleCouponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCoupon(e.target.value);
  };

  const handleCancel = () => {
    setSelectedCoupon(""); // Reset the selected coupon value
  };

  const handleConfirm = () => {
    navigate("/scanpayment"); // Navigate to ScanPayment page
  };

  useEffect(() => {
    navigate("/paymentdetail");
    
  }, [totalPrice, selectedSeats, ticketID, navigate]);
  

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
                <img src={IconDate} alt="date" style={styles.icon} /> {showDate || "Loading..."}
              </p>
              <p>
                <img src={Icontime} alt="time" style={styles.icon} /> {showTime || "Loading..."}
              </p>
              <p>
                <img src={Iconlo} alt="location" style={styles.icon} /> Merje Cineplex
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
              <span style={styles.text}>{selectedSeats && selectedSeats.length > 0 ? selectedSeats.join(", ") : "No seats selected"}</span>

            </div>
          </div>
          <div style={styles.item}>
            <h3 style={styles.label}>Total</h3>
            <div style={styles.innerContent}>
              <img src={Iconcoin} alt="total" style={styles.icon} />
              <span style={styles.text}> {totalPrice ? `${totalPrice} THB` : "THB"}</span>
            </div>
          </div>
        </div>

        {/* Content สำหรับ Select Coupon และ Payment Method */}
        <div style={styles.contentColumn}>
          <div style={styles.fullWidth}>
            <h3 style={styles.label}>Select Coupon</h3>
            <div style={styles.couponContent}>
              <img src={Iconcoupon} alt="coupon" style={styles.icon} />
              <select
                style={styles.select}
                value={selectedCoupon}
                onChange={handleCouponChange}
              >
                <option value="">Select Coupon</option>
                <option value="discount50">Discount 50THB</option>
                <option value="discount100">Discount 100THB</option>
              </select>
              <div style={styles.buttonGroup}>
                <button style={styles.button}>Apply</button>
                <button style={styles.cancelbutton} onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div style={styles.fullWidth}>
            <h3 style={styles.label}>Select Payment Method</h3>
            <div style={styles.paymentContent}>
              <button style={styles.promptPayButton}>
                <img
                  src={PromptPayLogo}
                  alt="PromptPay"
                  style={styles.promptPayLogo}
                />
              </button>
            </div>
            <div style={styles.paymentButtonWrapper}>
              <button style={styles.confirmButton} onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const styles = {
  container: {
    width: "1520px",
    height: "100%",
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    paddingTop: "80px",
    boxSizing: "border-box" as "border-box",
  },
  content: {
    display: "flex",
    backgroundColor: "#FFC700",
    padding: "20px",
    borderRadius: "20px",
    width: "70%",
    height: "auto",
    margin: "50px auto",
    boxSizing: "border-box" as "border-box",
    justifyContent: "space-between",
  },
  selectSeatContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFC700",
    padding: "20px",
    paddingLeft: "200px",
    paddingRight: "200px",
    borderRadius: "20px",
    width: "70%",
    height: "auto",
    margin: "20px auto",
    boxSizing: "border-box" as "border-box",
  },
  innerContent: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  contentColumn: {
    display: "flex",
    backgroundColor: "#FFC700",
    padding: "20px",
    borderRadius: "20px",
    width: "70%",
    height: "auto",
    margin: "20px auto",
    boxSizing: "border-box" as "border-box",
    flexDirection: "column" as "column",
  },
  fullWidth: {
    width: "100%",
    marginBottom: "70px",
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
    width: "25px",
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
    textAlign: "center" as "center",
  },
  text: {
    fontSize: "24px",
    fontWeight: "bold" as "bold",
    color: "#000",
  },
  couponContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "30px",
  },
  buttonGroup: {
    display: "flex",
    gap: "30px",
  },
  paymentContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30px",
  },
  paymentButtonWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  select: {
    padding: "5px 10px",
    fontSize: "20px",
    aligntext: "center",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelbutton: {
    backgroundColor: "#fff",
    color: "#000",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  promptPayLogo: {
    width: "150px",
    height: "auto",
  },
  promptPayButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0",
  },
  confirmButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PaymentDetail;


//hello onnieeeee  222222