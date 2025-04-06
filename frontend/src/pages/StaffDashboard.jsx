import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentVerifications, setRecentVerifications] = useState([]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "Bus-Faculty") {
      navigate("/");
    }

    // Load recent verifications from localStorage
    const savedVerifications = localStorage.getItem("busFacultyRecentVerifications");
    if (savedVerifications) {
      setRecentVerifications(JSON.parse(savedVerifications));
    }
  }, [navigate]);

  const handleVerifyTicket = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTicketData(null);

    try {
      // Get ticket details directly using the ticket ID
      const ticketResponse = await axios.get(`http://localhost:5001/getTicket/${ticketId}`);
      const ticketDetails = ticketResponse.data;

      if (!ticketDetails) {
        throw new Error("Ticket not found");
      }

      // Check if ticket is paid
      if (ticketDetails.paymentStatus !== "Paid") {
        throw new Error("Ticket payment not completed");
      }

      // Format the data for display
      const formattedData = {
        name: ticketDetails.name,
        department: ticketDetails.department,
        semester: ticketDetails.semester,
        date: ticketDetails.date,
        purpose: ticketDetails.purpose,
        destination: ticketDetails.destination,
        ticketId: ticketDetails.ticketId,
        verificationCode: ticketDetails.verificationCode,
        timestamp: ticketDetails.ticketGeneratedAt
      };

      setTicketData(formattedData);
      
      // Add to recent verifications
      const newVerification = {
        ...formattedData,
        verifiedAt: new Date().toISOString()
      };
      
      const updatedVerifications = [newVerification, ...recentVerifications.slice(0, 4)];
      setRecentVerifications(updatedVerifications);
      localStorage.setItem("busFacultyRecentVerifications", JSON.stringify(updatedVerifications));

    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.error || err.message || "Failed to verify ticket");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bus Faculty Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                sessionStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verification Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Verify Student Ticket</h2>
            
            <form onSubmit={handleVerifyTicket} className="space-y-4">
              <div>
                <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket ID
                </label>
                <input
                  type="text"
                  id="ticketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter ticket ID from student's ticket"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : 'Verify Ticket'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTicketId("");
                    setTicketData(null);
                    setError("");
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                >
                  Clear
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
            </form>

            {/* Verification Result */}
            {ticketData && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Ticket Verified Successfully</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Student Name</p>
                      <p className="font-medium">{ticketData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{ticketData.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Semester</p>
                      <p className="font-medium">{ticketData.semester}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Travel Date</p>
                      <p className="font-medium">{formatDate(ticketData.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Destination</p>
                      <p className="font-medium">{ticketData.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Purpose</p>
                      <p className="font-medium">{ticketData.purpose}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  <p>Ticket ID: {ticketData.ticketId}</p>
                  <p>Issued at: {new Date(ticketData.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Verifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Verifications</h2>
            
            {recentVerifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent verifications</p>
            ) : (
              <ul className="space-y-3">
                {recentVerifications.map((item, index) => (
                  <li key={index} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{formatDate(item.date)}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-gray-700 truncate">
                      To: {item.destination}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Verified at: {new Date(item.verifiedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    <p className="text-xs font-mono text-gray-400 mt-1 truncate">
                      ID: {item.ticketId}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;