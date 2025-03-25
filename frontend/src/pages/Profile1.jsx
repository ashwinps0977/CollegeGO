import React, { useState } from "react";

const Profile1 = () => {
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for user information
  const [user, setUser] = useState({
    name: "Edward Vincent",
    email: "richardjameswap@gmail.com",
    phone: "+1 123 456 7890",
    address: "57th Cross, Richmond Circle, Church Road, London",
    gender: "Male",
    birthday: "20 July, 2024",
  });

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
    setIsEditing(false);
    alert("Profile information updated successfully!");
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Profile Image Section */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          className="w-20 h-20 rounded-full"
          src="https://via.placeholder.com/150" // Replace with actual profile image
          alt="Profile"
        />
        <div>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="border rounded p-1 text-xl font-semibold"
            />
          ) : (
            <h2 className="text-xl font-semibold">{user.name}</h2>
          )}
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-gray-600 font-semibold">CONTACT INFORMATION</h3>
        <p>
          <strong>Email:</strong>{" "}
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="border rounded p-1 ml-2"
            />
          ) : (
            <span className="text-blue-500">{user.email}</span>
          )}
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="border rounded p-1 ml-2"
            />
          ) : (
            <span className="text-blue-500">{user.phone}</span>
          )}
        </p>
        <p>
          <strong>Address:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="border rounded p-1 ml-2 w-full"
            />
          ) : (
            user.address
          )}
        </p>
      </div>

      {/* Basic Information Section */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-gray-600 font-semibold">BASIC INFORMATION</h3>
        <p>
          <strong>Gender:</strong>{" "}
          {isEditing ? (
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="border rounded p-1 ml-2"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            user.gender
          )}
        </p>
        <p>
          <strong>Birthday:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="birthday"
              value={user.birthday}
              onChange={handleChange}
              className="border rounded p-1 ml-2"
            />
          ) : (
            user.birthday
          )}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Information
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile1;
