import React, { useState, useEffect } from "react";

const Profile1 = () => {
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Load user data from localStorage
  const [user, setUser] = useState({
    name: "",
    username: "",
    branch: "",
    semester: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Handles input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Toggles edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Saves updated information
  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false);
    alert("Profile information updated successfully!");
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
      </div>

      {/* Profile Information */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-gray-600 font-semibold">Personal Information</h3>
        <p><strong>Name:</strong> {isEditing ? <input type="text" name="name" value={user.name} onChange={handleChange} className="border rounded p-1 ml-2" /> : user.name}</p>
        <p><strong>Username:</strong> {isEditing ? <input type="text" name="username" value={user.username} onChange={handleChange} className="border rounded p-1 ml-2" /> : user.username}</p>
      </div>

      <div className="border-b pb-4 mb-4">
        <h3 className="text-gray-600 font-semibold">Academic Information</h3>
        <p><strong>Branch:</strong> {isEditing ? <input type="text" name="branch" value={user.branch} onChange={handleChange} className="border rounded p-1 ml-2" /> : user.branch}</p>
        <p><strong>Semester:</strong> {isEditing ? <input type="text" name="semester" value={user.semester} onChange={handleChange} className="border rounded p-1 ml-2" /> : user.semester}</p>
      </div>

      <div className="border-b pb-4 mb-4">
        <h3 className="text-gray-600 font-semibold">Contact Information</h3>
        <p><strong>Email:</strong> {isEditing ? <input type="email" name="email" value={user.email} onChange={handleChange} className="border rounded p-1 ml-2" /> : user.email}</p>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        {isEditing ? (
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        ) : (
          <button onClick={handleEdit} className="bg-gray-500 text-white px-4 py-2 rounded">Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile1;