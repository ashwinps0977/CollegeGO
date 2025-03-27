import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Import Supabase client

const Hod1 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    let { data, error } = await supabase.from("requests").select("*");
    if (error) console.error("Error fetching requests:", error);
    else setRequests(data);
  };

  const handleAction = async (id, newStatus) => {
    const { error } = await supabase.from("requests").update({ status: newStatus }).eq("id", id);
    if (!error) fetchRequests(); // Refresh requests after update
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg w-64 p-5 space-y-4 ${sidebarOpen ? "block" : "hidden"} md:block`}>
        <h2 className="text-xl font-bold text-blue-700">SafePass</h2>
        <nav className="mt-5 space-y-2">
          <Link to="/hod-dashboard" className="block py-2 px-3 bg-blue-600 text-white rounded-md">Dashboard</Link>
          <Link to="/history" className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded-md">Request History</Link>
          <Link to="/approved" className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded-md">Approved Passes</Link>
          <Link to="/rejected" className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded-md">Rejected Requests</Link>
          <Link to="/logout" className="block py-2 px-3 text-red-600 hover:bg-gray-200 rounded-md">Logout</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <button className="md:hidden text-blue-600 text-xl" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h2 className="text-2xl font-bold text-gray-700">HOD Dashboard</h2>
        </div>

        {/* Recent Requests Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Movement Requests</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-200">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b">
                  <td className="p-3">{req.id}</td>
                  <td className="p-3">{req.name}</td>
                  <td className={`p-3 font-semibold ${req.status === "Approved" ? "text-green-600" : req.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>{req.status}</td>
                  <td className="p-3">
                    {req.status === "Pending" && (
                      <div className="flex space-x-2">
                        <button onClick={() => handleAction(req.id, "Approved")} className="bg-green-500 text-white px-3 py-1 rounded-lg">Approve</button>
                        <button onClick={() => handleAction(req.id, "Rejected")} className="bg-red-500 text-white px-3 py-1 rounded-lg">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hod1;
