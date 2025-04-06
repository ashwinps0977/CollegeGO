import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaClock, FaBell, FaTicketAlt, FaEye } from "react-icons/fa";

const Student = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      fetchRequests(parsedUser.username);
      fetchNotifications(parsedUser.username);
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [navigate, location.pathname]);

  const fetchRequests = async (username) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/getUserRequests/${username}`);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (username) => {
    try {
      setNotificationsLoading(true);
      const response = await axios.get(`http://localhost:5001/getNotifications/${username}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleTakeTicket = (requestId) => {
    navigate(`/payment/${requestId}`);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const getStatusBadge = (request) => {
    if (request.finalApproval === "Approved") {
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <FaCheckCircle className="mr-1" /> Fully Approved
        </span>
      );
    } else if (request.status === "Approved" && request.finalApproval === "Pending") {
      return (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <FaClock className="mr-1" /> HOD Approved - Waiting for Warden
        </span>
      );
    } else if (request.status === "Rejected") {
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <FaTimesCircle className="mr-1" /> Rejected by HOD
        </span>
      );
    } else if (request.finalApproval === "Rejected") {
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <FaTimesCircle className="mr-1" /> Rejected by Warden
        </span>
      );
    } else {
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <FaClock className="mr-1" /> Pending HOD Approval
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">STUDENT DASHBOARD</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {userData && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {userData.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Branch: <span className="font-medium">{userData.branch}</span></p>
              <p className="text-gray-600">Semester: <span className="font-medium">{userData.semester}</span></p>
            </div>
            <div>
              <p className="text-gray-600">Username: <span className="font-medium">{userData.username}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center mb-4">
          <FaBell className="text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        {notificationsLoading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">No new notifications</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification._id || notification.createdAt} 
                className="p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <p className="font-medium text-gray-800">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
                {notification.requestDetails && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p><span className="font-medium">Purpose:</span> {notification.requestDetails.purpose}</p>
                    <p><span className="font-medium">Date:</span> {new Date(notification.requestDetails.date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Destination:</span> {notification.requestDetails.destination}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requests Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Your Movement Requests</h2>
        
        {loading ? (
          <p>Loading your requests...</p>
        ) : requests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">HOD Status</th>
                  <th className="p-3">Warden Status</th>
                  <th className="p-3">Overall Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{request.purpose}</td>
                    <td className="p-3">{request.destination}</td>
                    <td className="p-3">{new Date(request.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      {request.status === "Approved" ? (
                        <span className="text-green-600 font-semibold">Approved</span>
                      ) : request.status === "Rejected" ? (
                        <span className="text-red-600 font-semibold">Rejected</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="p-3">
                      {request.wardenApproval === "Approved" ? (
                        <span className="text-green-600 font-semibold">Approved</span>
                      ) : request.wardenApproval === "Rejected" ? (
                        <span className="text-red-600 font-semibold">Rejected</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="p-3">{getStatusBadge(request)}</td>
                    <td className="p-3">
                      {request.finalApproval === "Approved" && (
                        <>
                          {request.paymentStatus === "Paid" ? (
                            <button
                              onClick={() => navigate(`/ticket/${request._id}`)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center"
                            >
                              <FaEye className="mr-1" /> View Ticket
                            </button>
                          ) : (
                            <button
                              onClick={() => handleTakeTicket(request._id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                            >
                              <FaTicketAlt className="mr-1" /> Take Ticket
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;