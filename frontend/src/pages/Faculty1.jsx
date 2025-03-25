import React, { useState, useEffect } from "react";

const Faculty1 = () => {
  const [facultyRequests, setFacultyRequests] = useState([]);

  // Load approved requests from localStorage
  useEffect(() => {
    const savedFacultyRequests = JSON.parse(localStorage.getItem("facultyRequests")) || [];
    setFacultyRequests(savedFacultyRequests);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Faculty Dashboard - Pending Approvals</h2>

      <table className="w-full border-collapse bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Request ID</th>
            <th className="p-2">Date</th>
            <th className="p-2">Purpose</th>
            <th className="p-2">Destination</th>
            <th className="p-2">Time Out</th>
            <th className="p-2">Expected Return</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {facultyRequests.map((req) => (
            <tr key={req.id} className="border-t">
              <td className="p-2">#{req.id}</td>
              <td className="p-2">{req.date}</td>
              <td className="p-2">{req.purpose}</td>
              <td className="p-2">{req.destination}</td>
              <td className="p-2">{req.timeOut}</td>
              <td className="p-2">{req.expectedReturn}</td>
              <td className="p-2">
                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full">
                  Pending Faculty Approval
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Faculty1;
