import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation } from "react-router-dom";

const Ticketbooking1 = () => {
  const location = useLocation();
  const [ticketData, setTicketData] = useState({
    name: "",
    department: "",
    semester: "",
    date: "",
    purpose: "",
    destination: ""
  });

  useEffect(() => {
    if (location.state?.ticketData) {
      setTicketData({
        name: location.state.ticketData.name,
        department: location.state.ticketData.department,
        semester: location.state.ticketData.semester,
        date: location.state.ticketData.date,
        purpose: location.state.ticketData.purpose,
        destination: location.state.ticketData.destination
      });
    }
  }, [location.state]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white w-80 p-6 rounded-lg shadow-lg border-2 border-gray-300">
        {/* Header */}
        <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg">
          <h1 className="text-xl font-bold">🚍 College GO</h1>
          <p className="text-xs">St. Joseph's College of Engineering and Technology, Palai</p>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-bold my-3">BUS TICKET</h2>

        {/* Ticket Information */}
        <div className="mb-4">
          <label className="font-semibold">NAME:</label>
          <div className="w-full border-b-2 border-black py-1">
            {ticketData.name}
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">DEPARTMENT:</label>
          <div className="w-full border-b-2 border-black py-1">
            {ticketData.department}
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">SEMESTER:</label>
          <div className="w-full border-b-2 border-black py-1">
            {ticketData.semester}
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">DATE:</label>
          <div className="w-full border-b-2 border-black py-1">
            {new Date(ticketData.date).toLocaleDateString()}
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">PURPOSE:</label>
          <div className="w-full border-b-2 border-black py-1">
            {ticketData.purpose}
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">DESTINATION:</label>
          <div className="w-full border-b-2 border-black py-1">
            {ticketData.destination}
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center mt-4">
          <QRCodeCanvas 
            value={JSON.stringify(ticketData)} 
            size={100} 
          />
          <p className="text-xs mt-2 text-gray-500">Scan this QR code for verification</p>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>This ticket is valid only for the specified date</p>
          <p className="mt-1">Present this ticket to the bus conductor</p>
        </div>
        <div className="bg-blue-500 h-2 mt-4 rounded-b-lg"></div>
      </div>
    </div>
  );
};

export default Ticketbooking1;