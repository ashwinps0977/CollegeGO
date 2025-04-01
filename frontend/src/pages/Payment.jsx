import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const Payment = () => {
  const [formData, setFormData] = useState({
    name: "",
    route: "",
    date: "",
    rate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment processing...");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Header */}
      <div className="w-full bg-blue-600 p-4 flex justify-between items-center text-white">
        <div className="text-xl font-bold">LOGO</div>
        <div className="text-lg font-semibold">PAY ₹</div>
        <button className="bg-white text-black px-4 py-2 rounded-lg flex items-center">
          <FaArrowLeft className="mr-2" /> BACK
        </button>
      </div>

      {/* Payment Box */}
      <div className="bg-white p-8 rounded-lg shadow-lg mt-10 w-96">
        <h2 className="text-xl font-bold text-center mb-4">PAYMENT</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">NAME:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-gray-700">ROUTE:</label>
            <input type="text" name="route" value={formData.route} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-gray-700">DATE:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-gray-700">RATE:</label>
            <input type="number" name="rate" value={formData.rate} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <p className="text-center text-gray-500 text-sm">(DETAILS)</p>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
            PAY NOW
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;