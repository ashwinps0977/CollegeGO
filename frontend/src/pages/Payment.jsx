import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaCreditCard, FaCheckCircle, FaSpinner } from "react-icons/fa";

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
        setTimeout(() => navigate('/tick', { 
          state: { ticketData: response.data.ticketData } 
        }), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCreditCard className="text-blue-500 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Complete Your Payment</h2>
        <p className="text-gray-500 mt-1">Secure transaction powered by our payment gateway</p>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Request ID:</span>
          <span className="font-medium text-gray-800">{requestId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount:</span>
          <span className="text-xl font-bold text-blue-600">₹100.00</span>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 rounded-lg border border-red-100 flex items-center">
          <div className="text-red-500 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center animate-pulse">
          <FaCheckCircle className="text-green-500 mr-2 text-xl" />
          <p className="text-green-600 font-medium">Payment successful! Redirecting...</p>
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={loading || success}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center ${
          loading || success 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
        }`}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Processing Payment...
          </>
        ) : success ? (
          <>
            <FaCheckCircle className="mr-2" />
            Payment Completed
          </>
        ) : (
          'Pay Now'
        )}
      </button>
      
      <div className="mt-6 text-center text-xs text-gray-400">
        <p>Your payment is secured with 256-bit SSL encryption</p>
        <div className="flex justify-center space-x-4 mt-2">
          <span>VISA</span>
          <span>Mastercard</span>
          <span>UPI</span>
          <span>NetBanking</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;