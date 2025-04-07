import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useParams, useNavigate } from "react-router-dom";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import axios from 'axios';

const Ticketbooking1 = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [ticketData, setTicketData] = useState({
    name: "",
    department: "",
    semester: "",
    date: "",
    purpose: "",
    destination: "",
    ticketId: "",
    verificationCode: "",
    timestamp: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        if (!ticketId) {
          console.error("Ticket ID parameter is missing");
          throw new Error("Ticket ID is missing");
        }

        console.log(`Fetching ticket data for ID: ${ticketId}`);
        const response = await axios.get(`http://localhost:5001/getTicket/${ticketId}`);
        
        console.log("Ticket API response:", response.data);
        if (!response.data.success) {
          throw new Error(response.data.error || "Ticket data not found");
        }

        const { ticketData } = response.data;
        if (!ticketData) {
          throw new Error("Ticket data not found in response");
        }

        console.log("Ticket date from backend:", ticketData.date);
        console.log("Parsed ticket date:", new Date(ticketData.date));
        console.log("Current date:", new Date());

        setTicketData({
          name: ticketData.name,
          department: ticketData.department,
          semester: ticketData.semester,
          date: ticketData.date,
          purpose: ticketData.purpose,
          destination: ticketData.destination,
          ticketId: ticketData.ticketId,
          verificationCode: ticketData.verificationCode,
          timestamp: ticketData.timestamp
        });
      } catch (err) {
        console.error("Error fetching ticket data:", err);
        setError(err.response?.data?.error || err.message || "Failed to load ticket data");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [ticketId]);

  const isTicketValid = () => {
    if (!ticketData.date) return false;
    
    // Create date objects and set to same time (midnight) to compare only dates
    const ticketDate = new Date(ticketData.date);
    const today = new Date();
    
    // Normalize both dates to midnight for accurate comparison
    ticketDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return ticketDate.getTime() === today.getTime();
  };

  const downloadTicket = () => {
    if (!ticketRef.current) return;

    import('html2canvas').then((html2canvas) => {
      html2canvas.default(ticketRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BusTicket-${ticketData.name}-${new Date(ticketData.date).toLocaleDateString()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  };

  const generateQRData = () => {
    return JSON.stringify({
      ticketId: ticketData.ticketId,
      name: ticketData.name,
      department: ticketData.department,
      date: ticketData.date,
      purpose: ticketData.purpose,
      destination: ticketData.destination,
      timestamp: ticketData.timestamp,
      verificationCode: ticketData.verificationCode
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="text-center">Loading ticket information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Ticket</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-200 p-4">
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div 
        ref={ticketRef}
        className="bg-white w-full max-w-xs rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden"
      >
        <div className="bg-blue-600 text-white text-center py-3">
          <h1 className="text-lg font-bold">🚍 College GO</h1>
          <p className="text-xs">St. Joseph's College of Engineering and Technology</p>
        </div>

        <h2 className="text-center text-md font-bold my-3">BUS TICKET</h2>

        <div className="px-4 space-y-3 mb-4">
          {[
            { label: "NAME", value: ticketData.name },
            { label: "DEPARTMENT", value: ticketData.department },
            { label: "SEMESTER", value: ticketData.semester },
            { label: "DATE", value: ticketData.date ? new Date(ticketData.date).toLocaleDateString() : '' },
            { label: "PURPOSE", value: ticketData.purpose },
            { label: "DESTINATION", value: ticketData.destination }
          ].map((field, index) => (
            <div key={index}>
              <label className="font-semibold text-sm">{field.label}:</label>
              <div className="w-full border-b border-gray-300 py-1 text-sm">
                {field.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center px-4 pb-4">
          <QRCodeCanvas 
            value={generateQRData()} 
            size={120}
            level="H"
            includeMargin={true}
            className="border border-gray-200 p-1"
          />
          <p className="text-xs mt-2 text-gray-500 text-center">
            Scan this QR code for verification
          </p>
          <p className="text-xxs text-gray-400 mt-1 text-center">
            Ticket ID: {ticketData.ticketId}
          </p>
          
          <div className="mt-4 w-full">
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              <p className="text-sm font-semibold text-gray-700 mb-1">VERIFICATION CODE</p>
              <p className="text-2xl font-bold text-blue-600 tracking-wider">
                {ticketData.verificationCode}
              </p>
            </div>
          </div>
        </div>

        <div className={`text-white text-center py-2 text-xs ${isTicketValid() ? 'bg-green-600' : 'bg-red-600'}`}>
          {isTicketValid() ? (
            `Valid for ${new Date(ticketData.date).toLocaleDateString()}`
          ) : (
            'EXPIRED - Not valid for today'
          )}
        </div>
      </div>

      <button
        onClick={downloadTicket}
        className="mt-6 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-colors"
      >
        <FaDownload className="mr-2" />
        Download Ticket
      </button>
    </div>
  );
};

export default Ticketbooking1;