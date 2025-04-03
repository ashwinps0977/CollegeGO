import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Payment = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      // Call your payment API endpoint
      const response = await axios.post(`http://localhost:5001/makePayment`, {
        requestId,
        amount: 100 // Example amount
      });
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/tick'), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Make Payment</h2>
      <p className="mb-4">Request ID: {requestId}</p>
      <p className="mb-4">Amount: ₹100</p>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Payment successful! Redirecting...</p>}
      
      <button
        onClick={handlePayment}
        disabled={loading || success}
        className={`w-full py-2 px-4 rounded-md text-white ${loading || success ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default Payment;