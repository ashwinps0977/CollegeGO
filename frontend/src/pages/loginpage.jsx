import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to change button color on click
  const getButtonStyle = (role) => `
    px-6 py-3 rounded-lg text-white font-semibold transition duration-300 
    ${selectedRole === role ? "bg-green-600 shadow-lg" : "bg-blue-500 hover:bg-blue-600"}
  `;

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError("Please select a role!");
      return;
    }
    
    if (!username || !password) {
      setError("All fields are required!");
      return;
    }

    // Clear any previously stored user data
    localStorage.removeItem("user");

    alert("Login successful!");
    
    // Redirect based on role
    if (selectedRole === "Student") navigate("/request1");
    else if (selectedRole === "HOD") navigate("/Hod1");  // Redirecting to Hod1.jsx page
    else if (selectedRole === "Warden") navigate("/warden");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Header */}
      <div className="bg-white w-full text-blue-600 text-3xl font-extrabold py-5 text-center shadow-lg rounded-b-lg">
        CollegeGO
      </div>

      {/* Card Container */}
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md mt-10"> 
        <h2 className="text-center text-2xl font-bold text-gray-700">A Safe Eco-Pass</h2>
        <h3 className="text-center text-lg font-medium text-gray-500 mt-2">Select Your Role</h3>

        {/* Role Selection */}
        <div className="flex justify-center gap-4 mt-6">
          <button className={getButtonStyle("Student")} onClick={() => setSelectedRole("Student")}>
            Student
          </button>
          <button className={getButtonStyle("HOD")} onClick={() => setSelectedRole("HOD")}>
            HOD
          </button>
          <button className={getButtonStyle("Warden")} onClick={() => setSelectedRole("Warden")}>
            Warden
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        {/* Input Fields */}
        <form onSubmit={handleLogin} className="mt-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your username or ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <div className="relative mt-4">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-6 shadow-lg transform transition duration-300 hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
