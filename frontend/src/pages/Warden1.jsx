import React, { useState, useEffect } from "react";

const Warden1 = () => {
  const [requests, setRequests] = useState([]);

  // Load requests from localStorage
  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem("wardenRequests")) || [];
    setRequests(savedRequests);
  }, []);

  // Handle Approval/Rejection
  const handleDecision = (id, status) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status } : req
    );

    setRequests(updatedRequests);
    localStorage.setItem("wardenRequests", JSON.stringify(updatedRequests));

    // Move approved requests to Faculty1.jsx
    if (status === "Approved") {
      const approvedRequest = updatedRequests.find(req => req.id === id);
      const facultyRequests = JSON.parse(localStorage.getItem("facultyRequests")) || [];
      facultyRequests.push(approvedRequest);
      localStorage.setItem("facultyRequests", JSON.stringify(facultyRequests));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-6"></h2>
        <ul className="space-y-2">
          <li className="bg-blue-800 text-white p-2 rounded">Dashboard</li>
          <li className="p-2 hover:bg-gray-200 cursor-pointer">New Request</li>
          <li className="p-2 hover:bg-gray-200 cursor-pointer">Request History</li>
          <li className="p-2 hover:bg-gray-200 cursor-pointer">Approved Passes</li>
          <li className="p-2 hover:bg-gray-200 cursor-pointer">Rejected Requests</li>
          <li className="p-2 hover:bg-gray-200 cursor-pointer text-red-600">Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-4/5 p-6">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Warden Dashboard</h2>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 shadow-md rounded text-center">
            <p className="text-lg font-semibold">Total Requests</p>
            <p className="text-2xl font-bold text-blue-600">{requests.length}</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded text-center">
            <p className="text-lg font-semibold">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {requests.filter((req) => req.status === "Approved").length}
            </p>
          </div>
          <div className="bg-white p-4 shadow-md rounded text-center">
            <p className="text-lg font-semibold">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {requests.filter((req) => req.status === "Pending").length}
            </p>
          </div>
          <div className="bg-white p-4 shadow-md rounded text-center">
            <p className="text-lg font-semibold">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {requests.filter((req) => req.status === "Rejected").length}
            </p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white p-6 shadow-md rounded">
          <h3 className="text-xl font-semibold mb-4">Recent Movement Requests</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Request ID</th>
                <th className="p-2">Date</th>
                <th className="p-2">Purpose</th>
                <th className="p-2">Destination</th>
                <th className="p-2">Time Out</th>
                <th className="p-2">Expected Return</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="p-2">#{req.id}</td>
                  <td className="p-2">{req.date}</td>
                  <td className="p-2">{req.purpose}</td>
                  <td className="p-2">{req.destination}</td>
                  <td className="p-2">{req.timeOut}</td>
                  <td className="p-2">{req.expectedReturn}</td>
                  <td className="p-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      req.status === "Approved" ? "bg-green-200 text-green-800" :
                      req.status === "Pending" ? "bg-yellow-200 text-yellow-800" :
                      "bg-red-200 text-red-800"
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-2 flex space-x-2">
                    {req.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleDecision(req.id, "Approved")}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(req.id, "Rejected")}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status === "Rejected" && (
                      <button className="px-3 py-1 bg-gray-600 text-white rounded">
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Warden1;