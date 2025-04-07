import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Warden1 = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Route protection - check if user is logged in
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    }
  }, [navigate]);

  // Fetch requests from the backend
  useEffect(() => {
    fetchRequests();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all requests that have been approved by HOD (both pending and finalized)
      const response = await axios.get("http://localhost:5001/getAllWardenRequests");
      
      if (response.data && Array.isArray(response.data)) {
        setAllRequests(response.data);
        
        // Categorize requests
        setApprovedRequests(response.data.filter(req => req.finalApproval === "Approved"));
        setRejectedRequests(response.data.filter(req => req.finalApproval === "Rejected"));
        setPendingRequests(response.data.filter(req => req.finalApproval === "Pending"));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
      setError("Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Final Approval with notification
  const handleFinalApproval = async (id) => {
    try {
      const requestToApprove = allRequests.find(req => req._id === id);
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
      setPendingRequests(prev => prev.filter(req => req._id !== id));
      setApprovedRequests(prev => [...prev, {...requestToApprove, finalApproval: "Approved"}]);
      
      if (response.data.sms?.sent) {
        setNotification({
          message: `Request approved! Notification and SMS sent to ${requestToApprove.name}.`,
          type: "success",
          requestId: id,
          studentName: requestToApprove.name
        });
      } else if (response.data.sms?.error) {
        setNotification({
          message: `Request approved but SMS failed to send to ${requestToApprove.name}`,
          type: "warning",
          requestId: id,
          studentName: requestToApprove.name
        });
        console.error('SMS Error Details:', response.data.sms.error);
      } else {
        setNotification({
          message: `Request approved successfully. Notification sent to ${requestToApprove.name}.`,
          type: "success",
          requestId: id,
          studentName: requestToApprove.name
        });
      }

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);

    } catch (error) {
      console.error("❌ Approval Error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          error.message;
      setError(`Failed to approve request: ${errorMessage}`);
    }
  };

  // Handle Rejection
  const handleRejection = async (id) => {
    try {
      const requestToReject = allRequests.find(req => req._id === id);
      if (!requestToReject) {
        throw new Error("Request not found");
      }

      const response = await axios.put(`http://localhost:5001/finalApproveRequest/${id}`, { 
        action: "reject" 
      });
      
      // Optimistic UI update
      setPendingRequests(prev => prev.filter(req => req._id !== id));
      setRejectedRequests(prev => [...prev, {...requestToReject, finalApproval: "Rejected"}]);
      
      setNotification({
        message: `Request from ${requestToReject.name} has been rejected!`,
        type: "info",
        requestId: id,
        studentName: requestToReject.name
      });

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);

    } catch (error) {
      console.error("❌ Error rejecting request:", error);
      setError("Failed to reject request. Please try again.");
    }
  };

  // Logout Function
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const getFilteredRequests = () => {
    switch (filter) {
      case "approved":
        return approvedRequests;
      case "rejected":
        return rejectedRequests;
      case "pending":
        return pendingRequests;
      default:
        return pendingRequests;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">WARDEN DASHBOARD</h1>
        
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === "success" ? "bg-green-500" : 
          notification.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
        } text-white`}>
          <div className="flex items-center">
            {notification.type === "success" ? (
              <FaCheckCircle className="mr-2" />
            ) : (
              <FaTimesCircle className="mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
          <div className="text-sm mt-1">
            Student: {notification.studentName} | ID: {notification.requestId.substring(18, 24)}...
          </div>
        </div>
      )}

      {/* Error Message Display */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <FaTimesCircle className="mr-2" />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Summary Boxes */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div 
          onClick={() => setFilter("approved")}
          className={`bg-green-500 text-white p-4 rounded-lg text-center shadow-lg cursor-pointer transition hover:bg-green-600 ${
            filter === "approved" ? "ring-4 ring-green-300" : ""
          }`}
        >
          <h2 className="text-xl font-bold">Approved Requests</h2>
          <p className="text-3xl font-semibold">{approvedRequests.length}</p>
        </div>
        <div 
          onClick={() => setFilter("pending")}
          className={`bg-yellow-500 text-white p-4 rounded-lg text-center shadow-lg cursor-pointer transition hover:bg-yellow-600 ${
            filter === "pending" ? "ring-4 ring-yellow-300" : ""
          }`}
        >
          <h2 className="text-xl font-bold">Pending Requests</h2>
          <p className="text-3xl font-semibold">{pendingRequests.length}</p>
        </div>
        <div 
          onClick={() => setFilter("rejected")}
          className={`bg-red-500 text-white p-4 rounded-lg text-center shadow-lg cursor-pointer transition hover:bg-red-600 ${
            filter === "rejected" ? "ring-4 ring-red-300" : ""
          }`}
        >
          <h2 className="text-xl font-bold">Rejected Requests</h2>
          <p className="text-3xl font-semibold">{rejectedRequests.length}</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {filter === "pending" ? "Pending" : filter.charAt(0).toUpperCase() + filter.slice(1)} 
            Final Approvals
          </h3>
          {filter !== "pending" && (
            <button 
              onClick={() => setFilter("pending")}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
            >
              Show Pending Requests
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchRequests}
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
              {getFilteredRequests().length > 0 ? (
                getFilteredRequests().map((req) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-600">{req._id.substring(18, 24)}...</td>
                    <td className="p-3">{req.name}</td>
                    <td className="p-3">{req.branch}</td>
                    <td className="p-3">{req.purpose}</td>
                    <td className="p-3">{req.destination}</td>
                    <td className="p-3">{new Date(req.date).toLocaleDateString()}</td>
                    <td className={`p-3 font-semibold ${
                      req.finalApproval === "Approved" ? "text-green-600" : 
                      req.finalApproval === "Rejected" ? "text-red-600" : 
                      "text-yellow-600"
                    }`}>
                      {req.finalApproval === "Approved" ? "Warden Approved" : 
                       req.finalApproval === "Rejected" ? "Warden Rejected" : 
                       "HOD Approved"}
                    </td>
                    <td className="p-3">
                      {req.finalApproval === "Pending" && (
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
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-3 text-center text-gray-600">
                    No {filter === "pending" ? "pending" : filter} requests found
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