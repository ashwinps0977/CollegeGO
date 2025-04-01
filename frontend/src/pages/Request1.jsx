import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Request1 = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [request, setRequest] = useState({
    name: "",
    branch: "",
    semester: "",
    purpose: "",
    destination: "",
    date: "",
    status: "Pending",
  });

  // Retrieve user info from session storage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("📌 User data from session:", userData);

      setRequest((prev) => ({
        ...prev,
        name: userData.name || "",
        branch: userData.branch || "",
        semester: userData.semester || "",
      }));

      // Fetch latest user data from backend
      fetchUserData(userData.username);
    }
  }, []);

  // Fetch user details from MongoDB
  const fetchUserData = async (username) => {
    try {
      if (!username) {
        console.error("🚨 No username found in sessionStorage.");
        return;
      }
      console.log("🔍 Fetching user data for:", username);

      const response = await axios.get(`http://localhost:5001/getUser/${username}`);
      console.log("✅ Fetched user data:", response.data);

      if (response.data) {
        setRequest((prev) => ({
          ...prev,
          name: response.data.name || prev.name,
          branch: response.data.branch || prev.branch,
          semester: response.data.semester || prev.semester,
        }));
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["purpose", "destination"].includes(name) && !/^[A-Za-z ]*$/.test(value)) return;
    setRequest((prev) => ({ ...prev, [name]: value }));
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Submit this request for HOD approval?");
    if (!isConfirmed) return;

    try {
      await axios.post("http://localhost:5001/addRequest", request);
      alert("✅ Request Submitted! Forwarding to HOD for Approval...");
      navigate("/Hod1");
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      alert("Failed to submit request!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">New Movement Request</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input type="text" name="name" value={request.name} readOnly className="w-full p-2 border rounded-lg bg-gray-200" />
          </div>

          <div>
            <label className="block text-gray-700">Branch</label>
            <input type="text" name="branch" value={request.branch} readOnly className="w-full p-2 border rounded-lg bg-gray-200" />
          </div>

          <div>
            <label className="block text-gray-700">Semester</label>
            <input type="text" name="semester" value={request.semester} readOnly className="w-full p-2 border rounded-lg bg-gray-200" />
          </div>

          <div>
            <label className="block text-gray-700">Purpose</label>
            <input type="text" name="purpose" value={request.purpose} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Enter purpose" />
          </div>

          <div>
            <label className="block text-gray-700">Destination</label>
            <input type="text" name="destination" value={request.destination} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="Enter destination" />
          </div>

          <div>
            <label className="block text-gray-700">Date</label>
            <input type="date" name="date" value={request.date} onChange={handleChange} required className="w-full p-2 border rounded-lg" min={today} />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Request1;
