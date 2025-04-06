import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5001/updateUser/${user.username}`, {
        name: user.name,
        email: user.email,
        mobile: user.mobile
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{user.name}'s Profile</h2>
        <p className="text-gray-600">Role: {user.role}</p>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
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