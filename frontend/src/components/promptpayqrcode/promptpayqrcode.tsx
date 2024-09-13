import React from "react";

interface PromptPayQRCodeProps {
  phoneNumber: string;
  amount?: number;
}

const PromptPayQRCode: React.FC<PromptPayQRCodeProps> = ({
  phoneNumber,
  amount,
}) => {
  const ppUrl = `https://promptpay.io/${phoneNumber}.png${
    amount ? `/${amount}` : ""
  }`;

  return (
    <div>
      <img src={ppUrl} alt="PromptPay QR Code" />
    </div>
  );
};

export default PromptPayQRCode;
