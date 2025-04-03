import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Warden1 = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch approved requests from the backend
  useEffect(() => {
    fetchApprovedRequests();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchApprovedRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5001/getApprovedRequestsHOD");
      setRequests(response.data);
    } catch (error) {
      console.error("❌ Error fetching approved requests:", error);
      setError("Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Final Approval with notification
  const handleFinalApproval = async (id) => {
    try {
      const requestToApprove = requests.find(req => req._id === id);
      if (!requestToApprove) {
        throw new Error("Request not found");
      }

      const response = await axios.put(`http://localhost:5001/finalApproveRequest/${id}`, { 
        action: "approve",
        notificationMessage: `YOUR REQUEST HAS BEEN APPROVED - ${requestToApprove.purpose.toUpperCase()} ON ${new Date(requestToApprove.date).toLocaleDateString()} - MAKE PAYMENT TO GRAB YOUR TICKET`,
        requestData: {
          purpose: requestToApprove.purpose,
          date: requestToApprove.date,
          destination: requestToApprove.destination
        }
      });
      
      // Optimistic UI update
      setRequests(prevRequests => prevRequests.filter(req => req._id !== id));
      
      if (response.data.sms?.sent) {
        alert(`✅ Request approved! Notification and SMS sent to ${requestToApprove.name}.`);
      } else if (response.data.sms?.error) {
        alert(`⚠️ Request approved but SMS failed to send to ${requestToApprove.name}: ${response.data.sms.error.message}`);
        console.error('SMS Error Details:', response.data.sms.error);
      } else {
        alert(`✅ Request approved successfully. Notification sent to ${requestToApprove.name}.`);
      }
    } catch (error) {
      console.error("❌ Approval Error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          error.message;
      alert(`Failed to approve request: ${errorMessage}`);
    }
  };

  // Handle Rejection
  const handleRejection = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5001/finalApproveRequest/${id}`, { 
        action: "reject" 
      });
      
      // Optimistic UI update
      setRequests(prevRequests => 
        prevRequests.filter(req => req._id !== id)
      );
      
      alert("Request has been rejected!");
    } catch (error) {
      console.error("❌ Error rejecting request:", error);
      alert("Failed to reject request. Please try again.");
    }
  };

  // Logout Function
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">WARDEN DASHBOARD</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Summary Box */}
      <div className="bg-blue-500 text-white p-4 rounded-lg text-center shadow-lg mb-6">
        <h2 className="text-xl font-bold">Pending Final Approvals</h2>
        <p className="text-3xl font-semibold">{requests.length}</p>
      </div>

      {/* Requests Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">HOD Approved Requests (Pending Final Approval)</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchApprovedRequests}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-200">
                {["ID", "Name", "Branch", "Purpose", "Destination", "Date", "Status", "Actions"].map((header) => (
                  <th key={header} className="p-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-600">{req._id.substring(18, 24)}...</td>
                    <td className="p-3">{req.name}</td>
                    <td className="p-3">{req.branch}</td>
                    <td className="p-3">{req.purpose}</td>
                    <td className="p-3">{req.destination}</td>
                    <td className="p-3">{new Date(req.date).toLocaleDateString()}</td>
                    <td className="p-3 font-semibold text-green-600">HOD Approved</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFinalApproval(req._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-green-600 transition"
                          aria-label="Final Approve Request"
                        >
                          <FaCheckCircle /> <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejection(req._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-red-600 transition"
                          aria-label="Reject Request"
                        >
                          <FaTimesCircle /> <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-3 text-center text-gray-600">
                    No pending requests for final approval
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Warden1;