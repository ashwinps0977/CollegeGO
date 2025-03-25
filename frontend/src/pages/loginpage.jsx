import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to change button color on click
  const getButtonStyle = (role) =>
    `px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${
      selectedRole === role ? "bg-green-600 shadow-lg" : "bg-blue-500 hover:bg-blue-600"
    }`;

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

    // Fetch stored user data
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser && savedUser.username === username && savedUser.password === password) {
      alert(`Welcome, ${savedUser.name}!`);
      
      // Redirect based on role
      if (selectedRole === "Student") navigate("/dashboard");
      else if (selectedRole === "HOD") navigate("/hod-panel");
      else if (selectedRole === "Warden") navigate("/warden-panel");
    } else {
      setError("Invalid Username or Password!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 w-full text-white text-2xl font-bold py-4 text-center shadow-md">
        CollegeGO
      </div>

      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mt-8">
        <h2 className="text-center text-xl font-semibold text-gray-700">
          A Safe Eco-Pass
        </h2>
        <h3 className="text-center text-lg font-medium text-gray-600 mt-2">
          Select Your Role
        </h3>

        {/* Role Selection */}
        <div className="flex justify-center gap-4 mt-4">
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
          <input
            type="text"
            placeholder="Enter your username or ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-6 shadow-md transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
