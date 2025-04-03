import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCheckCircle } from "react-icons/fa";

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        
        if (!storedUser || !storedUser.username) {
          throw new Error("No user session found");
        }

        // Fetch user data including notifications
        const response = await axios.get(`http://localhost:5001/getUser/${storedUser.username}`);
        
        if (response.data) {
          setUser({
            name: response.data.name || "",
            username: response.data.username || "",
            branch: response.data.branch || "",
            semester: response.data.semester || "",
            email: response.data.email || "",
            mobile: response.data.mobile || "",
            role: response.data.role || "Student" // Ensure role is properly set
          });
          
          // Process notifications
          if (response.data.notifications && response.data.notifications.length > 0) {
            const sortedNotifications = [...response.data.notifications].sort(
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
  }, [navigate]);

  // ... [rest of your existing functions remain the same] ...

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{user.name}'s Profile</h2>
        <p className="text-gray-600">Role: {user.role}</p>
      </div>

      {/* Notifications Section */}
      <div className="border-b pb-4 mb-4">
        <div className="flex items-center mb-3">
          <FaBell className="text-blue-500 mr-2" />
          <h3 className="text-gray-600 font-semibold">
            Notifications ({notifications.length})
          </h3>
        </div>
        
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${notification.type === 'payment' ? 
                  'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-start">
                  {notification.type === "payment" && (
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {notification.type === "payment" && (
                      <button
                        onClick={() => navigate(`/payment/${notification.requestId}`)}
                        className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition-colors"
                      >
                        Make Payment
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

      {/* ... [rest of your existing profile JSX remains the same] ... */}
    </div>
  );
};

export default Profile1;