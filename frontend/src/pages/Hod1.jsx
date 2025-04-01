import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Hod1 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [hodData, setHodData] = useState({ name: "", branch: "" });

  useEffect(() => {
    fetchHodDetails();
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5001/hodRequests");
      setRequests(response.data);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
    }
  };

  const fetchHodDetails = async () => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return;

    const userData = JSON.parse(storedUser);
    try {
      const response = await axios.get(`http://localhost:5001/getHod/${userData.username}`);
      setHodData(response.data || userData);
    } catch (error) {
      console.error("❌ Error fetching HOD data:", error);
    }
  };

  const handleAction = async (id, newStatus) => {
    try {
      console.log(`🔄 Updating request ${id} to: ${newStatus}`);
      await axios.put(`http://localhost:5001/updateRequest/${id}`, { status: newStatus });
      fetchRequests();
    } catch (error) {
      console.error("❌ Error updating request status:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg w-64 p-5 space-y-4 ${sidebarOpen ? "block" : "hidden"} md:block`}>
        <h2 className="text-xl font-bold text-blue-700">SafePass</h2>
        <p className="text-sm text-gray-600">HOD: <span className="font-semibold">{hodData.name}</span></p>
        <p className="text-sm text-gray-600">Branch: <span className="font-semibold">{hodData.branch}</span></p>

        <nav className="mt-5 space-y-2">
          {[
            { to: "/hod-dashboard", label: "Dashboard" },
            { to: "/requests", label: "Requests" },
            { to: "/approved", label: "Approved Passes" },
            { to: "/rejected", label: "Rejected Requests" },
            { to: "/logout", label: "Logout", className: "text-red-600" }
          ].map(({ to, label, className = "text-gray-700" }) => (
            <Link key={to} to={to} className={`block py-2 px-3 hover:bg-gray-200 rounded-md ${className}`}>{label}</Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <button className="md:hidden text-blue-600 text-xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
          <h2 className="text-2xl font-bold text-gray-700">HOD Dashboard</h2>
        </div>

        {/* Requests Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6 overflow-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">All Movement Requests</h3>
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
                  <tr key={req._id} className="border-b">
                    <td className="p-3">{req._id}</td>
                    <td className="p-3">{req.name}</td>
                    <td className="p-3">{req.branch}</td>
                    <td className="p-3">{req.semester}</td>
                    <td className="p-3">{req.purpose}</td>
                    <td className="p-3">{req.destination}</td>
                    <td className="p-3">{new Date(req.date).toLocaleDateString()}</td>
                    <td className={`p-3 font-semibold ${req.status === "Approved" ? "text-green-600" : req.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>{req.status}</td>
                    <td className="p-3">
                      {req.status === "Pending" && (
                        <div className="flex space-x-2">
                          <button onClick={() => handleAction(req._id, "Approved")} className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1" aria-label="Approve Request">
                            <FaCheckCircle /> <span>Approve</span>
                          </button>
                          <button onClick={() => handleAction(req._id, "Rejected")} className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1" aria-label="Reject Request">
                            <FaTimesCircle /> <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-3 text-center text-gray-600">No requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hod1;
