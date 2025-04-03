import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCheckCircle, FaTimesCircle, FaTicketAlt } from "react-icons/fa";

const Profile1 = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    branch: "",
    semester: "",
    email: "",
    mobile: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        
        if (!storedUser || !storedUser.username) {
          throw new Error("No user session found");
        }

        // Fetch user data
        const userResponse = await axios.get(`http://localhost:5001/getUser/${storedUser.username}`);
        
        if (userResponse.data) {
          setUser({
            name: userResponse.data.name || "",
            username: userResponse.data.username || "",
            branch: userResponse.data.branch || "",
            semester: userResponse.data.semester || "",
            email: userResponse.data.email || "",
            mobile: userResponse.data.mobile || "",
            role: userResponse.data.role || "Student"
          });
          
          // Fetch approved requests for this user
          try {
            const requestsResponse = await axios.get(`http://localhost:5001/getUserRequests/${storedUser.username}`);
            setApprovedRequests(requestsResponse.data || []);
          } catch (err) {
            console.error("Error fetching requests:", err);
            setApprovedRequests([]);
          }

          // Handle notifications
          if (userResponse.data.notifications?.length > 0) {
            const sortedNotifications = [...userResponse.data.notifications].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotifications(sortedNotifications);
          } else {
            setNotifications([]);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.response?.data?.error || error.message || "Failed to load profile");
        navigate("/loginpage");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5001/updateUser/${user.username}`, {
        name: user.name,
        email: user.email,
        mobile: user.mobile
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{user.name}'s Profile</h2>
        <p className="text-gray-600">Role: {user.role}</p>
      </div>

      {/* Approved Requests Section */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Approved Requests</h3>
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading requests...</p>
        ) : approvedRequests.length > 0 ? (
          <div className="space-y-3">
            {approvedRequests.map((request) => (
              <div key={request._id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{request.purpose}</p>
                    <p className="text-sm">Destination: {request.destination}</p>
                    <p className="text-sm">Date: {new Date(request.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      request.finalApproval === "Approved" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {request.finalApproval === "Approved" ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
                
                {/* Add Take Ticket button for approved requests */}
                {request.finalApproval === "Approved" && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => navigate(`/payment/${request._id}`)}
                      className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <FaTicketAlt className="mr-2" />
                      Take Ticket
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No approved requests yet</p>
        )}
      </div>

      {/* Notifications Section */}
      <div className="border-b pb-4 mb-4">
        <div className="flex items-center mb-3">
          <FaBell className="text-blue-500 mr-2" />
          <h3 className="text-gray-600 font-semibold">
            Notifications ({notifications.length})
          </h3>
        </div>
        
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading notifications...</p>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  notification.type === 'payment' ? 
                  'bg-blue-50 border-blue-200' : 
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  {notification.type === "payment" ? (
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 text-xl" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mt-1 mr-3 text-xl" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-800">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    {notification.requestDetails && (
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex">
                          <span className="font-medium w-24">Purpose:</span>
                          <span>{notification.requestDetails.purpose}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-24">Date:</span>
                          <span>{new Date(notification.requestDetails.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-24">Destination:</span>
                          <span>{notification.requestDetails.destination}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-24">Status:</span>
                          <span className={`font-semibold ${
                            notification.requestDetails.status === "Approved" ? 
                            "text-green-600" : "text-red-600"
                          }`}>
                            {notification.requestDetails.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    )}

                    {notification.type === "payment" && (
                      <button
                        onClick={() => navigate(`/payment/${notification.requestId}`)}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Proceed to Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No notifications available
          </p>
        )}
      </div>

      {/* Profile Details Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-500 hover:text-blue-700"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            ) : (
              <p className="mt-1 text-gray-600">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="mt-1 text-gray-600">{user.username}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            ) : (
              <p className="mt-1 text-gray-600">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile</label>
            {isEditing ? (
              <input
                type="tel"
                value={user.mobile}
                onChange={(e) => setUser({...user, mobile: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            ) : (
              <p className="mt-1 text-gray-600">{user.mobile}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            <p className="mt-1 text-gray-600">{user.branch}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <p className="mt-1 text-gray-600">{user.semester}</p>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile1;