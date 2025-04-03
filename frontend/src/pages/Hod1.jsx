import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Hod1 = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("http://localhost:5001/hodRequests");
      if (response.data && Array.isArray(response.data)) {
        // Sort requests by creation date (newest first)
        const sortedRequests = [...response.data].sort((a, b) => 
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );

        setRequests(sortedRequests);
        setApprovedRequests(sortedRequests.filter(req => req.status === "Approved"));
        setRejectedRequests(sortedRequests.filter(req => req.status === "Rejected"));
        setPendingRequests(sortedRequests.filter(req => req.status === "Pending"));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
      setError("Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    
    // Add auto-refresh every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/updateRequest/${id}`, { status: newStatus });
      
      // Optimistic UI update
      setRequests(prevRequests =>
        prevRequests.map(req => 
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
      
      // Refresh counts
      fetchRequests();
    } catch (error) {
      console.error("❌ Error updating request status:", error);
      alert("Failed to update request status");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">HOD DASHBOARD</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-green-500 text-white p-4 rounded-lg text-center shadow-lg">
          <h2 className="text-xl font-bold">Approved Requests</h2>
          <p className="text-3xl font-semibold">{approvedRequests.length}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg text-center shadow-lg">
          <h2 className="text-xl font-bold">Pending Requests</h2>
          <p className="text-3xl font-semibold">{pendingRequests.length}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg text-center shadow-lg">
          <h2 className="text-xl font-bold">Rejected Requests</h2>
          <p className="text-3xl font-semibold">{rejectedRequests.length}</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">All Movement Requests (Newest First)</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchRequests}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-200">
                {["ID", "Name", "Branch", "Semester", "Purpose", "Destination", "Date", "Status", "Actions"].map((header) => (
                  <th key={header} className="p-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-600">{req._id.substring(18, 24)}...</td>
                    <td className="p-3">{req.name}</td>
                    <td className="p-3">{req.branch}</td>
                    <td className="p-3">{req.semester}</td>
                    <td className="p-3">{req.purpose}</td>
                    <td className="p-3">{req.destination}</td>
                    <td className="p-3">{new Date(req.date).toLocaleDateString()}</td>
                    <td className={`p-3 font-semibold 
                        ${req.status === "Approved" ? "text-green-600" : 
                          req.status === "Pending" ? "text-yellow-600" : 
                          "text-red-600"}`}>
                      {req.status}
                    </td>
                    <td className="p-3">
                      {req.status === "Pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAction(req._id, "Approved")}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-green-600 transition"
                            aria-label="Approve Request"
                          >
                            <FaCheckCircle /> <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleAction(req._id, "Rejected")}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-red-600 transition"
                            aria-label="Reject Request"
                          >
                            <FaTimesCircle /> <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-3 text-center text-gray-600">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Hod1;