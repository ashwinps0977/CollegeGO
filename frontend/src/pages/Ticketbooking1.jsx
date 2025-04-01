import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Ticketbooking1 = () => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    semester: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white w-80 p-6 rounded-lg shadow-lg border-2 border-gray-300">
        {/* Header */}
        <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg">
          <h1 className="text-xl font-bold">🚍 College GO</h1>
          <p className="text-xs">St. Joseph's College of Engineering and Technology, Palai</p>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-bold my-3">BUS ROUTE</h2>

        {/* Form Fields */}
        <div className="mb-4">
          <label className="font-semibold">NAME:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border-b-2 border-black outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">DEPARTMENT:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border-b-2 border-black outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">SEMESTER:</label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full border-b-2 border-black outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">DATE:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border-b-2 border-black outline-none"
          />
        </div>

        {/* QR Code */}
        <div className="flex justify-center mt-4">
          <QRCodeCanvas value={JSON.stringify(formData)} size={100} />
        </div>

        {/* Footer */}
        <div className="bg-blue-500 h-2 mt-4 rounded-b-lg"></div>
      </div>
    </div>
  );
};

export default Ticketbooking1;
