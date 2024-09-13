import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentDetail from '../pages/paymentdetails/paymentdetail';
import ScanPayment from '../pages/scanpayment/scanpayment';
import Ticket from '../pages/ticket/ticket';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PaymentDetail />} />
      <Route path="/scanpayment" element={<ScanPayment />} />
      <Route path="/ticket" element={<Ticket />} />
    </Routes>
  );
};

export default AppRoutes;
