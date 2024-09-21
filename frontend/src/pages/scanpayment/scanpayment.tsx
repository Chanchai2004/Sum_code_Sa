import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import CheckSlip from "../../components/checkslip/checkslip";
import {
  GetShowtimeById,
  GetMovieById,
  GetPaymentByTicketID,
  updateTicketStatus,
  updatePaymentStatus,
  saveSlipAndUpdateStatus,
} from "../../services/https/index";
import styles from "./ScanPayment.module.css";

const ScanPayment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedSeats, showtimeID, ticketID } = location.state || {};
  console.log("Received in ScanPayment: ", {
    selectedSeats,
    showtimeID,
    ticketID,
  });

  const [movieName, setMovieName] = useState<string>("Loading...");
  const [showDate, setShowDate] = useState<string>("Loading...");
  const [showTime, setShowTime] = useState<string>("Loading...");
  const [theaterID, setTheaterID] = useState<number | string>("Loading...");
  const [poster, setPoster] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState(600); // Time countdown in seconds
  const [files, setFiles] = useState<File | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [isCheckingSlip, setIsCheckingSlip] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<boolean | null>(null);
  const [timeUpPopup, setTimeUpPopup] = useState(false);

  useEffect(() => {
    if (showtimeID) {
      GetShowtimeById(showtimeID).then((showtime) => {
        if (showtime) {
          setShowDate(new Date(showtime.Showdate).toLocaleDateString());
          setShowTime(new Date(showtime.Showdate).toLocaleTimeString());
          setTheaterID(showtime.TheaterID || "Unknown");

          if (showtime.MovieID) {
            GetMovieById(showtime.MovieID).then((movie) => {
              if (movie) {
                setMovieName(movie.MovieName);
                setPoster(movie.Poster);
              }
            });
          }
        }
      });
    }

    if (ticketID) {
      GetPaymentByTicketID(ticketID)
        .then((payment) => {
          if (payment && payment.TotalPrice) {
            setTotalPrice(payment.TotalPrice);
          }
        })
        .catch((error) => {
          console.error("Error fetching payment:", error);
        });
    }
  }, [showtimeID, ticketID]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          handleTimeUp(); // Call the function to update status and show popup
          return 0;
        }
        return prevTime - 1;
      });
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

  const handleTimeUp = async () => {
    if (ticketID) {
      try {
        await updatePaymentStatus(ticketID, "unfinish");
        await updateTicketStatus(ticketID, "unfinish");
        setTimeUpPopup(true); // Show the time-up popup
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const handleCancelClick = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    try {
      if (ticketID) {
        await updatePaymentStatus(ticketID, "unfinish");
        await updateTicketStatus(ticketID, "unfinish");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const handleCloseCancelConfirmation = () => {
    setShowCancelConfirmation(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files[0]);
      setShowButtons(true);
    }
  };

  const handleReset = () => {
    setFiles(null);
    setShowButtons(false);
  };

  const handleSlipCheckResult = async (result: boolean) => {
  if (result && files) {
    try {
      const saveResult = await saveSlipAndUpdateStatus(
        ticketID,
        files,
        "Paid",   // Payment status
        "Booked"  // Ticket status set to "Booked"
      );
      if (saveResult.status) {
        setShowSuccessPopup(true);
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกการชำระเงิน");
      }
    } catch (error) {
      console.error("Error during saving payment:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกการชำระเงิน โปรดลองใหม่อีกครั้ง");
    }
  } else {
    alert("Slip ไม่ถูกต้อง กรุณาอัพโหลดสลิปใหม่");
  }

  setIsCheckingSlip(false);
};


  const handleSubmit = async () => {
    if (!files || !ticketID) {
      console.error("No file selected or ticket ID is missing");
      return;
    }

    setIsCheckingSlip(true);
  };

  const handleOkClick = () => {
    setShowSuccessPopup(false);
    navigate("/ticket", { state: { ticketID, selectedSeats } });
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Content ด้านบน */}
        <div className={styles.content}>
          <p>
            <img src={Poster || poster} alt="movie" className={styles.poster} />
          </p>
          <div className={styles.details}>
            <h1 className={styles.title}>{movieName}</h1>
            <div className={styles.info}>
              <p>
                <img src={IconDate} alt="date" className={styles.icon} />{" "}
                {showDate || "Loading..."}
              </p>
              <p>
                <img src={Icontime} alt="time" className={styles.icon} />{" "}
                {showTime || "Loading..."}
              </p>
              <p>
                <img src={Iconlo} alt="location" className={styles.icon} />{" "}
                Merje Cineplex
              </p>
              <h2>Theater {theaterID} </h2>
              <div className={styles.languages}>
                <p>
                  <img src={Iconsound} alt="sound" className={styles.icon} /> TH{" "}
                </p>
                <p>
                  <img src={Iconsub} alt="subtitle" className={styles.icon} />{" "}
                  ENG{" "}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content สำหรับ Select Seat และ Total */}
        <div className={styles.selectSeatContent}>
          <div className={styles.item}>
            <h3 className={styles.label}>Select Seat</h3>
            <div className={styles.innerContent}>
              <img src={Iconchair} alt="seat" className={styles.icon} />
              <span className={styles.text}>
                {selectedSeats && selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "No seats selected"}
              </span>
            </div>
          </div>
          <div className={styles.item}>
            <h3 className={styles.label}>Total</h3>
            <div className={styles.innerContent}>
              <img src={Iconcoin} alt="total" className={styles.icon} />
              <span className={styles.text}>
                {" "}
                {totalPrice !== 0 ? totalPrice : 0} THB
              </span>
            </div>
          </div>
        </div>

        {/* Content สำหรับ PromptPay QR Code */}
        <div className={styles.paymentContent}>
          <div className={styles.timeLeft}>
            <p>Time left to purchase</p>
            <div className={styles.timer}>{formatTime(timeLeft)}</div>
          </div>
          <img
            src={BGPromptPay}
            alt="PromptPay QR Code"
            className={styles.bgqrCode}
          />

          {/* แสดง PromptPay QR Code */}
          <div className={styles.qrCodeContent}>
            <div className={styles.qrCodeOverlay}>
              <PromptPayQRCode
                phoneNumber="0967360797"
                amount={totalPrice !== null ? totalPrice : undefined}
              />
            </div>
          </div>

          {/* Content สำหรับการอัปโหลดสลิปและการยกเลิก */}
          <div className={styles.buttonGroup}>
            <label htmlFor="file-upload" className={styles.button}>
              Upload Slip
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className={styles.fileInput}
            />
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>

          {/* การยืนยันการยกเลิก */}
          {showCancelConfirmation && (
            <div className={styles.confirmationOverlay}>
              <div className={styles.confirmationBox}>
                <p>คุณต้องการยกเลิกการชำระเงินและออกจากหน้านี้หรือไม่?</p>
                <div className={styles.confirmationButtons}>
                  <button
                    className={styles.button}
                    onClick={handleConfirmCancel}
                  >
                    ใช่
                  </button>
                  <button
                    className={styles.button}
                    onClick={handleCloseCancelConfirmation}
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Display uploaded slip */}
          {files && (
            <div className={styles.screenshotContainer}>
              <img
                src={URL.createObjectURL(files)}
                alt="Slip"
                className={styles.screenshot}
              />
            </div>
          )}

          {/* Confirm and Reset Buttons */}
          {showButtons && (
            <div className={styles.paymentButtonWrapper}>
              <button className={styles.button} onClick={handleReset}>
                Reset
              </button>
              <button className={styles.button} onClick={handleSubmit}>
                Confirm
              </button>
            </div>
          )}
        </div>

        {/* Render CheckSlip component only if isCheckingSlip is true */}
        {isCheckingSlip && (
          <CheckSlip
            file={files}
            totalPrice={totalPrice}
            onResult={handleSlipCheckResult}
          />
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className={styles.rewardPopupOverlay}>
            <div className={styles.rewardPopup}>
              <p className={styles.rewardPopupMessage}>Payment Successful!</p>
              <button
                className={styles.rewardPopupButton}
                onClick={handleOkClick}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Time Up Popup */}
        {timeUpPopup && (
          <div className={styles.rewardPopupOverlay}>
            <div className={styles.rewardPopup}>
              <p className={styles.rewardPopupMessage}>
                หมดเวลาในการชำระเงิน กรุณาทำรายการจองใหม่อีกครั้ง
              </p>
              <button
                className={styles.rewardPopupButton}
                onClick={handleConfirmCancel}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ScanPayment;
