import React, { useImperativeHandle, forwardRef } from "react";

interface CheckSlipProps {
  file: File | null;
  totalPrice: number | null;
  onResult: (result: boolean) => void;
}

const CheckSlip = forwardRef((props: CheckSlipProps, ref) => {
  const checkSlip = async () => {
    const { file, totalPrice, onResult } = props;

    if (!file || totalPrice === null) {
      console.log("No file or totalPrice provided.");
      onResult(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("log", "true");
      formData.append("amount", String(totalPrice));

      console.log("Sending request with data:", { file, totalPrice });

      const response = await fetch(`http://localhost:3001/proxy/slipok`, {
        method: "POST",
        body: formData,
      });

      console.log("HTTP Status:", response.status);

      if (response.status === 200) {
        const result = await response.json();
        console.log("Response data:", result);
        onResult(true);
      } else if (response.status === 400) {
        const errorData = await response.json();
        console.log("Bad Request Error data:", errorData);
        onResult(false);
      } else {
        console.log("Unexpected Status Code:", response.status);
        onResult(false);
      }
    } catch (err) {
      console.error("Error during slip check:", err);
      onResult(false);
    }
  };

  useImperativeHandle(ref, () => ({
    checkSlip,
  }));

  return null;
});

export default CheckSlip;
