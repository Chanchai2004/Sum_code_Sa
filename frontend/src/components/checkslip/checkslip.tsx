import React, { useEffect } from "react";

interface CheckSlipProps {
  file: File | null;
  totalPrice: number | null;
  onResult: (result: boolean) => void;
}

const CheckSlip: React.FC<CheckSlipProps> = ({ file, totalPrice, onResult }) => {
  useEffect(() => {
    const checkSlip = async () => {
      if (!file || totalPrice === null) {
        onResult(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file); // ในกรณีนี้ field ของไฟล์ใน formData ต้องตรงกับที่กำหนดใน multer
        formData.append("log", "true");
        formData.append("amount", String(totalPrice));

        const response = await fetch(`http://localhost:3000/proxy/slipok`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data && result.data.success) {
          onResult(true);
        } else {
          onResult(false);
        }
      } catch (err) {
        console.error("Error during slip check:", err);
        onResult(false);
      }
    };

    checkSlip();
  }, [file, totalPrice, onResult]);

  return null;
};
export default CheckSlip;

