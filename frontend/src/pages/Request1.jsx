import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Request1 = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const destinations = [
    "PALA - B1",
    "ETTUMAANOOR - B2",
    "KOTTAYAM - B3",
    "THODUPUZHA - B4",
    "MUVATTUPUZHA - B5",
    "KOOTHATTUKULAM - B6",
    "KANJIRAPPALLY - B7",
    "MALLAPALLY - B8"
  ];

  const [request, setRequest] = useState({
    name: "",
    branch: "",
    semester: "",
    purpose: "",
    destination: "",
    date: "",
    status: "Pending",
  });

  const [userData, setUserData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUserData(parsedUser);
    setRequest((prev) => ({
      ...prev,
      name: parsedUser.name || "",
      branch: parsedUser.branch || "",
      semester: parsedUser.semester || "",
    }));

    fetchUserData(parsedUser.username);
  }, [navigate]);

  const fetchUserData = async (username) => {
    try {
      if (!username) return;
      const response = await axios.get(`http://localhost:5001/getUser/${username}`);
      if (response.data) {
        setUserData(prev => ({ ...prev, ...response.data }));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "purpose" && !/^[A-Za-z ]*$/.test(value)) return;
    setRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Submit this request for HOD approval?");
    if (!isConfirmed) return;

    try {
      const response = await axios.post("http://localhost:5001/addRequest", {
        ...request,
        date: new Date(request.date).toISOString()
      });
      
      if (response.data && response.data.message) {
        setSubmitted(true);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      alert(`Failed to submit request: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Student Profile Card - Left Side */}
        {userData && (
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6 h-fit">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl text-blue-600 font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
              <p className="text-blue-600 font-medium">Student</p>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Academic Details
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Branch:</span>
                    <span className="font-medium">{userData.branch}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Semester:</span>
                    <span className="font-medium">{userData.semester}</span>
                  </p>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Contact Info
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {userData.email || "N/A"}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {userData.mobile || "N/A"}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => navigate("/student")}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Movements
              </button>

              <button 
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Request Form - Right Side */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {!submitted ? (
              <>
                <h2 className="text-2xl font-semibold text-center mb-6">New Movement Request</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={request.name} 
                        readOnly 
                        className="w-full p-2 border rounded-lg bg-gray-100" 
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Branch</label>
                      <input 
                        type="text" 
                        name="branch" 
                        value={request.branch} 
                        readOnly 
                        className="w-full p-2 border rounded-lg bg-gray-100" 
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Semester</label>
                      <input 
                        type="text" 
                        name="semester" 
                        value={request.semester} 
                        readOnly 
                        className="w-full p-2 border rounded-lg bg-gray-100" 
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Date</label>
                      <input 
                        type="date" 
                        name="date" 
                        value={request.date} 
                        onChange={handleChange} 
                        required 
                        className="w-full p-2 border rounded-lg" 
                        min={today} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Purpose</label>
                    <input 
                      type="text" 
                      name="purpose" 
                      value={request.purpose} 
                      onChange={handleChange} 
                      required 
                      className="w-full p-2 border rounded-lg" 
                      placeholder="Enter purpose of travel" 
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Destination</label>
                    <select
                      name="destination"
                      value={request.destination}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((destination) => (
                        <option key={destination} value={destination}>
                          {destination}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium mt-6"
                  >
                    Submit Request
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-green-600">REQUEST SUBMITTED</h2>
                <p className="text-gray-700 mt-2">Your request has been successfully forwarded to HOD for approval.</p>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request1;